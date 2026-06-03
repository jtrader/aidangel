// Shopify Gateway — proxies Storefront + Admin GraphQL securely.
// Storefront: callable by any client (read-only, public token).
// Admin: requires authenticated admin user (server-side only token).

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const STORE_DOMAIN = Deno.env.get("SHOPIFY_STORE_DOMAIN") ?? "";
const API_VERSION = Deno.env.get("SHOPIFY_API_VERSION") ?? "";
const STOREFRONT_TOKEN = Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN") ?? "";
const ADMIN_TOKEN = Deno.env.get("SHOPIFY_ADMIN_ACCESS_TOKEN") ?? "";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

function normalizeDomain(d: string) {
  return d.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

async function shopifyFetch(
  endpoint: "storefront" | "admin",
  query: string,
  variables: Record<string, unknown> | undefined,
) {
  const domain = normalizeDomain(STORE_DOMAIN);
  const url =
    endpoint === "storefront"
      ? `https://${domain}/api/${API_VERSION}/graphql.json`
      : `https://${domain}/admin/api/${API_VERSION}/graphql.json`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (endpoint === "storefront") {
    headers["X-Shopify-Storefront-Access-Token"] = STOREFRONT_TOKEN;
  } else {
    headers["X-Shopify-Access-Token"] = ADMIN_TOKEN;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables: variables ?? {} }),
  });

  const text = await res.text();
  let body: unknown = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text };
  }
  return { ok: res.ok, status: res.status, body };
}

async function requireAdmin(authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false as const, error: "Missing bearer token", status: 401 };
  }
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return { ok: false as const, error: "Server misconfigured", status: 500 };
  }
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false },
  });
  const token = authHeader.slice(7);
  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !userData?.user) {
    return { ok: false as const, error: "Invalid session", status: 401 };
  }
  const { data: roleRow, error: roleErr } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (roleErr || !roleRow) {
    return { ok: false as const, error: "Forbidden", status: 403 };
  }
  return { ok: true as const, userId: userData.user.id };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (!STORE_DOMAIN || !API_VERSION) {
    return json({ error: "Shopify gateway not configured" }, 500);
  }

  let payload: {
    api?: "storefront" | "admin";
    query?: string;
    variables?: Record<string, unknown>;
  };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const api = payload.api ?? "storefront";
  const query = payload.query;
  if (!query || typeof query !== "string") {
    return json({ error: "Missing GraphQL `query`" }, 400);
  }
  if (api !== "storefront" && api !== "admin") {
    return json({ error: "`api` must be 'storefront' or 'admin'" }, 400);
  }

  if (api === "admin") {
    if (!ADMIN_TOKEN) {
      return json({ error: "Admin API not configured" }, 500);
    }
    const guard = await requireAdmin(req.headers.get("authorization"));
    if (!guard.ok) return json({ error: guard.error }, guard.status);
  } else if (!STOREFRONT_TOKEN) {
    return json({ error: "Storefront API not configured" }, 500);
  }

  try {
    const result = await shopifyFetch(api, query, payload.variables);
    return json(result.body, result.ok ? 200 : result.status);
  } catch (err) {
    console.error("shopify-gateway error", err);
    return json({ error: "Upstream Shopify request failed" }, 502);
  }
});
