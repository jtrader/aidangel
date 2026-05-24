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
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SeoHead } from "@/components/SeoHead";
import CoursesHeader from "@/components/CoursesHeader";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const TIERS = [
  {
    name: "Single Licence",
    price: "AU$25",
    unit: "/ licence / year",
    seats: "1 learner",
    popular: false,
    features: [
      "Full Australian First Aid 5th Ed. course library",
      "Interactive quizzes & progress tracking",
      "CPD-certified personal completion certificate",
      "Lifetime access to updates for the year",
    ],
  },
  {
    name: "Household 3-Pack",
    price: "AU$60",
    unit: "/ year",
    seats: "3 licences",
    popular: true,
    features: [
      "Everything in Single Licence",
      "Share with family or housemates",
      "Save $15 vs. individual licences",
      "Individual CPD-certified certificates for each learner",
    ],
  },
  {
    name: "Family 5-Pack",
    price: "AU$90",
    unit: "/ year",
    seats: "5 licences",
    popular: false,
    features: [
      "Everything in Household 3-Pack",
      "Ideal for larger families",
      "Save AU$35 vs. individual licences",
      "Priority email support",
    ],
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Learn at your own pace",
    body: "Bite-sized lessons covering CPR, choking, bleeding, burns and more. Pause and resume anytime, on any device.",
  },
  {
    icon: Award,
    title: "Earn a CPD-certified certificate",
    body: "Complete the course and quizzes to download a CPD-certified personal certificate of completion based on Australian First Aid 5th Edition.",
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

export default function PersonalMarketing() {
  const { user } = useAuth();
  const startHref = user ? "/programs" : "/auth?redirect=/programs";
  const [topics, setTopics] = useState<TopicCard[]>([]);

  useEffect(() => {
    supabase
      .from("courses")
      .select("id,slug,title,summary,cover_url,level,duration_minutes")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setTopics((data as TopicCard[]) ?? []));
  }, []);

  const marqueeTrack =
    topics.length > 0 ? [...topics, ...topics, ...topics] : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang="en"
        basePath="/personal"
        title="Personal First Aid Training Licences | First Aid Angel"
        description="Australian First Aid 5th Edition training for individuals and families. Personal licences from AU$25/year with certificates, quizzes and lifetime updates."
      />
      <CoursesHeader />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#F7F7F7] to-card border-b">
        <div className="container max-w-6xl mx-auto px-4 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <User className="h-4 w-4" /> First Aid Angel Training for Individuals
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
            First aid training,{" "}
            <span className="text-primary">from just $25</span>.
            <br />
            Learn the skills that save lives.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Self-paced Australian First Aid 5th Edition courses with quizzes, a
            personal certificate and tools like the Live CPR Guide and AED
            Finder — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to={startHref}>
                Start learning <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            One-off annual payment · No subscription traps · Cancel renewals
            anytime
          </p>
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
              {marqueeTrack.map((c, i) => (
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
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                          <BookOpen className="h-10 w-10 text-primary/40" />
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
              ))}
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
              Simple licence pricing
            </h2>
            <p className="text-muted-foreground">
              All prices in AUD. One annual payment, no hidden fees.
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
                  asChild
                  className="w-full"
                  variant={t.popular ? "default" : "outline"}
                >
                  <Link to={startHref}>Get started</Link>
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

      {/* Final CTA */}
      <section className="container max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">
          Ready to start learning?
        </h2>
        <p className="text-muted-foreground mb-6">
          Join thousands of Australians building life-saving skills with First
          Aid Angel.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link to={startHref}>
            Get your licence <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
