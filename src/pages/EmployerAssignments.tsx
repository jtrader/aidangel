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
import { Plus, Trash2, BookOpen, Layers } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Member { id: string; full_name: string | null; email: string; department: string | null; status: string; }
interface Item { id: string; title: string; slug: string; }
type Status = "assigned" | "in_progress" | "completed" | "overdue";
interface Row {
  id: string;
  kind: "topic" | "program";
  member_id: string;
  item_id: string;
  status: Status;
  due_at: string | null;
  created_at: string;
  completed_at: string | null;
}

const STATUS_STYLES: Record<Status, string> = {
  assigned: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
};

export default function EmployerAssignments() {
  const { activeOrg, can } = useOrg();
  const [members, setMembers] = useState<Member[]>([]);
  const [courses, setCourses] = useState<Item[]>([]);
  const [programs, setPrograms] = useState<Item[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const [kind, setKind] = useState<"topic" | "program">("topic");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [dueAt, setDueAt] = useState<string>("");
  const [memberSearch, setMemberSearch] = useState("");

  const load = useCallback(async () => {
    if (!activeOrg) return;
    setLoading(true);
    const [m, c, p, ac, ap] = await Promise.all([
      supabase.from("org_members").select("id, full_name, email, department, status")
        .eq("org_id", activeOrg.id).neq("status", "removed").order("full_name"),
      supabase.from("courses").select("id, title, slug").eq("is_published", true).order("sort_order"),
      supabase.from("programs").select("id, title, slug").eq("is_published", true).order("sort_order"),
      supabase.from("org_course_assignments")
        .select("id, member_id, course_id, status, due_at, created_at, completed_at")
        .eq("org_id", activeOrg.id),
      supabase.from("org_program_assignments")
        .select("id, member_id, program_id, status, due_at, created_at, completed_at")
        .eq("org_id", activeOrg.id),
    ]);
    setMembers((m.data ?? []) as Member[]);
    setCourses((c.data ?? []) as Item[]);
    setPrograms((p.data ?? []) as Item[]);
    const combined: Row[] = [
      ...(ac.data ?? []).map((r: any) => ({ ...r, kind: "topic" as const, item_id: r.course_id })),
      ...(ap.data ?? []).map((r: any) => ({ ...r, kind: "program" as const, item_id: r.program_id })),
    ].sort((a, b) => b.created_at.localeCompare(a.created_at));
    setRows(combined);
    setLoading(false);
  }, [activeOrg]);

  useEffect(() => { load(); }, [load]);

  const memberById = useMemo(() => new Map(members.map(m => [m.id, m])), [members]);
  const itemById = useMemo(() => new Map<string, Item>([
    ...courses.map(c => [c.id, c] as const),
    ...programs.map(p => [p.id, p] as const),
  ]), [courses, programs]);

  const options: Item[] = kind === "topic" ? courses : programs;

  const handleAssign = async () => {
    if (!activeOrg || !selectedItem || selectedMembers.size === 0) {
      toast({ title: "Pick at least one person and an item", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { data: userRes } = await supabase.auth.getUser();
    const baseRows = Array.from(selectedMembers).map(member_id => ({
      org_id: activeOrg.id, member_id,
      due_at: dueAt ? new Date(dueAt).toISOString() : null,
      assigned_by: userRes.user?.id ?? null,
      status: "assigned" as const,
    }));
    const insertRows = kind === "topic"
      ? baseRows.map(r => ({ ...r, course_id: selectedItem }))
      : baseRows.map(r => ({ ...r, program_id: selectedItem }));
    const table = kind === "topic" ? "org_course_assignments" : "org_program_assignments";
    const { error } = await supabase.from(table).insert(insertRows as any);
    setBusy(false);
    if (error) { toast({ title: "Couldn't assign", description: error.message, variant: "destructive" }); return; }
    const item = options.find(o => o.id === selectedItem);
    await supabase.from("org_audit_log").insert({
      org_id: activeOrg.id, actor_id: userRes.user?.id ?? null,
      action: `assignments.created.${kind}`, target_type: kind, target_id: selectedItem,
      metadata: { count: insertRows.length, title: item?.title, due_at: dueAt || null },
    });
    toast({ title: "Assigned", description: `${insertRows.length} ${kind} assignment${insertRows.length === 1 ? "" : "s"} created.` });
    setSelectedMembers(new Set()); setSelectedItem(""); setDueAt(""); setOpen(false);
    load();
  };

  const handleDelete = async (row: Row) => {
    if (!confirm("Remove this assignment?")) return;
    const table = row.kind === "topic" ? "org_course_assignments" : "org_program_assignments";
    const { error } = await supabase.from(table).delete().eq("id", row.id);
    if (error) { toast({ title: "Couldn't remove", description: error.message, variant: "destructive" }); return; }
    load();
  };

  const filtered = rows.filter(r => {
    if (kindFilter !== "all" && r.kind !== kindFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    const m = memberById.get(r.member_id);
    const i = itemById.get(r.item_id);
    return (m?.full_name ?? "").toLowerCase().includes(q)
      || (m?.email ?? "").toLowerCase().includes(q)
      || (i?.title ?? "").toLowerCase().includes(q);
  });

  const filteredMembers = members.filter(m => {
    if (!memberSearch.trim()) return true;
    const q = memberSearch.toLowerCase();
    return (m.full_name ?? "").toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || (m.department ?? "").toLowerCase().includes(q);
  });

  return (
    <EmployerLayout title="Assignments">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 flex-1">
          <Input placeholder="Search by person, topic, or course…" value={filter} onChange={(e) => setFilter(e.target.value)} className="max-w-sm" />
          <Select value={kindFilter} onValueChange={setKindFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All kinds</SelectItem>
              <SelectItem value="topic">Topics</SelectItem>
              <SelectItem value="program">Courses</SelectItem>
            </SelectContent>
          </Select>
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
              <DialogHeader><DialogTitle>Assign training</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>What to assign</Label>
                  <Select value={kind} onValueChange={(v) => { setKind(v as any); setSelectedItem(""); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="topic">Topic (single course)</SelectItem>
                      <SelectItem value="program">Program (bundle of topics)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{kind === "topic" ? "Topic" : "Program"}</Label>
                  <Select value={selectedItem} onValueChange={setSelectedItem}>
                    <SelectTrigger><SelectValue placeholder={`Pick a ${kind}…`} /></SelectTrigger>
                    <SelectContent>
                      {options.map(o => <SelectItem key={o.id} value={o.id}>{o.title}</SelectItem>)}
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
                    <button type="button" className="text-xs text-primary hover:underline"
                      onClick={() => selectedMembers.size === filteredMembers.length
                        ? setSelectedMembers(new Set())
                        : setSelectedMembers(new Set(filteredMembers.map(m => m.id)))}>
                      {selectedMembers.size === filteredMembers.length ? "Clear all" : "Select all"}
                    </button>
                  </div>
                  <Input placeholder="Search people…" value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} className="mb-2" />
                  <div className="max-h-64 overflow-y-auto border rounded-lg divide-y">
                    {filteredMembers.length === 0 && <div className="p-4 text-sm text-muted-foreground text-center">No people found.</div>}
                    {filteredMembers.map(m => (
                      <label key={m.id} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/40 cursor-pointer">
                        <Checkbox checked={selectedMembers.has(m.id)} onCheckedChange={() => {
                          setSelectedMembers(s => { const n = new Set(s); n.has(m.id) ? n.delete(m.id) : n.add(m.id); return n; });
                        }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{m.full_name ?? m.email}</div>
                          <div className="text-xs text-muted-foreground truncate">{m.email}{m.department ? ` · ${m.department}` : ""}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleAssign} disabled={busy || !selectedItem || selectedMembers.size === 0}>
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
        ) : filtered.length === 0 ? (
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
                  <th className="px-4 py-3">Assignment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Completed</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const m = memberById.get(r.member_id);
                  const i = itemById.get(r.item_id);
                  return (
                    <tr key={`${r.kind}-${r.id}`} className="border-t">
                      <td className="px-4 py-3">
                        <div className="font-medium">{m?.full_name ?? m?.email ?? "Unknown"}</div>
                        {m && <div className="text-xs text-muted-foreground">{m.email}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {r.kind === "program" ? <Layers className="h-3.5 w-3.5 text-primary" /> : <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />}
                          <span>{i?.title ?? "—"}</span>
                          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{r.kind}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${STATUS_STYLES[r.status]}`}>{r.status.replace("_", " ")}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{r.due_at ? format(new Date(r.due_at), "d MMM yyyy") : "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.completed_at ? format(new Date(r.completed_at), "d MMM yyyy") : "—"}</td>
                      <td className="px-4 py-3 text-right">
                        {can("manager") && (
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(r)}><Trash2 className="h-4 w-4" /></Button>
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
