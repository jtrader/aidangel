import { useState } from "react";
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
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SeoHead } from "@/components/SeoHead";
import CoursesHeader from "@/components/CoursesHeader";
import { TopicExplorerDialog } from "@/components/TopicExplorerDialog";

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

export default function PersonalMarketing() {
  const { user } = useAuth();
  const startHref = user ? "/programs" : "/auth?redirect=/programs";

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
        <div className="container max-w-6xl mx-auto px-4 py-20 text-center">
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
            <Button asChild size="lg" variant="outline">
              <Link to="/topics">Browse topics</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            One-off annual payment · No subscription traps · Cancel renewals
            anytime
          </p>
        </div>
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
