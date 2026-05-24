import { useCallback, useEffect, useMemo, useState } from "react";
import EmployerLayout from "@/components/employer/EmployerLayout";
import { useOrg } from "@/hooks/useOrg";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Member {
  id: string;
  full_name: string | null;
  email: string;
  department: string | null;
  status: string;
}
interface Course {
  id: string;
  title: string;
  slug: string;
}
interface Assignment {
  id: string;
  member_id: string;
  course_id: string;
  status: "assigned" | "in_progress" | "completed" | "overdue";
  due_at: string | null;
  created_at: string;
  completed_at: string | null;
}

const STATUS_STYLES: Record<Assignment["status"], string> = {
  assigned: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
};

export default function EmployerAssignments() {
  const { activeOrg, can } = useOrg();
  const [members, setMembers] = useState<Member[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // dialog state
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [dueAt, setDueAt] = useState<string>("");
  const [memberSearch, setMemberSearch] = useState("");

  const load = useCallback(async () => {
    if (!activeOrg) return;
    setLoading(true);
    const [m, c, a] = await Promise.all([
      supabase.from("org_members")
        .select("id, full_name, email, department, status")
        .eq("org_id", activeOrg.id).neq("status", "removed")
        .order("full_name", { ascending: true }),
      supabase.from("courses")
        .select("id, title, slug").eq("is_published", true).order("sort_order"),
      supabase.from("org_course_assignments")
        .select("id, member_id, course_id, status, due_at, created_at, completed_at")
        .eq("org_id", activeOrg.id).order("created_at", { ascending: false }),
    ]);
    if (m.error) toast({ title: "Couldn't load people", description: m.error.message, variant: "destructive" });
    if (c.error) toast({ title: "Couldn't load courses", description: c.error.message, variant: "destructive" });
    if (a.error) toast({ title: "Couldn't load assignments", description: a.error.message, variant: "destructive" });
    setMembers((m.data ?? []) as Member[]);
    setCourses((c.data ?? []) as Course[]);
    setAssignments((a.data ?? []) as Assignment[]);
    setLoading(false);
  }, [activeOrg]);

  useEffect(() => { load(); }, [load]);

  const memberById = useMemo(() => new Map(members.map((m) => [m.id, m])), [members]);
  const courseById = useMemo(() => new Map(courses.map((c) => [c.id, c])), [courses]);

  const toggleMember = (id: string) => {
    setSelectedMembers((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleAssign = async () => {
    if (!activeOrg || !selectedCourse || selectedMembers.size === 0) {
      toast({ title: "Pick at least one person and a course", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { data: userRes } = await supabase.auth.getUser();
    const rows = Array.from(selectedMembers).map((member_id) => ({
      org_id: activeOrg.id,
      member_id,
      course_id: selectedCourse,
      due_at: dueAt ? new Date(dueAt).toISOString() : null,
      assigned_by: userRes.user?.id ?? null,
      status: "assigned" as const,
    }));
    const { error } = await supabase.from("org_course_assignments").insert(rows);
    setBusy(false);
    if (error) {
      toast({ title: "Couldn't assign", description: error.message, variant: "destructive" });
      return;
    }
    const course = courses.find((c) => c.id === selectedCourse);
    await supabase.from("org_audit_log").insert({
      org_id: activeOrg.id,
      actor_id: userRes.user?.id ?? null,
      action: "assignments.created",
      target_type: "course",
      target_id: selectedCourse,
      metadata: { count: rows.length, course_title: course?.title, due_at: dueAt || null },
    });
    toast({ title: "Assigned", description: `${rows.length} assignment${rows.length === 1 ? "" : "s"} created.` });
    setSelectedMembers(new Set());
    setSelectedCourse("");
    setDueAt("");
    setOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this assignment?")) return;
    const { error } = await supabase.from("org_course_assignments").delete().eq("id", id);
    if (error) {
      toast({ title: "Couldn't remove", description: error.message, variant: "destructive" });
      return;
    }
    if (activeOrg) {
      const { data: u } = await supabase.auth.getUser();
      await supabase.from("org_audit_log").insert({
        org_id: activeOrg.id, actor_id: u.user?.id ?? null,
        action: "assignment.deleted", target_type: "assignment", target_id: id, metadata: {},
      });
    }
    load();
  };

  const filteredAssignments = assignments.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    const m = memberById.get(a.member_id);
    const c = courseById.get(a.course_id);
    return (
      (m?.full_name ?? "").toLowerCase().includes(q) ||
      (m?.email ?? "").toLowerCase().includes(q) ||
      (c?.title ?? "").toLowerCase().includes(q)
    );
  });

  const filteredMembers = members.filter((m) => {
    if (!memberSearch.trim()) return true;
    const q = memberSearch.toLowerCase();
    return (m.full_name ?? "").toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || (m.department ?? "").toLowerCase().includes(q);
  });

  return (
    <EmployerLayout title="Assignments">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 flex-1">
          <Input
            placeholder="Search by person or course…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {can("manager") && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> New assignment</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Assign a course</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Course</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger><SelectValue placeholder="Pick a course…" /></SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Due date (optional)</Label>
                  <Input type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>People ({selectedMembers.size} selected)</Label>
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
                      onClick={() =>
                        selectedMembers.size === filteredMembers.length
                          ? setSelectedMembers(new Set())
                          : setSelectedMembers(new Set(filteredMembers.map((m) => m.id)))
                      }
                    >
                      {selectedMembers.size === filteredMembers.length ? "Clear all" : "Select all"}
                    </button>
                  </div>
                  <Input
                    placeholder="Search people…"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="mb-2"
                  />
                  <div className="max-h-64 overflow-y-auto border rounded-lg divide-y">
                    {filteredMembers.length === 0 && (
                      <div className="p-4 text-sm text-muted-foreground text-center">No people found.</div>
                    )}
                    {filteredMembers.map((m) => (
                      <label key={m.id} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/40 cursor-pointer">
                        <Checkbox
                          checked={selectedMembers.has(m.id)}
                          onCheckedChange={() => toggleMember(m.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{m.full_name ?? m.email}</div>
                          <div className="text-xs text-muted-foreground truncate">{m.email}{m.department ? ` · ${m.department}` : ""}</div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${m.status === "active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{m.status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleAssign} disabled={busy || !selectedCourse || selectedMembers.size === 0}>
                  {busy ? "Assigning…" : `Assign to ${selectedMembers.size}`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : filteredAssignments.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-50" />
            No assignments yet. {can("manager") && <span>Click "New assignment" to get started.</span>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3">Person</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Completed</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((a) => {
                  const m = memberById.get(a.member_id);
                  const c = courseById.get(a.course_id);
                  return (
                    <tr key={a.id} className="border-t">
                      <td className="px-4 py-3">
                        <div className="font-medium">{m?.full_name ?? m?.email ?? "Unknown"}</div>
                        {m && <div className="text-xs text-muted-foreground">{m.email}</div>}
                      </td>
                      <td className="px-4 py-3">{c?.title ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${STATUS_STYLES[a.status]}`}>
                          {a.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {a.due_at ? format(new Date(a.due_at), "d MMM yyyy") : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {a.completed_at ? format(new Date(a.completed_at), "d MMM yyyy") : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {can("manager") && (
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(a.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </EmployerLayout>
  );
}
