import { useEffect, useState } from "react";
import { z } from "zod";
import { CheckCircle2, ShieldCheck, Send, AlertCircle, Upload, X, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  claimant_name: z.string().trim().min(2).max(120),
  claimant_email: z.string().trim().email().max(255),
  claimant_role: z.string().trim().max(120).optional().or(z.literal("")),
  claimant_phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  evidence_url: z.string().trim().url().max(500).optional().or(z.literal("")),
});

export default function ClaimListingDialog({
  educatorId,
  educatorName,
}: {
  educatorId: string;
  educatorName: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadyPending, setAlreadyPending] = useState<{ claimId: string; createdAt: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    claimant_name: "",
    claimant_email: "",
    claimant_role: "",
    claimant_phone: "",
    message: "",
    evidence_url: "",
  });

  const MAX_FILES = 3;
  const MAX_SIZE = 8 * 1024 * 1024; // 8 MB per file
  const ACCEPTED = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    const valid: File[] = [];
    for (const f of picked) {
      if (!ACCEPTED.includes(f.type)) {
        toast({ title: "Unsupported file", description: `${f.name} must be PDF, JPG, PNG, or WebP.`, variant: "destructive" });
        continue;
      }
      if (f.size > MAX_SIZE) {
        toast({ title: "File too large", description: `${f.name} must be under 8 MB.`, variant: "destructive" });
        continue;
      }
      valid.push(f);
    }
    setFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES));
    e.target.value = "";
  };

  useEffect(() => {
    if (!open) return;
    const checkExisting = async () => {
      setChecking(true);
      try {
        const raw = localStorage.getItem("faa_claims");
        if (!raw) return;
        const claims = JSON.parse(raw) as Array<{ educatorId: string; claimId: string; claimantEmail: string }>;
        const mine = claims.filter((c) => c.educatorId === educatorId);
        if (mine.length === 0) return;
        const { data, error } = await supabase.rpc("get_claim_statuses", {
          claim_ids: mine.map((c) => c.claimId),
        });
        if (error || !data) return;
        const pending = data.find((d: { status: string }) => d.status === "pending");
        if (pending) {
          setAlreadyPending({ claimId: pending.id, createdAt: pending.created_at });
        }
      } finally {
        setChecking(false);
      }
    };
    checkExisting();
  }, [open, educatorId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      toast({ title: "Please check your details", description: first ?? "Invalid input", variant: "destructive" });
      return;
    }
    setLoading(true);
    const claimId = crypto.randomUUID();

    // Upload evidence files first so we can store their paths on the claim row
    const uploadedPaths: string[] = [];
    for (const f of files) {
      const ext = f.name.split(".").pop()?.toLowerCase() || "bin";
      const safe = f.name.replace(/[^a-z0-9._-]/gi, "_").slice(0, 60);
      const path = `${claimId}/${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage
        .from("claim-evidence")
        .upload(path, f, { contentType: f.type, upsert: false });
      if (upErr) {
        setLoading(false);
        toast({ title: "Upload failed", description: `${f.name}: ${upErr.message}`, variant: "destructive" });
        return;
      }
      uploadedPaths.push(path);
    }

    const { error } = await supabase.from("educator_claims").insert({
      id: claimId,
      educator_id: educatorId,
      claimant_name: parsed.data.claimant_name,
      claimant_email: parsed.data.claimant_email,
      claimant_role: parsed.data.claimant_role || null,
      claimant_phone: parsed.data.claimant_phone || null,
      message: parsed.data.message || null,
      evidence_url: parsed.data.evidence_url || null,
      evidence_file_paths: uploadedPaths,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Could not submit claim", description: error.message, variant: "destructive" });
      return;
    }
    // Persist claim so user can check status later
    const existing = JSON.parse(localStorage.getItem("faa_claims") ?? "[]") as Array<{ educatorId: string; claimId: string; claimantEmail: string }>;
    existing.push({ educatorId, claimId, claimantEmail: parsed.data.claimant_email });
    localStorage.setItem("faa_claims", JSON.stringify(existing));
    // Fire-and-forget confirmation email
    supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "claim-received",
        recipientEmail: parsed.data.claimant_email,
        idempotencyKey: `claim-received-${claimId}`,
        templateData: { name: parsed.data.claimant_name, educatorName },
      },
    }).catch(() => { /* non-blocking */ });
    setDone(true);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setDone(false);
          setAlreadyPending(null);
          setForm({ claimant_name: "", claimant_email: "", claimant_role: "", claimant_phone: "", message: "", evidence_url: "" });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ShieldCheck className="h-4 w-4" /> Claim this listing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {checking ? (
          <div className="py-8 text-center">
            <DialogDescription>Checking your claim status…</DialogDescription>
          </div>
        ) : alreadyPending ? (
          <div className="py-6 text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
            <DialogTitle>You already have a pending claim</DialogTitle>
            <DialogDescription>
              You submitted a claim for this listing on{" "}
              {new Date(alreadyPending.createdAt).toLocaleDateString()}. We'll review it and contact you within a few
              business days. You can check its status on this profile page.
            </DialogDescription>
            <Button onClick={() => setOpen(false)} className="mt-4">Close</Button>
          </div>
        ) : done ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
            <DialogTitle>Thanks — we're on it</DialogTitle>
            <DialogDescription>
              We'll review your claim and contact you within a few business days. Once verified, you'll be able to update
              your listing.
            </DialogDescription>
            <Button onClick={() => setOpen(false)} className="mt-4">Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Claim {educatorName}</DialogTitle>
              <DialogDescription>
                Confirm you represent this provider. We'll verify and unlock listing edits, booking links, and a verified
                badge.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cname">Your name *</Label>
                  <Input id="cname" required value={form.claimant_name} onChange={(e) => setForm({ ...form, claimant_name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="crole">Your role</Label>
                  <Input id="crole" placeholder="Owner, manager…" value={form.claimant_role} onChange={(e) => setForm({ ...form, claimant_role: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="cemail">Work email *</Label>
                <Input id="cemail" type="email" required value={form.claimant_email} onChange={(e) => setForm({ ...form, claimant_email: e.target.value })} placeholder="you@provider.com" />
                <p className="text-xs text-muted-foreground mt-1">Use an email on the provider's domain when possible — it speeds up verification.</p>
              </div>
              <div>
                <Label htmlFor="cphone">Phone (optional)</Label>
                <Input id="cphone" value={form.claimant_phone} onChange={(e) => setForm({ ...form, claimant_phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="cevidence">Link supporting your claim</Label>
                <Input id="cevidence" type="url" placeholder="https://your-site.com/team" value={form.evidence_url} onChange={(e) => setForm({ ...form, evidence_url: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="cmsg">Anything else?</Label>
                <Textarea id="cmsg" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What would you like to update on this listing?" />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                <Send className="h-4 w-4 mr-2" /> {loading ? "Submitting…" : "Submit claim"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
