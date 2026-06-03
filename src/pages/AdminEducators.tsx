import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, X, Search, Loader2 } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { COUNTRIES } from "@/lib/donations";
import AdminClaims from "@/components/AdminClaims";

type Pending = {
  id: string;
  name: string;
  type: string;
  blurb: string | null;
  website: string | null;
  booking_url: string | null;
  hq_country_code: string | null;
  is_online: boolean;
  country_code: string | null;
  region: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  languages: string[];
  source: string;
  source_url: string | null;
  submitter_name: string | null;
  submitter_email: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

function AuthPanel() {
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
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin/educators` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth failed");
    } finally { setLoading(false); }
  };

  return (
    <Card className="max-w-md mx-auto mt-12">
      <CardHeader><CardTitle>Admin sign in</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-3">
          <div><Label htmlFor="e">Email</Label><Input id="e" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><Label htmlFor="p">Password</Label><Input id="p" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}</Button>
          <button type="button" className="text-xs text-muted-foreground hover:underline w-full text-center" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdminEducators() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Pending[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  // Crawler controls
  const [crawlCountry, setCrawlCountry] = useState("AU");
  const [crawlLang, setCrawlLang] = useState("en");
  const [crawling, setCrawling] = useState(false);

  // Notes per row
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).then(({ data }) => {
      setIsAdmin(!!data?.some((r) => r.role === "admin"));
    });
  }, [session]);

  const load = async () => {
    if (!isAdmin) return;
    setLoading(true);
    let q = supabase.from("pending_educators").select("*").order("created_at", { ascending: false }).limit(200);
    if (statusFilter !== "all") q = q.eq("status", statusFilter);
    const { data, error } = await q;
    if (!error && data) setRows(data as Pending[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, [isAdmin, statusFilter]);

  const runCrawl = async () => {
    setCrawling(true);
    try {
      const country = COUNTRIES.find((c) => c.code === crawlCountry);
      const { data, error } = await supabase.functions.invoke("crawl-educators", {
        body: {
          country_code: crawlCountry,
          country_name: country?.name,
          language_code: crawlLang,
        },
      });
      if (error) throw error;
      toast({ title: "Crawl complete", description: `Discovered ${data?.discovered ?? 0} new providers.` });
      load();
    } catch (e) {
      toast({ title: "Crawl failed", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    } finally { setCrawling(false); }
  };

  const approve = async (id: string) => {
    const { error } = await supabase.functions.invoke("approve-educator", { body: { pending_id: id } });
    if (error) { toast({ title: "Approve failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Approved" });
    load();
  };

  const reject = async (id: string) => {
    const { error } = await supabase.from("pending_educators").update({
      status: "rejected", review_notes: notes[id] ?? null, reviewed_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) { toast({ title: "Reject failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Rejected" });
    load();
  };

  if (!session) {
    return (
      <main className="min-h-screen bg-background p-4">
        <Helmet><title>Admin · Educators</title><meta name="robots" content="noindex" /></Helmet>
        <AuthPanel />
      </main>
    );
  }
  if (isAdmin === null) return <main className="min-h-screen grid place-items-center text-muted-foreground">Checking access…</main>;
  if (!isAdmin) return (
    <main className="min-h-screen p-6 max-w-md mx-auto text-center space-y-4">
      <Helmet><title>Admin · Access denied</title></Helmet>
      <h1 className="text-xl font-semibold">Access denied</h1>
      <p className="text-sm text-muted-foreground">{session.user.email} is not an admin.</p>
      <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
    </main>
  );

  return (
    <main className="min-h-screen bg-background">
      <Helmet><title>Admin · Educator moderation</title><meta name="robots" content="noindex" /></Helmet>
      <header className="border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Admin
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{session.user.email}</span>
          <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <h1 className="font-heading text-2xl font-bold">Educator moderation</h1>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Search className="h-4 w-4" /> Discover providers</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
            <div>
              <Label className="text-xs">Country</Label>
              <Select value={crawlCountry} onValueChange={setCrawlCountry}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Language code</Label>
              <Input value={crawlLang} onChange={(e) => setCrawlLang(e.target.value)} placeholder="en" />
            </div>
            <div className="flex items-end">
              <Button onClick={runCrawl} disabled={crawling} className="w-full">
                {crawling ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Crawling…</> : "Run crawler"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Label className="text-xs">Status</Label>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">{loading ? "Loading…" : `${rows.length} rows`}</span>
        </div>

        <div className="space-y-3">
          {rows.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-semibold">{r.name}</h3>
                      <Badge variant="outline">{r.type}</Badge>
                      {r.is_online && <Badge variant="secondary">Online</Badge>}
                      <Badge variant="outline" className="text-[10px]">{r.source}</Badge>
                      <Badge variant={r.status === "pending" ? "default" : r.status === "approved" ? "secondary" : "destructive"}>{r.status}</Badge>
                    </div>
                    {r.blurb && <p className="text-sm text-muted-foreground mt-1">{r.blurb}</p>}
                    <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
                      {r.country_code && <div>📍 {[r.address, r.city, r.region, r.country_code].filter(Boolean).join(", ")}</div>}
                      {r.phone && <div>📞 {r.phone}</div>}
                      {r.website && <div>🌐 <a href={r.website} target="_blank" rel="noreferrer" className="underline">{r.website}</a></div>}
                      {r.booking_url && r.booking_url !== r.website && <div>🎟 <a href={r.booking_url} target="_blank" rel="noreferrer" className="underline">{r.booking_url}</a></div>}
                      {r.source_url && <div>🔗 <a href={r.source_url} target="_blank" rel="noreferrer" className="underline">source</a></div>}
                      {r.languages?.length > 0 && <div>🗣 {r.languages.join(", ")}</div>}
                      {r.submitter_email && <div>✉️ {r.submitter_name ?? "Anon"} &lt;{r.submitter_email}&gt;</div>}
                    </div>
                  </div>
                  {r.status === "pending" && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button size="sm" onClick={() => approve(r.id)}><Check className="h-4 w-4 mr-1" /> Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => reject(r.id)}><X className="h-4 w-4 mr-1" /> Reject</Button>
                    </div>
                  )}
                </div>
                {r.status === "pending" && (
                  <Textarea
                    placeholder="Review notes (optional, saved on reject)"
                    value={notes[r.id] ?? ""}
                    onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })}
                    className="text-xs"
                    rows={2}
                  />
                )}
              </CardContent>
            </Card>
          ))}
          {!loading && rows.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No {statusFilter === "all" ? "" : statusFilter} submissions.</p>
          )}
        </div>

        <AdminClaims />
      </div>
    </main>
  );
}
