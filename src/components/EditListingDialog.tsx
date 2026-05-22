import { useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditListingDialogProps {
  educatorId: string;
  claimId: string;
  initial: {
    blurb: string | null;
    website: string | null;
    booking_url: string | null;
    logo_url: string | null;
  };
  onSaved?: (next: EditListingDialogProps["initial"]) => void;
}

export default function EditListingDialog({ educatorId, claimId, initial, onSaved }: EditListingDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initial);

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("update-educator-listing", {
      body: { claimId, educatorId, updates: form },
    });
    setSaving(false);
    if (error || (data as { error?: string })?.error) {
      const msg = (data as { error?: string })?.error || error?.message || "Could not save changes.";
      toast({ title: "Edit blocked", description: msg, variant: "destructive" });
      return;
    }
    toast({ title: "Listing updated", description: "Your changes are live." });
    onSaved?.(form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" /> Edit listing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit your listing</DialogTitle>
          <DialogDescription>
            Available because your claim is approved. Changes go live immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="blurb">About</Label>
            <Textarea id="blurb" rows={4} value={form.blurb ?? ""} onChange={(e) => update("blurb", e.target.value)} maxLength={2000} />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" type="url" placeholder="https://" value={form.website ?? ""} onChange={(e) => update("website", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="booking_url">Booking URL</Label>
            <Input id="booking_url" type="url" placeholder="https://" value={form.booking_url ?? ""} onChange={(e) => update("booking_url", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input id="logo_url" type="url" placeholder="https://" value={form.logo_url ?? ""} onChange={(e) => update("logo_url", e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
