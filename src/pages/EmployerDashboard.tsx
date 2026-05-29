import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmployerLayout from "@/components/employer/EmployerLayout";
import { useOrg } from "@/hooks/useOrg";
import { supabase } from "@/integrations/supabase/client";
import { Users, ListChecks, AlertTriangle, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStrings } from "@/hooks/useUiStrings";

interface Stats {
  members: number;
  active: number;
  assigned: number;
  completed: number;
  overdue: number;
  programsAssigned: number;
  programsCompleted: number;
}

function StatCard({ icon: Icon, label, value, hint }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number | string; hint?: string }) {
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

export default function EmployerDashboard() {
  const { activeOrg } = useOrg();
  const tr = useUiStrings({
    dashboard: "Dashboard",
    dashboardSuffix: "dashboard",
    people: "People",
    activeOfSeats: "{a} active of {s} seats",
    topicAssignments: "Topic assignments",
    completed: "completed",
    coursesAssigned: "Courses assigned",
    overdueTopics: "Overdue topics",
    getStarted: "Get started",
    addPeople: "Add your first people",
    or: "manually, or",
    uploadCsv: "upload a CSV",
    assignCourses: "Assign courses",
    withDue: "with due dates.",
    trackProgress: "Track progress and download compliance reports from",
    reports: "Reports",
    managePeople: "Manage people",
    bulkImport: "Bulk import",
  });
  const [stats, setStats] = useState<Stats>({ members: 0, active: 0, assigned: 0, completed: 0, overdue: 0, programsAssigned: 0, programsCompleted: 0 });

  useEffect(() => {
    if (!activeOrg) return;
    (async () => {
      const [{ count: members }, { count: active }, { count: assigned }, { count: completed }, { count: overdue }, { count: pAssigned }, { count: pCompleted }] = await Promise.all([
        supabase.from("org_members").select("id", { count: "exact", head: true }).eq("org_id", activeOrg.id),
        supabase.from("org_members").select("id", { count: "exact", head: true }).eq("org_id", activeOrg.id).eq("status", "active"),
        supabase.from("org_course_assignments").select("id", { count: "exact", head: true }).eq("org_id", activeOrg.id),
        supabase.from("org_course_assignments").select("id", { count: "exact", head: true }).eq("org_id", activeOrg.id).eq("status", "completed"),
        supabase.from("org_course_assignments").select("id", { count: "exact", head: true }).eq("org_id", activeOrg.id).eq("status", "overdue"),
        supabase.from("org_program_assignments").select("id", { count: "exact", head: true }).eq("org_id", activeOrg.id),
        supabase.from("org_program_assignments").select("id", { count: "exact", head: true }).eq("org_id", activeOrg.id).eq("status", "completed"),
      ]);
      setStats({
        members: members ?? 0,
        active: active ?? 0,
        assigned: assigned ?? 0,
        completed: completed ?? 0,
        overdue: overdue ?? 0,
        programsAssigned: pAssigned ?? 0,
        programsCompleted: pCompleted ?? 0,
      });
    })();
  }, [activeOrg]);

  return (
    <EmployerLayout title={activeOrg ? `${activeOrg.name} ${tr.dashboardSuffix}` : tr.dashboard}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label={tr.people} value={stats.members} hint={tr.activeOfSeats.replace("{a}", String(stats.active)).replace("{s}", String(activeOrg?.seat_limit ?? 0))} />
        <StatCard icon={ListChecks} label={tr.topicAssignments} value={stats.assigned} hint={`${stats.completed} ${tr.completed}`} />
        <StatCard icon={GraduationCap} label={tr.coursesAssigned} value={stats.programsAssigned} hint={`${stats.programsCompleted} ${tr.completed}`} />
        <StatCard icon={AlertTriangle} label={tr.overdueTopics} value={stats.overdue} />
      </div>

      <div className="bg-card rounded-2xl shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-lg">{tr.getStarted}</h2>
        <ol className="list-decimal pl-5 text-sm space-y-2 text-foreground">
          <li>
            <Link to="/employer/people" className="text-primary hover:underline">{tr.addPeople}</Link> {tr.or}
            <Link to="/employer/people/import" className="text-primary hover:underline ml-1">{tr.uploadCsv}</Link>.
          </li>
          <li>
            <Link to="/employer/assignments" className="text-primary hover:underline">{tr.assignCourses}</Link> {tr.withDue}
          </li>
          <li>
            {tr.trackProgress} <Link to="/employer/reports" className="text-primary hover:underline">{tr.reports}</Link>.
          </li>
        </ol>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button asChild><Link to="/employer/people">{tr.managePeople}</Link></Button>
          <Button asChild variant="outline"><Link to="/employer/people/import">{tr.bulkImport}</Link></Button>
        </div>
      </div>
    </EmployerLayout>
  );
}
