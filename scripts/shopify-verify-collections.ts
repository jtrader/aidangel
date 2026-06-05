/**
 * FAA-SHOPIFY-SETUP-002 — Verify all 13 required collections exist.
 *
 * Run: npx tsx scripts/shopify-verify-collections.ts
 *
 * Requires env:
 *   SHOPIFY_STORE_DOMAIN
 *   SHOPIFY_ADMIN_ACCESS_TOKEN
 *
 * Exits 0 if all expected handles exist, 1 otherwise.
 */

const ADMIN_API_VERSION = "2025-07";

const EXPECTED_HANDLES = [
  "emergency-response-essentials",
  "parents-childcare-essentials",
  "workplace-trades-essentials",
  "outdoor-remote-essentials",
  "aged-care-carers-essentials",
  "certificates",
  "product-routes",
  "training-routes",
  "country-au",
  "country-uk",
  "country-us",
  "country-ca",
  "country-nz",
];

const FIND_BY_HANDLE = `
  query CollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) { id handle title }
  }
`;

async function main() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!domain || !token) {
    console.error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN env var.");
    process.exit(1);
  }

  const url = `https://${domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`;
  const missing: string[] = [];
  const found: string[] = [];

  for (const handle of EXPECTED_HANDLES) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": token,
        },
        body: JSON.stringify({ query: FIND_BY_HANDLE, variables: { handle } }),
      });
      const body = await res.json();
      const col = body?.data?.collectionByHandle;
      if (col?.id) {
        console.log(`OK      ${handle}  (${col.title})`);
        found.push(handle);
      } else {
        console.log(`MISSING ${handle}`);
        missing.push(handle);
      }
    } catch (err) {
      console.log(`ERROR   ${handle} — ${err instanceof Error ? err.message : String(err)}`);
      missing.push(handle);
    }
  }

  console.log(`\nFound ${found.length}/${EXPECTED_HANDLES.length} collections.`);
  if (missing.length) {
    console.log(`Missing: ${missing.join(", ")}`);
    process.exit(1);
  }
  console.log("All required collections present.");
  process.exit(0);
}

main();
