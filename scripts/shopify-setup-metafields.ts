/**
 * FAA-SHOPIFY-SETUP-001 — Create faa.* metafield definitions on PRODUCT.
 *
 * Run: npx tsx scripts/shopify-setup-metafields.ts
 *
 * Requires env:
 *   SHOPIFY_STORE_DOMAIN          e.g. ty3mn0-c3.myshopify.com
 *   SHOPIFY_ADMIN_ACCESS_TOKEN    Admin API access token with write_products scope
 *
 * Idempotent: definitions that already exist (TAKEN / ALREADY_EXISTS) are skipped.
 */

const ADMIN_API_VERSION = "2025-07";

type MetafieldDef = {
  namespace: string;
  key: string;
  type: string;
  name: string;
};

const METAFIELD_DEFINITIONS: MetafieldDef[] = [
  { namespace: "faa", key: "program_slug",         type: "single_line_text_field", name: "Program Slug" },
  { namespace: "faa", key: "requires_eligibility", type: "boolean",                name: "Requires Eligibility" },
  { namespace: "faa", key: "is_checkout_enabled",  type: "boolean",                name: "Checkout Enabled" },
  { namespace: "faa", key: "is_route_only",        type: "boolean",                name: "Route Only" },
  { namespace: "faa", key: "route_type",           type: "single_line_text_field", name: "Route Type" },
  { namespace: "faa", key: "destination_url",      type: "url",                    name: "Destination URL" },
  { namespace: "faa", key: "redirect_slug",        type: "single_line_text_field", name: "Redirect Slug" },
  { namespace: "faa", key: "cta_label",            type: "single_line_text_field", name: "CTA Label" },
  { namespace: "faa", key: "country",              type: "single_line_text_field", name: "Country" },
  { namespace: "faa", key: "vendor",               type: "single_line_text_field", name: "Vendor Slug" },
  { namespace: "faa", key: "partner_entity",       type: "single_line_text_field", name: "Partner Entity" },
  { namespace: "faa", key: "amazon_asin",          type: "single_line_text_field", name: "Amazon ASIN" },
  { namespace: "faa", key: "route_confidence",     type: "single_line_text_field", name: "Route Confidence" },
  { namespace: "faa", key: "availability_status",  type: "single_line_text_field", name: "Availability Status" },
  { namespace: "faa", key: "last_checked_at",      type: "date",                   name: "Last Checked At" },
  { namespace: "faa", key: "related_program",      type: "single_line_text_field", name: "Related Program" },
  { namespace: "faa", key: "referral_code",        type: "single_line_text_field", name: "Referral Code" },
  { namespace: "faa", key: "utm_campaign",         type: "single_line_text_field", name: "UTM Campaign" },
  { namespace: "faa", key: "utm_content",          type: "single_line_text_field", name: "UTM Content" },
  { namespace: "faa", key: "cpd_hours",            type: "number_integer",         name: "CPD Hours" },
  { namespace: "faa", key: "cpd_disclaimer",       type: "multi_line_text_field",  name: "CPD Disclaimer" },
  { namespace: "faa", key: "disclosure_required",  type: "boolean",                name: "Disclosure Required" },
  { namespace: "faa", key: "expansion_candidates", type: "multi_line_text_field",  name: "Expansion Candidates" },
];

const MUTATION = `
  mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition { id name namespace key type { name } }
      userErrors { field message code }
    }
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
  let hadError = false;

  for (const def of METAFIELD_DEFINITIONS) {
    const label = `${def.namespace}.${def.key}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": token,
        },
        body: JSON.stringify({
          query: MUTATION,
          variables: {
            definition: { ...def, ownerType: "PRODUCT" },
          },
        }),
      });

      const body = await res.json();

      if (body.errors) {
        console.log(`ERROR ${label}: ${JSON.stringify(body.errors)}`);
        hadError = true;
        continue;
      }

      const result = body.data?.metafieldDefinitionCreate;
      const userErrors: Array<{ code?: string; message: string }> = result?.userErrors ?? [];

      if (result?.createdDefinition) {
        console.log(`CREATED  ${label}`);
        continue;
      }

      const alreadyExists = userErrors.some(
        (e) => e.code === "TAKEN" || e.code === "ALREADY_EXISTS" || /taken|already/i.test(e.message),
      );
      if (alreadyExists) {
        console.log(`SKIPPED  ${label} (already exists)`);
        continue;
      }

      console.log(`ERROR    ${label}: ${userErrors.map((e) => e.message).join("; ") || "unknown"}`);
      hadError = true;
    } catch (err) {
      console.log(`ERROR    ${label}: ${err instanceof Error ? err.message : String(err)}`);
      hadError = true;
    }
  }

  process.exit(hadError ? 1 : 0);
}

main();
