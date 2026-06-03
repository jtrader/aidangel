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
import { useUiStrings } from "@/hooks/useUiStrings";

export default function ProgramCertificate() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openCheckout, loading: checkoutLoading } = usePaddleCheckout();
  const tr = useUiStrings({
    heading: "CPD Certificate",
    courseNotFound: "Course not found",
    issuedTo: "Issued to",
    certNo: "Certificate No",
    downloadPdf: "Download PDF",
    enterName: "Enter the name to appear on your certificate.",
    fullName: "Full name",
    useCredit: "Use 1 credit & issue certificate",
    unlimited: "Unlimited certificates on your plan.",
    credit: "credit",
    credits: "credits",
    remaining: "remaining.",
    youHave: "You have",
    lockBadge: "CPD Certificate — AU$29",
    lockBlurb:
      "The course is free. Pay once to unlock a CPD-certified personal certificate of completion (PDF) based on St John Australian First Aid 5th Edition.",
    purchase: "Purchase certificate — AU$29",
    loading: "Loading…",
    bulkHint: "Buying for several people?",
    saveCreditPack: "Save with a credit pack",
    completeAllTopics: "Complete all topic quizzes first",
    passFinalFirst: "Pass the final quiz first",
    enterYourName: "Please enter your name",
    noCredits: "No certificate credits available",
    issued: "Certificate issued!",
  });
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

      // Check for existing free (credit-issued) program cert
      const { data: existing } = await supabase.from("program_certificates")
        .select("*").eq("user_id", user.id).eq("program_id", p.id).maybeSingle();
      if (existing) {
        setCert(existing);
      } else {
        // Check for paid Shopify cert
        const { data: paid } = await supabase.from("shopify_certificates")
          .select("certificate_id, learner_name, issue_date")
          .eq("user_id", user.id).eq("program_slug", p.slug)
          .eq("status", "issued")
          .order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (paid) {
          setCert({
            certificate_number: paid.certificate_id,
            learner_name: paid.learner_name,
            issued_at: paid.issue_date,
          });
        }
      }

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
    if (ids.some((id) => !passed.has(id))) { toast.error(tr.completeAllTopics); return false; }
    const { count: qCount } = await supabase.from("program_quiz_questions")
      .select("*", { count: "exact", head: true }).eq("program_id", program.id);
    if ((qCount ?? 0) > 0) {
      const { data: fa } = await supabase.from("program_quiz_attempts")
        .select("id").eq("user_id", user!.id).eq("program_id", program.id).eq("passed", true).maybeSingle();
      if (!fa) { toast.error(tr.passFinalFirst); return false; }
    }
    return true;
  };

  const issueWithCredit = async () => {
    if (!user || !program || !name.trim()) { toast.error(tr.enterYourName); return; }
    if (!(await verifyEligibility())) return;

    const { data: ok, error: rpcErr } = await supabase.rpc("consume_certificate_credit", {
      _user: user.id, _env: env,
    });
    if (rpcErr) { toast.error(rpcErr.message); return; }
    if (!ok) { toast.error(tr.noCredits); return; }

    const { data, error } = await supabase.from("program_certificates")
      .insert({ user_id: user.id, program_id: program.id, learner_name: name.trim() })
      .select().single();
    if (error) { toast.error(error.message); await refreshCredits(user.id); return; }
    setCert(data);
    await refreshCredits(user.id);
    toast.success(tr.issued);
  };

  const buySingle = async () => {
    if (!user || !program || !name.trim()) { toast.error(tr.enterYourName); return; }
    if (!(await verifyEligibility())) return;
    try {
      const { data, error } = await supabase.functions.invoke("cert-checkout", {
        body: { programSlug: slug, learnerName: name.trim() },
      });
      if (error) { toast.error(error.message); return; }
      if (!data?.checkoutUrl) { toast.error("Could not start checkout"); return; }
      window.open(data.checkoutUrl, "_blank");
    } catch (e: any) {
      toast.error(e?.message ?? "Checkout failed");
    }
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
  if (!program) return <div className="min-h-screen flex items-center justify-center">{tr.courseNotFound}</div>;

  const hasCredit = credits?.unlimited || (credits?.balance ?? 0) > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CoursesHeader />
      <main className="container max-w-2xl mx-auto px-4 py-10">
        <Card className="p-8 text-center rounded-2xl">
          <Award className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold mb-2">{tr.heading}</h1>
          <p className="text-muted-foreground mb-6">{program.title}</p>

          {cert ? (
            <>
              <p className="text-lg mb-2">{tr.issuedTo} <strong>{cert.learner_name}</strong></p>
              <p className="text-sm text-muted-foreground mb-6">{tr.certNo}: {cert.certificate_number}</p>
              <Button size="lg" onClick={download}><Download className="h-4 w-4 mr-2" /> {tr.downloadPdf}</Button>
            </>
          ) : (
            <>
              <p className="mb-4 text-muted-foreground">{tr.enterName}</p>
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder={tr.fullName}
                className="w-full max-w-sm mx-auto block border rounded-lg px-3 py-2 mb-6 text-center"
              />

              {hasCredit ? (
                <div className="space-y-3">
                  <Button size="lg" onClick={issueWithCredit} className="w-full max-w-sm">
                    <Award className="h-4 w-4 mr-2" /> {tr.useCredit}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {credits?.unlimited
                      ? tr.unlimited
                      : `${tr.youHave} ${credits?.balance} ${credits?.balance === 1 ? tr.credit : tr.credits} ${tr.remaining}`}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border bg-muted/40 p-4 text-left text-sm">
                    <div className="flex items-center gap-2 font-semibold mb-1">
                      <Lock className="h-4 w-4 text-primary" /> {tr.lockBadge}
                    </div>
                    <p className="text-muted-foreground">{tr.lockBlurb}</p>
                  </div>
                  <Button size="lg" onClick={buySingle} disabled={checkoutLoading} className="w-full max-w-sm">
                    {checkoutLoading ? tr.loading : tr.purchase}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {tr.bulkHint}{" "}
                    <Link to="/personal" className="underline">{tr.saveCreditPack}</Link>.
                  </p>
                </div>
              )}
            </>
          )}
        </Card>
      </main>
      <NetworkFooter />
    </div>
  );
}
