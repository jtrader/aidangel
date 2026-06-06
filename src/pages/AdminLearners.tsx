import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Search } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { SeoHead } from "@/components/SeoHead";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Row = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  title: string;
  slug: string;
  kind: "course" | "program";
  started_at: string;
  lessons_done: number;
  lessons_total: number;
  quiz_passed: boolean;
};

export default function AdminLearners() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Fetch enrollments and related meta
      const [ce, pe, courses, programs] = await Promise.all([
        supabase.from("course_enrollments").select("user_id,course_id,started_at").order("started_at", { ascending: false }).limit(2000),
        supabase.from("program_enrollments").select("user_id,program_id,started_at").order("started_at", { ascending: false }).limit(2000),
        supabase.from("courses").select("id,title,slug"),
        supabase.from("programs").select("id,title,slug"),
      ]);

      const courseMap = new Map((courses.data ?? []).map((c: any) => [c.id, c]));
      const programMap = new Map((programs.data ?? []).map((p: any) => [p.id, p]));

      const courseEnrolls = (ce.data ?? []) as any[];
      const programEnrolls = (pe.data ?? []) as any[];

      const userIds = Array.from(new Set([
        ...courseEnrolls.map((r) => r.user_id),
        ...programEnrolls.map((r) => r.user_id),
      ]));

      const profiles = userIds.length
        ? (await supabase.from("profiles").select("user_id,email,full_name").in("user_id", userIds)).data ?? []
        : [];
      const pMap = new Map(profiles.map((p: any) => [p.user_id, p]));

      // Gather lesson counts per course and progress rows for users
      const courseIds = Array.from(new Set(courseEnrolls.map((r) => r.course_id)));
      const programIds = Array.from(new Set(programEnrolls.map((r) => r.program_id)));

      const [lessonsRes, lpRes, quizPassedRes] = await Promise.all([
        courseIds.length ? supabase.from("lessons").select("id,course_id").in("course_id", courseIds) : Promise.resolve({ data: [] }),
        (courseIds.length && userIds.length) ? supabase.from("lesson_progress").select("user_id,course_id").in("course_id", courseIds).in("user_id", userIds) : Promise.resolve({ data: [] }),
        (courseIds.length && userIds.length) ? supabase.from("quiz_attempts").select("user_id,course_id,passed").in("course_id", courseIds).in("user_id", userIds).eq("passed", true) : Promise.resolve({ data: [] }),
      ] as any[]);

      // Map totals per course
      const lessonsByCourse: Record<string, number> = {};
      for (const l of (lessonsRes.data ?? [])) lessonsByCourse[l.course_id] = (lessonsByCourse[l.course_id] ?? 0) + 1;

      // Map progress per (user,course)
      const progressMap: Record<string, number> = {};
      for (const pr of (lpRes.data ?? [])) {
        const key = `${pr.user_id}|${pr.course_id}`;
        progressMap[key] = (progressMap[key] ?? 0) + 1;
      }

      const passedSet = new Set<string>();
      for (const pa of (quizPassedRes.data ?? [])) passedSet.add(`${pa.user_id}|${pa.course_id}`);

      // Program-level data: topics per program and passed topic counts per user
      let topicsByProgram: Record<string, number> = {};
      let programPassedMap: Record<string, number> = {};
      let programCertSet = new Set<string>();
      if (programIds.length) {
        const [ptsRes, progQuizPassedRes, progCertsRes] = await Promise.all([
          supabase.from("program_topics").select("program_id,course_id").in("program_id", programIds),
          // quizzes passed for courses that are part of these programs
          supabase.from("quiz_attempts").select("user_id,course_id,passed").in("course_id", (await supabase.from("program_topics").select("course_id").in("program_id", programIds)).data?.map((r:any)=>r.course_id) ?? []).in("user_id", userIds).eq("passed", true),
          supabase.from("program_certificates").select("user_id,program_id").in("program_id", programIds).in("user_id", userIds),
        ] as any[]);

        // topics total
        for (const t of (ptsRes.data ?? [])) topicsByProgram[t.program_id] = (topicsByProgram[t.program_id] ?? 0) + 1;

        // passed topics per user/program — quiz_attempts joined by course -> program
        // build course->program map
        const courseToProgram: Record<string, string[]> = {};
        for (const t of (ptsRes.data ?? [])) {
          courseToProgram[t.course_id] = courseToProgram[t.course_id] ?? [];
          courseToProgram[t.course_id].push(t.program_id);
        }
        for (const pa of (progQuizPassedRes.data ?? [])) {
          const programIdsForCourse = courseToProgram[pa.course_id] ?? [];
          for (const pid of programIdsForCourse) {
            const key = `${pa.user_id}|${pid}`;
            programPassedMap[key] = (programPassedMap[key] ?? 0) + 1;
          }
        }

        for (const pc of (progCertsRes.data ?? [])) programCertSet.add(`${pc.user_id}|${pc.program_id}`);
      }

      const merged: Row[] = [
        ...courseEnrolls.map((r: any) => {
          const c: any = courseMap.get(r.course_id);
          const p: any = pMap.get(r.user_id);
          const lessons_total = lessonsByCourse[r.course_id] ?? 0;
          const lessons_done = progressMap[`${r.user_id}|${r.course_id}`] ?? 0;
          const quiz_passed = passedSet.has(`${r.user_id}|${r.course_id}`);
          return {
            user_id: r.user_id, started_at: r.started_at, kind: "course" as const,
            title: c?.title ?? "(deleted course)", slug: c?.slug ?? "",
            email: p?.email ?? null, full_name: p?.full_name ?? null,
            lessons_done, lessons_total, quiz_passed,
          };
        }),
        ...programEnrolls.map((r: any) => {
          const c: any = programMap.get(r.program_id);
          const p: any = pMap.get(r.user_id);
          const lessons_total = topicsByProgram[r.program_id] ?? 0;
          const lessons_done = programPassedMap[`${r.user_id}|${r.program_id}`] ?? 0;
          const quiz_passed = programCertSet.has(`${r.user_id}|${r.program_id}`);
          return {
            user_id: r.user_id, started_at: r.started_at, kind: "program" as const,
            title: c?.title ?? "(deleted program)", slug: c?.slug ?? "",
            email: p?.email ?? null, full_name: p?.full_name ?? null,
            lessons_done, lessons_total, quiz_passed,
          };
        }),
      ].sort((a, b) => +new Date(b.started_at) - +new Date(a.started_at));
      setRows(merged);
       setLoading(false);
     })();
   }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter((r) =>
      (r.email ?? "").toLowerCase().includes(s) ||
      (r.full_name ?? "").toLowerCase().includes(s) ||
      r.title.toLowerCase().includes(s),
    );
  }, [rows, q]);

  function exportCsv() {
    const header = ["kind", "title", "slug", "user_id", "email", "full_name", "started_at", "lessons_done", "lessons_total", "quiz_passed"];
    const lines = [header.join(",")].concat(
      filtered.map((r) => [r.kind, r.title, r.slug, r.user_id, r.email ?? "", r.full_name ?? "", r.started_at, r.lessons_done, r.lessons_total, r.quiz_passed]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")),
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `learners-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <RequireAuth adminOnly>
      <SeoHead lang="en" basePath="/admin/learners" title="Learners — Admin" description="All course and program enrollments." />
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Admin
          </Link>
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div>
              <h1 className="text-3xl font-display font-bold">Learners</h1>
              <p className="text-sm text-muted-foreground">{filtered.length} of {rows.length} enrollments</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, course…" className="pl-8 w-72" />
              </div>
              <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1" /> CSV</Button>
            </div>
          </div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-3 py-2 font-medium">Learner</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Type</th>
                    <th className="px-3 py-2 font-medium">Title</th>
                    <th className="px-3 py-2 font-medium">Started</th>
                    <th className="px-3 py-2 font-medium">Lessons Done</th>
                    <th className="px-3 py-2 font-medium">Lessons Total</th>
                    <th className="px-3 py-2 font-medium">Quiz Passed</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td className="px-3 py-6 text-muted-foreground" colSpan={8}>Loading…</td></tr>}
                  {!loading && filtered.length === 0 && (
                    <tr><td className="px-3 py-6 text-muted-foreground" colSpan={8}>No learners found.</td></tr>
                  )}
                  {filtered.map((r, i) => (
                    <tr key={`${r.kind}-${r.user_id}-${r.slug}-${i}`} className="border-t">
                      <td className="px-3 py-2">{r.full_name ?? <span className="text-muted-foreground">—</span>}</td>
                      <td className="px-3 py-2">{r.email ?? <span className="text-muted-foreground">—</span>}</td>
                      <td className="px-3 py-2"><span className="inline-block rounded px-1.5 py-0.5 text-xs bg-muted">{r.kind}</span></td>
                      <td className="px-3 py-2">{r.title}</td>
                      <td className="px-3 py-2 text-muted-foreground">{new Date(r.started_at).toLocaleDateString()}</td>
                      <td className="px-3 py-2 text-center">{r.lessons_done}</td>
                      <td className="px-3 py-2 text-center">{r.lessons_total}</td>
                      <td className="px-3 py-2 text-center">
                        {r.quiz_passed ? (
                          <span className="inline-block rounded px-1.5 py-0.5 text-xs bg-green-500 text-white">Yes</span>
                        ) : (
                          <span className="inline-block rounded px-1.5 py-0.5 text-xs bg-red-500 text-white">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </RequireAuth>
  );
}
