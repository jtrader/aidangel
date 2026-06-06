import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Building2, Upload, BarChart3, ShieldCheck, ArrowRight, BookOpen, Clock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SeoHead } from "@/components/SeoHead";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { optimizeSupabaseImage } from "@/lib/imageOptimization";
import { useShopifyCheckout } from "@/hooks/useShopifyCheckout";
import EnrolAuthDialog from "@/components/EnrolAuthDialog";
import { useNavigate } from "react-router-dom";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";

type CourseCard = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  cover_url: string | null;
};

const TIERS = [
  { name: "Starter Pack", priceId: "employer_starter_seat_annual", price: "AU$29", unit: "/ credit", seats: "Per-credit pricing (1–10)", popular: false,
    features: ["Bulk CSV import of your team", "Assign courses to anyone", "Compliance dashboard", "CPD-certified certificate per credit"] },
  { name: "Team 25", priceId: "employer_team_25_annual", price: "AU$625", unit: "flat / year", seats: "25 certificate credits ($25 ea)", popular: true,
    features: ["Everything in Starter", "25 CPD-certified branded certificates", "Manager roles", "CSV / PDF reports"] },
  { name: "Team 50", priceId: "employer_team_50_annual", price: "AU$1,250", unit: "flat / year", seats: "50 certificate credits ($25 ea)", popular: false,
    features: ["Everything in Team 25", "Priority support", "Audit log access"] },
  { name: "Workplace Unlimited", priceId: "employer_workplace_annual", price: "AU$1,500", unit: "/ year", seats: "Unlimited certificate credits", popular: false,
    features: ["Everything in Team 50", "Unlimited CPD certificates for your team", "SAML SSO (Okta, Azure AD)", "Custom join code"] },
];

const FEATURES = [
  { icon: Upload, title: "All courses free for your team", body: "Every learner gets free access to the full St John Australian First Aid 5th Edition library. You only pay for CPD-certified certificate credits when staff complete and need proof." },
  { icon: BarChart3, title: "Live compliance tracking", body: "See who's done, who's overdue, and who needs a nudge. Export CSV/PDF for audits anytime." },
  { icon: ShieldCheck, title: "CPD certificate credits in bulk", body: "Buy credit packs and assign one CPD-certified branded certificate to each learner who passes — at a much better rate than the individual AU$29 price." },
];


