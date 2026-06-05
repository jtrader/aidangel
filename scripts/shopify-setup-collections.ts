/**
 * FAA-SHOPIFY-SETUP-002 — Create program, product-type, and country collections.
 *
 * Run: npx tsx scripts/shopify-setup-collections.ts
 *
 * Requires env:
 *   SHOPIFY_STORE_DOMAIN
 *   SHOPIFY_ADMIN_ACCESS_TOKEN  (write_products scope)
 *
 * Idempotent: existing handles are skipped.
 */

const ADMIN_API_VERSION = "2025-07";

type Collection = { title: string; handle: string };

const COLLECTIONS: Collection[] = [
  // Program collections
  { title: "Emergency Response Essentials", handle: "emergency-response-essentials" },
  { title: "Parents & Childcare Essentials", handle: "parents-childcare-essentials" },
  { title: "Workplace & Trades Essentials", handle: "workplace-trades-essentials" },
  { title: "Outdoor & Remote Essentials", handle: "outdoor-remote-essentials" },
  { title: "Aged Care & Carers Essentials", handle: "aged-care-carers-essentials" },
  // Product type collections
  { title: "Certificates", handle: "certificates" },
  { title: "Product Routes", handle: "product-routes" },
  { title: "Training Routes", handle: "training-routes" },
  // Country collections
  { title: "Country: Australia", handle: "country-au" },
  { title: "Country: United Kingdom", handle: "country-uk" },
  { title: "Country: United States", handle: "country-us" },
  { title: "Country: Canada", handle: "country-ca" },
  { title: "Country: New Zealand", handle: "country-nz" },
];

const FIND_BY_HANDLE = `
  query CollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) { id handle }
  }
`;

const CREATE_MUTATION = `
  mutation CollectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection { id handle title }
      userErrors { field message }
    }
  }
`;

async function gql(url: string, token: string, query: string, variables: Record<string, unknown>) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

async function main() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!domain || !token) {
    console.error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN env var.");
    process.exit(1);
  }

  const url = `https://${domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`;
  let hadError = false;

  for (const c of COLLECTIONS) {
    try {
      const existing = await gql(url, token, FIND_BY_HANDLE, { handle: c.handle });
      if (existing?.data?.collectionByHandle?.id) {
        console.log(`SKIPPED: ${c.handle}`);
        continue;
      }

      const body = await gql(url, token, CREATE_MUTATION, {
        input: { title: c.title, handle: c.handle },
      });

      if (body.errors) {
        console.log(`ERROR: ${c.handle} — ${JSON.stringify(body.errors)}`);
        hadError = true;
        continue;
      }

      const result = body.data?.collectionCreate;
      const userErrors: Array<{ message: string }> = result?.userErrors ?? [];

      if (result?.collection?.id) {
        console.log(`CREATED: ${c.handle}`);
        continue;
      }

      if (userErrors.some((e) => /taken|already|handle/i.test(e.message))) {
        console.log(`SKIPPED: ${c.handle}`);
        continue;
      }

      console.log(`ERROR: ${c.handle} — ${userErrors.map((e) => e.message).join("; ") || "unknown"}`);
      hadError = true;
    } catch (err) {
      console.log(`ERROR: ${c.handle} — ${err instanceof Error ? err.message : String(err)}`);
      hadError = true;
    }
  }

  process.exit(hadError ? 1 : 0);
}

main();
