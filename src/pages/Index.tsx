import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Heart,
  HandCoins,
  Home as HomeIcon,
  HeartPulse,
  Sparkles,
} from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { pillarMeta, type Pillar } from "@/data/programs";

const pillarIcons: Record<Pillar, React.ReactNode> = {
  immediate: <Sparkles className="h-5 w-5" />,
  financial: <HandCoins className="h-5 w-5" />,
  housing: <HomeIcon className="h-5 w-5" />,
  emotional: <HeartPulse className="h-5 w-5" />,
  business: <HandCoins className="h-5 w-5" />,
};

const pillarOrder: Pillar[] = ["immediate", "financial", "housing", "emotional"];

const Index = () => {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container max-w-4xl mx-auto px-4 pt-16 pb-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border shadow-glow mb-6">
            <Heart className="h-7 w-7 text-primary" fill="currentColor" />
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight">
            A warm light on the path to{" "}
            <span className="text-gradient-warm">recovery.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
            After a bushfire, flood or storm, finding the right help can feel impossible.
            Aid Angel gently guides you to the financial support and services you may be
            eligible for — in under five minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-opacity"
            >
              Start your relief path <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground font-semibold hover:bg-muted transition-colors"
            >
              Browse resources
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> No login required</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> Under 5 minutes</span>
            <span className="inline-flex items-center gap-1.5"><Heart className="h-4 w-4 text-primary" /> Free to use</span>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl">
            Help across every part of recovery
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            From the first night of safety to rebuilding your home and your livelihood.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillarOrder.map((key) => {
            const meta = pillarMeta[key];
            return (
              <div
                key={key}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
                >
                  {pillarIcons[key]}
                </div>
                <h3 className="font-display font-semibold text-lg">{meta.label}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">{meta.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* THREE STEPS */}
      <section className="container max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl">Three calm steps</h2>
          <p className="text-muted-foreground mt-3">
            No long forms. No jargon. One question at a time.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Tell us what happened",
              body: "Share a few simple details about the disaster and how it affected you.",
            },
            {
              n: "02",
              title: "We match the help",
              body: "Our matching engine identifies the support programs you may be eligible for.",
            },
            {
              n: "03",
              title: "Take the next step",
              body: "Get a clear, personalised action plan with direct links to apply.",
            },
          ].map((step) => (
            <div key={step.n} className="rounded-2xl border border-border bg-card p-6">
              <div className="text-xs font-semibold tracking-widest text-primary">{step.n}</div>
              <h3 className="font-display font-semibold text-lg mt-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display font-bold text-3xl sm:text-4xl">
          You don't have to navigate this alone.
        </h2>
        <p className="text-muted-foreground mt-3">Take a breath. Then take the first step.</p>
        <Link
          to="/assessment"
          className="inline-flex items-center gap-2 px-6 py-3 mt-7 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-opacity"
        >
          Begin assessment <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </SiteLayout>
  );
};

export default Index;
