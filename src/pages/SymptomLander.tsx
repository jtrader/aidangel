import { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Phone, AlertTriangle, BookOpen, ArrowRight, Check, X } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCountry } from "@/hooks/useCountry";
import { emergencyNumberForCountry } from "@/lib/donations";
import { localizedPath, SITE_ORIGIN, HREFLANG } from "@/lib/i18n";
import { getTopic } from "@/lib/kb";
import { SYMPTOM_LANDERS, getLanderBySlug } from "@/data/symptomLanders";
import NetworkFooter from "@/components/NetworkFooter";


const REVIEWED_BY = "First Aid Angel editorial team";
const DATE_MODIFIED = "2026-05-22";

const SymptomLander = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { code: countryCode } = useCountry();
  const emergencyNumber = emergencyNumberForCountry(countryCode);

  const lander = useMemo(() => getLanderBySlug(slug), [slug]);

  if (!lander) {
    return <Navigate to="/symptoms" replace />;
  }

  const kbTopic = getTopic(lander.kbSlug, language) ?? getTopic(lander.kbSlug, "en");
  const homePath = localizedPath(language, "/");
  const symptomsPath = "/symptoms";
  const kbPath = localizedPath(language, `/kb/${lander.kbSlug}`);
  const pageUrl = `${SITE_ORIGIN}/symptoms/${lander.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      name: lander.h1,
      url: pageUrl,
      inLanguage: HREFLANG[language],
      description: lander.description,
      datePublished: "2026-05-01",
      dateModified: DATE_MODIFIED,
      reviewedBy: { "@type": "Organization", name: REVIEWED_BY },
      about: kbTopic
        ? { "@type": "MedicalCondition", name: kbTopic.section || kbTopic.title }
        : undefined,
      audience: { "@type": "MedicalAudience", audienceType: "Patient" },
      mainEntityOfPage: pageUrl,
      citation: [
        { "@type": "CreativeWork", name: "St John Australian First Aid 5th Edition (St John Ambulance Australia)" },
        { "@type": "CreativeWork", name: "Australian Resuscitation Council Guidelines" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: lander.h1,
      description: lander.description,
      step: lander.quickSteps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: `Step ${i + 1}`,
        text: s,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: lander.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Symptoms", item: `${SITE_ORIGIN}/symptoms` },
        { "@type": "ListItem", position: 3, name: lander.h1, item: pageUrl },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang={language}
        basePath={`/symptoms/${lander.slug}`}
        title={lander.title}
        description={lander.description}
        jsonLd={jsonLd}
      />

      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link
            to={symptomsPath}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All symptoms
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-3">
            <Link to={homePath} className="hover:text-foreground">First Aid Angel</Link>
            <span className="mx-1">/</span>
            <Link to={symptomsPath} className="hover:text-foreground">Symptoms</Link>
            <span className="mx-1">/</span>
            <span className="text-foreground">{lander.h1}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            {lander.h1}
          </h1>
          <p className="text-base text-muted-foreground mb-5">{lander.intro}</p>

          {/* Emergency call CTA */}
          <a
            href={`tel:${emergencyNumber}`}
            className="mb-6 flex items-center justify-center gap-2 rounded-2xl bg-destructive px-4 py-3 text-destructive-foreground font-bold text-base shadow-md hover:opacity-95 transition"
          >
            <Phone className="h-5 w-5" />
            Emergency — call {emergencyNumber}
          </a>

          {/* When to call 000 */}
          <section
            aria-labelledby="when-to-call"
            className="mb-6 rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4"
          >
            <h2
              id="when-to-call"
              className="text-sm font-bold uppercase tracking-wider text-destructive mb-2 inline-flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" /> Call {emergencyNumber} right now if
            </h2>
            <ul className="space-y-1.5">
              {lander.callTriple.map((c, i) => (
                <li key={i} className="text-sm text-foreground flex gap-2">
                  <span className="text-destructive font-bold mt-0.5">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Quick steps */}
          <section aria-labelledby="quick-steps" className="mb-6">
            <h2 id="quick-steps" className="text-xl font-bold text-foreground mb-3">
              What to do — step by step
            </h2>
            <ol className="space-y-3">
              {lander.quickSteps.map((s, i) => (
                <li key={i} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed pt-0.5">{s}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Do NOT */}
          {lander.doNot && lander.doNot.length > 0 && (
            <section aria-labelledby="do-not" className="mb-6 rounded-2xl border border-border bg-muted/40 p-4">
              <h2 id="do-not" className="text-sm font-bold uppercase tracking-wider text-foreground mb-2">
                Do NOT
              </h2>
              <ul className="space-y-1.5">
                {lander.doNot.map((c, i) => (
                  <li key={i} className="text-sm text-foreground flex gap-2">
                    <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Open full KB guide */}
          {kbTopic && (
            <Link
              to={kbPath}
              className="mb-8 flex items-center justify-between gap-3 rounded-2xl border-2 border-primary/30 bg-primary/5 hover:border-primary p-4 transition"
            >
              <div className="flex gap-3 items-start">
                <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">Open the full guide: {kbTopic.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Detailed step-by-step procedure, illustrations, and audio reading in 48 languages.
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
            </Link>
          )}

          {/* FAQ */}
          <section aria-labelledby="faqs" className="mb-8">
            <h2 id="faqs" className="text-xl font-bold text-foreground mb-3">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {lander.faqs.map((f, i) => (
                <details key={i} className="rounded-xl border border-border bg-card p-4 group">
                  <summary className="font-semibold text-foreground cursor-pointer list-none flex items-start justify-between gap-3">
                    <span>{f.q}</span>
                    <span className="text-primary transition-transform group-open:rotate-90 flex-shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Related symptoms */}
          {lander.related.length > 0 && (
            <section aria-labelledby="related" className="mb-8">
              <h2 id="related" className="text-sm font-bold uppercase tracking-wider text-primary mb-3">
                Related emergencies
              </h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {lander.related
                  .map((s) => getLanderBySlug(s))
                  .filter((x): x is NonNullable<typeof x> => Boolean(x))
                  .map((r) => (
                    <li key={r.slug}>
                      <Link
                        to={`/symptoms/${r.slug}`}
                        className="block p-3 rounded-xl border border-border bg-card hover:border-primary transition-all"
                      >
                        <p className="font-semibold text-foreground text-sm">{r.h1.split(" — ")[0]}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{r.description}</p>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          )}

          {/* Trust footer */}
          <footer className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground space-y-1">
            <p className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" />
              Reviewed by {REVIEWED_BY}. Last updated {DATE_MODIFIED}.
            </p>
            <p>
              Source: St John Australian First Aid 5th Edition (St John Ambulance Australia) and
              Australian Resuscitation Council Guidelines. This is general information,
              not a substitute for professional medical care — in an emergency always call{" "}
              <a href={`tel:${emergencyNumber}`} className="underline text-primary font-semibold">
                {emergencyNumber}
              </a>
              .
            </p>
          </footer>
        </article>
      </main>

      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
};

export default SymptomLander;
