// Creates or updates a Shopify customer matching the authenticated user.
// Stores shopify_customer_id on profiles, applies marketing opt-in.

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SHOPIFY_DOMAIN = "ty3mn0-c3.myshopify.com";
const SHOPIFY_ADMIN_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN")!;
const SHOPIFY_API_VERSION = "2025-07";

async function shopifyAdmin(path: string, init: RequestInit = {}) {
  return fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
      ...(init.headers ?? {}),
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await anonClient.auth.getClaims(token);
    if (claimsErr || !claims?.claims?.sub) return json({ error: "Unauthorized" }, 401);

    const userId = claims.claims.sub as string;
    const email = (claims.claims.email as string | undefined)?.toLowerCase();
    if (!email) return json({ error: "No email" }, 400);

    const body = await req.json().catch(() => ({}));
    const marketingOptIn: boolean = !!body.marketing_opt_in;
    const fullName: string | undefined = body.full_name;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: profile } = await admin
      .from("profiles")
      .select("user_id, shopify_customer_id, marketing_opt_in, full_name")
      .eq("user_id", userId)
      .maybeSingle();

    const effectiveOptIn = marketingOptIn || !!profile?.marketing_opt_in;
    const effectiveName = fullName || profile?.full_name || "";
    const [firstName, ...rest] = effectiveName.trim().split(/\s+/);
    const lastName = rest.join(" ");

    // Look up existing Shopify customer by email
    let shopifyCustomerId: string | null = profile?.shopify_customer_id ?? null;

    if (!shopifyCustomerId) {
      const search = await shopifyAdmin(
        `/customers/search.json?query=${encodeURIComponent(`email:${email}`)}`,
      );
      if (search.ok) {
        const j = await search.json();
        const found = j.customers?.[0];
        if (found) shopifyCustomerId = String(found.id);
      }
    }

    const customerPayload = {
      customer: {
        email,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        tags: "first-aid-angel",
        email_marketing_consent: effectiveOptIn
          ? {
            state: "subscribed",
            opt_in_level: "single_opt_in",
            consent_updated_at: new Date().toISOString(),
          }
          : { state: "not_subscribed", opt_in_level: "single_opt_in" },
      },
    };

    let res: Response;
    if (shopifyCustomerId) {
      res = await shopifyAdmin(`/customers/${shopifyCustomerId}.json`, {
        method: "PUT",
        body: JSON.stringify({ customer: { id: Number(shopifyCustomerId), ...customerPayload.customer } }),
      });
    } else {
      res = await shopifyAdmin(`/customers.json`, {
        method: "POST",
        body: JSON.stringify(customerPayload),
      });
    }

    const result = await res.json();
    if (!res.ok) {
      console.error("Shopify customer error", res.status, result);
      return json({ error: "shopify_error", details: result }, 502);
    }

    const customerId = String(result.customer?.id ?? shopifyCustomerId);

    await admin.from("profiles").upsert({
      user_id: userId,
      email,
      full_name: effectiveName || null,
      shopify_customer_id: customerId,
      marketing_opt_in: effectiveOptIn,
      marketing_opt_in_at: effectiveOptIn ? new Date().toISOString() : null,
      shopify_synced_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    return json({ ok: true, shopify_customer_id: customerId, marketing_opt_in: effectiveOptIn });
  } catch (err) {
    console.error(err);
    return json({ error: String(err) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
