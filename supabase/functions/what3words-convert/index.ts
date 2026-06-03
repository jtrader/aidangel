// Convert lat/lng → what3words address via the W3W API.
// Key lives server-side as W3W_API_KEY secret so it can be rotated.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");
  const key = Deno.env.get("W3W_API_KEY");

  if (!lat || !lng) {
    return new Response(JSON.stringify({ error: "missing_coords" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!key) {
    return new Response(JSON.stringify({ error: "missing_key" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const r = await fetch(
      `https://api.what3words.com/v3/convert-to-3wa?coordinates=${encodeURIComponent(
        `${lat},${lng}`,
      )}&key=${encodeURIComponent(key)}&language=en`,
    );
    const data = await r.json();
    if (!r.ok || data?.error) {
      return new Response(
        JSON.stringify({ error: data?.error?.message ?? `w3w_${r.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    return new Response(JSON.stringify({ words: data.words, map: data.map, nearestPlace: data.nearestPlace }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
