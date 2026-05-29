import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Check,
  User,
  BookOpen,
  Award,
  HeartPulse,
  ArrowRight,
  Building2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SeoHead } from "@/components/SeoHead";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { optimizeSupabaseImage } from "@/lib/imageOptimization";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { useNavigate } from "react-router-dom";
import { CmsPageRenderer } from "@/components/CmsPageRenderer";

const TIERS = [
  {
    name: "Single Credit",
    priceId: "personal_individual_annual",
    price: "AU$25",
    unit: "/ year",
    seats: "1 certificate credit (save $4)",
    popular: false,
    features: [
      "1 CPD-certified certificate credit",
      "Use it on any course once you pass the quiz",
      "Cheaper than buying a single certificate on its own",
      "Credit valid for 12 months",
    ],
  },
  {
    name: "Household 3-Pack",
    priceId: "personal_family_annual",
    price: "AU$60",
    unit: "/ year",
    seats: "3 certificate credits ($20 ea)",
    popular: true,
    features: [
      "3 CPD-certified certificate credits",
      "Share with colleagues, friends or family",
      "Save $27 vs. buying single certificates",
      "Credits valid for 12 months",
    ],
  },
  {
    name: "Family 5-Pack",
    priceId: "personal_family_plus_annual",
    price: "AU$90",
    unit: "/ year",
    seats: "5 certificate credits ($18 ea)",
    popular: false,
    features: [
      "5 CPD-certified certificate credits",
      "Ideal for larger groups",
      "Save $55 vs. buying single certificates",
      "Priority email support",
    ],
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "All courses are free, forever",
    body: "Watch the lessons, take the quizzes, and use the Live CPR Guide and AED Finder — no payment, no sign-up wall. Pay only when you want a CPD certificate.",
  },
  {
    icon: Award,
    title: "CPD certificate on completion — AU$29",
    body: "Pass the quiz and unlock a CPD-certified personal certificate of completion based on the St John Australian First Aid 5th Edition. Buy a single certificate or save with a credit pack below.",
  },
  {
    icon: HeartPulse,
    title: "Be ready when it matters",
    body: "Practice with our Live CPR Guide, AED Finder and step-by-step emergency walkthroughs — designed for real-world moments.",
  },
];


type TopicCard = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  cover_url: string | null;
  level: string;
  duration_minutes: number;
};

type CourseCard = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  cover_url: string | null;
};

