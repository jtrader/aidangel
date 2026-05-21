import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Session } from "@supabase/supabase-js";
import { NGOS, COUNTRIES } from "@/lib/donations";
import { SHOPS } from "@/lib/shops";

type EventFilter = "all" | "give_click" | "shop_click";

function vendorLabel(eventName: string, id: string | null): string {
  if (!id) return "—";
  if (eventName === "shop_click") return SHOPS[id as keyof typeof SHOPS]?.short ?? id;
  return NGOS[id as keyof typeof NGOS]?.short ?? id;
}

type Row = {
  id: string;
  event_name: string;
  ngo_id: string | null;
  country_code: string | null;
  country_name: string | null;
  destination_url: string | null;
  is_national: boolean | null;
  page_path: string | null;
  referrer: string | null;
  language: string | null;
  variant: string | null;
  created_at: string;
};

type Range = "24h" | "7d" | "30d" | "all";

function sinceFor(range: Range): string | null {
  const ms = { "24h": 864e5, "7d": 7 * 864e5, "30d": 30 * 864e5 }[range as "24h" | "7d" | "30d"];
  if (!ms) return null;
  return new Date(Date.now() - ms).toISOString();
}

function countryFlag(code: string | null): string {
  if (!code) return "🌐";
  return COUNTRIES.find((c) => c.code === code)?.flag ?? "🏳️";
}

function AuthPanel({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const redirectTo = `${window.location.origin}/admin/donations`;
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: redirectTo },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onAuthed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-12">
      <CardHeader>
        <CardTitle>Admin sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
          <button
            type="button"
            className="text-xs text-muted-foreground hover:underline w-full text-center"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
          </button>
          <p className="text-[11px] text-muted-foreground text-center">
            The first user to sign up automatically becomes the admin.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdminDonations() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState<Range>("7d");
  const [ngoFilter, setNgoFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).then(({ data }) => {
      setIsAdmin(!!data?.some((r) => r.role === "admin"));
    });
  }, [session]);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    let q = supabase.from("give_clicks").select("*").order("created_at", { ascending: false }).limit(1000);
    const since = sinceFor(range);
    if (since) q = q.gte("created_at", since);
    if (ngoFilter !== "all") q = q.eq("ngo_id", ngoFilter);
    if (countryFilter !== "all") q = q.eq("country_code", countryFilter);
    q.then(({ data, error }) => {
      if (!error && data) setRows(data as Row[]);
      setLoading(false);
    });
  }, [isAdmin, range, ngoFilter, countryFilter]);

  const stats = useMemo(() => {
    const total = rows.length;
    const uniqueSessions = new Set(rows.map((r) => r.id)).size;
    const byNgo: Record<string, number> = {};
    const byCountry: Record<string, number> = {};
    const byPage: Record<string, number> = {};
    const byReferrer: Record<string, number> = {};
    for (const r of rows) {
      if (r.ngo_id) byNgo[r.ngo_id] = (byNgo[r.ngo_id] ?? 0) + 1;
      if (r.country_code) byCountry[r.country_code] = (byCountry[r.country_code] ?? 0) + 1;
      if (r.page_path) byPage[r.page_path] = (byPage[r.page_path] ?? 0) + 1;
      const ref = r.referrer ? new URL(r.referrer, "https://x").hostname || "direct" : "direct";
      byReferrer[ref] = (byReferrer[ref] ?? 0) + 1;
    }
    const sortDesc = (o: Record<string, number>) => Object.entries(o).sort((a, b) => b[1] - a[1]);
    return { total, uniqueSessions, byNgo: sortDesc(byNgo), byCountry: sortDesc(byCountry), byPage: sortDesc(byPage).slice(0, 8), byReferrer: sortDesc(byReferrer).slice(0, 8) };
  }, [rows]);

  if (!session) {
    return (
      <main className="min-h-screen bg-background p-4">
        <Helmet><title>Admin · Give Analytics</title><meta name="robots" content="noindex" /></Helmet>
        <AuthPanel onAuthed={() => { /* session listener will update */ }} />
      </main>
    );
  }

  if (isAdmin === null) {
    return <main className="min-h-screen grid place-items-center text-muted-foreground">Checking access…</main>;
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen p-6 max-w-md mx-auto text-center space-y-4">
        <Helmet><title>Admin · Access denied</title></Helmet>
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="text-sm text-muted-foreground">Your account ({session.user.email}) is not an admin.</p>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <Helmet><title>Give Analytics · Referral Dashboard</title><meta name="robots" content="noindex" /></Helmet>

      <div className="max-w-6xl mx-auto space-y-4">
        <header className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Give Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Track who clicks Give, which NGO they pick, and where they came from.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </header>

        <Card>
          <CardContent className="pt-4 flex flex-wrap gap-3 items-end">
            <div>
              <Label className="text-xs">Range</Label>
              <Select value={range} onValueChange={(v) => setRange(v as Range)}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">NGO</Label>
              <Select value={ngoFilter} onValueChange={setNgoFilter}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All NGOs</SelectItem>
                  {Object.values(NGOS).map((n) => (
                    <SelectItem key={n.id} value={n.id}>{n.short}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Country</Label>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="all">All countries</SelectItem>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total clicks" value={stats.total} />
          <StatCard label="Unique sessions" value={new Set(rows.map(r => r.id)).size} />
          <StatCard label="National sites" value={rows.filter(r => r.is_national).length} />
          <StatCard label="International" value={rows.filter(r => r.is_national === false).length} />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Breakdown title="By NGO" rows={stats.byNgo.map(([k, v]) => [NGOS[k as keyof typeof NGOS]?.short ?? k, v])} />
          <Breakdown title="By country" rows={stats.byCountry.map(([k, v]) => [`${countryFlag(k)} ${k}`, v])} />
          <Breakdown title="Top pages" rows={stats.byPage} />
          <Breakdown title="Top referrers" rows={stats.byReferrer} />
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent clicks</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <p className="text-sm text-muted-foreground py-4">Loading…</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>NGO</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Referrer</TableHead>
                    <TableHead>Lang</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.slice(0, 100).map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap text-xs">{new Date(r.created_at).toLocaleString()}</TableCell>
                      <TableCell>{NGOS[r.ngo_id as keyof typeof NGOS]?.short ?? r.ngo_id}</TableCell>
                      <TableCell>{countryFlag(r.country_code)} {r.country_code}</TableCell>
                      <TableCell>
                        {r.is_national ? <Badge variant="default">National</Badge> : <Badge variant="secondary">Intl</Badge>}
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate text-xs">{r.page_path}</TableCell>
                      <TableCell className="max-w-[180px] truncate text-xs">{r.referrer || "direct"}</TableCell>
                      <TableCell className="text-xs">{r.language}</TableCell>
                    </TableRow>
                  ))}
                  {rows.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">No clicks yet for this filter.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold tabular-nums">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}

function Breakdown({ title, rows }: { title: string; rows: Array<[string, number]> }) {
  const max = Math.max(1, ...rows.map(([, v]) => v));
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-1.5">
        {rows.length === 0 && <p className="text-xs text-muted-foreground">No data.</p>}
        {rows.slice(0, 10).map(([k, v]) => (
          <div key={k} className="text-xs">
            <div className="flex justify-between"><span className="truncate pr-2">{k}</span><span className="tabular-nums text-muted-foreground">{v}</span></div>
            <div className="h-1.5 bg-muted rounded overflow-hidden"><div className="h-full bg-primary" style={{ width: `${(v / max) * 100}%` }} /></div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
