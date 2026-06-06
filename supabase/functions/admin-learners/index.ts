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

    // Build aggregated learner rows server-side
    // Fetch enrollments
    const [{ data: courseEnrolls }, { data: programEnrolls }] = await Promise.all([
      supabase.from("course_enrollments").select("user_id,course_id,started_at").order("started_at", { ascending: false }).limit(5000),
      supabase.from("program_enrollments").select("user_id,program_id,started_at").order("started_at", { ascending: false }).limit(5000),
    ]);

    const courseIds = Array.from(new Set((courseEnrolls ?? []).map((r:any) => r.course_id)));
    const programIds = Array.from(new Set((programEnrolls ?? []).map((r:any) => r.program_id)));

    const [coursesRes, programsRes, profilesRes] = await Promise.all([
      supabase.from("courses").select("id,title,slug").in("id", courseIds),
      supabase.from("programs").select("id,title,slug").in("id", programIds),
      supabase.from("profiles").select("user_id,email,full_name").in("user_id", Array.from(new Set([...(courseEnrolls ?? []).map((r:any) => r.user_id), ...(programEnrolls ?? []).map((r:any) => r.user_id)]))),
    ]);

    const courseMap = new Map((coursesRes.data ?? []).map((c:any) => [c.id, c]));
    const programMap = new Map((programsRes.data ?? []).map((p:any) => [p.id, p]));
    const profileMap = new Map((profilesRes.data ?? []).map((p:any) => [p.user_id, p]));

    // Lessons count per course
    const lessonsRes = await supabase.from("lessons").select("id,course_id").in("course_id", courseIds);
    const lessonsByCourse: Record<string, number> = {};
    for (const l of (lessonsRes.data ?? [])) lessonsByCourse[l.course_id] = (lessonsByCourse[l.course_id] ?? 0) + 1;

    // Progress
    const lpRes = await supabase.from("lesson_progress").select("user_id,course_id").in("course_id", courseIds).in("user_id", Array.from(profileMap.keys()));
    const progressMap: Record<string, number> = {};
    for (const pr of (lpRes.data ?? [])) {
      const key = `${pr.user_id}|${pr.course_id}`;
      progressMap[key] = (progressMap[key] ?? 0) + 1;
    }

    // Quiz passes
    const quizPassRes = await supabase.from("quiz_attempts").select("user_id,course_id").in("course_id", courseIds).in("user_id", Array.from(profileMap.keys())).eq("passed", true);
    const passedSet = new Set<string>();
    for (const pa of (quizPassRes.data ?? [])) passedSet.add(`${pa.user_id}|${pa.course_id}`);

    // Program topics and program-level passed topics
    let topicsByProgram: Record<string, number> = {};
    let programPassedMap: Record<string, number> = {};
    let programCertSet = new Set<string>();
    if (programIds.length) {
      const ptsRes = await supabase.from("program_topics").select("program_id,course_id").in("program_id", programIds);
      for (const t of (ptsRes.data ?? [])) topicsByProgram[t.program_id] = (topicsByProgram[t.program_id] ?? 0) + 1;

      const progCourseIds = (ptsRes.data ?? []).map((r:any)=>r.course_id);
      const progQuizPassRes = await supabase.from("quiz_attempts").select("user_id,course_id").in("course_id", progCourseIds).in("user_id", Array.from(profileMap.keys())).eq("passed", true);

      const courseToProgram: Record<string,string[]> = {};
      for (const t of (ptsRes.data ?? [])) {
        courseToProgram[t.course_id] = courseToProgram[t.course_id] ?? [];
        courseToProgram[t.course_id].push(t.program_id);
      }
      for (const pa of (progQuizPassRes.data ?? [])) {
        const programIdsForCourse = courseToProgram[pa.course_id] ?? [];
        for (const pid of programIdsForCourse) {
          const key = `${pa.user_id}|${pid}`;
          programPassedMap[key] = (programPassedMap[key] ?? 0) + 1;
        }
      }

      const progCertRes = await supabase.from("program_certificates").select("user_id,program_id").in("program_id", programIds).in("user_id", Array.from(profileMap.keys()));
      for (const pc of (progCertRes.data ?? [])) programCertSet.add(`${pc.user_id}|${pc.program_id}`);
    }

    const merged = [
      ...(courseEnrolls ?? []).map((r:any) => {
        const c = courseMap.get(r.course_id);
        const p = profileMap.get(r.user_id);
        const lessons_total = lessonsByCourse[r.course_id] ?? 0;
        const lessons_done = progressMap[`${r.user_id}|${r.course_id}`] ?? 0;
        const quiz_passed = passedSet.has(`${r.user_id}|${r.course_id}`);
        return {
          user_id: r.user_id, started_at: r.started_at, kind: "course",
          title: c?.title ?? "(deleted course)", slug: c?.slug ?? "",
          email: p?.email ?? null, full_name: p?.full_name ?? null,
          lessons_done, lessons_total, quiz_passed,
        };
      }),
      ...(programEnrolls ?? []).map((r:any) => {
        const c = programMap.get(r.program_id);
        const p = profileMap.get(r.user_id);
        const lessons_total = topicsByProgram[r.program_id] ?? 0;
        const lessons_done = programPassedMap[`${r.user_id}|${r.program_id}`] ?? 0;
        const quiz_passed = programCertSet.has(`${r.user_id}|${r.program_id}`);
        return {
          user_id: r.user_id, started_at: r.started_at, kind: "program",
          title: c?.title ?? "(deleted program)", slug: c?.slug ?? "",
          email: p?.email ?? null, full_name: p?.full_name ?? null,
          lessons_done, lessons_total, quiz_passed,
        };
      }),
    ].sort((a:any,b:any) => +new Date(b.started_at) - +new Date(a.started_at));

    return json({ data: merged });
  } catch (e:any) {
    console.error("admin-learners error:", e);
    return json({ error: String(e?.message ?? e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
