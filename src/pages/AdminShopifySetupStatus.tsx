import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RequireAuth from "@/components/RequireAuth";
import { SeoHead } from "@/components/SeoHead";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import {
  ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, XCircle,
  Loader2, RefreshCw, ArrowLeft, ShieldCheck,
} from "lucide-react";

type Status = "PASS" | "WARNING" | "FAIL";

interface Report {
  ok: true;
  checkedAt: string;
  passCount: number;
  total: number;
  overall: Status;
  sections: {
    metafields: { status: Status; foundFaa: string[]; missingFaa: string[]; legacyCustom: string[]; expectedCount: number };
    collections: { status: Status; foundCollections: string[]; missingCollections: string[]; expectedCount: number };
    certificates: {
      status: Status;
      rows: Array<{ sku: string; expectedPrice: string | null; found: boolean; title: string | null; price: string | null }>;
      duplicates: Array<{ title: string }>;
    };
    routes: {
      status: Status; total: number; expected: number;
      byCountry: Record<string, number>; byStatus: Record<string, number>;
      missingFields: Array<{ title: string; missing: string[] }>; hasNextPage: boolean;
    };
    disclosure: { status: Status; handle: string | null; fields: Record<string, string> };
  };
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "PASS") return <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white gap-1"><CheckCircle2 className="h-3 w-3" /> PASS</Badge>;
  if (status === "WARNING") return <Badge className="bg-amber-500 hover:bg-amber-500 text-white gap-1"><AlertTriangle className="h-3 w-3" /> WARNING</Badge>;
  return <Badge className="bg-destructive hover:bg-destructive text-destructive-foreground gap-1"><XCircle className="h-3 w-3" /> FAIL</Badge>;
}

function SectionCard({
  title, status, children,
}: { title: string; status: Status; children: React.ReactNode }) {
  const [open, setOpen] = useState(status !== "PASS");
  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-semibold text-base">{title}</span>
        </div>
        <StatusBadge status={status} />
      </button>
      {open && <div className="border-t px-5 py-4 text-sm">{children}</div>}
    </Card>
  );
}

