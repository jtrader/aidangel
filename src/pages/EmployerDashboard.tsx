import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmployerLayout from "@/components/employer/EmployerLayout";
import { useOrg } from "@/hooks/useOrg";
import { supabase } from "@/integrations/supabase/client";
import { Users, ListChecks, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Stats {
  members: number;
  active: number;
  assigned: number;
  completed: number;
  overdue: number;
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
  const [stats, setStats] = useState<Stats>({ members: 0, active: 0, assigned: 0, completed: 0, overdue: 0 });

  useEffect(() => {
    if (!activeOrg) return;
    (async () => {
      const [{ count: members }, { count: active }, { count: assigned }, { count: completed }, { count: overdue }] = await Promise.all([
        supabase.from("org_members").select("id", { count: "exact", head: true }).eq("org_id", activeOrg.id),
        supabase.from("org_members").select("id", { count: "exact", head: true }).eq("org_id", activeOrg.id).eq("status", "active"),
        supabase.from("org_course_assignments").select("id", { count: "exact", head: true }).eq("org_id", activeOrg.id),
        supabase.from("org_course_assignments").select("id", { count: "exact", head: true }).eq("org_id", activeOrg.id).eq("status", "completed"),
        supabase.from("org_course_assignments").select("id", { count: "exact", head: true }).eq("org_id", activeOrg.id).eq("status", "overdue"),
      ]);
      setStats({
        members: members ?? 0,
        active: active ?? 0,
        assigned: assigned ?? 0,
        completed: completed ?? 0,
        overdue: overdue ?? 0,
      });
    })();
  }, [activeOrg]);

  return (
    <EmployerLayout title={activeOrg ? `${activeOrg.name} dashboard` : "Dashboard"}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="People" value={stats.members} hint={`${stats.active} active of ${activeOrg?.seat_limit ?? 0} seats`} />
        <StatCard icon={ListChecks} label="Assignments" value={stats.assigned} />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdue} />
      </div>

      <div className="bg-card rounded-2xl shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-lg">Get started</h2>
        <ol className="list-decimal pl-5 text-sm space-y-2 text-foreground">
          <li>
            <Link to="/employer/people" className="text-primary hover:underline">Add your first people</Link> manually, or
            <Link to="/employer/people/import" className="text-primary hover:underline ml-1">upload a CSV</Link>.
          </li>
          <li>
            <Link to="/employer/assignments" className="text-primary hover:underline">Assign courses</Link> with due dates.
          </li>
          <li>
            Track progress and download compliance reports from <Link to="/employer/reports" className="text-primary hover:underline">Reports</Link>.
          </li>
        </ol>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button asChild><Link to="/employer/people">Manage people</Link></Button>
          <Button asChild variant="outline"><Link to="/employer/people/import">Bulk import</Link></Button>
        </div>
      </div>
    </EmployerLayout>
  );
}
