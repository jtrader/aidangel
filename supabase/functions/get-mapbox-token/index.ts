// Returns the Mapbox public access token from server-side env.
// The token itself is a "pk." public token — safe to expose — but we serve it
// via an edge function so it lives in a single secret and can be rotated.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const token = Deno.env.get("MAPBOX_PUBLIC_TOKEN") ?? "";

  return new Response(
    JSON.stringify({ token }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    },
  );
});