function CheckRow({
  ok, label, detail, warn,
}: { ok: boolean; label: string; detail?: string; warn?: boolean }) {
  const Icon = warn ? AlertTriangle : ok ? CheckCircle2 : XCircle;
  const color = warn ? "text-amber-600" : ok ? "text-emerald-600" : "text-destructive";
  return (
    <div className="flex items-start gap-2 py-1.5">
      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${color}`} />
      <div className="flex-1">
        <div className="font-mono text-xs">{label}</div>
        {detail && <div className="text-muted-foreground text-xs mt-0.5">{detail}</div>}
      </div>
    </div>
  );
}

export default function AdminShopifySetupStatus() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("shopify-setup-status", { body: {} });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setReport(data as Report);
    } catch (e) {
      setError(String((e as Error).message ?? e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { run(); }, [run]);

  const bar = report
    ? report.overall === "PASS" ? "bg-emerald-600 text-white"
    : report.overall === "WARNING" ? "bg-amber-500 text-white"
    : "bg-destructive text-destructive-foreground"
    : "bg-muted text-foreground";

  return (
    <RequireAuth adminOnly>
      <div className="min-h-screen bg-background">
        <SeoHead lang="en" basePath="/admin/shopify-setup-status" title="Shopify Setup Status — Admin" description="Live verification of Shopify metafields, collections, products, route cards and disclosure metaobject." />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Admin
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <h1 className="text-2xl md:text-3xl font-display font-bold">Shopify Setup Status</h1>
          </div>

          {/* Summary bar */}
          <div className={`rounded-lg px-5 py-3 mb-6 flex flex-wrap items-center justify-between gap-3 ${bar}`}>
            <div className="text-sm md:text-base">
              <span className="font-semibold">
                {report ? `${report.passCount} of ${report.total} sections complete` : loading ? "Checking…" : "Not run"}
              </span>
              {report && (
                <span className="opacity-90 ml-3 text-xs md:text-sm">
                  Last checked: {new Date(report.checkedAt).toLocaleString()}
                </span>
              )}
            </div>
            <Button onClick={run} disabled={loading} variant="secondary" size="sm" className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Re-run checks
            </Button>
          </div>

          {error && (
            <Card className="p-4 mb-6 border-destructive/40 bg-destructive/5 text-destructive text-sm">
              {error}
            </Card>
          )}

          {report && (
            <div className="space-y-4">
              {/* 1. Metafields */}
              <SectionCard title={`1. Metafield definitions (faa.*) — ${report.sections.metafields.foundFaa.length}/${report.sections.metafields.expectedCount}`} status={report.sections.metafields.status}>
                {report.sections.metafields.missingFaa.length === 0 ? (
                  <CheckRow ok label={`All ${report.sections.metafields.expectedCount} faa.* definitions present`} />
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      {report.sections.metafields.foundFaa.map((k) => <CheckRow key={k} ok label={`faa.${k}`} />)}
                      {report.sections.metafields.missingFaa.map((k) => <CheckRow key={k} ok={false} label={`faa.${k}`} detail="Missing" />)}
                    </div>
                  </>
                )}
                {report.sections.metafields.legacyCustom.length > 0 && (
                  <div className="mt-4 p-3 rounded border bg-muted/50">
                    <div className="text-xs font-semibold mb-2">Legacy definitions in <code>custom</code> namespace ({report.sections.metafields.legacyCustom.length})</div>
                    <div className="text-xs text-muted-foreground mb-2">Can be safely deleted from Shopify Admin → Settings → Custom data once confirmed unused.</div>
                    <div className="flex flex-wrap gap-1">
                      {report.sections.metafields.legacyCustom.map((k) => (
                        <code key={k} className="text-xs bg-background px-1.5 py-0.5 rounded border">custom.{k}</code>
                      ))}
                    </div>
                  </div>
                )}
              </SectionCard>

              {/* 2. Collections */}
              <SectionCard title={`2. Collections — ${report.sections.collections.foundCollections.length}/${report.sections.collections.expectedCount}`} status={report.sections.collections.status}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {report.sections.collections.foundCollections.map((h) => <CheckRow key={h} ok label={h} />)}
                  {report.sections.collections.missingCollections.map((h) => <CheckRow key={h} ok={false} label={h} detail="Missing" />)}
                </div>
              </SectionCard>

              {/* 3. Certificate products */}
              <SectionCard title="3. Certificate products" status={report.sections.certificates.status}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-3">SKU</th>
                        <th className="py-2 pr-3">Title</th>
                        <th className="py-2 pr-3">Price</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.sections.certificates.rows.map((r) => (
                        <tr key={r.sku} className="border-b last:border-0">
                          <td className="py-2 pr-3 font-mono">{r.sku}</td>
                          <td className="py-2 pr-3">{r.title ?? <span className="text-muted-foreground">—</span>}</td>
                          <td className="py-2 pr-3">{r.price ? `$${r.price}` : r.expectedPrice ? <span className="text-muted-foreground">expected ${r.expectedPrice}</span> : "—"}</td>
                          <td className="py-2">
                            {r.found
                              ? <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> FOUND</span>
                              : <span className="inline-flex items-center gap-1 text-destructive"><XCircle className="h-3.5 w-3.5" /> MISSING</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {report.sections.certificates.duplicates.length > 0 && (
                  <div className="mt-4 space-y-1">
                    {report.sections.certificates.duplicates.map((d, i) => (
                      <div key={i} className="flex items-start gap-2 text-amber-700 text-xs p-2 rounded bg-amber-50 border border-amber-200">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>Duplicate detected: <strong>"{d.title}"</strong> has no SKU — delete this from Shopify Admin.</span>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* 4. Route cards */}
              <SectionCard title={`4. Route cards — ${report.sections.routes.total}/${report.sections.routes.expected}`} status={report.sections.routes.status}>
                <div className="mb-4">
                  <Progress value={Math.min(100, (report.sections.routes.total / report.sections.routes.expected) * 100)} />
                  <div className="text-xs text-muted-foreground mt-1">{report.sections.routes.total} of {report.sections.routes.expected} expected</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold mb-2">By availability_status</div>
                    {Object.entries(report.sections.routes.byStatus).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs py-0.5"><span className="font-mono">{k}</span><span>{v}</span></div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-2">By country</div>
                    {Object.entries(report.sections.routes.byCountry).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs py-0.5"><span className="font-mono">{k}</span><span>{v}</span></div>
                    ))}
                  </div>
                </div>
                {report.sections.routes.missingFields.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-semibold mb-2 text-destructive">Cards missing required metafields</div>
                    {report.sections.routes.missingFields.map((m, i) => (
                      <CheckRow key={i} ok={false} label={m.title} detail={`Missing: ${m.missing.join(", ")}`} />
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* 5. Disclosure */}
              <SectionCard title="5. Disclosure metaobject" status={report.sections.disclosure.status}>
                {report.sections.disclosure.status === "PASS" ? (
                  <div className="space-y-2">
                    <div className="text-xs"><span className="font-semibold">handle:</span> <code>{report.sections.disclosure.handle}</code></div>
                    <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-1 text-xs">
                      {Object.entries(report.sections.disclosure.fields).map(([k, v]) => (
                        <div key={k} className="contents">
                          <div className="font-mono text-muted-foreground">{k}</div>
                          <div className="whitespace-pre-wrap break-words">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm">
                    <p className="text-destructive mb-2">No <code>affiliate-route-disclosure</code> metaobject found.</p>
                    <p className="text-muted-foreground text-xs">Run <code className="bg-muted px-1.5 py-0.5 rounded">npx tsx scripts/shopify-setup-disclosure.ts</code> to create it.</p>
                  </div>
                )}
              </SectionCard>
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
