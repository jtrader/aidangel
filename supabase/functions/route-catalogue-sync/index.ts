// Syncs products from Shopify tagged `route-catalogue` into public.route_catalogue.
// Reads partner metadata from product tags formatted as `key:value`, e.g.
//   route-catalogue, type:course, program:ERE, country:AU, partner:RedCross,
//   ref:FAA123, utm_campaign:partners, utm_content:ere, confidence:high,
//   cta:Book course
// The product's onlineStoreUrl (or first variant URL) becomes destination_url.

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SHOPIFY_DOMAIN = "ty3mn0-c3.myshopify.com";
const SHOPIFY_STOREFRONT_TOKEN = Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN")!;
const SHOPIFY_API_VERSION = "2025-07";

const PRODUCTS_QUERY = `
  query Products($cursor: String) {
    products(first: 50, after: $cursor, query: "tag:route-catalogue") {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          handle
          title
          description
          vendor
          tags
          onlineStoreUrl
          featuredImage { url }
        }
      }
    }
  }
`;

function parseTags(tags: string[]) {
  const m: Record<string, string> = {};
  for (const t of tags) {
    const i = t.indexOf(":");
    if (i > 0) m[t.slice(0, i).trim().toLowerCase()] = t.slice(i + 1).trim();
  }
  return m;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Admin-only: require service role OR caller is admin user
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Allow either service role secret or admin app role.
    if (!authHeader.includes(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)) {
      const userClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } },
      );
      const { data: { user } } = await userClient.auth.getUser();
      if (!user) return json({ error: "Unauthorized" }, 401);
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!isAdmin) return json({ error: "Forbidden" }, 403);
    }

    let cursor: string | null = null;
    let synced = 0;
    const seen: string[] = [];

    do {
      const res = await fetch(
        `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
          },
          body: JSON.stringify({ query: PRODUCTS_QUERY, variables: { cursor } }),
        },
      );
      const body = await res.json();
      if (body.errors) return json({ error: "shopify_error", details: body.errors }, 502);

      const edges = body.data?.products?.edges ?? [];
      for (const e of edges) {
        const p = e.node;
        const meta = parseTags(p.tags ?? []);
        const slug = (meta.slug || p.handle).toLowerCase();
        const destination = p.onlineStoreUrl
          ?? `https://${SHOPIFY_DOMAIN.replace(".myshopify.com", "")}.myshopify.com/products/${p.handle}`;

        const row = {
          id: p.id,
          route_slug: slug,
          title: p.title,
          description: p.description ?? null,
          vendor: meta.partner || p.vendor || null,
          image_url: p.featuredImage?.url ?? null,
          route_type: meta.type ?? "course",
          cta_label: meta.cta ?? "Learn more",
          confidence: meta.confidence ?? "medium",
          country: meta.country ?? null,
          destination_url: destination,
          partner_entity: meta.partner ?? null,
          referral_code: meta.ref ?? null,
          utm_campaign: meta.utm_campaign ?? "route_catalogue",
          utm_content: meta.utm_content ?? slug,
          availability_status: meta.status ?? "available",
          related_program: meta.program ?? null,
          last_checked_at: new Date().toISOString().slice(0, 10),
          synced_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("route_catalogue").upsert(row, { onConflict: "id" });
        if (error) console.error("upsert error", slug, error);
        else { synced++; seen.push(slug); }
      }

      cursor = body.data?.products?.pageInfo?.hasNextPage ? body.data.products.pageInfo.endCursor : null;
    } while (cursor);

    // Mark anything not seen as unavailable (soft delete)
    if (seen.length) {
      await supabase
        .from("route_catalogue")
        .update({ availability_status: "unavailable", synced_at: new Date().toISOString() })
        .not("route_slug", "in", `(${seen.map((s) => `"${s}"`).join(",")})`);
    }

    return json({ ok: true, synced, slugs: seen });
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
