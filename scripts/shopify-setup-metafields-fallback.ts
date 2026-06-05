/**
 * FAA-SHOPIFY-SETUP-002 — Fallback creator for faa.* PRODUCT metafield definitions.
 *
 * Use when a direct Admin API access token (shpat_...) is NOT available.
 *
 * Run: npx tsx scripts/shopify-setup-metafields-fallback.ts [mode]
 *
 *   mode = auto  (default) Try, in order:
 *                  1. Admin API     (if SHOPIFY_ADMIN_ACCESS_TOKEN set)
 *                  2. Shopify CLI   (if `shopify` is on PATH and authed)
 *                  3. Print manual  GraphiQL payload + agent runbook
 *
 *   mode = cli       Force Shopify CLI path
 *   mode = manual    Just print the manual payload + runbook
 *   mode = agent     Print a JSON plan the Lovable agent can execute via
 *                    the shopify--update_product tool (seeds the definitions
 *                    by attaching metafields to a single seed product, which
 *                    causes Shopify to auto-register them as ad-hoc fields,
 *                    then the agent promotes them to definitions in admin).
 *
 * Env (optional):
 *   SHOPIFY_STORE_DOMAIN          ty3mn0-c3.myshopify.com
 *   SHOPIFY_ADMIN_ACCESS_TOKEN    shpat_...
 */

import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

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

const MUTATION = `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $definition) {
    createdDefinition { id name namespace key type { name } }
    userErrors { field message code }
  }
}`;

// ---------------------------------------------------------------------------
// Mode 1: Admin API (delegates to the primary script)
// ---------------------------------------------------------------------------
async function tryAdminApi(): Promise<boolean> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (!domain || !token || !token.startsWith("shpat_")) return false;

  console.log("→ Admin API token detected, delegating to primary script…");
  const res = spawnSync("npx", ["tsx", "scripts/shopify-setup-metafields.ts"], {
    stdio: "inherit",
  });
  return res.status === 0;
}

// ---------------------------------------------------------------------------
// Mode 2: Shopify CLI (`shopify app function` / `shopify api`)
// ---------------------------------------------------------------------------
function shopifyCliAvailable(): boolean {
  const res = spawnSync("shopify", ["version"], { encoding: "utf8" });
  return res.status === 0;
}

async function tryShopifyCli(): Promise<boolean> {
  if (!shopifyCliAvailable()) {
    console.log("→ Shopify CLI not on PATH. Install: npm i -g @shopify/cli @shopify/theme");
    return false;
  }

  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    console.log("→ SHOPIFY_STORE_DOMAIN required for CLI path.");
    return false;
  }

  let hadError = false;
  for (const def of METAFIELD_DEFINITIONS) {
    const label = `${def.namespace}.${def.key}`;
    const variables = JSON.stringify({
      definition: { ...def, ownerType: "PRODUCT" },
    });

    const res = spawnSync(
      "shopify",
      [
        "api", "graphql",
        "--store", domain,
        "--api-version", ADMIN_API_VERSION,
        "--body", JSON.stringify({ query: MUTATION, variables: JSON.parse(variables) }),
      ],
      { encoding: "utf8" },
    );

    if (res.status !== 0) {
      console.log(`ERROR    ${label}: ${res.stderr.trim() || "cli failure"}`);
      hadError = true;
      continue;
    }

    const out = (res.stdout || "").trim();
    if (/createdDefinition/.test(out) && !/"createdDefinition":\s*null/.test(out)) {
      console.log(`CREATED  ${label}`);
    } else if (/TAKEN|ALREADY_EXISTS|already/i.test(out)) {
      console.log(`SKIPPED  ${label} (already exists)`);
    } else {
      console.log(`ERROR    ${label}: ${out.slice(0, 200)}`);
      hadError = true;
    }
  }
  return !hadError;
}

// ---------------------------------------------------------------------------
// Mode 3: Manual — emit a Bulk GraphiQL payload the user pastes once
// ---------------------------------------------------------------------------
function emitManualPayload() {
  const aliased = METAFIELD_DEFINITIONS.map((def, i) => {
    const alias = `m${i}_${def.key}`;
    const input = JSON.stringify({ ...def, ownerType: "PRODUCT" })
      .replace(/"([a-zA-Z_]+)":/g, "$1:");
    return `  ${alias}: metafieldDefinitionCreate(definition: ${input}) {
    createdDefinition { id namespace key }
    userErrors { code message }
  }`;
  }).join("\n");

  const doc = `mutation SeedFaaMetafields {
${aliased}
}
`;

  const outPath = "/mnt/documents/shopify-faa-metafields.graphql";
  writeFileSync(outPath, doc);

  console.log("\n=== MANUAL FALLBACK ===");
  console.log("1. Install the free 'Shopify GraphiQL App' on your store:");
  console.log("   https://shopify-graphiql-app.shopifycloud.com/login");
  console.log(`2. Open it, set API version to ${ADMIN_API_VERSION}.`);
  console.log("3. Paste the contents of:");
  console.log(`     ${outPath}`);
  console.log("4. Hit Run. Aliases that return userErrors with code TAKEN are already created — safe to ignore.");
  console.log("\nGraphQL payload also printed below:\n");
  console.log(doc);
}

// ---------------------------------------------------------------------------
// Mode 4: Agent runbook — JSON the Lovable agent can execute
// ---------------------------------------------------------------------------
function emitAgentPlan() {
  const plan = {
    tool: "shopify--update_product or shopify--create_product",
    note:
      "The Shopify connector tools exposed to the Lovable agent can write " +
      "metafield VALUES on products, but cannot create metafield DEFINITIONS " +
      "directly. To create the definitions, the agent should: " +
      "(a) call shopify--get_admin_url, " +
      "(b) instruct the user to open Settings → Custom data → Products → " +
      "'Add definition', and (c) paste each definition below. Alternatively, " +
      "ask the user to install the Shopify GraphiQL App and rerun this script " +
      "with mode=manual.",
    definitions: METAFIELD_DEFINITIONS.map((d) => ({ ...d, ownerType: "PRODUCT" })),
  };

  const outPath = "/mnt/documents/shopify-faa-metafields-agent-plan.json";
  writeFileSync(outPath, JSON.stringify(plan, null, 2));
  console.log("=== AGENT PLAN ===");
  console.log(`Wrote ${outPath}`);
  console.log("Ask the Lovable agent: \"Execute the plan in shopify-faa-metafields-agent-plan.json\".");
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------
async function main() {
  const mode = (process.argv[2] || "auto").toLowerCase();

  if (mode === "manual") return emitManualPayload();
  if (mode === "agent")  return emitAgentPlan();

  if (mode === "cli") {
    const ok = await tryShopifyCli();
    if (!ok) { emitManualPayload(); process.exit(1); }
    return;
  }

  // auto
  if (await tryAdminApi()) return;
  console.log("→ No Admin API token. Trying Shopify CLI…");
  if (await tryShopifyCli()) return;
  console.log("→ CLI unavailable. Falling back to manual GraphiQL payload.");
  emitManualPayload();
  console.log("\nAlso writing agent plan for the Lovable agent to execute:");
  emitAgentPlan();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
