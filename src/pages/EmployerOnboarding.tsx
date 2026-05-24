import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOrg } from "@/hooks/useOrg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Building2 } from "lucide-react";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

const randomCode = (len = 8) => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

export default function EmployerOnboarding() {
  const { user, loading } = useAuth();
  const { refresh, setActive } = useOrg();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("AU");
  const [busy, setBusy] = useState(false);

  if (!loading && !user) {
    navigate("/auth?redirect=/employer/onboarding");
    return null;
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;
    setBusy(true);
    const slug = `${slugify(name)}-${randomCode(4).toLowerCase()}`;

    const { data: org, error } = await supabase
      .from("organisations")
      .insert({
        name: name.trim(),
        slug,
        industry: industry.trim() || null,
        country_code: country,
        billing_email: user.email,
        seat_limit: 5,
        status: "trial",
        join_code: randomCode(),
        created_by: user.id,
      })
      .select()
      .single();

    if (error || !org) {
      toast({ title: "Could not create organisation", description: error?.message, variant: "destructive" });
      setBusy(false);
      return;
    }

    // Owner membership is created automatically by the trg_add_creator_as_owner trigger.

    await refresh();
    setActive(org.id);
    toast({ title: "Organisation created", description: `${org.name} is ready.` });
    navigate("/employer/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <form onSubmit={handleCreate} className="max-w-md w-full bg-card rounded-2xl shadow-sm p-8 space-y-5">
        <div className="text-center space-y-2">
          <Building2 className="h-10 w-10 mx-auto text-primary" />
          <h1 className="text-2xl font-bold">Create your organisation</h1>
          <p className="text-sm text-muted-foreground">
            You'll be the owner. You can invite teammates next.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Organisation name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Pty Ltd" required maxLength={120} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry (optional)</Label>
          <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Construction, Childcare, Retail…" maxLength={80} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country code</Label>
          <Input id="country" value={country} onChange={(e) => setCountry(e.target.value.toUpperCase().slice(0, 2))} maxLength={2} />
        </div>

        <Button type="submit" disabled={busy || !name.trim()} className="w-full">
          {busy ? "Creating…" : "Create organisation"}
        </Button>
      </form>
    </div>
  );
}
