import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type State = "loading" | "valid" | "already" | "invalid" | "done" | "error";

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`;
    fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } })
      .then((r) => r.json())
      .then((d) => {
        if (d.valid) setState("valid");
        else if (d.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      })
      .catch(() => setState("error"));
  }, [token]);

  const confirm = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
    setBusy(false);
    if (error) { setState("error"); return; }
    if (data?.success || data?.reason === "already_unsubscribed") setState("done");
    else setState("error");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Email preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state === "loading" && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking your link…
            </p>
          )}
          {state === "valid" && (
            <>
              <p className="text-sm">Unsubscribe from First Aid Angel emails? You'll stop receiving listing claim updates and other notifications.</p>
              <Button onClick={confirm} disabled={busy} className="w-full">
                {busy ? "Working…" : "Confirm unsubscribe"}
              </Button>
            </>
          )}
          {state === "already" && (
            <p className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> You're already unsubscribed.</p>
          )}
          {state === "done" && (
            <p className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> You've been unsubscribed. Sorry to see you go.</p>
          )}
          {state === "invalid" && (
            <p className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> This link is invalid or has expired.</p>
          )}
          {state === "error" && (
            <p className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Something went wrong. Please try again later.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
