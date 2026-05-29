import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import NetworkFooter from "@/components/NetworkFooter";
import { useUiStrings } from "@/hooks/useUiStrings";

export default function JoinCodeEntry() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const tr = useUiStrings({
    title: "Join your organisation",
    blurb: "Enter the join code your employer shared with you.",
    label: "Join code",
    placeholder: "e.g. acme-warehouse",
    cta: "Continue",
    foot: "Don't have a code? Ask your workplace admin or check your invitation email.",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    navigate(`/join/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <div className="flex-1 flex items-center justify-center p-6">
        <form onSubmit={submit} className="max-w-md w-full bg-card rounded-2xl shadow-sm p-8 space-y-4">
          <Building2 className="h-10 w-10 mx-auto text-primary" />
          <h1 className="font-display text-2xl font-bold text-center">{tr.title}</h1>
          <p className="text-sm text-muted-foreground text-center">{tr.blurb}</p>
          <div className="space-y-2">
            <Label htmlFor="code">{tr.label}</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={tr.placeholder}
              autoFocus
              maxLength={120}
            />
          </div>
          <Button type="submit" className="w-full" disabled={!code.trim()}>
            {tr.cta}
          </Button>
          <p className="text-xs text-muted-foreground text-center">{tr.foot}</p>
        </form>
      </div>
      <NetworkFooter />
    </div>
  );
}
