import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, BookOpen, Loader2, MessageCircle } from "lucide-react";
import { getTopic, getBody, topicsFor, relatedSlugs, autoLinkBody } from "@/lib/kb";
import { SeoHead } from "@/components/SeoHead";
import { canonicalUrl, HREFLANG, localizedPath, SITE_ORIGIN } from "@/lib/i18n";
import NetworkFooter from "@/components/NetworkFooter";
import SupportUsBar from "@/components/SupportUsBar";
import LanguageSelector from "@/components/LanguageSelector";

import { useLanguage } from "@/contexts/LanguageContext";
import { useCountry } from "@/hooks/useCountry";
import { emergencyNumberForCountry } from "@/lib/donations";
import { translateTopic } from "@/lib/kbTranslate";
import { translateStrings } from "@/lib/uiTranslate";
import { buildHowToJsonLd, buildFaqJsonLd } from "@/lib/kbSchema";
import { qaFor } from "@/data/kbQa";

const STATIC_TOPIC_STRINGS = [
  "All topics",
  "Ask the assistant",
  "First Aid Angel",
  "Knowledge base",
  "Translating…",
  "Related topics",
  "Source",
  "Adapted from The St John of God First Aid Manual 5th Edition — section",
  "In an emergency call 000. These guides are for learning and refresher use — not a substitute for professional medical care.",
  "Questions & answers",
];

