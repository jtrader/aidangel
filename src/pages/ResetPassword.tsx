import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase recovery flow exchanges the URL hash for a session automatically.
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setReady(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setError(error.message);
    else setDone(true);
  };

  return (
    <main className="min-h-screen bg-background p-4 grid place-items-center">
      <Helmet><title>Reset password</title><meta name="robots" content="noindex" /></Helmet>
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Set a new password</CardTitle></CardHeader>
        <CardContent>
          {done ? (
            <div className="space-y-3">
              <p className="text-sm">Password updated. You can now sign in.</p>
              <Button asChild className="w-full"><a href="/admin/donations">Go to admin</a></Button>
            </div>
          ) : !ready ? (
            <p className="text-sm text-muted-foreground">
              Open this page using the recovery link in your email. If you got here directly, request a new reset link from the sign-in page.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <div>
                <Label htmlFor="pw">New password</Label>
                <Input id="pw" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="pw2">Confirm new password</Label>
                <Input id="pw2" type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Updating…" : "Update password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
