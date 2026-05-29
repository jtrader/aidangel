import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Award, Download, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { toast } from "sonner";
import { generateCertificatePdf } from "@/lib/certificate";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { getPaddleEnvironment } from "@/lib/paddle";

export default function ProgramCertificate() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openCheckout, loading: checkoutLoading } = usePaddleCheckout();
  const [program, setProgram] = useState<any>(null);
  const [cert, setCert] = useState<any>(null);
  const [org, setOrg] = useState<any>(null);
  const [credits, setCredits] = useState<{ balance: number; unlimited: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  const env = getPaddleEnvironment();

  const refreshCredits = async (uid: string) => {
    const { data } = await supabase.from("certificate_credits")
      .select("balance,unlimited").eq("user_id", uid).eq("environment", env).maybeSingle();
    setCredits({ balance: data?.balance ?? 0, unlimited: !!data?.unlimited });
  };

  useEffect(() => {
    (async () => {
      if (!user) { navigate(`/auth?redirect=/programs/${slug}/certificate`); return; }
      const { data: p } = await supabase.from("programs").select("*").eq("slug", slug).maybeSingle();
      if (!p) { setLoading(false); return; }
      setProgram(p);

      const { data: existing } = await supabase.from("program_certificates")
        .select("*").eq("user_id", user.id).eq("program_id", p.id).maybeSingle();
      if (existing) setCert(existing);

      const { data: orgs } = await supabase.from("organisations")
        .select("name,logo_url,primary_color").limit(1);
      if (orgs?.[0]) setOrg({ name: orgs[0].name, logoUrl: orgs[0].logo_url, primaryColor: orgs[0].primary_color });

      await refreshCredits(user.id);
      setName(user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "");
      setLoading(false);
    })();
     
  }, [slug, user, navigate]);

  const verifyEligibility = async () => {
    const { data: topics } = await supabase.from("program_topics").select("course_id").eq("program_id", program.id);
    const ids = (topics ?? []).map((t) => t.course_id);
    const { data: attempts } = await supabase.from("quiz_attempts")
      .select("course_id").eq("user_id", user!.id).eq("passed", true).in("course_id", ids);
    const passed = new Set((attempts ?? []).map((a) => a.course_id));
    if (ids.some((id) => !passed.has(id))) { toast.error("Complete all topic quizzes first"); return false; }
    const { count: qCount } = await supabase.from("program_quiz_questions")
      .select("*", { count: "exact", head: true }).eq("program_id", program.id);
    if ((qCount ?? 0) > 0) {
      const { data: fa } = await supabase.from("program_quiz_attempts")
        .select("id").eq("user_id", user!.id).eq("program_id", program.id).eq("passed", true).maybeSingle();
      if (!fa) { toast.error("Pass the final quiz first"); return false; }
    }
    return true;
  };

  const issueWithCredit = async () => {
    if (!user || !program || !name.trim()) { toast.error("Please enter your name"); return; }
    if (!(await verifyEligibility())) return;

    const { data: ok, error: rpcErr } = await supabase.rpc("consume_certificate_credit", {
      _user: user.id, _env: env,
    });
    if (rpcErr) { toast.error(rpcErr.message); return; }
    if (!ok) { toast.error("No certificate credits available"); return; }

    const { data, error } = await supabase.from("program_certificates")
      .insert({ user_id: user.id, program_id: program.id, learner_name: name.trim() })
      .select().single();
    if (error) { toast.error(error.message); await refreshCredits(user.id); return; }
    setCert(data);
    await refreshCredits(user.id);
    toast.success("Certificate issued!");
  };

  const buySingle = async () => {
    if (!user) return;
    if (!(await verifyEligibility())) return;
    openCheckout({
      priceId: "certificate_single",
      customerEmail: user.email ?? undefined,
      customData: { userId: user.id },
      successUrl: `${window.location.origin}/programs/${slug}/certificate?paid=1`,
    });
  };

  const download = async () => {
    if (!cert || !program) return;
    await generateCertificatePdf({
      learnerName: cert.learner_name,
      courseTitle: program.title,
      certificateNumber: cert.certificate_number,
      issuedAt: cert.issued_at,
      org,
    });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!program) return <div className="min-h-screen flex items-center justify-center">Course not found</div>;

  const hasCredit = credits?.unlimited || (credits?.balance ?? 0) > 0;

  return (
    <div className="min-h-screen bg-background">
      <CoursesHeader />
      <main className="container max-w-2xl mx-auto px-4 py-10">
        <Card className="p-8 text-center rounded-2xl">
          <Award className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold mb-2">CPD Certificate</h1>
          <p className="text-muted-foreground mb-6">{program.title}</p>

          {cert ? (
            <>
              <p className="text-lg mb-2">Issued to <strong>{cert.learner_name}</strong></p>
              <p className="text-sm text-muted-foreground mb-6">Certificate No: {cert.certificate_number}</p>
              <Button size="lg" onClick={download}><Download className="h-4 w-4 mr-2" /> Download PDF</Button>
            </>
          ) : (
            <>
              <p className="mb-4 text-muted-foreground">Enter the name to appear on your certificate.</p>
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full max-w-sm mx-auto block border rounded-lg px-3 py-2 mb-6 text-center"
              />

              {hasCredit ? (
                <div className="space-y-3">
                  <Button size="lg" onClick={issueWithCredit} className="w-full max-w-sm">
                    <Award className="h-4 w-4 mr-2" /> Use 1 credit & issue certificate
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {credits?.unlimited
                      ? "Unlimited certificates on your plan."
                      : `You have ${credits?.balance} certificate credit${credits?.balance === 1 ? "" : "s"} remaining.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border bg-muted/40 p-4 text-left text-sm">
                    <div className="flex items-center gap-2 font-semibold mb-1">
                      <Lock className="h-4 w-4 text-primary" /> CPD Certificate — AU$29
                    </div>
                    <p className="text-muted-foreground">
                      The course is free. Pay once to unlock a CPD-certified personal certificate of completion (PDF) based on St John Australian First Aid 5th Edition.
                    </p>
                  </div>
                  <Button size="lg" onClick={buySingle} disabled={checkoutLoading} className="w-full max-w-sm">
                    {checkoutLoading ? "Loading…" : "Purchase certificate — AU$29"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Buying for several people?{" "}
                    <Link to="/personal" className="underline">Save with a credit pack</Link>.
                  </p>
                </div>
              )}
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
