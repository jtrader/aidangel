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

    // Check admin role using the database helper
    const { data: roleData, error: roleErr } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    const isAdmin = Array.isArray(roleData) ? !!roleData[0] : !!roleData;
    if (roleErr || !isAdmin) return json({ error: "Forbidden" }, 403);

    const [{ count: usersCount }, { data: credits }, { count: enrolmentsCount }] = await Promise.all([
      supabase.from("profiles").select("user_id", { count: "exact" }),
      supabase.from("certificate_credits").select("user_id,balance,unlimited").limit(10000),
      supabase.from("course_enrollments").select("user_id", { count: "exact" }),
    ]);

    const totalCredits = (credits ?? []).reduce((s: number, c: any) => s + (c.balance ?? 0), 0);

    return json({ users: usersCount ?? 0, credits: totalCredits ?? 0, enrolments: enrolmentsCount ?? 0 });
  } catch (e: any) {
    console.error("admin-stats error:", e);
    return json({ error: String(e?.message ?? e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
