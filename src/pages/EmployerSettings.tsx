import { useRef, useState } from "react";
import EmployerLayout from "@/components/employer/EmployerLayout";
import { useOrg } from "@/hooks/useOrg";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Copy, Upload, X } from "lucide-react";

export default function EmployerSettings() {
  const { activeOrg, refresh, can } = useOrg();
  const [name, setName] = useState(activeOrg?.name ?? "");
  const [industry, setIndustry] = useState(activeOrg?.industry ?? "");
  const [billing, setBilling] = useState(activeOrg?.billing_email ?? "");
  const [logo, setLogo] = useState(activeOrg?.logo_url ?? "");
  const [color, setColor] = useState(activeOrg?.primary_color ?? "");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!activeOrg) return <EmployerLayout title="Settings"><p>No organisation selected.</p></EmployerLayout>;

  const handleUpload = async (file: File) => {
    if (!activeOrg) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Logo too large", description: "Max 2MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${activeOrg.id}/logo-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("org-logos").upload(path, file, {
      upsert: true, contentType: file.type,
    });
    if (upErr) {
      setUploading(false);
      toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      return;
    }
    const { data } = supabase.storage.from("org-logos").getPublicUrl(path);
    setLogo(data.publicUrl);
    await supabase.from("organisations").update({ logo_url: data.publicUrl }).eq("id", activeOrg.id);
    await refresh();
    setUploading(false);
    toast({ title: "Logo uploaded" });
  };

  const removeLogo = async () => {
    setLogo("");
    await supabase.from("organisations").update({ logo_url: null }).eq("id", activeOrg.id);
    await refresh();
  };

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

        <div>
          <Label>Logo</Label>
          <div className="flex items-center gap-3 mt-1">
            {logo ? (
              <div className="relative">
                <img src={logo} alt="Organisation logo" className="h-16 w-16 object-contain rounded-lg border bg-white p-1" />
                {can("admin") && (
                  <button type="button" onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-card border rounded-full p-0.5 shadow-sm hover:bg-muted">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ) : (
              <div className="h-16 w-16 rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground text-xs">No logo</div>
            )}
            {can("admin") && (
              <>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  <Upload className="h-4 w-4 mr-2" /> {uploading ? "Uploading…" : "Upload"}
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">PNG or SVG recommended, max 2MB. Shown on certificates issued to your team.</p>
        </div>

        <div>
          <Label>Brand color (hex)</Label>
          <div className="flex gap-2 items-center">
            <Input value={color} onChange={(e) => setColor(e.target.value)} disabled={!can("admin")} placeholder="#DC2626" maxLength={20} className="flex-1" />
            {color && /^#[0-9a-f]{3,8}$/i.test(color) && (
              <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: color }} />
            )}
          </div>
        </div>

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

