// Admin-only Shopify setup verification.
// Runs 5 parallel Admin GraphQL queries and returns a structured status report.
// Auth: requires an authenticated Supabase user with the `admin` role.

import { createClient } from "npm:@supabase/supabase-js@2";

const SHOPIFY_STORE_DOMAIN = Deno.env.get("SHOPIFY_STORE_DOMAIN") ?? "";
const SHOPIFY_ADMIN_ACCESS_TOKEN = Deno.env.get("SHOPIFY_ADMIN_ACCESS_TOKEN") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const SHOPIFY_API_VERSION = "2025-07";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EXPECTED_METAFIELD_KEYS = [
  "program_slug", "requires_eligibility", "is_checkout_enabled", "is_route_only",
  "route_type", "destination_url", "redirect_slug", "cta_label", "country", "vendor",
  "partner_entity", "amazon_asin", "route_confidence", "availability_status",
  "last_checked_at", "related_program", "referral_code", "utm_campaign", "utm_content",
  "cpd_hours", "cpd_disclaimer", "disclosure_required", "expansion_candidates",
];

const EXPECTED_COLLECTION_HANDLES = [
  "certificates", "emergency-response-essentials", "parents-childcare-essentials",
  "workplace-trades-essentials", "outdoor-remote-essentials", "aged-care-carers-essentials",
  "product-routes", "training-routes",
  "country-au", "country-uk", "country-us", "country-ca", "country-nz",
];

const EXPECTED_CERT_SKUS: Array<{ sku: string; price?: string }> = [
  { sku: "FAA-CERT-PREPAY-INDIVIDUAL", price: "25.00" },
  { sku: "FAA-CERT-PREPAY-HOUSEHOLD", price: "60.00" },
  { sku: "FAA-CERT-PREPAY-FAMILY", price: "90.00" },
  { sku: "FAA-CORP-STARTER-1" },
  { sku: "FAA-CORP-STARTER-2" },
  { sku: "FAA-CORP-STARTER-3" },
  { sku: "FAA-CORP-STARTER-5" },
  { sku: "FAA-CORP-STARTER-10" },
  { sku: "FAA-CORP-TEAM25", price: "625.00" },
  { sku: "FAA-CORP-TEAM50", price: "1250.00" },
  { sku: "FAA-CORP-UNLIMITED", price: "1500.00" },
];

const EXPECTED_ROUTE_TOTAL = 67;

