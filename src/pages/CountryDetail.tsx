import { useEffect, useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  ShieldCheck,
  Languages,
  HeartPulse,
  Database,
  ExternalLink,
} from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import HamburgerMenu from "@/components/HamburgerMenu";
import NetworkFooter from "@/components/NetworkFooter";
import { useLanguage, languages as UI_LANGUAGES } from "@/contexts/LanguageContext";
import { localizedPath } from "@/lib/i18n";
import { COUNTRIES, COUNTRY_LANGUAGES_RANKED } from "@/lib/donations";
import { supabase } from "@/integrations/supabase/client";
import type {
  EmergencyContact,
  CrisisLine,
} from "@/lib/localePack";

type LocalePackRow = {
  locale_id: string;
  locale_name: string;
  country_code: string;
  status: string;
  primary_language: string | null;
  secondary_languages: string[] | null;
  timezone: string | null;
  currency: string | null;
  last_reviewed_at: string | null;
};

const SERVICE_LABELS: Record<string, string> = {
  primary: "Primary emergency",
  ambulance: "Ambulance",
  fire: "Fire",
  police: "Police",
  ses: "State emergency service",
  coastguard: "Coastguard",
  non_emergency_police: "Non-emergency police",
  non_emergency_health: "Health advice line",
  text_emergency: "Text emergency",
};

