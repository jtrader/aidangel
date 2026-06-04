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
};

export default function AdminLearners() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [ce, pe, courses, programs] = await Promise.all([
        supabase.from("course_enrollments").select("user_id,course_id,started_at").order("started_at", { ascending: false }).limit(2000),
        supabase.from("program_enrollments").select("user_id,program_id,started_at").order("started_at", { ascending: false }).limit(2000),
        supabase.from("courses").select("id,title,slug"),
        supabase.from("programs").select("id,title,slug"),
      ]);
      const courseMap = new Map((courses.data ?? []).map((c: any) => [c.id, c]));
      const programMap = new Map((programs.data ?? []).map((p: any) => [p.id, p]));
      const userIds = Array.from(new Set([
        ...(ce.data ?? []).map((r: any) => r.user_id),
        ...(pe.data ?? []).map((r: any) => r.user_id),
      ]));
      const profiles = userIds.length
        ? (await supabase.from("profiles").select("user_id,email,full_name").in("user_id", userIds)).data ?? []
        : [];
      const pMap = new Map(profiles.map((p: any) => [p.user_id, p]));
      const merged: Row[] = [
        ...(ce.data ?? []).map((r: any) => {
          const c: any = courseMap.get(r.course_id);
          const p: any = pMap.get(r.user_id);
          return {
            user_id: r.user_id, started_at: r.started_at, kind: "course" as const,
            title: c?.title ?? "(deleted course)", slug: c?.slug ?? "",
            email: p?.email ?? null, full_name: p?.full_name ?? null,
          };
        }),
        ...(pe.data ?? []).map((r: any) => {
          const c: any = programMap.get(r.program_id);
          const p: any = pMap.get(r.user_id);
          return {
            user_id: r.user_id, started_at: r.started_at, kind: "program" as const,
            title: c?.title ?? "(deleted program)", slug: c?.slug ?? "",
            email: p?.email ?? null, full_name: p?.full_name ?? null,
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
    const header = ["kind", "title", "slug", "user_id", "email", "full_name", "started_at"];
    const lines = [header.join(",")].concat(
      filtered.map((r) => [r.kind, r.title, r.slug, r.user_id, r.email ?? "", r.full_name ?? "", r.started_at]
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
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td className="px-3 py-6 text-muted-foreground" colSpan={5}>Loading…</td></tr>}
                  {!loading && filtered.length === 0 && (
                    <tr><td className="px-3 py-6 text-muted-foreground" colSpan={5}>No learners found.</td></tr>
                  )}
                  {filtered.map((r, i) => (
                    <tr key={`${r.kind}-${r.user_id}-${r.slug}-${i}`} className="border-t">
                      <td className="px-3 py-2">{r.full_name ?? <span className="text-muted-foreground">—</span>}</td>
                      <td className="px-3 py-2">{r.email ?? <span className="text-muted-foreground">—</span>}</td>
                      <td className="px-3 py-2"><span className="inline-block rounded px-1.5 py-0.5 text-xs bg-muted">{r.kind}</span></td>
                      <td className="px-3 py-2">{r.title}</td>
                      <td className="px-3 py-2 text-muted-foreground">{new Date(r.started_at).toLocaleDateString()}</td>
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
