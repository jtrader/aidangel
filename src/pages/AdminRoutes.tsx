import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RequireAuth from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ExternalLink, RefreshCw, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

type Row = {
  id: string;
  route_slug: string;
  title: string | null;
  vendor: string | null;
  route_type: string | null;
  cta_label: string | null;
  confidence: string | null;
  country: string | null;
  destination_url: string | null;
  partner_entity: string | null;
  referral_code: string | null;
  availability_status: string | null;
  related_program: string | null;
  synced_at: string | null;
};

type ClickRow = {
  id: string;
  route_slug: string;
  source_page: string | null;
  country: string | null;
  timestamp: string | null;
};

function AdminRoutesInner() {
  const [rows, setRows] = useState<Row[]>([]);
  const [clicks, setClicks] = useState<ClickRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    const [{ data: cat }, { data: clk }] = await Promise.all([
      supabase.from("route_catalogue").select("*").order("synced_at", { ascending: false }).limit(500),
      supabase.from("route_clicks").select("id, route_slug, source_page, country, timestamp").order("timestamp", { ascending: false }).limit(50),
    ]);
    setRows((cat ?? []) as Row[]);
    setClicks((clk ?? []) as ClickRow[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function runSync() {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("route-catalogue-sync");
      if (error) throw error;
      toast.success("Sync complete", { description: JSON.stringify(data ?? {}) });
      await load();
    } catch (e: any) {
      toast.error("Sync failed", { description: e?.message ?? String(e) });
    } finally {
      setSyncing(false);
    }
  }

  const filtered = rows.filter((r) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return [r.route_slug, r.title, r.vendor, r.related_program, r.country, r.partner_entity, r.referral_code]
      .some((v) => (v ?? "").toLowerCase().includes(s));
  });

  const stats = {
    total: rows.length,
    available: rows.filter((r) => r.availability_status === "available").length,
    unavailable: rows.filter((r) => r.availability_status !== "available").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Route Catalogue — Admin</title></Helmet>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <Link to="/admin" className="text-sm text-muted-foreground hover:underline">← Admin</Link>
            <h1 className="text-3xl font-display font-bold mt-1">Route Catalogue</h1>
            <p className="text-muted-foreground text-sm">Partner courses, products, and donation routes synced from Shopify.</p>
          </div>
          <Button onClick={runSync} disabled={syncing}>
            {syncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Sync from Shopify
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4"><div className="text-2xl font-bold">{stats.total}</div><div className="text-xs text-muted-foreground uppercase">Total routes</div></Card>
          <Card className="p-4"><div className="text-2xl font-bold text-green-600">{stats.available}</div><div className="text-xs text-muted-foreground uppercase">Available</div></Card>
          <Card className="p-4"><div className="text-2xl font-bold text-muted-foreground">{stats.unavailable}</div><div className="text-xs text-muted-foreground uppercase">Unavailable</div></Card>
        </div>

        <div className="mb-4">
          <Input placeholder="Filter by slug, title, vendor, program, country…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <Card className="overflow-hidden mb-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slug</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No routes. Click "Sync from Shopify" to import products tagged <code>route-catalogue</code>.</TableCell></TableRow>
              ) : filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.route_slug}</TableCell>
                  <TableCell>{r.title ?? "—"}</TableCell>
                  <TableCell><Badge variant="outline">{r.route_type ?? "—"}</Badge></TableCell>
                  <TableCell>{r.related_program ?? "—"}</TableCell>
                  <TableCell>{r.country ?? "—"}</TableCell>
                  <TableCell>{r.partner_entity ?? r.vendor ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={r.availability_status === "available" ? "default" : "secondary"}>
                      {r.availability_status ?? "?"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button asChild variant="ghost" size="sm" title="Test /go redirect">
                        <Link to={`/go/${r.route_slug}?src=admin`} target="_blank"><ExternalLink className="h-3.5 w-3.5" /></Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <h2 className="text-xl font-display font-semibold mb-3">Recent clicks</h2>
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clicks.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No clicks yet.</TableCell></TableRow>
              ) : clicks.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-xs">{c.timestamp ? new Date(c.timestamp).toLocaleString() : "—"}</TableCell>
                  <TableCell className="font-mono text-xs">{c.route_slug}</TableCell>
                  <TableCell className="text-xs">{c.source_page ?? "—"}</TableCell>
                  <TableCell className="text-xs">{c.country ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

export default function AdminRoutes() {
  return <RequireAuth adminOnly><AdminRoutesInner /></RequireAuth>;
}
