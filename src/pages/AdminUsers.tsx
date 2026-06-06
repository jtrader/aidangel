import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Search, CheckCircle2, XCircle } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { SeoHead } from "@/components/SeoHead";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type UserRow = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  shopify_customer_id: string | null;
  shopify_synced_at: string | null;
  marketing_opt_in: boolean;
  credit_balance: number;
  credit_unlimited: boolean;
  enrolment_count: number;
  cert_count: number;
};

export default function AdminUsers() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = (sessionData as any)?.session ?? null;
        if (!session?.access_token) { setRows([]); setLoading(false); return; }
        const res = await fetch('/functions/v1/admin-users', { headers: { Authorization: `Bearer ${session.access_token}` } });
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
      (r.email ?? "").toLowerCase().includes(s) ||
      (r.full_name ?? "").toLowerCase().includes(s) ||
      (r.shopify_customer_id ?? "").includes(s)
    );
  }, [rows, q]);

  function exportCsv() {
    const header = ["user_id","email","full_name","created_at","shopify_customer_id",
      "shopify_synced_at","marketing_opt_in","credit_balance","credit_unlimited",
      "enrolment_count","cert_count"];
    const lines = [header.join(",")].concat(
      filtered.map((r) =>
        [r.user_id, r.email ?? "", r.full_name ?? "", r.created_at,
          r.shopify_customer_id ?? "", r.shopify_synced_at ?? "",
          r.marketing_opt_in, r.credit_balance, r.credit_unlimited,
          r.enrolment_count, r.cert_count]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <RequireAuth adminOnly>
      <SeoHead lang="en" basePath="/admin/users" title="Users — Admin" description="" noindex />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Admin
          </Link>
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div>
              <h1 className="text-3xl font-display font-bold">Users</h1>
              <p className="text-sm text-muted-foreground">
                {filtered.length} of {rows.length} registered accounts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name, email, Shopify ID…"
                  className="pl-8 w-72"
                />
              </div>
              <Button variant="outline" size="sm" onClick={exportCsv}>
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-3 py-2 font-medium">User</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Signed up</th>
                    <th className="px-3 py-2 font-medium text-center">Shopify</th>
                    <th className="px-3 py-2 font-medium text-center">Marketing</th>
                    <th className="px-3 py-2 font-medium text-center">Credits</th>
                    <th className="px-3 py-2 font-medium text-center">Enrolments</th>
                    <th className="px-3 py-2 font-medium text-center">Certs</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td className="px-3 py-6 text-muted-foreground" colSpan={8}>Loading…</td></tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr><td className="px-3 py-6 text-muted-foreground" colSpan={8}>No users found.</td></tr>
                  )}
                  {filtered.map((r) => (
                    <tr key={r.user_id} className="border-t hover:bg-muted/30">
                      <td className="px-3 py-2 font-medium">
                        {r.full_name ?? <span className="text-muted-foreground italic">—</span>}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{r.email ?? "—"}</td>
                      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {r.shopify_customer_id
                          ? <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                          : <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {r.marketing_opt_in
                          ? <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                          : <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {r.credit_unlimited
                          ? <Badge variant="secondary">∞ Unlimited</Badge>
                          : r.credit_balance > 0
                          ? <Badge variant="outline">{r.credit_balance}</Badge>
                          : <span className="text-muted-foreground">0</span>}
                      </td>
                      <td className="px-3 py-2 text-center tabular-nums">{r.enrolment_count}</td>
                      <td className="px-3 py-2 text-center tabular-nums">{r.cert_count}</td>
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
