import { useEffect, useState } from "react";
import { Check, X, ExternalLink, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

type Claim = {
  id: string;
  educator_id: string;
  claimant_name: string;
  claimant_email: string;
  claimant_role: string | null;
  claimant_phone: string | null;
  message: string | null;
  evidence_url: string | null;
  evidence_file_paths: string[] | null;
  status: "pending" | "approved" | "rejected";
  review_notes: string | null;
  created_at: string;
  educator?: { name: string; slug: string; website: string | null; is_claimed: boolean } | null;
};

export default function AdminClaims() {
  const [rows, setRows] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("educator_claims")
      .select("*, educator:educators(name, slug, website, is_claimed)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (status !== "all") q = q.eq("status", status);
    const { data, error } = await q;
    if (!error && data) setRows(data as unknown as Claim[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, [status]);

  const approve = async (c: Claim) => {
    const now = new Date().toISOString();
    const reviewNotes = notes[c.id] ?? null;
    const { error: cErr } = await supabase
      .from("educator_claims")
      .update({ status: "approved", review_notes: reviewNotes, reviewed_at: now })
      .eq("id", c.id);
    if (cErr) { toast({ title: "Approve failed", description: cErr.message, variant: "destructive" }); return; }
    const { error: eErr } = await supabase
      .from("educators")
      .update({ is_claimed: true, claimed_at: now })
      .eq("id", c.educator_id);
    if (eErr) { toast({ title: "Educator update failed", description: eErr.message, variant: "destructive" }); return; }
    supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "claim-approved",
        recipientEmail: c.claimant_email,
        idempotencyKey: `claim-approved-${c.id}`,
        templateData: {
          name: c.claimant_name,
          educatorName: c.educator?.name,
          profileUrl: c.educator ? `${window.location.origin}/learn/provider/${c.educator.slug}` : undefined,
          notes: reviewNotes ?? undefined,
        },
      },
    }).catch(() => {});
    toast({ title: "Claim approved" });
    load();
  };

  const reject = async (c: Claim) => {
    const reviewNotes = notes[c.id] ?? null;
    const { error } = await supabase
      .from("educator_claims")
      .update({ status: "rejected", review_notes: reviewNotes, reviewed_at: new Date().toISOString() })
      .eq("id", c.id);
    if (error) { toast({ title: "Reject failed", description: error.message, variant: "destructive" }); return; }
    supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "claim-rejected",
        recipientEmail: c.claimant_email,
        idempotencyKey: `claim-rejected-${c.id}`,
        templateData: {
          name: c.claimant_name,
          educatorName: c.educator?.name,
          notes: reviewNotes ?? undefined,
        },
      },
    }).catch(() => {});
    toast({ title: "Claim rejected" });
    load();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> Listing claims
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">{loading ? "Loading…" : `${rows.length} claims`}</span>
        </div>
        {rows.map((c) => (
          <div key={c.id} className="border border-border rounded-lg p-3 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={c.educator ? `/learn/provider/${c.educator.slug}` : "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold hover:text-primary inline-flex items-center gap-1"
                  >
                    {c.educator?.name ?? c.educator_id}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <Badge variant={c.status === "pending" ? "default" : c.status === "approved" ? "secondary" : "destructive"}>
                    {c.status}
                  </Badge>
                  {c.educator?.is_claimed && <Badge variant="secondary">Already claimed</Badge>}
                </div>
                <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <div>👤 {c.claimant_name}{c.claimant_role ? ` — ${c.claimant_role}` : ""}</div>
                  <div>✉️ {c.claimant_email}</div>
                  {c.claimant_phone && <div>📞 {c.claimant_phone}</div>}
                  {c.educator?.website && <div>🌐 listing site: <a href={c.educator.website} target="_blank" rel="noreferrer" className="underline">{c.educator.website}</a></div>}
                  {c.evidence_url && <div>🔗 evidence: <a href={c.evidence_url} target="_blank" rel="noreferrer" className="underline">{c.evidence_url}</a></div>}
                  {c.evidence_file_paths && c.evidence_file_paths.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      📎 files:
                      {c.evidence_file_paths.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={async () => {
                            const { data, error } = await supabase.storage
                              .from("claim-evidence")
                              .createSignedUrl(p, 300);
                            if (error || !data) {
                              toast({ title: "Could not open file", description: error?.message, variant: "destructive" });
                              return;
                            }
                            window.open(data.signedUrl, "_blank", "noopener,noreferrer");
                          }}
                          className="underline hover:text-foreground"
                        >
                          {p.split("/").pop()}
                        </button>
                      ))}
                    </div>
                  )}
                  {c.message && <div className="pt-1 italic">"{c.message}"</div>}
                </div>
              </div>
              {c.status === "pending" && (
                <div className="flex flex-col gap-2 shrink-0">
                  <Button size="sm" onClick={() => approve(c)}><Check className="h-4 w-4 mr-1" /> Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => reject(c)}><X className="h-4 w-4 mr-1" /> Reject</Button>
                </div>
              )}
            </div>
            {c.status === "pending" && (
              <Textarea
                placeholder="Review notes (optional)"
                value={notes[c.id] ?? ""}
                onChange={(e) => setNotes({ ...notes, [c.id]: e.target.value })}
                className="text-xs"
                rows={2}
              />
            )}
            {c.review_notes && c.status !== "pending" && (
              <div className="text-xs text-muted-foreground border-t border-border pt-2">Note: {c.review_notes}</div>
            )}
          </div>
        ))}
        {!loading && rows.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No {status === "all" ? "" : status} claims.</p>
        )}
      </CardContent>
    </Card>
  );
}
