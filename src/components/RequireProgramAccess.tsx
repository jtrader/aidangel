import { Link, useLocation } from "react-router-dom";
import { Loader2, Lock, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CoursesHeader from "@/components/CoursesHeader";

export default function RequireProgramAccess({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { hasProgramAccess, loading } = useSubscription();
  const location = useLocation();

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <ProgramPaywall reason="signin" redirect={location.pathname + location.search} />;
  }

  if (!hasProgramAccess) {
    return <ProgramPaywall reason="upgrade" />;
  }

  return <>{children}</>;
}

export function ProgramPaywall({ reason, redirect }: { reason: "signin" | "upgrade"; redirect?: string }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CoursesHeader />
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-16">
        <Card className="p-8 md:p-10 rounded-2xl text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Courses are a paid feature
          </h1>
          <p className="text-muted-foreground mb-6">
            Chat, AED finder, the Live CPR Guide and individual topics stay free. Full
            certified courses — lessons, quizzes and certificates — need an active plan.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {reason === "signin" ? (
              <>
                <Button asChild size="lg">
                  <Link to={`/auth?redirect=${encodeURIComponent(redirect ?? "/personal")}`}>
                    Sign in
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/personal"><Sparkles className="h-4 w-4 mr-2" /> See plans</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link to="/personal"><Sparkles className="h-4 w-4 mr-2" /> View personal plans</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/employer">Employer plans</Link>
                </Button>
              </>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
