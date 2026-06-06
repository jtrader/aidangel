// Verifies a user has completed a program, mints a single-use eligibility token,
// creates a Shopify cart with the token + program_slug + user_id attached as
// cart attributes, and returns the Shopify checkout URL.

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SHOPIFY_DOMAIN = Deno.env.get("SHOPIFY_DOMAIN") ?? "ty3mn0-c3.myshopify.com";
const SHOPIFY_STOREFRONT_TOKEN = Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN")!;
const SHOPIFY_API_VERSION = "2025-07";

const CART_CREATE = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomToken(): string {
  const b = new Uint8Array(32);
  crypto.getRandomValues(b);
  return Array.from(b).map((x) => x.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const programSlug = String(body?.programSlug ?? "");
    const learnerName = String(body?.learnerName ?? "").trim();
    if (!programSlug || !learnerName) return json({ error: "Missing programSlug or learnerName" }, 400);
    if (learnerName.length > 120) return json({ error: "Name too long" }, 400);

    // Load program
    const { data: program } = await supabase
      .from("programs")
      .select("id, title, slug, shopify_certificate_variant_id")
      .eq("slug", programSlug)
      .maybeSingle();
    if (!program) return json({ error: "Program not found" }, 404);
    if (!program.shopify_certificate_variant_id) {
      return json({ error: "Certificate not available for this program" }, 400);
    }

    // Eligibility: all topic quizzes passed + final quiz (if any) passed
    const { data: topics } = await supabase
      .from("program_topics").select("course_id").eq("program_id", program.id);
    const topicIds = (topics ?? []).map((t: any) => t.course_id);
    if (topicIds.length === 0) return json({ error: "Program has no topics" }, 400);

    const { data: passed } = await supabase
      .from("quiz_attempts")
      .select("course_id")
      .eq("user_id", user.id).eq("passed", true).in("course_id", topicIds);
    const passedSet = new Set((passed ?? []).map((a: any) => a.course_id));
    if (topicIds.some((id: string) => !passedSet.has(id))) {
      return json({ error: "Complete all topic quizzes first" }, 403);
    }

    const { count: finalQ } = await supabase
      .from("program_quiz_questions")
      .select("*", { count: "exact", head: true }).eq("program_id", program.id);
    if ((finalQ ?? 0) > 0) {
      const { data: fa } = await supabase
        .from("program_quiz_attempts")
        .select("id").eq("user_id", user.id).eq("program_id", program.id)
        .eq("passed", true).maybeSingle();
      if (!fa) return json({ error: "Pass the final quiz first" }, 403);
    }

    // Record program_completion (idempotent on user_id+program_slug)
    await supabase.from("program_completions").upsert({
      user_id: user.id,
      program_slug: program.slug,
      passed_at: new Date().toISOString(),
    }, { onConflict: "user_id,program_slug" });

    // Mint eligibility token (24h expiry)
    const token = randomToken();
    const tokenHash = await sha256Hex(token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { error: tokErr } = await supabase.from("certificate_eligibility_tokens").insert({
      user_id: user.id,
      program_slug: program.slug,
      token_hash: tokenHash,
      expires_at: expiresAt,
      used: false,
    });
    if (tokErr) return json({ error: `Token error: ${tokErr.message}` }, 500);

    // Create Shopify cart with attributes
    const cartResp = await fetch(
      `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({
          query: CART_CREATE,
          variables: {
            input: {
              lines: [{ quantity: 1, merchandiseId: program.shopify_certificate_variant_id }],
              buyerIdentity: { email: user.email },
              attributes: [
                { key: "_eligibility_token", value: token },
                { key: "_user_id", value: user.id },
                { key: "_program_slug", value: program.slug },
                { key: "learner_name", value: learnerName },
              ],
              note: `Certificate of Completion — ${program.title}`,
            },
          },
        }),
      },
    );

    const cartData = await cartResp.json();
    const userErrors = cartData?.data?.cartCreate?.userErrors ?? [];
    if (userErrors.length > 0) {
      return json({ error: "Cart error", details: userErrors }, 500);
    }
    const cart = cartData?.data?.cartCreate?.cart;
    if (!cart?.checkoutUrl) return json({ error: "No checkout URL" }, 500);

    const url = new URL(cart.checkoutUrl);
    url.searchParams.set("channel", "online_store");

    return json({ checkoutUrl: url.toString(), cartId: cart.id });
  } catch (e: any) {
    console.error("cert-checkout error", e);
    return json({ error: String(e?.message ?? e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
