import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ShieldPlus } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  name: z.string().trim().min(1, "Enter your name").max(100).optional(),
});

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/my-learning";
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(redirect, { replace: true });
    });
  }, [navigate, redirect]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password, name: mode === "signup" ? name : undefined });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirect}`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate(redirect, { replace: true });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}${redirect}` });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate(redirect, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <SeoHead title={`${mode === "signin" ? "Sign in" : "Create account"} — First Aid Angel Learning`} description="Sign in to track your first aid course progress and earn certificates." />
      <Card className="w-full max-w-md p-8 rounded-2xl">
        <Link to="/" className="flex items-center gap-2 mb-6 text-primary">
          <ShieldPlus className="h-6 w-6" />
          <span className="font-display font-bold text-lg">First Aid Angel Learning</span>
        </Link>
        <h1 className="text-2xl font-display font-bold mb-2">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-muted-foreground mb-6 text-sm">
          {mode === "signin" ? "Sign in to continue your courses." : "Track progress and earn certificates."}
        </p>

        <Button type="button" variant="outline" onClick={google} disabled={busy} className="w-full mb-4">
          Continue with Google
        </Button>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <span className="relative bg-card px-2 text-xs text-muted-foreground mx-auto block w-fit">or</span>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Full name (for your certificate)</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} maxLength={72} required />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-sm text-primary hover:underline mt-4 w-full text-center"
        >
          {mode === "signin" ? "Don't have an account? Create one" : "Already have an account? Sign in"}
        </button>
      </Card>
    </div>
  );
}