const KbTopic = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { code: countryCode } = useCountry();
  const emergencyNumber = emergencyNumberForCountry(countryCode);
  const topicEn = getTopic(slug, "en");

  if (!topicEn) {
    return <Navigate to="/kb" replace />;
  }

  // Localized topic metadata + body (from static files when available)
  const topic = getTopic(slug, language) ?? topicEn;
  const rawBody = getBody(slug, language);
  // Strip the first "# Title" — we render it as a real <h1> ourselves.
  const sourceBody = rawBody.replace(/^#\s+.*\n+/, "");
  // Is the body in the selected language already? (true if it differs from English or English is selected)
  const hasStaticBody = language === "en" || rawBody !== getBody(slug, "en");

  const [translated, setTranslated] = useState<{ title: string; summary: string; body: string }>({
    title: topic.title,
    summary: topic.summary,
    body: sourceBody,
  });
  const [translating, setTranslating] = useState(false);
  const [ui, setUi] = useState({
    allTopics: "All topics",
    askAssistant: "Ask the assistant",
    appName: "First Aid Angel",
    knowledgeBase: "Knowledge base",
    translating: "Translating…",
    relatedTopics: "Related topics",
    source: "Source",
    adaptedFrom: "Adapted from The St John of God First Aid Manual 5th Edition — section",
    emergencyNote: "In an emergency call 000. These guides are for learning and refresher use — not a substitute for professional medical care.",
    qaHeading: "Questions & answers",
    category: topic.category,
  });

  useEffect(() => {
    if (language === "en") {
      setUi({
        allTopics: "All topics",
        askAssistant: "Ask the assistant",
        appName: "First Aid Angel",
        knowledgeBase: "Knowledge base",
        translating: "Translating…",
        relatedTopics: "Related topics",
        source: "Source",
        adaptedFrom: STATIC_TOPIC_STRINGS[7],
        emergencyNote: STATIC_TOPIC_STRINGS[8],
        qaHeading: STATIC_TOPIC_STRINGS[9],
        category: topic.category,
      });
      return;
    }
    let cancelled = false;
    translateStrings(language, STATIC_TOPIC_STRINGS).then((s) => {
      if (cancelled) return;
      setUi({
        allTopics: s[0],
        askAssistant: s[1],
        appName: s[2],
        knowledgeBase: s[3],
        translating: s[4],
        relatedTopics: s[5],
        source: s[6],
        adaptedFrom: s[7],
        emergencyNote: s[8],
        qaHeading: s[9],
        category: topic.category, // already comes from per-lang meta when available
      });
    });
    return () => { cancelled = true; };
  }, [language, topic.category]);

  // Body: prefer static file; only call the AI fallback if no per-lang file exists.
  useEffect(() => {
    let cancelled = false;
    if (language === "en" || hasStaticBody) {
      setTranslated({ title: topic.title, summary: topic.summary, body: sourceBody });
      setTranslating(false);
      return;
    }
    setTranslating(true);
    translateTopic(slug, language, {
      title: topicEn.title,
      summary: topicEn.summary,
      body: getBody(slug, "en").replace(/^#\s+.*\n+/, ""),
    })
      .then((res) => {
        if (!cancelled) setTranslated(res);
      })
      .finally(() => {
        if (!cancelled) setTranslating(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, language, hasStaticBody, sourceBody, topic.title, topic.summary, topicEn.title, topicEn.summary]);

  const enTopics = topicsFor("en");
  const localTopics = topicsFor(language);
  const related = relatedSlugs(topicEn.slug, 6)
    .map((s) => localTopics.find((t) => t.slug === s) ?? enTopics.find((t) => t.slug === s))
    .filter((t): t is NonNullable<typeof t> => !!t);

  // Curated Q&A (English source) — translated on demand for non-English languages.
  const baseQa = qaFor(topicEn.slug);
  const [qa, setQa] = useState(baseQa);
  useEffect(() => {
    if (language === "en" || baseQa.length === 0) {
      setQa(baseQa);
      return;
    }
    let cancelled = false;
    const flat = baseQa.flatMap((item) => [item.q, item.a]);
    translateStrings(language, flat).then((s) => {
      if (cancelled) return;
      const out = baseQa.map((_, i) => ({ q: s[i * 2], a: s[i * 2 + 1] }));
      setQa(out);
    });
    return () => { cancelled = true; };
  }, [language, slug]);

  const linkedBody = autoLinkBody(
    translated.body,
    topicEn.slug,
    language,
    (s) => localizedPath(language, `/kb/${s}`),
  );

  const kbPath = localizedPath(language, "/kb");
  const homePath = localizedPath(language, "/");
  const topicPath = localizedPath(language, `/kb/${topic.slug}`);



  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang={language}
        basePath={`/kb/${topic.slug}`}
        title={`${translated.title} · First Aid Angel`}
        description={translated.summary}
        jsonLd={(() => {
          const inLanguage = HREFLANG[language];
          const topicUrl = `${SITE_ORIGIN}${topicPath}`;
          const schemas: Array<Record<string, unknown>> = [
            {
              "@context": "https://schema.org",
              "@type": "MedicalWebPage",
              name: translated.title,
              description: translated.summary,
              url: topicUrl,
              inLanguage,
              about: { "@type": "MedicalCondition", name: topicEn.section },
              keywords: topicEn.keywords.join(", "),
              isPartOf: { "@type": "WebSite", name: "First Aid Angel", url: SITE_ORIGIN },
              citation: {
                "@type": "Book",
                name: "The St John of God First Aid Manual 5th Edition",
                author: "St John of God",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: ui.appName, item: `${SITE_ORIGIN}${homePath}` },
                { "@type": "ListItem", position: 2, name: ui.knowledgeBase, item: `${SITE_ORIGIN}${kbPath}` },
                { "@type": "ListItem", position: 3, name: translated.title, item: topicUrl },
              ],
            },
          ];
          const howTo = buildHowToJsonLd({
            title: translated.title,
            description: translated.summary,
            url: topicUrl,
            body: translated.body,
            inLanguage,
          });
          if (howTo) schemas.push(howTo);
          const faq = buildFaqJsonLd({ body: translated.body, inLanguage });
          // Merge curated Q&A into the FAQPage schema (or build one if body didn't have any).
          if (qa.length > 0) {
            const curated = qa.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            }));
            if (faq) {
              const existing = (faq.mainEntity as Array<Record<string, unknown>>) || [];
              faq.mainEntity = [...existing, ...curated];
              schemas.push(faq);
            } else {
              schemas.push({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                inLanguage,
                mainEntity: curated,
              });
            }
          } else if (faq) {
            schemas.push(faq);
          }
          return schemas;
        })()}
      />
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link
            to={kbPath}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {ui.allTopics}
          </Link>
          <Link
            to={homePath}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{ui.askAssistant}</span>
            <span className="sr-only sm:hidden">{ui.askAssistant}</span>
          </Link>
        </div>
      </header>
      <SupportUsBar />

      <main className="flex-1 px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-3">
            <Link to={homePath} className="hover:text-foreground">{ui.appName}</Link>
            <span className="mx-1">/</span>
            <Link to={kbPath} className="hover:text-foreground">{ui.knowledgeBase}</Link>
            <span className="mx-1">/</span>
            <span className="text-foreground">{translated.title}</span>
          </nav>


          <p lang={language} className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
            {ui.category}
          </p>
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground" lang={language}>
              {translated.title}
            </h1>
            <LanguageSelector />
          </div>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed" lang={language}>
            {translated.summary}
          </p>

          {translating && (
            <div className="mb-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              {ui.translating}
            </div>
          )}

          <div lang={language} className="prose prose-sm sm:prose-base max-w-none prose-headings:text-foreground prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3 prose-p:text-card-foreground prose-strong:text-foreground prose-li:text-card-foreground prose-ol:text-card-foreground prose-ul:text-card-foreground prose-a:text-primary prose-a:font-medium prose-a:underline">
            <ReactMarkdown
              components={{
                a: ({ href, children, ...props }) => {
                  if (href?.startsWith("/")) {
                    return (
                      <Link to={href} className="text-primary font-medium underline hover:text-foreground transition-colors">
                        {children}
                      </Link>
                    );
                  }
                  return (
                    <a
                      href={href}
                      target={href?.startsWith("http") ? "_blank" : undefined}
                      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-primary font-medium underline hover:text-foreground transition-colors"
                      {...props}
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {linkedBody}
            </ReactMarkdown>
          </div>

          {qa.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border">
              <h2 lang={language} className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
                {ui.qaHeading}
              </h2>
              <div className="space-y-3">
                {qa.map((item, idx) => (
                  <details
                    key={idx}
                    className="group rounded-xl border border-border bg-card p-4 open:border-primary/40 transition-colors"
                  >
                    <summary
                      lang={language}
                      className="cursor-pointer list-none font-semibold text-foreground text-sm sm:text-base flex items-start justify-between gap-3"
                    >
                      <span>{item.q}</span>
                      <span
                        aria-hidden="true"
                        className="mt-1 inline-block text-primary transition-transform group-open:rotate-45 leading-none text-lg"
                      >
                        +
                      </span>
                    </summary>
                    <p lang={language} className="mt-3 text-sm text-card-foreground leading-relaxed">
                      {item.a.split(/(\b000\b)/g).map((part, i) =>
                        part === "000" ? (
                          <a key={i} href={`tel:${emergencyNumber}`} className="text-primary font-semibold underline">
                            {emergencyNumber}
                          </a>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border">
              <h2 lang={language} className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
                {ui.relatedTopics}
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to={localizedPath(language, `/kb/${r.slug}`)}
                      className="block p-3 rounded-xl border border-border bg-card hover:border-primary transition-all"
                    >
                      <h3 className="font-semibold text-foreground text-sm">{r.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.summary}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <aside className="mt-12 p-4 rounded-2xl border border-border bg-card text-sm">
            <p lang={language} className="text-foreground font-semibold mb-1 inline-flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-primary" />
              {ui.source}
            </p>
            <p lang={language} className="text-muted-foreground mb-2">
              {ui.adaptedFrom} <em>{topic.section}</em>.
            </p>
            <p lang={language} className="text-xs text-muted-foreground mt-3">
              {ui.emergencyNote.replace(/\b000\b/g, emergencyNumber).split(emergencyNumber).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <a href={`tel:${emergencyNumber}`} className="text-primary font-semibold underline">{emergencyNumber}</a>
                  )}
                </span>
              ))}
            </p>
          </aside>
        </article>
      </main>

      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
};

export default KbTopic;
