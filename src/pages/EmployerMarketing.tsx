import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Building2, Upload, BarChart3, ShieldCheck, ArrowRight, BookOpen, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SeoHead } from "@/components/SeoHead";
import CoursesHeader from "@/components/CoursesHeader";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { optimizeSupabaseImage } from "@/lib/imageOptimization";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { useNavigate } from "react-router-dom";

type CourseCard = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  cover_url: string | null;
};

const TIERS = [
  { name: "Starter", priceId: "employer_starter_seat_annual", perSeat: true, price: "AU$29", unit: "/ seat / year", seats: "Up to 10 seats", popular: false,
    features: ["Bulk CSV import", "Course assignments", "Compliance dashboard", "Email invitations"] },
  { name: "Team 25", priceId: "employer_team_25_annual", perSeat: false, price: "AU$625", unit: "flat / year", seats: "25 seats included", popular: true,
    features: ["Everything in Starter", "CPD-certified branded certificates", "Manager roles", "CSV / PDF reports"] },
  { name: "Team 50", priceId: "employer_team_50_annual", perSeat: false, price: "AU$1,250", unit: "flat / year", seats: "50 seats included", popular: false,
    features: ["Everything in Team 25", "Priority support", "Audit log access"] },
  { name: "Workplace", priceId: "employer_workplace_annual", perSeat: false, price: "AU$1,500", unit: "/ year", seats: "Unlimited seats", popular: false,
    features: ["Everything in Team 50", "SAML SSO (Okta, Azure AD)", "Custom join code"] },
];

const FEATURES = [
  { icon: Upload, title: "Bulk import in minutes", body: "Upload a CSV of your team and we'll invite everyone, auto-link them when they sign up, and pre-assign their courses." },
  { icon: BarChart3, title: "Live compliance tracking", body: "See who's done, who's overdue, and who needs a nudge. Export CSV/PDF for audits anytime." },
  { icon: ShieldCheck, title: "Australian First Aid 5th Ed.", body: "Every learner gets the same evidence-based content used across our public courses, with a CPD-certified branded certificate." },
];

export default function EmployerMarketing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openCheckout, loading: checkoutLoading } = usePaddleCheckout();
  const [courses, setCourses] = useState<CourseCard[]>([]);

  const handleBuy = (tier: (typeof TIERS)[number]) => {
    if (!user) {
      navigate(`/auth?redirect=/employer`);
      return;
    }
    let quantity = 1;
    if (tier.perSeat) {
      const input = window.prompt("How many seats? (1–10)", "5");
      if (!input) return;
      const n = Math.max(1, Math.min(10, parseInt(input, 10) || 0));
      if (!n) return;
      quantity = n;
    }
    openCheckout({
      priceId: tier.priceId,
      quantity,
      customerEmail: user.email ?? undefined,
      customData: { userId: user.id },
      successUrl: `${window.location.origin}/checkout/success`,
    });
  };


  useEffect(() => {
    supabase
      .from("programs")
      .select("id,slug,title,summary,cover_url")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setCourses((data as CourseCard[]) ?? []));
  }, []);

  const marqueeTrack =
    courses.length > 0 ? [...courses, ...courses, ...courses] : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang="en"
        basePath="/employer"
        title="First Aid Training for Teams | First Aid Angel for Continuing Professional Development"
        description="Train and certify your whole workforce in evidence-based first aid. Bulk import, automatic compliance tracking, CPD-certified branded certificates. Plans from AU$29/seat."
      />
      <CoursesHeader />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#F7F7F7] to-card border-b">
        <div className="container max-w-6xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Building2 className="h-4 w-4" /> First Aid Angel for Continuing Professional Development
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Train your whole team in <span className="text-primary">first aid</span>.<br className="hidden md:inline" />
            Prove CPD compliance in a click.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Bulk-invite your workforce, assign Australian First Aid 5th Edition courses, and track completion in a single dashboard. CPD-certified branded certificates included.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to={user ? "/employer/onboarding" : "/auth?redirect=/employer/onboarding"}>
                Start a free trial <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/join">Have a join code?</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">1 month free trial on all employer plans</p>
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
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Simple, seat-based pricing</h2>
            <p className="text-muted-foreground">All prices in AUD. Cancel anytime.</p>
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
                <Button
                  className="w-full"
                  variant={t.popular ? "default" : "outline"}
                  disabled={checkoutLoading}
                  onClick={() => handleBuy(t)}
                >
                  {checkoutLoading ? "Loading…" : t.perSeat ? "Buy seats" : "Get started"}
                </Button>
              </Card>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Need more than 50 seats or enterprise SSO? <a href="mailto:hello@firstaidangel.org" className="underline text-primary">Get in touch</a>.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">Ready to certify your team?</h2>
        <p className="text-muted-foreground mb-6">Set up your organisation in under two minutes.</p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link to={user ? "/employer/onboarding" : "/auth?redirect=/employer/onboarding"}>
            Create your organisation <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
