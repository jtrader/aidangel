import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) return json({ error: "Unauthorized" }, 401);

    const { data: roleData, error: roleErr } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    const isAdmin = Array.isArray(roleData) ? !!roleData[0] : !!roleData;
    if (roleErr || !isAdmin) return json({ error: "Forbidden" }, 403);

    // Get profiles
    const { data: profiles } = await supabase.from("profiles").select("user_id,email,full_name,created_at,shopify_customer_id,shopify_synced_at,marketing_opt_in").order("created_at", { ascending: false }).limit(5000);

    const userIds = (profiles ?? []).map((p:any) => p.user_id);

    const [creditsRes, enrolRes, certRes] = await Promise.all([
      supabase.from("certificate_credits").select("user_id,balance,unlimited").in("user_id", userIds),
      supabase.from("course_enrollments").select("user_id").in("user_id", userIds),
      supabase.from("program_certificates").select("user_id").in("user_id", userIds),
    ]);

    const creditMap = new Map((creditsRes.data ?? []).map((c:any)=>[c.user_id, c]));
    const enrolMap: Record<string, number> = {};
    for (const e of (enrolRes.data ?? [])) enrolMap[e.user_id] = (enrolMap[e.user_id] ?? 0) + 1;
    const certMap: Record<string, number> = {};
    for (const c of (certRes.data ?? [])) certMap[c.user_id] = (certMap[c.user_id] ?? 0) + 1;

    const merged = (profiles ?? []).map((p:any) => {
      const cr = creditMap.get(p.user_id);
      return {
        user_id: p.user_id,
        email: p.email,
        full_name: p.full_name,
        created_at: p.created_at,
        shopify_customer_id: p.shopify_customer_id,
        shopify_synced_at: p.shopify_synced_at,
        marketing_opt_in: !!p.marketing_opt_in,
        credit_balance: cr?.balance ?? 0,
        credit_unlimited: !!cr?.unlimited,
        enrolment_count: enrolMap[p.user_id] ?? 0,
        cert_count: certMap[p.user_id] ?? 0,
      };
    });

    return json({ data: merged });
  } catch (e:any) {
    console.error("admin-users error:", e);
    return json({ error: String(e?.message ?? e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
