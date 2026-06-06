import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SHOPIFY_DOMAIN = Deno.env.get("SHOPIFY_DOMAIN")!;

// Internal priceId → Shopify variant GID + credit metadata
const PRICE_MAP: Record<string, {
  variantGid: string;
  credits: number;
  unlimited: boolean;
  label: string;
  sku: string;
}> = {
  // ── Personal packs ──────────────────────────────────────────────────────────
  personal_individual_annual: {
    variantGid: "gid://shopify/ProductVariant/48633717489919",
    credits: 1, unlimited: false,
    label: "FAA Certificate Credit — Individual",
    sku: "FAA-CERT-PREPAY-INDIVIDUAL",
  },
  personal_family_annual: {
    variantGid: "gid://shopify/ProductVariant/48633740460287",
    credits: 3, unlimited: false,
    label: "FAA Certificate Credits — Household (3 seats)",
    sku: "FAA-CERT-PREPAY-HOUSEHOLD",
  },
  personal_family_plus_annual: {
    variantGid: "gid://shopify/ProductVariant/48633747374335",
    credits: 5, unlimited: false,
    label: "FAA Certificate Credits — Family (5 seats)",
    sku: "FAA-CERT-PREPAY-FAMILY",
  },

  // ── Employer Starter — one priceId per fixed credit count ───────────────────
  employer_starter_1: {
    variantGid: "gid://shopify/ProductVariant/48633995657471",
    credits: 1, unlimited: false,
    label: "FAA Corporate Certificate Credits — Starter (1)",
    sku: "FAA-CORP-STARTER-1",
  },
  employer_starter_2: {
    variantGid: "gid://shopify/ProductVariant/48633995690239",
    credits: 2, unlimited: false,
    label: "FAA Corporate Certificate Credits — Starter (2)",
    sku: "FAA-CORP-STARTER-2",
  },
  employer_starter_3: {
    variantGid: "gid://shopify/ProductVariant/48633995723007",
    credits: 3, unlimited: false,
    label: "FAA Corporate Certificate Credits — Starter (3)",
    sku: "FAA-CORP-STARTER-3",
  },
  employer_starter_5: {
    variantGid: "gid://shopify/ProductVariant/48633995755775",
    credits: 5, unlimited: false,
    label: "FAA Corporate Certificate Credits — Starter (5)",
    sku: "FAA-CORP-STARTER-5",
  },
  employer_starter_10: {
    variantGid: "gid://shopify/ProductVariant/48633995788543",
    credits: 10, unlimited: false,
    label: "FAA Corporate Certificate Credits — Starter (10)",
    sku: "FAA-CORP-STARTER-10",
  },

  // ── Employer flat packs ──────────────────────────────────────────────────────
  employer_team_25_annual: {
    variantGid: "gid://shopify/ProductVariant/48633785942271",
    credits: 25, unlimited: false,
    label: "FAA Corporate Certificate Credits — Team 25",
    sku: "FAA-CORP-TEAM25",
  },
  employer_team_50_annual: {
    variantGid: "gid://shopify/ProductVariant/48633822675199",
    credits: 50, unlimited: false,
    label: "FAA Corporate Certificate Credits — Team 50",
    sku: "FAA-CORP-TEAM50",
  },
  employer_workplace_annual: {
    variantGid: "gid://shopify/ProductVariant/48633835421951",
    credits: 0, unlimited: true,
    label: "FAA Corporate Certificate Credits — Workplace Unlimited",
    sku: "FAA-CORP-UNLIMITED",
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

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
    const priceId = String(body?.priceId ?? "");
    if (!priceId) return json({ error: "Missing priceId" }, 400);

    const entry = PRICE_MAP[priceId];
    if (!entry) return json({ error: `Unknown priceId: ${priceId}` }, 400);

    // Extract the numeric variant ID from the GID
    const variantNumericId = entry.variantGid.split("/").pop();

    // Build direct checkout URL — quantity always 1 (credit count is in the variant)
    const params = new URLSearchParams({
      "checkout[email]": user.email ?? "",
      "attributes[_user_id]": user.id,
      "attributes[_price_id]": priceId,
      "attributes[_sku]": entry.sku,
      "attributes[_credits]": String(entry.credits),
      "attributes[_unlimited]": String(entry.unlimited),
    });

    const checkoutUrl =
      `https://${SHOPIFY_DOMAIN}/cart/${variantNumericId}:1?${params.toString()}`;

    return json({ checkoutUrl });
  } catch (e: any) {
    console.error("create-credit-checkout error:", e);
    return json({ error: String(e?.message ?? e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