export default function CountryDetail() {
  const { language } = useLanguage();
  const { code } = useParams<{ code: string }>();
  const upper = (code ?? "").toUpperCase();
  const country = useMemo(
    () => COUNTRIES.find((c) => c.code === upper),
    [upper],
  );

  const [packs, setPacks] = useState<LocalePackRow[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [crisis, setCrisis] = useState<CrisisLine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!country) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: lps } = await supabase
        .from("locale_packs")
        .select(
          "locale_id, locale_name, country_code, status, primary_language, secondary_languages, timezone, currency, last_reviewed_at",
        )
        .eq("country_code", country.code)
        .eq("status", "published");

      const ids = (lps ?? []).map((p) => p.locale_id);
      const [{ data: ecs }, { data: cls }] = await Promise.all([
        ids.length
          ? supabase
              .from("locale_emergency_contacts")
              .select("*")
              .in("locale_id", ids)
              .order("service_type")
          : Promise.resolve({ data: [] as EmergencyContact[] }),
        ids.length
          ? supabase
              .from("locale_crisis_lines")
              .select("*")
              .in("locale_id", ids)
              .order("name")
          : Promise.resolve({ data: [] as CrisisLine[] }),
      ]);

      if (cancelled) return;
      setPacks((lps ?? []) as LocalePackRow[]);
      setContacts((ecs ?? []) as EmergencyContact[]);
      setCrisis((cls ?? []) as CrisisLine[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [country]);

  if (!country) {
    return <Navigate to={localizedPath(language, "/availability")} replace />;
  }

  const verified = contacts.length > 0 && crisis.length > 0;
  const rankedLangCodes = COUNTRY_LANGUAGES_RANKED[country.code] ?? ["en"];
  const supportedLangs = rankedLangCodes
    .map((c) => UI_LANGUAGES.find((l) => l.code === c))
    .filter(Boolean) as typeof UI_LANGUAGES;

  // Group emergency contacts by service_type, dedupe identical numbers.
  const groupedContacts = useMemo(() => {
    const map = new Map<string, EmergencyContact[]>();
    for (const c of contacts) {
      if (!map.has(c.service_type)) map.set(c.service_type, []);
      map.get(c.service_type)!.push(c);
    }
    return Array.from(map.entries());
  }, [contacts]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang={language}
        basePath={`/availability/${country.code.toLowerCase()}`}
        title={`${country.name} · First Aid Angel availability`}
        description={`Emergency numbers, crisis lines and supported languages in ${country.name}.`}
      />

      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link
            to={localizedPath(language, "/availability")}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All countries
          </Link>
          <HamburgerMenu />
        </div>
      </header>

      <main className="flex-1 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-8 flex items-start gap-5">
            <span className="text-5xl sm:text-6xl leading-none" aria-hidden>
              {country.flag}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                Country profile
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                {country.name}
              </h1>
              <p className="text-sm text-muted-foreground font-mono mb-3">
                ISO {country.code}
              </p>
              <div className="flex flex-wrap gap-2">
                {verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground px-2.5 py-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified catalog
                  </span>
                )}
                {packs.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full bg-foreground/10 text-foreground px-2.5 py-1">
                    <Database className="h-3.5 w-3.5" /> Locale pack published
                  </span>
                )}
              </div>
            </div>
          </div>

          {loading && (
            <p className="text-sm text-muted-foreground text-center py-10">
              Loading country data…
            </p>
          )}

          {!loading && packs.length === 0 && (
            <section className="bg-card border border-border rounded-2xl p-6 mb-8 text-sm text-muted-foreground">
              <p>
                We don't yet have a verified locale pack for{" "}
                <strong className="text-foreground">{country.name}</strong>. The
                app still works here using fallback content, but emergency numbers
                and crisis lines below come from our general international guidance.
              </p>
            </section>
          )}

          {/* Emergency numbers */}
          {groupedContacts.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Phone className="h-6 w-6 text-primary" />
                Emergency numbers
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {groupedContacts.map(([type, list]) => (
                  <div
                    key={type}
                    className="bg-card border border-border rounded-xl p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      {SERVICE_LABELS[type] ?? type}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {list.map((c) => (
                        <a
                          key={c.id}
                          href={`tel:${c.number}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold px-3 py-1.5 hover:bg-primary/20 transition-colors"
                        >
                          {c.number}
                        </a>
                      ))}
                    </div>
                    {list[0]?.label && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {list[0].label}
                      </p>
                    )}
                    {list[0]?.notes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {list[0].notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Crisis lines */}
          {crisis.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <HeartPulse className="h-6 w-6 text-primary" />
                Crisis & support lines
              </h2>
              <ul className="grid gap-3">
                {crisis.map((line) => (
                  <li
                    key={line.id}
                    className="bg-card border border-border rounded-xl p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground">
                          {line.name}
                        </h3>
                        {line.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {line.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                          {line.audience && <span>For: {line.audience}</span>}
                          {line.availability && <span>{line.availability}</span>}
                          {line.cost && <span>Cost: {line.cost}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {line.phone && (
                          <a
                            href={`tel:${line.phone}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold px-3 py-1.5 hover:bg-primary/20 transition-colors"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {line.phone}
                          </a>
                        )}
                        {line.url && (
                          <a
                            href={line.url}
                            target="_blank"
                            rel="noopener"
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                          >
                            Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Locale packs */}
          {packs.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Database className="h-6 w-6 text-primary" />
                Locale packs
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {packs.map((p) => (
                  <div
                    key={p.locale_id}
                    className="bg-card border border-border rounded-xl p-4"
                  >
                    <p className="font-semibold text-foreground">
                      {p.locale_name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {p.locale_id}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                      {p.primary_language && (
                        <span>Primary: {p.primary_language}</span>
                      )}
                      {p.currency && <span>Currency: {p.currency}</span>}
                      {p.timezone && <span>TZ: {p.timezone}</span>}
                    </div>
                    {p.last_reviewed_at && (
                      <p className="text-[11px] text-muted-foreground mt-2">
                        Last reviewed{" "}
                        {new Date(p.last_reviewed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Supported languages */}
          <section className="mb-4">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Languages className="h-6 w-6 text-primary" />
              Supported UI languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {supportedLangs.map((l) => (
                <span
                  key={l.code}
                  className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border text-sm text-foreground px-3 py-1.5"
                >
                  <span className="font-semibold">{l.nativeName}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {l.code}
                  </span>
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>

      <NetworkFooter />
    </div>
  );
}
