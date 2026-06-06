import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Search } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { SeoHead } from "@/components/SeoHead";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type OrgRow = {
  id: number;
  name: string;
  created_at: string;
  user_count: number;
  active: boolean;
};

export default function AdminOrganisations() {
  const [rows, setRows] = useState<OrgRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = (sessionData as any)?.session ?? null;
        if (!session?.access_token) { setRows([]); setLoading(false); return; }
        const res = await fetch('/functions/v1/admin-organisations', { headers: { Authorization: `Bearer ${session.access_token}` } });
        if (!res.ok) { setRows([]); setLoading(false); return; }
        const body = await res.json();
        setRows(body.data ?? []);
      } catch (err) {
        setRows([]);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter((r) =>
      (r.name ?? "").toLowerCase().includes(s)
    );
  }, [rows, q]);

  function exportCsv() {
    const header = ["id","name","created_at","user_count","active"];
    const lines = [header.join(",")].concat(
      filtered.map((r) =>
        [r.id, r.name, r.created_at, r.user_count, r.active]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `organisations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <RequireAuth adminOnly>
      <SeoHead lang="en" basePath="/admin/organisations" title="Organisations — Admin" description="" noindex />
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Admin
          </Link>

          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div>
              <h1 className="text-3xl font-display font-bold">Organisations</h1>
              <p className="text-sm text-muted-foreground">Managed organisations and account holders</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name…"
                  className="pl-8 w-64"
                />
              </div>
              <Button variant="outline" size="sm" onClick={exportCsv}>
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
            </div>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-3 py-2 font-medium">Organisation</th>
                    <th className="px-3 py-2 font-medium text-center">Users</th>
                    <th className="px-3 py-2 font-medium text-center">Created</th>
                    <th className="px-3 py-2 font-medium text-center">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td className="px-3 py-6 text-muted-foreground" colSpan={4}>Loading…</td></tr>}
                  {!loading && rows.length === 0 && <tr><td className="px-3 py-6 text-muted-foreground" colSpan={4}>No organisations found.</td></tr>}
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-muted/30">
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="px-3 py-2 text-center tabular-nums">{r.user_count}</td>
                      <td className="px-3 py-2 text-center">{new Date(r.created_at).toLocaleString()}</td>
                      <td className="px-3 py-2 text-center">{r.active ? "Yes" : "No"}</td>
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
