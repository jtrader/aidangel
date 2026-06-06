import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Search } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { SeoHead } from "@/components/SeoHead";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type CreditRow = {
  id: number;
  user_id: string;
  amount: number;
  unlimited: boolean;
  updated_at: string;
  source: string | null;
};

export default function AdminCredits() {
  const [rows, setRows] = useState<CreditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = (sessionData as any)?.session ?? null;
        if (!session?.access_token) { setRows([]); setLoading(false); return; }
        const res = await fetch('/functions/v1/admin-credits', { headers: { Authorization: `Bearer ${session.access_token}` } });
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
      (r.user_id ?? "").toLowerCase().includes(s) ||
      (r.source ?? "").toLowerCase().includes(s)
    );
  }, [rows, q]);

  function exportCsv() {
    const header = ["id","user_id","amount","unlimited","updated_at","source"];
    const lines = [header.join(",")].concat(
      filtered.map((r) =>
        [r.id, r.user_id, r.amount, r.unlimited, r.updated_at, r.source ?? ""]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `credits-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <RequireAuth adminOnly>
      <SeoHead lang="en" basePath="/admin/credits" title="Credits — Admin" description="" noindex />
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Admin
          </Link>

          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div>
              <h1 className="text-3xl font-display font-bold">Credits</h1>
              <p className="text-sm text-muted-foreground">Manage issued certificate credits</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search user ID or source…"
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
                    <th className="px-3 py-2 font-medium">User</th>
                    <th className="px-3 py-2 font-medium text-center">Amount</th>
                    <th className="px-3 py-2 font-medium text-center">Unlimited</th>
                    <th className="px-3 py-2 font-medium text-center">Source</th>
                    <th className="px-3 py-2 font-medium text-center">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td className="px-3 py-6 text-muted-foreground" colSpan={5}>Loading…</td></tr>}
                  {!loading && rows.length === 0 && <tr><td className="px-3 py-6 text-muted-foreground" colSpan={5}>No credits.</td></tr>}
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-muted/30">
                      <td className="px-3 py-2 text-muted-foreground">{r.user_id}</td>
                      <td className="px-3 py-2 text-center tabular-nums">{r.amount}</td>
                      <td className="px-3 py-2 text-center">{r.unlimited ? "Yes" : ""}</td>
                      <td className="px-3 py-2 text-center">{r.source ?? "—"}</td>
                      <td className="px-3 py-2 text-center">{new Date(r.updated_at).toLocaleString()}</td>
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
