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
  user_id: string | null;
  email: string | null;
  full_name: string | null;
  learner_name: string;
  certificate_number: string;
  title: string;
  kind: "topic" | "program" | "shopify";
  issued_at: string;
  pdf_url?: string | null;
};

export default function AdminGraduates() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [tc, pc, sc, courses, programs] = await Promise.all([
        supabase.from("certificates").select("user_id,course_id,learner_name,certificate_number,issued_at").order("issued_at", { ascending: false }).limit(2000),
        supabase.from("program_certificates").select("user_id,program_id,learner_name,certificate_number,issued_at").order("issued_at", { ascending: false }).limit(2000),
        supabase.from("shopify_certificates").select("user_id,learner_name,certificate_id,program_name,issue_date,pdf_url,status").eq("status", "issued").order("issue_date", { ascending: false }).limit(2000),
        supabase.from("courses").select("id,title"),
        supabase.from("programs").select("id,title"),
      ]);
      const courseMap = new Map((courses.data ?? []).map((c: any) => [c.id, c.title]));
      const programMap = new Map((programs.data ?? []).map((p: any) => [p.id, p.title]));
      const userIds = Array.from(new Set([
        ...(tc.data ?? []).map((r: any) => r.user_id),
        ...(pc.data ?? []).map((r: any) => r.user_id),
        ...(sc.data ?? []).map((r: any) => r.user_id).filter(Boolean),
      ]));
      const profiles = userIds.length
        ? (await supabase.from("profiles").select("user_id,email,full_name").in("user_id", userIds)).data ?? []
        : [];
      const pMap = new Map(profiles.map((p: any) => [p.user_id, p]));
      const merged: Row[] = [
        ...(tc.data ?? []).map((r: any): Row => {
          const p: any = pMap.get(r.user_id);
          return { kind: "topic", user_id: r.user_id, email: p?.email ?? null, full_name: p?.full_name ?? null,
            learner_name: r.learner_name, certificate_number: r.certificate_number,
            title: courseMap.get(r.course_id) ?? "(deleted)", issued_at: r.issued_at };
        }),
        ...(pc.data ?? []).map((r: any): Row => {
          const p: any = pMap.get(r.user_id);
          return { kind: "program", user_id: r.user_id, email: p?.email ?? null, full_name: p?.full_name ?? null,
            learner_name: r.learner_name, certificate_number: r.certificate_number,
            title: programMap.get(r.program_id) ?? "(deleted)", issued_at: r.issued_at };
        }),
        ...(sc.data ?? []).map((r: any): Row => {
          const p: any = r.user_id ? pMap.get(r.user_id) : null;
          return { kind: "shopify", user_id: r.user_id, email: p?.email ?? null, full_name: p?.full_name ?? null,
            learner_name: r.learner_name, certificate_number: r.certificate_id,
            title: r.program_name, issued_at: r.issue_date, pdf_url: r.pdf_url };
        }),
      ].sort((a, b) => +new Date(b.issued_at) - +new Date(a.issued_at));
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
      r.learner_name.toLowerCase().includes(s) ||
      r.certificate_number.toLowerCase().includes(s) ||
      r.title.toLowerCase().includes(s),
    );
  }, [rows, q]);

  function exportCsv() {
    const header = ["kind", "certificate_number", "title", "learner_name", "email", "full_name", "user_id", "issued_at", "pdf_url"];
    const lines = [header.join(",")].concat(
      filtered.map((r) => [r.kind, r.certificate_number, r.title, r.learner_name, r.email ?? "", r.full_name ?? "", r.user_id ?? "", r.issued_at, r.pdf_url ?? ""]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")),
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `graduates-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <RequireAuth adminOnly>
      <SeoHead lang="en" basePath="/admin/graduates" title="Graduates — Admin" description="All issued certificates." />
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Admin
          </Link>
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div>
              <h1 className="text-3xl font-display font-bold">Graduates</h1>
              <p className="text-sm text-muted-foreground">{filtered.length} of {rows.length} certificates</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, cert #…" className="pl-8 w-72" />
              </div>
              <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-1" /> CSV</Button>
            </div>
          </div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-3 py-2 font-medium">Certificate #</th>
                    <th className="px-3 py-2 font-medium">Type</th>
                    <th className="px-3 py-2 font-medium">Title</th>
                    <th className="px-3 py-2 font-medium">Learner</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Issued</th>
                    <th className="px-3 py-2 font-medium">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td className="px-3 py-6 text-muted-foreground" colSpan={7}>Loading…</td></tr>}
                  {!loading && filtered.length === 0 && (
                    <tr><td className="px-3 py-6 text-muted-foreground" colSpan={7}>No certificates found.</td></tr>
                  )}
                  {filtered.map((r) => (
                    <tr key={`${r.kind}-${r.certificate_number}`} className="border-t">
                      <td className="px-3 py-2 font-mono text-xs">{r.certificate_number}</td>
                      <td className="px-3 py-2"><span className="inline-block rounded px-1.5 py-0.5 text-xs bg-muted">{r.kind}</span></td>
                      <td className="px-3 py-2">{r.title}</td>
                      <td className="px-3 py-2">{r.learner_name}</td>
                      <td className="px-3 py-2">{r.email ?? <span className="text-muted-foreground">—</span>}</td>
                      <td className="px-3 py-2 text-muted-foreground">{new Date(r.issued_at).toLocaleDateString()}</td>
                      <td className="px-3 py-2">{r.pdf_url ? <a className="text-primary hover:underline" href={r.pdf_url} target="_blank" rel="noreferrer">Open</a> : <span className="text-muted-foreground">—</span>}</td>
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
