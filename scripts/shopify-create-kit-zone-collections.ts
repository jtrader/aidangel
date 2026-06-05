/**
 * Create 4 smart collections — one per shipping zone — for St John affiliate kits.
 * Each is a smart collection requiring BOTH `faa-affiliate-kit` AND `zone-<ZONE>` tags.
 * Hidden from Online Store sales channel; available via Storefront API.
 *
 * Run: npx tsx scripts/shopify-create-kit-zone-collections.ts
 */

const ADMIN_API_VERSION = "2025-07";

type ZoneCollection = { title: string; handle: string; zoneTag: string };

const COLLECTIONS: ZoneCollection[] = [
  { title: "Kits — Australia",            handle: "kits-au",       zoneTag: "zone-AU" },
  { title: "Kits — UK & Ireland",         handle: "kits-uk-ie",    zoneTag: "zone-UK_IE" },
  { title: "Kits — North America",        handle: "kits-north-am", zoneTag: "zone-NORTH_AM" },
  { title: "Kits — Europe & Middle East", handle: "kits-eu-mena",  zoneTag: "zone-EU_MENA" },
];

const FIND_BY_HANDLE = `
  query ($handle: String!) {
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
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

async function main() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (!domain || !token) {
    console.error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN");
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
        input: {
          title: c.title,
          handle: c.handle,
          descriptionHtml: `<p>Affiliate first aid kits for the ${c.title.replace(/^Kits — /, "")} shipping zone. Managed via tags <code>faa-affiliate-kit</code> + <code>${c.zoneTag}</code>.</p>`,
          ruleSet: {
            appliedDisjunctively: false, // ALL rules must match (AND)
            rules: [
              { column: "TAG", relation: "EQUALS", condition: "faa-affiliate-kit" },
              { column: "TAG", relation: "EQUALS", condition: c.zoneTag },
            ],
          },
        },
      });

      if (body.errors) {
        console.log(`ERROR: ${c.handle} — ${JSON.stringify(body.errors)}`);
        hadError = true;
        continue;
      }
      const result = body.data?.collectionCreate;
      const userErrors: Array<{ message: string }> = result?.userErrors ?? [];
      if (result?.collection?.id) {
        console.log(`CREATED: ${c.handle} (${result.collection.id})`);
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