export default function PersonalMarketing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const startHref = user ? "/programs" : "/auth?redirect=/programs";
  const { openCheckout, loading: checkoutLoading } = usePaddleCheckout();
  const [topics, setTopics] = useState<TopicCard[]>([]);
  const [courses, setCourses] = useState<CourseCard[]>([]);

  const handleBuy = (priceId: string) => {
    if (!user) {
      navigate(`/auth?redirect=/personal`);
      return;
    }
    openCheckout({
      priceId,
      customerEmail: user.email ?? undefined,
      customData: { userId: user.id },
      successUrl: `${window.location.origin}/checkout/success`,
    });
  };


  useEffect(() => {
    supabase
      .from("courses")
      .select("id,slug,title,summary,cover_url,level,duration_minutes")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setTopics((data as TopicCard[]) ?? []));
    supabase
      .from("programs")
      .select("id,slug,title,summary,cover_url")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setCourses((data as CourseCard[]) ?? []));
  }, []);

  const topicsWithCovers = topics.filter((t) => !!t.cover_url);
  const topicsTrack =
    topicsWithCovers.length > 0
      ? [...topicsWithCovers, ...topicsWithCovers, ...topicsWithCovers]
      : [];

  const coursesWithCovers = courses.filter((c) => !!c.cover_url);
  const coursesTrack =
    coursesWithCovers.length > 0
      ? [...coursesWithCovers, ...coursesWithCovers, ...coursesWithCovers]
      : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang="en"
        basePath="/personal"
        title="Free First Aid Courses + CPD Certificates | First Aid Angel"
        description="All First Aid Angel courses are free. Earn a CPD-certified personal certificate of completion for AU$29 — or save with a credit pack from AU$25."
      />
      <CoursesHeader />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#F7F7F7] to-card border-b">
        <div className="container max-w-6xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <User className="h-4 w-4" /> First Aid Angel — Free for Everyone
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
            All First Aid courses are{" "}
            <span className="text-primary">100% free</span>.
            <br />
            Pay only for your CPD certificate.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Watch every lesson, take every quiz and use the Live CPR Guide and AED Finder at no cost. When you pass, unlock a CPD-certified personal certificate of completion for just <strong>AU$29</strong> — or save with a credit pack below.
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
              <Link to={startHref}>
                Start learning free <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            No subscription. No paywall on lessons. Pay AU$29 per certificate, or save with a credit pack.
          </p>
        </div>


        {/* Auto-scrolling courses marquee (programs) */}
        {coursesTrack.length > 0 && (
          <div
            id="courses-marquee"
            className="relative pb-12 pt-2 overflow-hidden scroll-mt-24"
            aria-label="Browse first aid courses"
          >
            <style>{`
              @keyframes coursesMarquee {
                from { transform: translateX(0); }
                to { transform: translateX(-33.3333%); }
              }
              .courses-marquee-track {
                animation: coursesMarquee 60s linear infinite;
                width: max-content;
              }
              .courses-marquee-track:hover { animation-play-state: paused; }
              @media (prefers-reduced-motion: reduce) {
                .courses-marquee-track { animation: none; }
              }
            `}</style>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F7F7F7] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent z-10" />
            <div className="flex courses-marquee-track gap-4 px-4">
              {coursesTrack.map((c, i) => {
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
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Save with certificate credit packs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              All courses are free. CPD certificates are <strong>AU$29 each</strong>, or buy a pack below for a better per-certificate price.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {TIERS.map((t) => (
              <Card
                key={t.name}
                className={`p-6 rounded-2xl flex flex-col w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] ${
                  t.popular ? "border-2 border-primary shadow-lg relative" : ""
                }`}
              >
                {t.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    BEST VALUE
                  </div>
                )}
                <h3 className="font-display font-bold text-xl">{t.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{t.seats}</p>
                <div className="mb-4">
                  <span className="font-display text-3xl font-bold">
                    {t.price}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    {t.unit}
                  </span>
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
                  onClick={() => handleBuy(t.priceId)}
                >
                  {checkoutLoading ? "Loading…" : "Buy credit pack"}
                </Button>

              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Employer cross-sell */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <Card className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-primary/5 to-card border-2 border-primary/20">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold mb-2">
                Training a team or workforce?
              </h2>
              <p className="text-muted-foreground">
                Our employer plans add bulk CSV invites, course assignments,
                branded certificates and a live compliance dashboard — built for
                organisations from 5 to 5,000 people.
              </p>
            </div>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 flex-shrink-0">
              <Link to="/employer">
                See employer plans <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>
      <section className="container max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">
          Ready to start learning — for free?
        </h2>
        <p className="text-muted-foreground mb-6">
          All courses are 100% free. Pay only when you want your CPD-certified certificate of completion.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link to={startHref}>
            Start learning free <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </section>



      {/* Topics marquee (moved to footer) */}
      {topicsTrack.length > 0 && (
        <section
          id="topics-marquee"
          className="relative py-12 overflow-hidden border-t bg-[#F7F7F7] scroll-mt-24"
          aria-label="Browse first aid topics"
        >
          <div className="container max-w-6xl mx-auto px-4 mb-6 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Explore first aid topics
            </h2>
            <p className="text-sm text-muted-foreground">
              Quick-reference guides — every topic is free to study.
            </p>
          </div>
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
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#F7F7F7] to-transparent z-10" />
          <div className="flex topics-marquee-track gap-4 px-4">
            {topicsTrack.map((c, i) => {
              const isEager = i < 3;
              return (
              <Link
                key={`${c.id}-${i}`}
                to={`/topics/${c.slug}`}
                className="block group shrink-0 w-64"
              >
                <Card className="overflow-hidden rounded-2xl h-full hover:shadow-lg transition-shadow bg-card">
                  <div className="aspect-video bg-muted relative">
                    {c.cover_url ? (
                      <img
                        src={c.cover_url}
                        alt={c.title}
                        className="w-full h-full object-cover"
                        loading={isEager ? "eager" : "lazy"}
                        decoding="async"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <BookOpen className="h-12 w-12 text-primary/40" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 text-left">
                    <div className="flex gap-1.5 mb-2 flex-wrap">
                      <Badge variant="secondary" className="capitalize text-[10px]">
                        {c.level}
                      </Badge>
                      <Badge variant="outline" className="gap-1 text-[10px]">
                        <Clock className="h-3 w-3" />
                        {c.duration_minutes}m
                      </Badge>
                    </div>
                    <h3 className="font-display font-bold text-sm leading-snug group-hover:text-primary line-clamp-2">
                      {c.title}
                    </h3>
                  </div>
                </Card>
              </Link>
              );
            })}
          </div>
        </section>
      )}
      <NetworkFooter />
    </div>
  );
}
