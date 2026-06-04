import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  ArrowRight,
  Users,
  ShieldAlert,
  ClipboardCheck,
  Building2,
  AlertTriangle,
  BookOpen,
  Volume2,
  Square,
  Phone,
  CheckCircle2,
  HardHat,
  Pickaxe,
  Factory,
  Tractor,
  Stethoscope,
  School,
  ShoppingBag,
  ChefHat,
  Truck,
  Briefcase,
  Siren,
  Plane,
  Waves,
  Film,
  FlaskConical,
  Zap,
  Ship,
  Recycle,
  Shield,
  Sparkles,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import NetworkFooter from "@/components/NetworkFooter";
import MentalHealthCallout from "@/components/MentalHealthCallout";
import { SeoHead } from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { getVertical, VERTICALS } from "@/data/workplaceVerticals";
import { speak, stopSpeaking, isSpeechSupported } from "@/lib/speech";

const ICONS: Record<string, React.ElementType> = {
  HardHat, Pickaxe, Factory, Tractor, Stethoscope, School, ShoppingBag,
  ChefHat, Truck, Briefcase, Siren, Plane, Waves, Film, FlaskConical,
  Zap, Ship, Recycle, Shield, Sparkles,
};

export default function WorkplaceVertical() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const vertical = slug ? getVertical(slug) : undefined;
  const [speaking, setSpeaking] = useState(false);

  if (!vertical) return <Navigate to="/workplace" replace />;

  const Icon = ICONS[vertical.icon] ?? Briefcase;

  const related = useMemo(
    () => VERTICALS.filter((v) => v.slug !== vertical.slug && v.category === vertical.category).slice(0, 3),
    [vertical],
  );

  const overviewText = `${vertical.title}. ${vertical.summary} Workforce: ${vertical.stats.workforce}. Risk level: ${vertical.stats.risk}. Required first aider ratio: ${vertical.stats.ratio}. Certification: ${vertical.stats.cert}. Most common scenarios include ${vertical.scenarios.slice(0, 5).join(", ")}.`;

  const handleListen = async () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    await speak(overviewText, { lang: "en-AU", rate: 1 });
    setSpeaking(false);
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: vertical.title,
      description: vertical.summary,
      mainEntityOfPage: `https://firstaidangel.org/workplace/${vertical.slug}`,
      about: vertical.category,
      keywords: vertical.keywords.join(", "),
      publisher: {
        "@type": "Organization",
        name: "First Aid Angel",
        url: "https://firstaidangel.org",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://firstaidangel.org/" },
        { "@type": "ListItem", position: 2, name: "Workplace", item: "https://firstaidangel.org/workplace" },
        { "@type": "ListItem", position: 3, name: vertical.shortTitle, item: `https://firstaidangel.org/workplace/${vertical.slug}` },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang={language}
        basePath={`/workplace/${vertical.slug}`}
        title={`${vertical.title} | First Aid Angel`}
        description={vertical.summary}
        ogImage={vertical.image}
        jsonLd={jsonLd}
      />
      <SiteHeader backTo="/workplace" backLabel="All workplace verticals" />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border">
          {vertical.image ? (
            <div className="relative h-56 md:h-80 overflow-hidden bg-muted">
              <img
                src={vertical.image}
                alt={vertical.title}
                width={1280}
                height={720}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>
          ) : (
            <div className={`h-40 md:h-56 bg-gradient-to-br ${vertical.gradient}`} aria-hidden />
          )}
          <div className="max-w-4xl mx-auto px-4 -mt-14 md:-mt-20 pb-8 relative">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className={`flex-shrink-0 rounded-xl bg-gradient-to-br ${vertical.gradient} p-3 text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {vertical.category}
                  </p>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
                    {vertical.title}
                  </h1>
                </div>
              </div>
              <p className="text-base text-muted-foreground">{vertical.summary}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {isSpeechSupported() && (
                  <Button onClick={handleListen} variant="outline" size="sm">
                    {speaking ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    {speaking ? "Stop" : "Listen to overview"}
                  </Button>
                )}
                <a href="tel:000">
                  <Button variant="destructive" size="sm">
                    <Phone className="h-4 w-4" />
                    Call Triple Zero (000)
                  </Button>
                </a>
                <Link to="/">
                  <Button size="sm">
                    Ask First Aid Angel
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats infographic */}
        <section className="border-b border-border bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="sr-only">Industry statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat icon={Users} label="Workforce" value={vertical.stats.workforce} />
              <Stat icon={ShieldAlert} label="Risk level" value={vertical.stats.risk} />
              <Stat icon={ClipboardCheck} label="First aider ratio" value={vertical.stats.ratio} />
              <Stat icon={Building2} label="Certification" value={vertical.stats.cert} />
            </div>
          </div>
        </section>

        {/* Scenarios */}
        <section className="border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-10">
            <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Most common injury scenarios
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Pre-empt the predictable. These are the scenarios you should be ready for in this industry.
            </p>
            <ul className="mt-5 grid sm:grid-cols-2 gap-2">
              {vertical.scenarios.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2 rounded-lg bg-card border border-border p-3 text-sm"
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Sectors (if any) */}
        {vertical.sectors && vertical.sectors.length > 0 && (
          <section className="border-b border-border bg-muted/20">
            <div className="max-w-4xl mx-auto px-4 py-10">
              <h2 className="font-display text-2xl font-bold text-foreground">Sector breakdown</h2>
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {vertical.sectors.map((s) => (
                  <div key={s.name} className="rounded-xl bg-card border border-border p-4">
                    <div className="font-display font-semibold text-foreground">{s.name}</div>
                    <p className="text-sm text-muted-foreground mt-1">{s.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sub-topics → KB deep links */}
        <section className="border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-10">
            <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Industry-specific first aid guides
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Tap a topic to jump straight to the step-by-step guidance.
            </p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {vertical.subTopics.map((t) => {
                const inner = (
                  <div className="rounded-xl border border-border bg-card p-4 h-full hover:border-primary transition-colors group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-medium text-foreground text-sm leading-snug">{t.title}</div>
                      {t.kb && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                      )}
                    </div>
                    {t.kb && (
                      <div className="text-xs text-primary mt-2 font-medium">Open guide →</div>
                    )}
                  </div>
                );
                return t.kb ? (
                  <Link key={t.title} to={`/kb/${t.kb}`}>{inner}</Link>
                ) : (
                  <div key={t.title}>{inner}</div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Unique value (if any) */}
        {vertical.unique && vertical.unique.length > 0 && (
          <section className="border-b border-border bg-muted/20">
            <div className="max-w-4xl mx-auto px-4 py-10">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Why First Aid Angel for this industry
              </h2>
              <ul className="mt-4 space-y-2">
                {vertical.unique.map((u) => (
                  <li key={u} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Mental Health First Aid — always shown, every vertical */}
        <section className="border-b border-border bg-muted/20">
          <div className="max-w-4xl mx-auto px-4 py-10">
            <MentalHealthCallout context={vertical.shortTitle.toLowerCase()} />
          </div>
        </section>

        {/* Related verticals */}
        {related.length > 0 && (
          <section className="border-b border-border">
            <div className="max-w-4xl mx-auto px-4 py-10">
              <h2 className="font-display text-2xl font-bold text-foreground">Related verticals</h2>
              <div className="mt-5 grid sm:grid-cols-3 gap-3">
                {related.map((v) => (
                  <Link
                    key={v.slug}
                    to={`/workplace/${v.slug}`}
                    className="group rounded-xl border border-border bg-card p-4 hover:border-primary transition-colors"
                  >
                    <div className="font-display font-semibold text-foreground group-hover:text-primary">
                      {v.shortTitle}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{v.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <NetworkFooter />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-card border border-border p-4">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-2 font-display text-base font-bold text-foreground leading-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
