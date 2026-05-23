import { NavLink, useNavigate } from "react-router-dom";
import { Building2, LayoutDashboard, Users, Upload, ListChecks, BarChart3, Settings, Plus, Check } from "lucide-react";
import { useOrg, type OrgSummary } from "@/hooks/useOrg";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  title?: string;
}

const NAV = [
  { to: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employer/people", label: "People", icon: Users },
  { to: "/employer/people/import", label: "Bulk import", icon: Upload },
  { to: "/employer/assignments", label: "Assignments", icon: ListChecks },
  { to: "/employer/reports", label: "Reports", icon: BarChart3 },
  { to: "/employer/settings", label: "Settings", icon: Settings },
];

function OrgSwitcher({ orgs, active, onSelect }: { orgs: OrgSummary[]; active: OrgSummary | null; onSelect: (id: string) => void }) {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 max-w-[260px]">
          <Building2 className="h-4 w-4" />
          <span className="truncate">{active?.name ?? "Select organisation"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 bg-popover">
        <DropdownMenuLabel>Your organisations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {orgs.map((o) => (
          <DropdownMenuItem key={o.id} onSelect={() => onSelect(o.id)} className="cursor-pointer">
            <span className="flex-1 truncate">{o.name}</span>
            <span className="text-xs text-muted-foreground capitalize mr-2">{o.role}</span>
            {active?.id === o.id && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate("/employer/onboarding")} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          New organisation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function EmployerLayout({ children, title }: Props) {
  const { user, signOut } = useAuth();
  const { orgs, activeOrg, setActive, loading } = useOrg();
  const navigate = useNavigate();

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground">Loading workspace…</div>;
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (orgs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-sm p-8 text-center space-y-4">
          <Building2 className="h-12 w-12 mx-auto text-primary" />
          <h1 className="text-2xl font-bold">Welcome to Employer Admin</h1>
          <p className="text-muted-foreground text-sm">
            Create an organisation to start managing your team's first-aid training, or paste a join link from your admin.
          </p>
          <Button className="w-full" onClick={() => navigate("/employer/onboarding")}>
            <Plus className="h-4 w-4 mr-2" /> Create organisation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="bg-card border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="font-bold text-primary">First Aid Angel</button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-sm">Employer</span>
          </div>
          <div className="flex items-center gap-2">
            <OrgSwitcher orgs={orgs} active={activeOrg} onSelect={setActive} />
            <Button variant="ghost" size="sm" onClick={() => signOut().then(() => navigate("/"))}>Sign out</Button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <nav className="md:sticky md:top-[72px] md:self-start bg-card rounded-2xl p-3 space-y-1 shadow-sm">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground",
                )
              }
            >
              <n.icon className="h-4 w-4" />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <main className="space-y-6">
          {title && <h1 className="text-2xl font-bold">{title}</h1>}
          {children}
        </main>
      </div>
    </div>
  );
}
