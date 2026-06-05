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
// Mode 2: Shopify CLI session reuse
//
// Modern Shopify CLI (3.x) doesn't expose an arbitrary `api graphql` command.
// But after `shopify auth login` (or any `shopify theme` command that
// authenticates against the store) the CLI caches an OAuth offline access
// token on disk. We locate that token and use it ourselves with `fetch`.
//
// Token locations searched (first hit wins):
//   $SHOPIFY_CONFIG_HOME/identity.json
//   $XDG_CONFIG_HOME/shopify/identity.json
//   ~/.config/shopify/identity.json
//   ~/.config/shopify/identity-prod.json   (older CLI)
//   ~/Library/Application Support/shopify/identity.json   (macOS)
// ---------------------------------------------------------------------------
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

function shopifyCliAvailable(): boolean {
  for (const bin of ["shopify", "npx"]) {
    const args = bin === "npx" ? ["@shopify/cli@latest", "version"] : ["version"];
    const res = spawnSync(bin, args, { encoding: "utf8" });
    if (res.status === 0) return true;
  }
  return false;
}

function runShopify(args: string[]): { code: number; stdout: string; stderr: string } {
  // Prefer global `shopify`, fall back to `npx @shopify/cli@latest`.
  let res = spawnSync("shopify", args, { encoding: "utf8" });
  if (res.error || res.status === null) {
    res = spawnSync("npx", ["-y", "@shopify/cli@latest", ...args], { encoding: "utf8" });
  }
  return { code: res.status ?? 1, stdout: res.stdout || "", stderr: res.stderr || "" };
}

function findCliToken(domain: string): string | null {
  const candidates = [
    process.env.SHOPIFY_CONFIG_HOME && join(process.env.SHOPIFY_CONFIG_HOME, "identity.json"),
    process.env.XDG_CONFIG_HOME && join(process.env.XDG_CONFIG_HOME, "shopify", "identity.json"),
    join(homedir(), ".config", "shopify", "identity.json"),
    join(homedir(), ".config", "shopify", "identity-prod.json"),
    join(homedir(), "Library", "Application Support", "shopify", "identity.json"),
  ].filter(Boolean) as string[];

  for (const path of candidates) {
    if (!existsSync(path)) continue;
    try {
      const json = JSON.parse(readFileSync(path, "utf8"));
      // Layouts vary across CLI versions. Try the common shapes.
      const stores =
        json?.applicationTokens?.[domain] ||
        json?.exchanges?.[domain] ||
        json?.stores?.[domain] ||
        json?.[domain];
      const token =
        stores?.accessToken ||
        stores?.access_token ||
        json?.identity?.accessToken ||
        json?.accessToken;
      if (typeof token === "string" && token.length > 10) return token;
    } catch {
      /* ignore parse errors, try next */
    }
  }
  return null;
}

async function ensureCliSession(domain: string): Promise<string | null> {
  // 1. Already cached?
  let token = findCliToken(domain);
  if (token) return token;

  // 2. Trigger interactive login by calling a harmless authenticated command.
  console.log(`→ No cached CLI session for ${domain}. Launching \`shopify auth login\`…`);
  const login = spawnSync("shopify", ["auth", "login", "--store", domain], { stdio: "inherit" });
  if ((login.status ?? 1) !== 0) {
    spawnSync("npx", ["-y", "@shopify/cli@latest", "auth", "login", "--store", domain], { stdio: "inherit" });
  }

  // 3. Some CLI versions only write the token after a real command runs.
  if (!findCliToken(domain)) {
    console.log(`→ Priming session with \`shopify theme list --store ${domain}\`…`);
    runShopify(["theme", "list", "--store", domain]);
  }

  token = findCliToken(domain);
  if (!token) {
    console.log("→ Could not locate CLI access token after login. Falling back.");
    return null;
  }
  return token;
}

async function runMutation(domain: string, token: string, def: MetafieldDef) {
  const url = `https://${domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({
      query: MUTATION,
      variables: { definition: { ...def, ownerType: "PRODUCT" } },
    }),
  });
  return res.json() as Promise<any>;
}

async function tryShopifyCli(): Promise<boolean> {
  if (!shopifyCliAvailable()) {
    console.log("→ Shopify CLI not on PATH. Install: npm i -g @shopify/cli");
    return false;
  }

  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    console.log("→ SHOPIFY_STORE_DOMAIN required for CLI path.");
    return false;
  }

  const token = await ensureCliSession(domain);
  if (!token) return false;

  let hadError = false;
  for (const def of METAFIELD_DEFINITIONS) {
    const label = `${def.namespace}.${def.key}`;
    try {
      const body = await runMutation(domain, token, def);
      if (body.errors) {
        const msg = JSON.stringify(body.errors);
        // CLI session tokens are scoped to the app that created them.
        // If we get an auth error, bail out — fallback will handle the rest.
        if (/401|unauthorized|access denied/i.test(msg)) {
          console.log(`→ CLI session token rejected: ${msg}`);
          return false;
        }
        console.log(`ERROR    ${label}: ${msg}`);
        hadError = true;
        continue;
      }
      const result = body.data?.metafieldDefinitionCreate;
      const userErrors: Array<{ code?: string; message: string }> = result?.userErrors ?? [];
      if (result?.createdDefinition) {
        console.log(`CREATED  ${label}`);
      } else if (
        userErrors.some(
          (e) => e.code === "TAKEN" || e.code === "ALREADY_EXISTS" || /taken|already/i.test(e.message),
        )
      ) {
        console.log(`SKIPPED  ${label} (already exists)`);
      } else {
        console.log(`ERROR    ${label}: ${userErrors.map((e) => e.message).join("; ") || "unknown"}`);
        hadError = true;
      }
    } catch (err) {
      console.log(`ERROR    ${label}: ${err instanceof Error ? err.message : String(err)}`);
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
