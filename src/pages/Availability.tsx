import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Globe, ShieldCheck, CheckCircle2, Languages, Database } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import HamburgerMenu from "@/components/HamburgerMenu";
import NetworkFooter from "@/components/NetworkFooter";
import { useLanguage, languages as UI_LANGUAGES } from "@/contexts/LanguageContext";
import { localizedPath } from "@/lib/i18n";
import {
  COUNTRIES,
  COUNTRY_LANGUAGES_RANKED,
  emergencyNumberForCountry,
} from "@/lib/donations";
import { supabase } from "@/integrations/supabase/client";

type PackStatus = {
  locale_id: string;
  country_code: string;
  status: string;
  verified: boolean; // has crisis lines
};

export default function Availability() {
  const { language } = useLanguage();
  const [packs, setPacks] = useState<PackStatus[]>([]);

  useEffect(() => {
    (async () => {
      const { data: lps } = await supabase
        .from("locale_packs")
        .select("locale_id, country_code, status");
      const { data: cls } = await supabase
        .from("locale_crisis_lines")
        .select("locale_id");
      const withCrisis = new Set((cls ?? []).map((r) => r.locale_id));
      setPacks(
        (lps ?? []).map((p) => ({
          locale_id: p.locale_id,
          country_code: (p.country_code || "").toUpperCase(),
          status: p.status,
          verified: withCrisis.has(p.locale_id),
        })),
      );
    })();
  }, []);

  const publishedByCountry = useMemo(() => {
    const m = new Map<string, PackStatus>();
    for (const p of packs) {
      if (p.status === "published") m.set(p.country_code, p);
    }
    return m;
  }, [packs]);

  const verifiedCount = packs.filter((p) => p.verified).length;
  const publishedCount = packs.filter((p) => p.status === "published").length;

  // Sort countries alphabetically by name for the directory.
  const sortedCountries = useMemo(
    () => [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang={language}
        basePath="/availability"
        title="Availability · Countries, languages & locale packs"
        description="Directory of countries, UI languages and locale packs supported by First Aid Angel — including verified emergency numbers and crisis lines."
      />

      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link
            to={localizedPath(language, "/")}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            First Aid Angel
          </Link>
          <HamburgerMenu />
        </div>
      </header>

      <main className="flex-1 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-sm">
              <Globe className="h-7 w-7" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
              Availability
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Where First Aid Angel works
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A directory of countries, UI languages and locale packs we
              currently support — including which catalogs have hand-checked
              emergency numbers and crisis lines.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            <Stat value={COUNTRIES.length} label="Countries listed" />
            <Stat value={UI_LANGUAGES.length} label="UI languages" />
            <Stat value={verifiedCount} label="Verified catalogs" />
            <Stat value={publishedCount} label="Published locale packs" />
          </div>

          {/* Legend */}
          <section className="bg-card border border-border rounded-2xl p-5 mb-10 text-sm text-muted-foreground">
            <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <strong className="text-foreground">Verified</strong> = emergency
                numbers &amp; crisis lines hand-checked.
              </span>
              <span className="inline-flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <strong className="text-foreground">Published</strong> = locale
                pack live in the database.
              </span>
            </p>
          </section>

          {/* Languages */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Languages className="h-6 w-6 text-primary" />
              Supported UI languages
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {UI_LANGUAGES.map((l) => (
                <div
                  key={l.code}
                  className="bg-card border border-border rounded-xl p-3"
                >
                  <p className="font-semibold text-foreground leading-tight">
                    {l.nativeName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {l.name} · <span className="font-mono">{l.code}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Countries */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              Supported countries
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {sortedCountries.map((c) => {
                const pack = publishedByCountry.get(c.code);
                const number = emergencyNumberForCountry(c.code);
                const langs =
                  COUNTRY_LANGUAGES_RANKED[c.code] ?? ["en"];
                return (
                  <article
                    key={c.code}
                    className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2"
                  >
                    <header className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-2xl leading-none" aria-hidden>
                          {c.flag}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {c.name}
                          </h3>
                          <p className="text-xs text-muted-foreground font-mono">
                            {c.code}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`tel:${number}`}
                        className="shrink-0 inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs font-bold px-2.5 py-1"
                      >
                        {number}
                      </a>
                    </header>

                    <div className="flex flex-wrap gap-1.5">
                      {pack?.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold rounded-full bg-primary text-primary-foreground px-2 py-0.5">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      )}
                      {pack && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold rounded-full bg-foreground/10 text-foreground px-2 py-0.5">
                          <CheckCircle2 className="h-3 w-3" /> Published
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {langs.map((code) => (
                        <span
                          key={code}
                          className="text-[11px] font-mono rounded bg-muted text-muted-foreground px-1.5 py-0.5"
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <p className="text-xs text-muted-foreground mt-10 text-center">
            Don't see your country?{" "}
            <Link
              to={localizedPath(language, "/about")}
              className="text-primary font-semibold"
            >
              Get in touch
            </Link>{" "}
            — we're expanding locale packs continuously.
          </p>
        </div>
      </main>

      <NetworkFooter />
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 text-center">
      <p className="text-3xl font-bold text-primary leading-none">{value}</p>
      <p className="text-xs text-muted-foreground mt-2 leading-tight">{label}</p>
    </div>
  );
}
