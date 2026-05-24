import { useCallback, useEffect, useRef, useState } from "react";
import EmployerLayout from "@/components/employer/EmployerLayout";
import { useOrg } from "@/hooks/useOrg";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet, Download, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface ImportJob {
  id: string;
  file_path: string;
  status: "queued" | "processing" | "completed" | "failed";
  total_rows: number;
  success_rows: number;
  error_rows: number;
  error_report: { row: number; email?: string; error: string }[];
  created_at: string;
}

const TEMPLATE = "email,full_name,role,department,employee_ref,assign_course_slugs\nalice@example.com,Alice Nguyen,learner,Operations,EMP-001,cpr-basics\nbob@example.com,Bob Smith,manager,Safety,EMP-002,\"cpr-basics,bleeding-control\"\n";

export default function EmployerImport() {
  const { activeOrg, can } = useOrg();
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (!activeOrg) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("org_import_jobs")
      .select("id, file_path, status, total_rows, success_rows, error_rows, error_report, created_at")
      .eq("org_id", activeOrg.id)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) toast({ title: "Couldn't load history", description: error.message, variant: "destructive" });
    setJobs((data ?? []) as unknown as ImportJob[]);
    setLoading(false);
  }, [activeOrg]);

  useEffect(() => { load(); }, [load]);

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadErrorReport = (job: ImportJob) => {
    const header = "row,email,error\n";
    const rows = (job.error_report ?? []).map((r) => `${r.row},${r.email ?? ""},"${(r.error ?? "").replace(/"/g, '""')}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `import-errors-${job.id.slice(0, 8)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = async (file: File) => {
    if (!activeOrg) return;
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast({ title: "File too large", description: "Maximum 5MB.", variant: "destructive" });
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["csv", "xlsx", "xls"].includes(ext)) {
      toast({ title: "Unsupported file", description: "Use CSV or XLSX.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      // 1. Create job row first to get a job id
      const { data: job, error: jobErr } = await supabase
        .from("org_import_jobs")
        .insert({ org_id: activeOrg.id, file_path: "pending", status: "queued" })
        .select("id")
        .single();
      if (jobErr || !job) throw jobErr ?? new Error("Couldn't create job");

      const path = `${activeOrg.id}/${job.id}.${ext}`;
      const { error: upErr } = await supabase.storage.from("org-imports").upload(path, file, { upsert: true });
      if (upErr) throw upErr;

      await supabase.from("org_import_jobs").update({ file_path: path }).eq("id", job.id);

      const { data: result, error: fnErr } = await supabase.functions.invoke("org-import-process", {
        body: { job_id: job.id, site_url: window.location.origin },
      });
      if (fnErr) throw fnErr;

      toast({
        title: "Import finished",
        description: `${result?.inserted ?? 0} added · ${result?.invitesSent ?? 0} invites sent · ${result?.assignmentsCreated ?? 0} courses assigned · ${result?.errors ?? 0} errors.`,
      });
      load();
    } catch (e) {
      toast({ title: "Import failed", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <EmployerLayout title="Bulk import">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5 text-primary" /> Upload your roster</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload a CSV or XLSX with columns: <code className="text-xs bg-muted px-1 py-0.5 rounded">email</code>,{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">full_name</code>, optional{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">role</code> (owner/admin/manager/learner),{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">department</code>,{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">employee_ref</code>. Duplicate emails are skipped.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" /> Download CSV template
            </Button>
            {can("manager") && (
              <>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  {uploading ? "Processing…" : "Upload file"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent imports</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No imports yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-3">When</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Rows</th>
                    <th className="py-2 pr-3">Added</th>
                    <th className="py-2 pr-3">Errors</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id} className="border-t">
                      <td className="py-2 pr-3">{formatDistanceToNow(new Date(j.created_at), { addSuffix: true })}</td>
                      <td className="py-2 pr-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                          j.status === "completed" ? "bg-green-100 text-green-800" :
                          j.status === "failed" ? "bg-red-100 text-red-800" :
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {j.status === "completed" ? <CheckCircle2 className="h-3 w-3" /> :
                           j.status === "failed" ? <AlertTriangle className="h-3 w-3" /> :
                           <Loader2 className="h-3 w-3 animate-spin" />}
                          {j.status}
                        </span>
                      </td>
                      <td className="py-2 pr-3">{j.total_rows}</td>
                      <td className="py-2 pr-3 text-green-700">{j.success_rows}</td>
                      <td className="py-2 pr-3 text-red-700">{j.error_rows}</td>
                      <td className="py-2 text-right">
                        {j.error_rows > 0 && (
                          <Button variant="ghost" size="sm" onClick={() => downloadErrorReport(j)}>
                            <Download className="h-3 w-3 mr-1" /> Errors
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </EmployerLayout>
  );
}
