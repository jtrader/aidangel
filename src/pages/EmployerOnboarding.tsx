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
import NetworkFooter from "@/components/NetworkFooter";
import { useUiStrings } from "@/hooks/useUiStrings";

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
  const tr = useUiStrings({
    title: "Create your organisation",
    blurb: "You'll be the owner. You can invite teammates next.",
    nameLabel: "Organisation name",
    namePlaceholder: "Acme Pty Ltd",
    industryLabel: "Industry (optional)",
    industryPlaceholder: "Construction, Childcare, Retail…",
    countryLabel: "Country code",
    creating: "Creating…",
    cta: "Create organisation",
    couldNot: "Could not create organisation",
    created: "Organisation created",
    ready: "is ready.",
  });
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
      toast({ title: tr.couldNot, description: error?.message, variant: "destructive" });
      setBusy(false);
      return;
    }

    await refresh();
    setActive(org.id);
    toast({ title: tr.created, description: `${org.name} ${tr.ready}` });
    navigate("/employer/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <div className="flex-1 flex items-center justify-center p-6">
        <form onSubmit={handleCreate} className="max-w-md w-full bg-card rounded-2xl shadow-sm p-8 space-y-5">
          <div className="text-center space-y-2">
            <Building2 className="h-10 w-10 mx-auto text-primary" />
            <h1 className="text-2xl font-bold">{tr.title}</h1>
            <p className="text-sm text-muted-foreground">{tr.blurb}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">{tr.nameLabel}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={tr.namePlaceholder} required maxLength={120} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">{tr.industryLabel}</Label>
            <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder={tr.industryPlaceholder} maxLength={80} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">{tr.countryLabel}</Label>
            <Input id="country" value={country} onChange={(e) => setCountry(e.target.value.toUpperCase().slice(0, 2))} maxLength={2} />
          </div>

          <Button type="submit" disabled={busy || !name.trim()} className="w-full">
            {busy ? tr.creating : tr.cta}
          </Button>
        </form>
      </div>
      <NetworkFooter />
    </div>
  );
}
