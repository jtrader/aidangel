import { Link } from "react-router-dom";
import { Briefcase, ArrowRight, ShieldAlert, Users, ClipboardCheck } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import NetworkFooter from "@/components/NetworkFooter";
import MentalHealthCallout from "@/components/MentalHealthCallout";
import { SeoHead } from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { VERTICALS, VERTICALS_BY_TIER } from "@/data/workplaceVerticals";

const TIER_LABEL: Record<1 | 2 | 3, string> = {
  1: "Tier 1 — High-priority, high-risk verticals",
  2: "Tier 2 — Large workforce, standardised requirements",
  3: "Tier 3 — Specialised settings & smaller workforces",
};

export default function WorkplaceIndex() {
  const { language } = useLanguage();
  const totalScenarios = VERTICALS.reduce((n, v) => n + v.scenarios.length, 0);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Workplace First Aid by Industry",
      description:
        "Industry-specific first aid guidance for 20 Australian workplace verticals — construction, mining, healthcare, education, hospitality and more.",
      url: "https://firstaidangel.org/workplace",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: VERTICALS.map((v, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: v.shortTitle,
        url: `https://firstaidangel.org/workplace/${v.slug}`,
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang={language}
        basePath="/workplace"
        title="Workplace First Aid by Industry — 20 Australian Verticals | First Aid Angel"
        description="Industry-specific first aid guidance for 20 Australian workplace verticals — construction, mining, healthcare, childcare, hospitality, office and more. WHS-aligned."
        jsonLd={jsonLd}
      />
      <SiteHeader backTo="/" backLabel="Back to home" />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold mb-4">
              <Briefcase className="h-3.5 w-3.5" />
              Workplace first aid hub
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight text-foreground">
              First aid for every Australian workplace
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
              Twenty industry verticals, each with the WHS requirements, the most common injuries
              and the AI-guided first aid steps that match. Built around Australia's HLTAID
              certifications and the Australian First Aid 5th Edition.
            </p>

            {/* Stat infographic */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatTile icon={Briefcase} label="Industry verticals" value="20" />
              <StatTile icon={Users} label="Workers covered" value="10M+" />
              <StatTile icon={ShieldAlert} label="Injury scenarios" value={`${totalScenarios}+`} />
              <StatTile icon={ClipboardCheck} label="HLTAID certifications" value="011 · 012 · 013" />
            </div>
          </div>
        </section>

        {/* Tiers */}
        {([1, 2, 3] as const).map((tier) => (
          <section key={tier} className="border-b border-border">
            <div className="max-w-5xl mx-auto px-4 py-10">
              <h2 className="font-display text-2xl font-bold text-foreground">{TIER_LABEL[tier]}</h2>
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {VERTICALS_BY_TIER[tier].map((v) => (
                  <Link
                    key={v.slug}
                    to={`/workplace/${v.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary transition-all shadow-sm hover:shadow-md"
                  >
                    {v.image ? (
                      <div className="aspect-[16/9] overflow-hidden bg-muted">
                        <img
                          src={v.image}
                          alt={v.shortTitle}
                          loading="lazy"
                          width={1280}
                          height={720}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className={`aspect-[16/9] bg-gradient-to-br ${v.gradient}`} aria-hidden />
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display font-semibold text-foreground leading-tight">
                          {v.shortTitle}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{v.stats.workforce} · Risk: {v.stats.risk}</p>
                      <p className="text-sm text-foreground/80 mt-2 line-clamp-3">{v.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
        {/* Mental Health First Aid — cross-cutting across every vertical */}
        <section className="border-b border-border bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <MentalHealthCallout />
          </div>
        </section>
      </main>

      <NetworkFooter />
    </div>
  );
}

function StatTile({
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
      <div className="mt-2 font-display text-2xl font-bold text-foreground leading-none">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
