import { useCallback, useEffect, useState } from "react";
import EmployerLayout from "@/components/employer/EmployerLayout";
import { useOrg, type OrgRole } from "@/hooks/useOrg";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

interface Member {
  id: string;
  email: string;
  full_name: string | null;
  role: OrgRole;
  department: string | null;
  employee_ref: string | null;
  status: "invited" | "active" | "removed";
  invited_at: string;
}

const PersonSchema = z.object({
  email: z.string().trim().email().max(255),
  full_name: z.string().trim().min(1).max(120),
  role: z.enum(["owner", "admin", "manager", "learner"]),
  department: z.string().trim().max(80).optional(),
  employee_ref: z.string().trim().max(80).optional(),
});

export default function EmployerPeople() {
  const { activeOrg, can } = useOrg();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!activeOrg) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("org_members")
      .select("id, email, full_name, role, department, employee_ref, status, invited_at")
      .eq("org_id", activeOrg.id)
      .neq("status", "removed")
      .order("invited_at", { ascending: false });
    if (error) toast({ title: "Couldn't load people", description: error.message, variant: "destructive" });
    setMembers((data ?? []) as Member[]);
    setLoading(false);
  }, [activeOrg]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeOrg) return;
    const fd = new FormData(e.currentTarget);
    const parsed = PersonSchema.safeParse({
      email: fd.get("email"),
      full_name: fd.get("full_name"),
      role: fd.get("role"),
      department: fd.get("department") || undefined,
      employee_ref: fd.get("employee_ref") || undefined,
    });
    if (!parsed.success) {
      toast({ title: "Check the form", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("org_members").insert({
      org_id: activeOrg.id,
      email: parsed.data.email.toLowerCase(),
      full_name: parsed.data.full_name,
      role: parsed.data.role,
      department: parsed.data.department ?? null,
      employee_ref: parsed.data.employee_ref ?? null,
      status: "invited",
    });
    setBusy(false);
    if (error) {
      toast({ title: "Couldn't add person", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Added", description: `${parsed.data.full_name} has been invited.` });
    setOpen(false);
    load();
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this person from your organisation?")) return;
    const { error } = await supabase.from("org_members").update({ status: "removed" }).eq("id", id);
    if (error) {
      toast({ title: "Couldn't remove", description: error.message, variant: "destructive" });
      return;
    }
    load();
  };

  const filtered = members.filter((m) => {
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return (
      m.email.toLowerCase().includes(q) ||
      (m.full_name ?? "").toLowerCase().includes(q) ||
      (m.department ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <EmployerLayout title="People">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          placeholder="Search by name, email, department…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        {can("manager") && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><UserPlus className="h-4 w-4 mr-2" /> Add person</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add a person</DialogTitle></DialogHeader>
              <form onSubmit={handleAdd} className="space-y-3">
                <div><Label>Email</Label><Input name="email" type="email" required maxLength={255} /></div>
                <div><Label>Full name</Label><Input name="full_name" required maxLength={120} /></div>
                <div>
                  <Label>Role</Label>
                  <Select name="role" defaultValue="learner">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learner">Learner</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Department</Label><Input name="department" maxLength={80} /></div>
                <div><Label>Employee ref</Label><Input name="employee_ref" maxLength={80} /></div>
                <Button type="submit" className="w-full" disabled={busy}>{busy ? "Adding…" : "Add person"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No people yet. {can("manager") && <span>Click "Add person" above to start.</span>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Dept</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{m.full_name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.email}</td>
                    <td className="px-4 py-3 capitalize">{m.role}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.department ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${m.status === "active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {can("manager") && (
                        <Button variant="ghost" size="sm" onClick={() => handleRemove(m.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </EmployerLayout>
  );
}
