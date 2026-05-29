import EmployerLayout from "@/components/employer/EmployerLayout";
import { Construction } from "lucide-react";
import { useUiStrings } from "@/hooks/useUiStrings";

export default function EmployerPlaceholder({ title, phase }: { title: string; phase: string }) {
  const tr = useUiStrings({
    comingIn: "Coming in",
    blurb:
      "This area is part of the approved Employer Admin plan and will ship in a follow-up phase. Phase 1 (foundations, people, settings) is live and usable.",
  });
  return (
    <EmployerLayout title={title}>
      <div className="bg-card rounded-2xl shadow-sm p-12 text-center space-y-3">
        <Construction className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="text-xl font-bold">{tr.comingIn} {phase}</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">{tr.blurb}</p>
      </div>
    </EmployerLayout>
  );
}
