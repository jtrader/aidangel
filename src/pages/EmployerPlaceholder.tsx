import EmployerLayout from "@/components/employer/EmployerLayout";
import { Construction } from "lucide-react";

export default function EmployerPlaceholder({ title, phase }: { title: string; phase: string }) {
  return (
    <EmployerLayout title={title}>
      <div className="bg-card rounded-2xl shadow-sm p-12 text-center space-y-3">
        <Construction className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="text-xl font-bold">Coming in {phase}</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          This area is part of the approved Employer Admin plan and will ship in a follow-up phase. Phase 1 (foundations, people, settings) is live and usable.
        </p>
      </div>
    </EmployerLayout>
  );
}
