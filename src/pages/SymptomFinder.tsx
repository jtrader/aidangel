import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Phone, AlertTriangle } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCountry } from "@/hooks/useCountry";
import { emergencyNumberForCountry } from "@/lib/donations";
import { localizedPath, SITE_ORIGIN, HREFLANG } from "@/lib/i18n";
import { getTopic } from "@/lib/kb";
import { SYMPTOM_LANDERS } from "@/data/symptomLanders";
import NetworkFooter from "@/components/NetworkFooter";
import LanguageSelector from "@/components/LanguageSelector";
import EmergencyCallButton from "@/components/EmergencyCallButton";

type Symptom = {
  label: string;
  slug: string;
  urgent?: boolean;
  keywords: string[];
};

const SYMPTOMS: Symptom[] = [
  { label: "Not breathing / no pulse", slug: "cpr", urgent: true, keywords: ["unresponsive", "collapsed", "no pulse", "cardiac arrest"] },
  { label: "Can't breathe / choking", slug: "choking", urgent: true, keywords: ["choke", "blocked airway", "can't speak"] },
  { label: "Severe allergic reaction", slug: "anaphylaxis", urgent: true, keywords: ["swelling", "epipen", "tongue", "throat"] },
  { label: "Heavy bleeding", slug: "bleeding", urgent: true, keywords: ["wound", "blood", "haemorrhage", "cut"] },
  { label: "Face drooping / slurred speech", slug: "stroke", urgent: true, keywords: ["fast", "weakness", "one side", "facial droop"] },
  { label: "Chest pain or pressure", slug: "heart-attack", urgent: true, keywords: ["heart", "angina", "tight chest", "arm pain"] },
  { label: "Snake bite", slug: "snake-bite", urgent: true, keywords: ["bitten", "snake", "fang"] },
  { label: "Spider bite", slug: "spider-bite", urgent: true, keywords: ["funnel web", "redback", "spider"] },
  { label: "Drowning / pulled from water", slug: "drowning", urgent: true, keywords: ["water", "submerged"] },
  { label: "Electric shock", slug: "electric-shock", urgent: true, keywords: ["electrocuted", "current"] },
  { label: "Seizure / fitting", slug: "seizures", keywords: ["epilepsy", "convulsion", "fit"] },
  { label: "Unconscious but breathing", slug: "recovery-position", keywords: ["passed out", "unresponsive breathing"] },
  { label: "Asthma attack", slug: "asthma", keywords: ["wheezing", "inhaler", "puffer"] },
  { label: "Burn or scald", slug: "burns", keywords: ["fire", "hot", "scald", "scalded"] },
  { label: "Suspected poisoning", slug: "poisoning", keywords: ["swallowed", "overdose", "chemical"] },
  { label: "Fainting / lightheaded", slug: "fainting", keywords: ["dizzy", "blackout"] },
  { label: "Diabetic emergency", slug: "diabetes", keywords: ["hypo", "low sugar", "insulin"] },
  { label: "Jellyfish or marine sting", slug: "jellyfish-stings", keywords: ["bluebottle", "stinger", "box jellyfish"] },
  { label: "Overheating / heat stroke", slug: "heat-illness", keywords: ["hot", "heat exhaustion", "dehydrated"] },
  { label: "Too cold / hypothermia", slug: "hypothermia", keywords: ["freezing", "cold"] },
  { label: "Suspected broken bone", slug: "fractures", keywords: ["fracture", "broken", "snap"] },
  { label: "Sprain or strain", slug: "sprains-strains", keywords: ["twisted", "ankle", "rolled"] },
  { label: "Head knock / concussion", slug: "head-injury", keywords: ["concussion", "hit head"] },
  { label: "Possible spinal injury", slug: "spinal-injury", keywords: ["neck", "back injury"] },
  { label: "Eye injury or chemical splash", slug: "eye-injuries", keywords: ["eye", "vision", "splash"] },
  { label: "Knocked-out tooth", slug: "dental-injury", keywords: ["tooth", "dental"] },
  { label: "Nosebleed", slug: "nosebleed", keywords: ["nose bleed", "epistaxis"] },
  { label: "Mild allergic reaction", slug: "allergic-reactions", keywords: ["hives", "rash", "itchy"] },
  { label: "Shock (pale, clammy, weak pulse)", slug: "shock", keywords: ["pale", "clammy"] },
  { label: "Sunburn", slug: "sunburn", keywords: ["sun"] },
  { label: "Dehydrated", slug: "dehydration", keywords: ["thirsty", "dry mouth"] },
];

