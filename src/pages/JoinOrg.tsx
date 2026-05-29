import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOrg } from "@/hooks/useOrg";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Building2 } from "lucide-react";
import NetworkFooter from "@/components/NetworkFooter";

interface OrgInfo {
  id: string;
  name: string;
  slug: string;
}

export default function JoinOrg() {
  const { token } = useParams<{ token: string }>();
  const { user, loading: authLoading } = useAuth();
  const { refresh, setActive } = useOrg();
  const navigate = useNavigate();
  const [org, setOrg] = useState<OrgInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      // try invitation first (via security-definer RPC), then join_code
      const { data: invRows } = await supabase.rpc("get_invitation_by_token", { _token: token });
      const inv = Array.isArray(invRows) ? invRows[0] : null;

      let orgId: string | null = null;
      if (inv) {
        if (inv.accepted_at) { setError("This invitation has already been used."); return; }
        if (new Date(inv.expires_at) < new Date()) { setError("This invitation has expired."); return; }
        orgId = inv.org_id;
      } else {
        const { data: o } = await supabase
          .from("organisations")
          .select("id, name, slug")
          .eq("join_code", token)
          .maybeSingle();
        if (!o) { setError("Invalid or expired link."); return; }
        setOrg(o as OrgInfo);
        return;
      }

      const { data: o } = await supabase
        .from("organisations")
        .select("id, name, slug")
        .eq("id", orgId!)
        .maybeSingle();
      if (o) setOrg(o as OrgInfo);
      else setError("Organisation not found.");
    })();
  }, [token]);

  const accept = async () => {
    if (!user) { navigate(`/auth?redirect=/join/${token}`); return; }
    if (!org || !token) return;
    setBusy(true);

    // Insert/upsert membership as learner-active
    const { error: memErr } = await supabase.from("org_members").upsert(
      {
        org_id: org.id,
        user_id: user.id,
        email: user.email!,
        full_name: ((user.user_metadata as Record<string, unknown> | null)?.full_name as string) ?? user.email,
        role: "learner",
        status: "active",
        joined_at: new Date().toISOString(),
      },
      { onConflict: "org_id,email" },
    );
    if (memErr) {
      toast({ title: "Couldn't join", description: memErr.message, variant: "destructive" });
      setBusy(false);
      return;
    }
    // Mark invitation accepted (if it was one)
    await supabase.rpc("accept_invitation_by_token", { _token: token });
    await refresh();
    setActive(org.id);
    toast({ title: "Welcome", description: `You've joined ${org.name}.` });
    navigate("/employer/dashboard");
  };

  if (authLoading) return <div className="p-12 text-center text-muted-foreground">Loading…</div>;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-sm p-8 text-center space-y-4">
          <Building2 className="h-10 w-10 mx-auto text-primary" />
          {error ? (
            <>
              <h1 className="text-xl font-bold">Can't join</h1>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={() => navigate("/")}>Go home</Button>
            </>
          ) : !org ? (
            <p className="text-muted-foreground">Checking link…</p>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Join {org.name}</h1>
              <p className="text-sm text-muted-foreground">
                {user ? `You'll be added as a learner.` : `Sign in or create an account to join.`}
              </p>
              <Button className="w-full" onClick={accept} disabled={busy}>
                {busy ? "Joining…" : user ? "Accept & join" : "Sign in to join"}
              </Button>
            </>
          )}
        </div>
      </div>
      <NetworkFooter />
    </div>
  );
}
