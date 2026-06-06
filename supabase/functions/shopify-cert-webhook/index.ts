// Receives Shopify orders/paid webhook, verifies HMAC, idempotently consumes the
// eligibility token attached to the cart and issues an official certificate row.

import { createClient } from "npm:@supabase/supabase-js@2";

const SHOPIFY_WEBHOOK_SECRET = Deno.env.get("SHOPIFY_WEBHOOK_SECRET") ?? "";

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyHmac(rawBody: string, headerHmac: string): Promise<boolean> {
  if (!SHOPIFY_WEBHOOK_SECRET || !headerHmac) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SHOPIFY_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const computed = btoa(String.fromCharCode(...new Uint8Array(sig)));
  if (computed.length !== headerHmac.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) diff |= computed.charCodeAt(i) ^ headerHmac.charCodeAt(i);
  return diff === 0;
}

function genCertId(): string {
  const b = new Uint8Array(8);
  crypto.getRandomValues(b);
  const hex = Array.from(b).map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `FAA-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

async function handleCreditPackOrder(
  payload: any,
  attrs: Record<string, string>,
  supabase: ReturnType<typeof createClient>,
): Promise<string | null> {
  const userId = attrs["_user_id"];
  const priceId = attrs["_price_id"];
  const credits = parseInt(attrs["_credits"] ?? "0", 10);
  const unlimited = attrs["_unlimited"] === "true";
  const orderId = String(payload?.id ?? "");

  if (!userId || !priceId) return "Missing credit pack attributes";

  // Idempotency — has this order already been processed?
  const { data: existing } = await supabase
    .from("shopify_credit_orders")
    .select("id")
    .eq("shopify_order_id", orderId)
    .maybeSingle();
  if (existing) return null; // already processed

  // Read current credits
  const { data: current } = await supabase
    .from("certificate_credits")
    .select("balance, unlimited")
    .eq("user_id", userId)
    .maybeSingle();

  const nextBalance = unlimited
    ? (current?.balance ?? 0)
    : (current?.balance ?? 0) + credits;
  const nextUnlimited = (current?.unlimited ?? false) || unlimited;

  // Upsert credits — certificate_credits PK is user_id
  await supabase.from("certificate_credits").upsert(
    {
      user_id: userId,
      balance: nextBalance,
      unlimited: nextUnlimited,
      environment: "live",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  // Record the order for idempotency
  await supabase.from("shopify_credit_orders").insert({
    shopify_order_id: orderId,
    user_id: userId,
    price_id: priceId,
    credits_granted: credits,
    unlimited,
    created_at: new Date().toISOString(),
  });

  console.log("Granted credits", { userId, priceId, credits, unlimited, orderId });
  return null;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const rawBody = await req.text();
  const hmacHeader = req.headers.get("x-shopify-hmac-sha256") ?? "";
  const topic = req.headers.get("x-shopify-topic") ?? "";
  const webhookId = req.headers.get("x-shopify-webhook-id") ?? "";
  const shopDomain = req.headers.get("x-shopify-shop-domain") ?? "";

  const ok = await verifyHmac(rawBody, hmacHeader);
  if (!ok) {
    console.warn("HMAC verification failed", { topic, webhookId });
    return new Response("Invalid signature", { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Idempotency
  if (webhookId) {
    const { data: existing } = await supabase
      .from("webhook_events").select("id,processed").eq("shopify_webhook_id", webhookId).maybeSingle();
    if (existing?.processed) return new Response("Already processed", { status: 200 });
  }

  let payload: any;
  try { payload = JSON.parse(rawBody); } catch { return new Response("Bad JSON", { status: 400 }); }

  // Log webhook event (upsert by shopify_webhook_id)
  const eventId = webhookId || crypto.randomUUID();
  await supabase.from("webhook_events").upsert({
    shopify_webhook_id: eventId,
    shopify_topic: topic,
    shop_domain: shopDomain,
    raw_payload: payload,
  }, { onConflict: "shopify_webhook_id" });

  if (topic !== "orders/paid" && topic !== "orders/create") {
    await supabase.from("webhook_events")
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq("shopify_webhook_id", eventId);
    return new Response("Ignored topic", { status: 200 });
  }

  // Extract note_attributes into a flat map
  const attrs: Record<string, string> = {};
  for (const a of (payload?.note_attributes ?? [])) {
    if (a?.name) attrs[a.name] = String(a.value ?? "");
  }

  const isCreditPack = !!attrs["_price_id"];
  const isCertPurchase = !!attrs["_eligibility_token"];

  if (isCreditPack) {
    const err = await handleCreditPackOrder(payload, attrs, supabase);
    await finish(err ?? undefined);
    return new Response("ok", { status: 200 });
  }

  if (!isCertPurchase) {
    await finish("No recognised attributes");
    return new Response("ok", { status: 200 });
  }

  // ── Existing certificate issuance logic continues below, unchanged ──
  const token = attrs["_eligibility_token"];
  const userId = attrs["_user_id"];
  const programSlug = attrs["_program_slug"];
  const learnerName = attrs["learner_name"] || payload?.customer?.first_name || "Learner";

  const finish = async (err?: string) => {
    await supabase.from("webhook_events").update({
      processed: true,
      processed_at: new Date().toISOString(),
      processing_error: err ?? null,
    }).eq("shopify_webhook_id", eventId);
  };

  if (!token || !userId || !programSlug) {
    await finish("Missing cart attributes");
    return new Response("Missing attributes", { status: 200 });
  }

  // Validate token
  const tokenHash = await sha256Hex(token);
  const { data: tokenRow } = await supabase
    .from("certificate_eligibility_tokens")
    .select("*").eq("token_hash", tokenHash).maybeSingle();

  if (!tokenRow) { await finish("Token not found"); return new Response("ok", { status: 200 }); }
  if (tokenRow.used) { await finish("Token already used"); return new Response("ok", { status: 200 }); }
  if (new Date(tokenRow.expires_at) < new Date()) { await finish("Token expired"); return new Response("ok", { status: 200 }); }
  if (tokenRow.user_id !== userId || tokenRow.program_slug !== programSlug) {
    await finish("Token mismatch"); return new Response("ok", { status: 200 });
  }

  // Look up program
  const { data: program } = await supabase
    .from("programs").select("title").eq("slug", programSlug).maybeSingle();
  if (!program) { await finish("Program not found"); return new Response("ok", { status: 200 }); }

  const orderId = String(payload?.id ?? payload?.admin_graphql_api_id ?? "");

  // Idempotency by order_id
  const { data: existingCert } = await supabase
    .from("shopify_certificates")
    .select("certificate_id").eq("shopify_order_id", orderId).maybeSingle();
  if (existingCert) { await finish(); return new Response("Already issued", { status: 200 }); }

  const certId = genCertId();
  const today = new Date().toISOString().slice(0, 10);

  const { error: insErr } = await supabase.from("shopify_certificates").insert({
    certificate_id: certId,
    user_id: userId,
    program_slug: programSlug,
    program_name: program.title,
    learner_name: learnerName,
    shopify_order_id: orderId,
    issue_date: today,
    completion_date: today,
    status: "issued",
  });
  if (insErr) {
    console.error("Failed to insert certificate", insErr);
    await finish(`Insert error: ${insErr.message}`);
    return new Response("DB error", { status: 500 });
  }

  await supabase.from("certificate_eligibility_tokens")
    .update({ used: true })
    .eq("id", tokenRow.id);

  await finish();
  console.log("Issued certificate", { certId, userId, programSlug });
  return new Response(JSON.stringify({ ok: true, certificate_id: certId }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
