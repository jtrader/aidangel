// Resolves a route slug to a destination URL with UTM + referral params,
// logs the outbound click, and returns a 302 redirect. Public, no auth.
//
// Usage:  GET /functions/v1/go-redirect/<slug>?src=<source_page>
// or:     GET /functions/v1/go-redirect?slug=<slug>

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    // path may be /go-redirect/<slug>
    const pathParts = url.pathname.split("/").filter(Boolean);
    const slugFromPath = pathParts[pathParts.length - 1];
    const slug = (url.searchParams.get("slug") || slugFromPath || "").toLowerCase();
    const sourcePage = url.searchParams.get("src") ?? null;
    const sessionId = url.searchParams.get("sid") ?? null;
    const countryHeader = req.headers.get("cf-ipcountry") ?? req.headers.get("x-vercel-ip-country") ?? null;

    if (!slug || slug === "go-redirect") {
      return json({ error: "missing_slug" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: route, error } = await supabase
      .from("route_catalogue")
      .select("route_slug, destination_url, partner_entity, referral_code, utm_campaign, utm_content, country, availability_status")
      .eq("route_slug", slug)
      .maybeSingle();

    if (error || !route || !route.destination_url) {
      return json({ error: "not_found" }, 404);
    }

    if (route.availability_status === "unavailable") {
      return json({ error: "unavailable" }, 410);
    }

    // Build outbound URL with UTM + referral
    const dest = new URL(route.destination_url);
    dest.searchParams.set("utm_source", "firstaidangel");
    dest.searchParams.set("utm_medium", "referral");
    if (route.utm_campaign) dest.searchParams.set("utm_campaign", route.utm_campaign);
    if (route.utm_content) dest.searchParams.set("utm_content", route.utm_content);
    if (route.referral_code) dest.searchParams.set("ref", route.referral_code);

    const clickId = crypto.randomUUID();
    await supabase.from("route_clicks").insert({
      click_id: clickId,
      route_slug: route.route_slug,
      partner_slug: route.partner_entity,
      destination_url: dest.toString(),
      country: route.country ?? countryHeader,
      source_page: sourcePage,
      session_id: sessionId,
    });

    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: dest.toString(),
        "Cache-Control": "no-store",
      },
    });
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