export default function EmployerMarketing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openCheckout, loading: checkoutLoading } = useShopifyCheckout();
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [starterQty, setStarterQty] = useState<1 | 2 | 3 | 5 | 10>(5);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pendingPriceId, setPendingPriceId] = useState<string | null>(null);

  const handleBuy = (priceId: string) => {
    if (!user) {
      setPendingPriceId(priceId);
      setAuthDialogOpen(true);
      return;
    }
    openCheckout({ priceId });
  };
  const onAuthSuccess = () => {
    if (pendingPriceId) {
      openCheckout({ priceId: pendingPriceId });
      setPendingPriceId(null);
    }
  };


  useEffect(() => {
    supabase
      .from("programs")
      .select("id,slug,title,summary,cover_url")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setCourses((data as CourseCard[]) ?? []));
  }, []);

  const coursesWithCovers = courses.filter((c) => !!c.cover_url);
  const marqueeTrack =
    coursesWithCovers.length > 0
      ? [...coursesWithCovers, ...coursesWithCovers, ...coursesWithCovers]
      : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang="en"
        basePath="/employer"
        title="Free Team First Aid Training + Bulk CPD Certificates | First Aid Angel"
        description="Give your whole team free St John Australian First Aid 5th Edition training. Buy CPD-certified certificate credits in bulk — from AU$25 each in workforce packs."
      />

      <CoursesHeader />

      <CmsPageRenderer
        slug="employer"
        fallback={
          <>



      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#F7F7F7] to-card border-b">
        <div className="container max-w-6xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Building2 className="h-4 w-4" /> First Aid Angel for Workforces
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Free first aid training for your <span className="text-primary">whole team</span>.<br className="hidden md:inline" />
            Buy CPD certificate credits in bulk.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Every learner gets free access to St John Australian First Aid 5th Edition aligned courses. You only pay for the CPD-certified certificates your staff need — buy a credit pack and assign one per completion.
          </p>
          <div className="max-w-2xl mx-auto mb-8 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-left">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div className="text-sm text-amber-900">
                <p className="font-semibold mb-1">Not a substitute for accredited hands-on training</p>
                <p>
                  These short courses are designed for essential general knowledge, continuing professional development (CPD), and as a study guide for accredited in-person training. They do not replace official hands-on training accreditation.
                </p>
                <p className="mt-2">
                  Find official accreditation education providers in our <Link to="/learn" className="underline font-medium hover:text-amber-700">Educators directory</Link>.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to={user ? "/employer/onboarding" : "/auth?redirect=/employer/onboarding"}>
                Start free <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/join">Have a join code?</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Courses free for everyone. Certificate credits from AU$25 in bulk.</p>
        </div>



        {/* Auto-scrolling topic marquee */}
        {marqueeTrack.length > 0 && (
          <div
            id="topics-marquee"
            className="relative pb-12 pt-2 overflow-hidden scroll-mt-24"
            aria-label="Browse first aid topics"
          >
            <style>{`
              @keyframes topicsMarquee {
                from { transform: translateX(0); }
                to { transform: translateX(-33.3333%); }
              }
              .topics-marquee-track {
                animation: topicsMarquee 60s linear infinite;
                width: max-content;
              }
              .topics-marquee-track:hover { animation-play-state: paused; }
              @media (prefers-reduced-motion: reduce) {
                .topics-marquee-track { animation: none; }
              }
            `}</style>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F7F7F7] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent z-10" />
            <div className="flex topics-marquee-track gap-4 px-4">
              {marqueeTrack.map((c, i) => {
                const isEager = i < 3;
                return (
                <Link
                  key={`${c.id}-${i}`}
                  to={`/programs/${c.slug}`}
                  className="block group shrink-0 w-64"
                >
                  <Card className="overflow-hidden rounded-2xl h-full hover:shadow-lg transition-shadow bg-card">
                    <div className="aspect-video bg-muted relative">
                      {c.cover_url ? (
                        <img
                          src={optimizeSupabaseImage(c.cover_url, 512)}
                          alt={c.title}
                          width={512}
                          height={288}
                          className="w-full h-full object-cover"
                          loading={isEager ? "eager" : "lazy"}
                          decoding="async"
                          fetchPriority={i === 0 ? "high" : isEager ? "auto" : "low"}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                          <BookOpen className="h-10 w-10 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 text-left">
                      <div className="flex gap-1.5 mb-2 flex-wrap">
                        <Badge variant="secondary" className="text-[10px]">Course</Badge>
                      </div>
                      <h3 className="font-display font-bold text-sm leading-snug group-hover:text-primary line-clamp-2">
                        {c.title}
                      </h3>
                      {c.summary && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{c.summary}</p>
                      )}
                    </div>
                  </Card>
                </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-6 rounded-2xl">
              <f.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>


      {/* Pricing */}
      <section className="bg-[#F7F7F7] border-y">
        <div className="container max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">CPD certificate credit packs</h2>
            <p className="text-muted-foreground">All courses free. Buy credits in bulk — assign one per learner who passes.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((t) => (
              <Card
                key={t.name}
                className={`p-6 rounded-2xl flex flex-col ${t.popular ? "border-2 border-primary shadow-lg relative" : ""}`}
              >
                {t.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="font-display font-bold text-xl">{t.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{t.seats}</p>
                <div className="mb-4">
                  <span className="font-display text-3xl font-bold">{t.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">{t.unit}</span>
                </div>
                <ul className="space-y-2 text-sm mb-6 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {t.priceId === "employer_starter_seat_annual" ? (
                  <div className="space-y-3">
                    {/* Fixed-option credit selector */}
                    <div className="flex gap-1.5 flex-wrap">
                      {([1, 2, 3, 5, 10] as const).map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setStarterQty(n)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                            starterQty === n
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-foreground border-border hover:border-primary"
                          }`}
                        >
                          {n} {n === 1 ? "credit" : "credits"}
                        </button>
                      ))}
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      disabled={checkoutLoading}
                      onClick={() => handleBuy(`employer_starter_${starterQty}`)}
                    >
                      {checkoutLoading
                        ? "Loading…"
                        : `Buy ${starterQty} credit${starterQty === 1 ? "" : "s"}`}
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    variant={t.popular ? "default" : "outline"}
                    disabled={checkoutLoading}
                    onClick={() => handleBuy(t.priceId)}
                  >
                    {checkoutLoading ? "Loading…" : "Get pack"}
                  </Button>
                )}
               </Card>
             ))}
           </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Need unlimited certificates or enterprise SSO? <a href="mailto:hello@firstaidangel.org" className="underline text-primary">Get in touch</a>.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">Ready to roll out free training?</h2>
        <p className="text-muted-foreground mb-6">Set up your organisation in under two minutes.</p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link to={user ? "/employer/onboarding" : "/auth?redirect=/employer/onboarding"}>
            Create your organisation <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </section>
          </>
        }
      />
      <NetworkFooter />

      <EnrolAuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onSuccess={onAuthSuccess}
        variant="purchase-employer"
      />
    </div>
  );
}
