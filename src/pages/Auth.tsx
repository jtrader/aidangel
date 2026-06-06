import { useState, useEffect } from "react";
import aidAngelLogo from "@/assets/aidangel-logo.png";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ShieldPlus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SeoHead } from "@/components/SeoHead";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  name: z.string().trim().min(1, "Enter your name").max(100).optional(),
});

const RETURNING_FLAG = "faa_returning_member";

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">(() => {
    if (typeof window === "undefined") return "signup";
    try {
      return localStorage.getItem(RETURNING_FLAG) === "1" ? "signin" : "signup";
    } catch {
      return "signup";
    }
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [privacyAccepted, setPrivacyAccepted] = useState(true);
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
        if (!privacyAccepted) {
          toast.error("Please accept the Privacy Policy to create an account.");
          setBusy(false);
          return;
        }
        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirect}`,
            data: { full_name: name, marketing_opt_in: marketingOptIn, privacy_accepted: true, privacy_accepted_at: new Date().toISOString() },
          },
        });
        if (error) throw error;
        // Fire-and-forget: create matching Shopify customer for seamless checkout.
        if (signUpData.session) {
          supabase.functions.invoke("shopify-customer-sync", {
            body: { full_name: name, marketing_opt_in: marketingOptIn },
          }).catch((e) => console.warn("shopify sync deferred", e));
        }
        toast.success("Check your email to confirm your account.");
        try { localStorage.setItem(RETURNING_FLAG, "1"); } catch {}
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        try { localStorage.setItem(RETURNING_FLAG, "1"); } catch {}
        navigate(redirect, { replace: true });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const oauth = async (provider: "google" | "apple") => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}${redirect}` });
    if (result.error) {
      toast.error(result.error.message ?? `${provider === "google" ? "Google" : "Apple"} sign-in failed`);
      setBusy(false);
      return;
    }
    try { localStorage.setItem(RETURNING_FLAG, "1"); } catch {}
    if (result.redirected) return;
    navigate(redirect, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <SeoHead lang="en" basePath="/auth" title={`${mode === "signin" ? "Sign in" : "Create account"} — First Aid Angel Learning`} description="Sign in to track your first aid course progress and earn certificates." />
      <Card className="w-full max-w-md p-8 rounded-2xl">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <img src={aidAngelLogo} alt="First Aid Angel" width={28} height={28} className="h-7 w-7" />
          <span className="font-display font-bold text-lg">
            <span className="text-foreground">First Aid Angel </span>
            <span className="text-primary">Learning</span>
          </span>
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
          {mode === "signup" && (
            <div className="space-y-3">
              <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
                <Checkbox
                  checked={privacyAccepted}
                  onCheckedChange={(v) => setPrivacyAccepted(v === true)}
                  className="mt-0.5"
                />
                <span>
                  I have read and agree to the{" "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                    Privacy Policy
                  </a>
                  . Required to create an account.
                </span>
              </label>
              <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
                <Checkbox
                  checked={marketingOptIn}
                  onCheckedChange={(v) => setMarketingOptIn(v === true)}
                  className="mt-0.5"
                />
                <span>
                  Send me first aid tips, course updates, and discounts on official certifications. You can unsubscribe anytime.
                </span>
              </label>
            </div>
          )}
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
