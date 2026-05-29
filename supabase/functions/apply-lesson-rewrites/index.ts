// One-shot admin utility — applies lesson body rewrites from a storage JSON payload.
// Requires an admin JWT.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
  const token = authHeader.replace("Bearer ", "");
  const { data: claimsData } = await userClient.auth.getClaims(token);
  const userId = claimsData?.claims?.sub;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const supa = createClient(url, key);
  const { data: roleRow } = await supa
    .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!roleRow) {
    return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const res = await fetch(`${url}/storage/v1/object/public/lesson-sources/_tmp/lesson_updates.json`);
  if (!res.ok) return new Response(`fetch failed ${res.status}`, { status: 500, headers: corsHeaders });
  const items: { id: string; body: string }[] = await res.json();

  const results: any[] = [];
  for (const it of items) {
    const { error } = await supa.from("lessons").update({ body: it.body }).eq("id", it.id);
    results.push({ id: it.id, ok: !error, error: error?.message });
  }
  const ok = results.filter(r => r.ok).length;
  return new Response(JSON.stringify({ total: items.length, ok, failed: results.filter(r => !r.ok) }, null, 2), {
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
});

