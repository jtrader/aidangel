import { useState } from "react";
import EmployerLayout from "@/components/employer/EmployerLayout";
import { useOrg } from "@/hooks/useOrg";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

export default function EmployerSettings() {
  const { activeOrg, refresh, can } = useOrg();
  const [name, setName] = useState(activeOrg?.name ?? "");
  const [industry, setIndustry] = useState(activeOrg?.industry ?? "");
  const [billing, setBilling] = useState(activeOrg?.billing_email ?? "");
  const [logo, setLogo] = useState(activeOrg?.logo_url ?? "");
  const [color, setColor] = useState(activeOrg?.primary_color ?? "");
  const [busy, setBusy] = useState(false);

  if (!activeOrg) return <EmployerLayout title="Settings"><p>No organisation selected.</p></EmployerLayout>;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase
      .from("organisations")
      .update({
        name: name.trim() || activeOrg.name,
        industry: industry.trim() || null,
        billing_email: billing.trim() || null,
        logo_url: logo.trim() || null,
        primary_color: color.trim() || null,
      })
      .eq("id", activeOrg.id);
    setBusy(false);
    if (error) {
      toast({ title: "Could not save", description: error.message, variant: "destructive" });
      return;
    }
    await refresh();
    toast({ title: "Saved" });
  };

  const joinUrl = activeOrg.join_code ? `${window.location.origin}/join/${activeOrg.join_code}` : "";

  return (
    <EmployerLayout title="Settings">
      <form onSubmit={save} className="bg-card rounded-2xl shadow-sm p-6 space-y-4 max-w-2xl">
        <div><Label>Organisation name</Label><Input value={name} onChange={(e) => setName(e.target.value)} disabled={!can("admin")} maxLength={120} /></div>
        <div><Label>Industry</Label><Input value={industry} onChange={(e) => setIndustry(e.target.value)} disabled={!can("admin")} maxLength={80} /></div>
        <div><Label>Billing email</Label><Input type="email" value={billing} onChange={(e) => setBilling(e.target.value)} disabled={!can("admin")} maxLength={255} /></div>
        <div><Label>Logo URL</Label><Input value={logo} onChange={(e) => setLogo(e.target.value)} disabled={!can("admin")} maxLength={500} /></div>
        <div><Label>Brand color (hex)</Label><Input value={color} onChange={(e) => setColor(e.target.value)} disabled={!can("admin")} placeholder="#DC2626" maxLength={20} /></div>

        <div className="text-sm text-muted-foreground">
          Seats: <strong className="text-foreground">{activeOrg.seat_limit}</strong> · Status: <strong className="text-foreground">{activeOrg.status}</strong>
        </div>

        {can("admin") && <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>}
      </form>

      {joinUrl && (
        <div className="bg-card rounded-2xl shadow-sm p-6 space-y-3 max-w-2xl">
          <h2 className="font-bold">Self-serve join link</h2>
          <p className="text-sm text-muted-foreground">
            Share this with new employees so they can join your organisation directly.
          </p>
          <div className="flex gap-2">
            <Input readOnly value={joinUrl} />
            <Button type="button" variant="outline" onClick={() => { navigator.clipboard.writeText(joinUrl); toast({ title: "Copied" }); }}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </EmployerLayout>
  );
}
