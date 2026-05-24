import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";

export default function JoinCodeEntry() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    navigate(`/join/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <form onSubmit={submit} className="max-w-md w-full bg-card rounded-2xl shadow-sm p-8 space-y-4">
        <Building2 className="h-10 w-10 mx-auto text-primary" />
        <h1 className="font-display text-2xl font-bold text-center">Join your organisation</h1>
        <p className="text-sm text-muted-foreground text-center">
          Enter the join code your employer shared with you.
        </p>
        <div className="space-y-2">
          <Label htmlFor="code">Join code</Label>
          <Input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. acme-warehouse"
            autoFocus
            maxLength={120}
          />
        </div>
        <Button type="submit" className="w-full" disabled={!code.trim()}>
          Continue
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Don't have a code? Ask your workplace admin or check your invitation email.
        </p>
      </form>
    </div>
  );
}