async function adminGraphQL(query: string) {
  const url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Shopify ${r.status}: ${text.slice(0, 200)}`);
  }
  const j = await r.json();
  if (j.errors) throw new Error(`Shopify errors: ${JSON.stringify(j.errors).slice(0, 300)}`);
  return j.data;
}

const Q_METAFIELDS_FAA = `{
  metafieldDefinitions(ownerType: PRODUCT, namespace: "faa", first: 50) {
    edges { node { key name type { name } } }
  }
}`;
const Q_METAFIELDS_CUSTOM = `{
  metafieldDefinitions(ownerType: PRODUCT, namespace: "custom", first: 50) {
    edges { node { key name } }
  }
}`;
const Q_COLLECTIONS = `{
  collections(first: 50) { edges { node { handle title } } }
}`;
const Q_CERT_PRODUCTS = `{
  products(first: 50, query: "vendor:FirstAidAngel") {
    edges {
      node {
        id title productType vendor
        variants(first: 10) { edges { node { sku price } } }
      }
    }
  }
}`;
function qRouteProducts(after: string | null) {
  const cursor = after ? `, after: "${after}"` : "";
  return `{
    products(first: 50, query: "product_type:\\"Product Route\\""${cursor}) {
      edges {
        node {
          id title
          metafields(identifiers: [
            { namespace: "faa", key: "redirect_slug" },
            { namespace: "faa", key: "destination_url" },
            { namespace: "faa", key: "availability_status" },
            { namespace: "faa", key: "country" }
          ]) { key value }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }`;
}

async function fetchAllRouteProducts(maxPages = 20): Promise<any[]> {
  const all: any[] = [];
  let after: string | null = null;
  for (let i = 0; i < maxPages; i++) {
    const data = await adminGraphQL(qRouteProducts(after));
    const edges = data.products.edges ?? [];
    for (const e of edges) all.push(e.node);
    const pi = data.products.pageInfo;
    if (!pi?.hasNextPage) return all;
    after = pi.endCursor;
  }
  console.warn(`fetchAllRouteProducts: hit maxPages=${maxPages} cap`);
  return all;
}

const Q_DISCLOSURE = `{
  metaobjects(type: "disclosure_block", first: 5) {
    edges { node { id handle type fields { key value } } }
  }
}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Verify admin role via authenticated caller
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return json({ error: "unauthorized" }, 401);

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: userRes, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userRes?.user) return json({ error: "unauthorized" }, 401);

    const { data: hasRole, error: roleErr } = await admin.rpc("has_role", {
      _user_id: userRes.user.id,
      _role: "admin",
    });
    if (roleErr || !hasRole) return json({ error: "forbidden" }, 403);

    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return json({ error: "Shopify Admin API not configured" }, 500);
    }

    const [mfFaa, mfCustom, collections, certs, routes, disclosure] = await Promise.all([
      adminGraphQL(Q_METAFIELDS_FAA),
      adminGraphQL(Q_METAFIELDS_CUSTOM).catch(() => ({ metafieldDefinitions: { edges: [] } })),
      adminGraphQL(Q_COLLECTIONS),
      adminGraphQL(Q_CERT_PRODUCTS),
      adminGraphQL(Q_ROUTE_PRODUCTS),
      adminGraphQL(Q_DISCLOSURE),
    ]);

    // --- Section 1: metafield definitions ---
    const faaKeys: string[] = mfFaa.metafieldDefinitions.edges.map((e: any) => e.node.key);
    const foundFaa = EXPECTED_METAFIELD_KEYS.filter((k) => faaKeys.includes(k));
    const missingFaa = EXPECTED_METAFIELD_KEYS.filter((k) => !faaKeys.includes(k));
    const legacyCustom: string[] = mfCustom.metafieldDefinitions.edges.map((e: any) => e.node.key);

    const section1 = {
      status: missingFaa.length === 0 ? "PASS" : "FAIL",
      foundFaa, missingFaa, legacyCustom,
      expectedCount: EXPECTED_METAFIELD_KEYS.length,
    };

    // --- Section 2: collections ---
    const collectionHandles: string[] = collections.collections.edges.map((e: any) => e.node.handle);
    const foundCollections = EXPECTED_COLLECTION_HANDLES.filter((h) => collectionHandles.includes(h));
    const missingCollections = EXPECTED_COLLECTION_HANDLES.filter((h) => !collectionHandles.includes(h));
    const section2 = {
      status: missingCollections.length === 0 ? "PASS" : "FAIL",
      foundCollections, missingCollections,
      expectedCount: EXPECTED_COLLECTION_HANDLES.length,
    };

    // --- Section 3: certificate products ---
    const allCertProducts = certs.products.edges.map((e: any) => e.node);
    const skuToProduct: Record<string, { title: string; price: string }> = {};
    const duplicates: Array<{ title: string }> = [];
    for (const p of allCertProducts) {
      const variants = p.variants.edges.map((v: any) => v.node);
      let hasValidSku = false;
      for (const v of variants) {
        if (v.sku && v.sku.trim()) {
          skuToProduct[v.sku] = { title: p.title, price: v.price };
          hasValidSku = true;
        }
      }
      if (!hasValidSku) duplicates.push({ title: p.title });
    }
    const certRows = EXPECTED_CERT_SKUS.map((e) => {
      const found = skuToProduct[e.sku];
      return {
        sku: e.sku,
        expectedPrice: e.price ?? null,
        found: !!found,
        title: found?.title ?? null,
        price: found?.price ?? null,
      };
    });
    const missingCerts = certRows.filter((r) => !r.found).length;
    const section3 = {
      status: missingCerts > 0 ? "FAIL" : duplicates.length > 0 ? "WARNING" : "PASS",
      rows: certRows, duplicates,
    };

    // --- Section 4: route cards ---
    const routeNodes = routes.products.edges.map((e: any) => e.node);
    const byCountry: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const missingFields: Array<{ title: string; missing: string[] }> = [];
    for (const p of routeNodes) {
      const mf: Record<string, string> = {};
      for (const f of p.metafields ?? []) {
        if (f && f.key) mf[f.key] = f.value;
      }
      const country = mf.country ?? "unknown";
      const status = mf.availability_status ?? "unknown";
      byCountry[country] = (byCountry[country] ?? 0) + 1;
      byStatus[status] = (byStatus[status] ?? 0) + 1;
      const missing: string[] = [];
      if (!mf.redirect_slug) missing.push("redirect_slug");
      if (!mf.destination_url) missing.push("destination_url");
      if (missing.length) missingFields.push({ title: p.title, missing });
    }
    const totalRoutes = routeNodes.length;
    const section4 = {
      status: totalRoutes >= EXPECTED_ROUTE_TOTAL && missingFields.length === 0
        ? "PASS"
        : totalRoutes === 0 ? "FAIL" : "WARNING",
      total: totalRoutes,
      expected: EXPECTED_ROUTE_TOTAL,
      byCountry, byStatus, missingFields,
      hasNextPage: routes.products.pageInfo?.hasNextPage ?? false,
    };

    // --- Section 5: disclosure metaobject ---
    const metaobjects = disclosure.metaobjects.edges.map((e: any) => e.node);
    const target = metaobjects.find((m: any) => m.handle === "affiliate-route-disclosure");
    const section5 = {
      status: target ? "PASS" : "FAIL",
      handle: target?.handle ?? null,
      fields: target ? Object.fromEntries(target.fields.map((f: any) => [f.key, f.value])) : {},
    };

    const sections = [section1, section2, section3, section4, section5];
    const passCount = sections.filter((s) => s.status === "PASS").length;
    const hasFail = sections.some((s) => s.status === "FAIL");
    const hasWarn = sections.some((s) => s.status === "WARNING");

    return json({
      ok: true,
      checkedAt: new Date().toISOString(),
      passCount,
      total: sections.length,
      overall: hasFail ? "FAIL" : hasWarn ? "WARNING" : "PASS",
      sections: { metafields: section1, collections: section2, certificates: section3, routes: section4, disclosure: section5 },
    });
  } catch (e) {
    console.error("shopify-setup-status error", e);
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