const SymptomFinder = () => {
  const { language } = useLanguage();
  const { code: countryCode } = useCountry();
  const emergencyNumber = emergencyNumberForCountry(countryCode);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SYMPTOMS;
    return SYMPTOMS.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.includes(q) || q.includes(k)) ||
        s.slug.includes(q),
    );
  }, [query]);

  const urgentList = filtered.filter((s) => s.urgent);
  const otherList = filtered.filter((s) => !s.urgent);

  // Map KB slug → best matching long-tail lander (if any)
  const landerByKb = useMemo(() => {
    const m = new Map<string, string>();
    for (const l of SYMPTOM_LANDERS) {
      if (!m.has(l.kbSlug)) m.set(l.kbSlug, l.slug);
    }
    return m;
  }, []);
  const linkFor = (kbSlug: string) => {
    const lander = landerByKb.get(kbSlug);
    return lander ? `/symptoms/${lander}` : localizedPath(language, `/kb/${kbSlug}`);
  };

  const homePath = localizedPath(language, "/");
  const pageUrl = `${SITE_ORIGIN}/symptoms`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang={language}
        basePath="/symptoms"
        title="First aid by symptom — what to do right now · First Aid Angel"
        description="Find first aid steps fast by symptom: chest pain, severe bleeding, choking, stroke signs, allergic reaction, snake bite, burns and more. Australian First Aid 5th Edition."
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "First aid by symptom",
            url: pageUrl,
            inLanguage: HREFLANG[language],
            description: "Symptom-first directory routing to step-by-step Australian first aid guides.",
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: SYMPTOMS.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.label,
              url: `${SITE_ORIGIN}/kb/${s.slug}`,
            })),
          },
        ]}
      />
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link
            to={homePath}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            What's happening right now?
          </h1>
          <p className="text-muted-foreground mb-4">
            Tap the symptom that best matches the emergency for step-by-step first aid.
            For any life-threatening emergency, call{" "}
            <a href={`tel:${emergencyNumber}`} className="text-primary font-semibold underline">
              {emergencyNumber}
            </a>{" "}
            first.
          </p>

          <a
            href={`tel:${emergencyNumber}`}
            className="mb-6 flex items-center justify-center gap-2 rounded-2xl bg-destructive px-4 py-3 text-destructive-foreground font-bold text-base shadow-md hover:opacity-95 transition"
          >
            <Phone className="h-5 w-5" />
            Emergency — call {emergencyNumber}
          </a>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Type a symptom (e.g. bleeding, choking, chest pain)…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {urgentList.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-destructive mb-3 inline-flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Life-threatening — act fast
              </h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {urgentList.map((s) => {
                  const t = getTopic(s.slug, language) ?? getTopic(s.slug, "en");
                  return (
                    <li key={s.slug}>
                      <Link
                        to={linkFor(s.slug)}
                        className="block p-3 rounded-xl border-2 border-destructive/30 bg-destructive/5 hover:border-destructive transition-all"
                      >
                        <p className="font-semibold text-foreground text-sm">{s.label}</p>
                        {t && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{t.title}</p>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {otherList.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">
                Other symptoms
              </h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {otherList.map((s) => {
                  const t = getTopic(s.slug, language) ?? getTopic(s.slug, "en");
                  return (
                    <li key={s.slug}>
                      <Link
                        to={linkFor(s.slug)}
                        className="block p-3 rounded-xl border border-border bg-card hover:border-primary transition-all"
                      >
                        <p className="font-semibold text-foreground text-sm">{s.label}</p>
                        {t && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{t.title}</p>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No symptoms matched. Try the{" "}
              <Link to={localizedPath(language, "/kb")} className="text-primary underline font-semibold">
                full knowledge base
              </Link>
              .
            </p>
          )}
        </div>
      </main>

      <EmergencyCallButton />
      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
};

export default SymptomFinder;
