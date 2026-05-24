import { useCallback, useEffect, useMemo, useState } from "react";
import EmployerLayout from "@/components/employer/EmployerLayout";
import { useOrg } from "@/hooks/useOrg";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, AlertTriangle, CheckCircle2, ListChecks, Users, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Member {
  id: string;
  full_name: string | null;
  email: string;
  department: string | null;
  status: string;
}
interface Course { id: string; title: string }
interface Assignment {
  id: string;
  member_id: string;
  course_id: string;
  status: "assigned" | "in_progress" | "completed" | "overdue";
  due_at: string | null;
  completed_at: string | null;
  created_at: string;
}
interface AuditEntry {
  id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  actor_id: string | null;
}

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function downloadCsv(filename: string, rows: (string | number | null)[][]) {
  const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function EmployerReports() {
  const { activeOrg } = useOrg();
  const [members, setMembers] = useState<Member[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    if (!activeOrg) return;
    setLoading(true);
    const [m, c, a, l] = await Promise.all([
      supabase.from("org_members").select("id, full_name, email, department, status").eq("org_id", activeOrg.id).neq("status", "removed"),
      supabase.from("courses").select("id, title").eq("is_published", true),
      supabase.from("org_course_assignments").select("id, member_id, course_id, status, due_at, completed_at, created_at").eq("org_id", activeOrg.id),
      supabase.from("org_audit_log").select("id, action, target_type, target_id, metadata, created_at, actor_id").eq("org_id", activeOrg.id).order("created_at", { ascending: false }).limit(100),
    ]);
    if (m.error || c.error || a.error) {
      toast({ title: "Couldn't load reports", description: m.error?.message ?? c.error?.message ?? a.error?.message, variant: "destructive" });
    }
    setMembers((m.data ?? []) as Member[]);
    setCourses((c.data ?? []) as Course[]);
    setAssignments((a.data ?? []) as Assignment[]);
    setAudit((l.data ?? []) as AuditEntry[]);
    setLoading(false);
  }, [activeOrg]);

  useEffect(() => { load(); }, [load]);

  const memberById = useMemo(() => new Map(members.map((x) => [x.id, x])), [members]);
  const courseById = useMemo(() => new Map(courses.map((x) => [x.id, x])), [courses]);

  // KPIs
  const total = assignments.length;
  const completed = assignments.filter((a) => a.status === "completed").length;
  const overdue = assignments.filter((a) => a.status === "overdue").length;
  const inProgress = assignments.filter((a) => a.status === "in_progress").length;
  const complianceRate = total ? Math.round((completed / total) * 100) : 0;

  // Per-person rollup
  type Row = { member: Member; total: number; completed: number; overdue: number; pct: number };
  const rows: Row[] = useMemo(() => {
    const map = new Map<string, Row>();
    for (const m of members) map.set(m.id, { member: m, total: 0, completed: 0, overdue: 0, pct: 0 });
    for (const a of assignments) {
      const r = map.get(a.member_id);
      if (!r) continue;
      r.total += 1;
      if (a.status === "completed") r.completed += 1;
      if (a.status === "overdue") r.overdue += 1;
    }
    for (const r of map.values()) r.pct = r.total ? Math.round((r.completed / r.total) * 100) : 0;
    return Array.from(map.values()).sort((a, b) => a.pct - b.pct);
  }, [members, assignments]);

  const filteredRows = rows.filter((r) => {
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return (r.member.full_name ?? "").toLowerCase().includes(q)
      || r.member.email.toLowerCase().includes(q)
      || (r.member.department ?? "").toLowerCase().includes(q);
  });

  const exportAssignmentsCsv = () => {
    const header = ["full_name", "email", "department", "course", "status", "due_at", "completed_at", "assigned_at"];
    const data = assignments.map((a) => {
      const m = memberById.get(a.member_id);
      const c = courseById.get(a.course_id);
      return [
        m?.full_name ?? "",
        m?.email ?? "",
        m?.department ?? "",
        c?.title ?? "",
        a.status,
        a.due_at ?? "",
        a.completed_at ?? "",
        a.created_at,
      ];
    });
    downloadCsv(`${activeOrg?.slug ?? "org"}-assignments-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...data]);
  };

  const exportComplianceCsv = () => {
    const header = ["full_name", "email", "department", "total_assignments", "completed", "overdue", "compliance_pct"];
    const data = rows.map((r) => [
      r.member.full_name ?? "",
      r.member.email,
      r.member.department ?? "",
      r.total,
      r.completed,
      r.overdue,
      r.pct,
    ]);
    downloadCsv(`${activeOrg?.slug ?? "org"}-compliance-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...data]);
  };

  return (
    <EmployerLayout title="Reports & compliance">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi icon={Users} label="People" value={members.length} />
        <Kpi icon={ListChecks} label="Assignments" value={total} />
        <Kpi icon={CheckCircle2} label="Compliance" value={`${complianceRate}%`} hint={`${completed} of ${total}`} />
        <Kpi icon={AlertTriangle} label="Overdue" value={overdue} hint={`${inProgress} in progress`} />
      </div>

      <div className="bg-card rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b">
          <Input placeholder="Search people…" value={filter} onChange={(e) => setFilter(e.target.value)} className="max-w-sm" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportComplianceCsv}><Download className="h-4 w-4 mr-2" /> Compliance CSV</Button>
            <Button variant="outline" size="sm" onClick={exportAssignmentsCsv}><Download className="h-4 w-4 mr-2" /> Assignments CSV</Button>
          </div>
        </div>
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : filteredRows.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No data yet. Assign courses to start tracking compliance.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3">Person</th>
                  <th className="px-4 py-3">Dept</th>
                  <th className="px-4 py-3">Compliance</th>
                  <th className="px-4 py-3 text-right">Completed</th>
                  <th className="px-4 py-3 text-right">Overdue</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r) => (
                  <tr key={r.member.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.member.full_name ?? r.member.email}</div>
                      <div className="text-xs text-muted-foreground">{r.member.email}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.member.department ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${r.pct >= 80 ? "bg-green-500" : r.pct >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${r.pct}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums w-10">{r.pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">{r.completed}</td>
                    <td className="px-4 py-3 text-right">
                      {r.overdue > 0 ? <span className="text-red-600 font-medium">{r.overdue}</span> : 0}
                    </td>
                    <td className="px-4 py-3 text-right">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-card rounded-2xl shadow-sm">
        <div className="flex items-center justify-between gap-3 p-4 border-b">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold">Recent activity</h2>
          </div>
          <span className="text-xs text-muted-foreground">Latest 100</span>
        </div>
        {audit.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No activity yet.</div>
        ) : (
          <ul className="divide-y">
            {audit.map((e) => (
              <li key={e.id} className="px-4 py-3 text-sm flex justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium">{describeAction(e)}</div>
                  {e.metadata && Object.keys(e.metadata).length > 0 && (
                    <div className="text-xs text-muted-foreground truncate">{JSON.stringify(e.metadata)}</div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">{format(new Date(e.created_at), "d MMM HH:mm")}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </EmployerLayout>
  );
}

function Kpi({ icon: Icon, label, value, hint }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number | string; hint?: string }) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-3xl font-bold mt-2">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

function describeAction(e: AuditEntry): string {
  const meta = e.metadata ?? {};
  switch (e.action) {
    case "assignments.created": return `Assigned ${meta.count ?? "?"} ${meta.course_title ? `× ${meta.course_title}` : "course(s)"}`;
    case "assignment.deleted": return `Removed an assignment`;
    case "import.completed": return `Imported ${meta.success_rows ?? "?"} people (${meta.error_rows ?? 0} errors)`;
    case "member.added": return `Added ${meta.email ?? "a person"}`;
    case "member.removed": return `Removed ${meta.email ?? "a person"}`;
    default: return e.action;
  }
}
