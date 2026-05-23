import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { topics, getBody } from "@/lib/kb";

/** Split a markdown body into ~1200-char chunks, breaking at paragraph boundaries. */
function chunkMarkdown(body: string, target = 1200, overlap = 150): string[] {
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let buf = "";
  for (const p of paragraphs) {
    if (buf.length + p.length + 2 > target && buf.length > 0) {
      chunks.push(buf.trim());
      const tail = buf.slice(Math.max(0, buf.length - overlap));
      buf = tail + "\n\n" + p;
    } else {
      buf = buf ? `${buf}\n\n${p}` : p;
    }
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks.length ? chunks : [body.slice(0, target)];
}

function AuthPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
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
          <Button type="submit" disabled={loading} className="w-full">{loading ? "…" : "Sign in"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdminKb() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number; current: string } | null>(null);
  const [counts, setCounts] = useState<{ chunks: number } | null>(null);

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

  const loadCount = async () => {
    const { count } = await supabase.from("kb_chunks").select("*", { count: "exact", head: true });
    setCounts({ chunks: count ?? 0 });
  };
  useEffect(() => { if (isAdmin) loadCount(); }, [isAdmin]);

  const rebuild = async () => {
    setRunning(true);
    try {
      // Build chunk payload from English KB
      type Chunk = { slug: string; lang: string; title: string; section: string; content: string; chunk_index: number };
      const payload: Chunk[] = [];
      for (const t of topics) {
        const body = getBody(t.slug, "en");
        if (!body) continue;
        const parts = chunkMarkdown(body);
        parts.forEach((content, i) => {
          payload.push({
            slug: t.slug, lang: "en", title: t.title, section: t.section,
            content, chunk_index: i,
          });
        });
      }
      const total = payload.length;
      const BATCH = 20;
      for (let i = 0; i < payload.length; i += BATCH) {
        const batch = payload.slice(i, i + BATCH);
        setProgress({ done: i, total, current: batch[0]?.slug ?? "" });
        const { error } = await supabase.functions.invoke("embed-kb", { body: { chunks: batch } });
        if (error) throw error;
      }
      setProgress({ done: total, total, current: "done" });
      toast({ title: "KB embedded", description: `${total} chunks upserted.` });
      loadCount();
    } catch (e) {
      toast({ title: "Embedding failed", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    } finally { setRunning(false); }
  };

  if (!session) {
    return (
      <main className="min-h-screen bg-background p-4">
        <Helmet><title>Admin · KB embeddings</title><meta name="robots" content="noindex" /></Helmet>
        <AuthPanel />
      </main>
    );
  }
  if (isAdmin === null) return <main className="min-h-screen grid place-items-center text-muted-foreground">Checking access…</main>;
  if (!isAdmin) return (
    <main className="min-h-screen p-6 max-w-md mx-auto text-center space-y-4">
      <h1 className="text-xl font-semibold">Access denied</h1>
      <p className="text-sm text-muted-foreground">{session.user.email} is not an admin.</p>
      <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
    </main>
  );

  return (
    <main className="min-h-screen bg-background p-4 max-w-3xl mx-auto">
      <Helmet><title>Admin · KB embeddings</title><meta name="robots" content="noindex" /></Helmet>
      <Link to="/admin/educators" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to admin
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Knowledge base embeddings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Embeds every English KB topic into the <code>kb_chunks</code> table so the chatbot
            can ground answers in the canonical AFA5 content. Safe to re-run — chunks are
            upserted on (slug, lang, chunk_index).
          </p>
          <div className="text-sm">
            <strong>Topics:</strong> {topics.length} · <strong>Stored chunks:</strong>{" "}
            {counts ? counts.chunks : "…"}
          </div>
          <Button onClick={rebuild} disabled={running}>
            {running ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Embedding…</> : "Rebuild KB embeddings"}
          </Button>
          {progress && (
            <p className="text-xs text-muted-foreground">
              {progress.done} / {progress.total} ({progress.current})
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
