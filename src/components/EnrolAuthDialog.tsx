import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  courseName?: string;
  variant?: "enrol" | "purchase-personal" | "purchase-employer";
}

export default function EnrolAuthDialog({ open, onOpenChange, onSuccess, courseName, variant = "enrol" }: Props) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [privacyAccepted, setPrivacyAccepted] = useState(true);
  const [busy, setBusy] = useState(false);

  const variantCopy = {
    "enrol": {
      eyebrow: "Free — no credit card",
      signupHeading: "Join to start learning",
      signinHeading: "Welcome back",
      signupSubtext: courseName
        ? `Sign up free to start "${courseName}" and track your progress.`
        : "Track your progress and earn a CPD certificate when you pass.",
      signinSubtext: "Sign in to continue your courses.",
    },
    "purchase-personal": {
      eyebrow: "Secure checkout",
      signupHeading: "Create your account to purchase",
      signinHeading: "Sign in to complete your purchase",
      signupSubtext: courseName
        ? `Create a free account to buy the ${courseName} credit pack — your credits will appear instantly after checkout.`
        : "Create a free account to buy your certificate credits — they'll appear in your account instantly after checkout.",
      signinSubtext: "Sign in to complete your certificate credit purchase.",
    },
    "purchase-employer": {
      eyebrow: "Team plan — secure checkout",
      signupHeading: "Create your account to purchase",
      signinHeading: "Sign in to complete your purchase",
      signupSubtext: courseName
        ? `Create an account to buy the ${courseName} plan — your team dashboard will be ready immediately after checkout.`
        : "Create an account to purchase your employer plan — your team dashboard and certificate credits will be ready immediately after checkout.",
      signinSubtext: "Sign in to complete your employer plan purchase and access your team dashboard.",
    },
  }[variant ?? "enrol"];

  useEffect(() => {
    if (!open) {
      // reset on close
      setMode("signup");
      setEmail("");
      setPassword("");
      setName("");
      setMarketingOptIn(true);
      setPrivacyAccepted(true);
      setBusy(false);
    }
  }, [open]);

  const google = async () => {
    setBusy(true);
    const redirect = window.location.pathname;
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}${redirect}` });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      setBusy(false);
      return;
    }
    // if redirected the browser will leave; otherwise assume success
    if (result.redirected) return;
    onSuccess();
    onOpenChange(false);
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
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
            emailRedirectTo: window.location.origin,
            data: {
              full_name: name,
              marketing_opt_in: marketingOptIn,
              privacy_accepted: true,
              privacy_accepted_at: new Date().toISOString(),
            },
          },
        });
        if (error) throw error;
        // Fire-and-forget Shopify sync for immediate checkout experience
        if (signUpData?.session) {
          supabase.functions.invoke("shopify-customer-sync", {
            body: { full_name: name, marketing_opt_in: marketingOptIn, privacy_accepted: true },
          }).catch((e) => console.warn("shopify sync deferred", e));
        }
        if (signUpData?.session) {
          onSuccess();
          onOpenChange(false);
        } else {
          toast.success("Check your email to confirm your account.");
          onOpenChange(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
        onOpenChange(false);
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{variantCopy.eyebrow}</p>
          <DialogTitle>{mode === "signup" ? variantCopy.signupHeading : variantCopy.signinHeading}</DialogTitle>
          <p className="text-sm text-muted-foreground mb-4">{mode === "signup" ? variantCopy.signupSubtext : variantCopy.signinSubtext}</p>
        </DialogHeader>

        <div className="space-y-3">
          <Button type="button" variant="outline" onClick={google} disabled={busy} className="w-full">
            Continue with Google
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <span className="relative bg-card px-2 text-xs text-muted-foreground mx-auto block w-fit">or</span>
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <Label htmlFor="enrol_name">Full name (for your certificate)</Label>
                <Input id="enrol_name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
              </div>
            )}

            <div>
              <Label htmlFor="enrol_email">Email</Label>
              <Input id="enrol_email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required />
            </div>

            <div>
              <Label htmlFor="enrol_password">Password</Label>
              <Input id="enrol_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} maxLength={72} required />
            </div>

            {mode === "signup" && (
              <div className="space-y-3 pt-1">
                <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
                  <Checkbox
                    checked={privacyAccepted}
                    onCheckedChange={(v) => setPrivacyAccepted(v === true)}
                    className="mt-0.5"
                    required
                  />
                  <span>
                    I have read and agree to the{" "}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80" onClick={(e) => e.stopPropagation()}>
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
                    Send me first aid tips, course updates, and certificate discounts. Unsubscribe anytime.
                  </span>
                </label>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signup" ? "Create account" : "Sign in"}
              </Button>
              <Button variant="ghost" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>
                {mode === "signup" ? "Have an account? Sign in" : "Create an account"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
