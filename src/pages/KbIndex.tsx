import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { topicsByCategory, topics } from "@/lib/kb";
import { useSeo, SITE_URL } from "@/lib/seo";
import NetworkFooter from "@/components/NetworkFooter";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getCachedMeta,
  prefetchTopicListMeta,
  type TopicMetaTranslation,
} from "@/lib/kbTranslate";
import { translateStrings } from "@/lib/uiTranslate";

const STATIC_INDEX_STRINGS = [
  "Back to chat",
  "Knowledge base",
  "First Aid Angel",
  "First Aid Knowledge Base",
  "Plain-English first aid guides for everyday Australians, organised by topic and adapted from The St John of God First Aid Manual 5th Edition.",
  "In a real emergency, call 000 first. These guides are for learning and refresher use — not a substitute for professional medical care.",
  "Translating topics…",
  "Source:",
  "The St John of God First Aid Manual 5th Edition (AFA5).",
];

const KbIndex = () => {
  const grouped = useMemo(() => topicsByCategory(), []);
  const orderedCategories = useMemo(() => Object.keys(grouped).sort(), [grouped]);
  const { language } = useLanguage();
  const [metaMap, setMetaMap] = useState<Record<string, TopicMetaTranslation>>({});
  const [prefetching, setPrefetching] = useState(false);
  const [ui, setUi] = useState({
    backToChat: "Back to chat",
    knowledgeBase: "Knowledge base",
    appName: "First Aid Angel",
    pageTitle: "First Aid Knowledge Base",
    intro: "Plain-English first aid guides for everyday Australians, organised by topic and adapted from The St John of God First Aid Manual 5th Edition.",
    disclaimer: "In a real emergency, call 000 first. These guides are for learning and refresher use — not a substitute for professional medical care.",
    translating: "Translating topics…",
    sourceLabel: "Source:",
    sourceValue: "The St John of God First Aid Manual 5th Edition (AFA5).",
    categories: orderedCategories,
  });

  useEffect(() => {
    if (language === "en") {
      setUi({
        backToChat: "Back to chat",
        knowledgeBase: "Knowledge base",
        appName: "First Aid Angel",
        pageTitle: "First Aid Knowledge Base",
        intro: STATIC_INDEX_STRINGS[4],
        disclaimer: STATIC_INDEX_STRINGS[5],
        translating: STATIC_INDEX_STRINGS[6],
        sourceLabel: STATIC_INDEX_STRINGS[7],
        sourceValue: STATIC_INDEX_STRINGS[8],
        categories: orderedCategories,
      });
      return;
    }
    let cancelled = false;
    translateStrings(language, STATIC_INDEX_STRINGS).then((s) => {
      if (cancelled) return;
      translateStrings(language, orderedCategories).then((cats) => {
        if (cancelled) return;
        const catMap: Record<string, string> = {};
        orderedCategories.forEach((c, i) => { catMap[c] = cats[i] ?? c; });
        setUi({
          backToChat: s[2],
          knowledgeBase: s[1],
          appName: s[2],
          pageTitle: s[3],
          intro: s[4],
          disclaimer: s[5],
          translating: s[6],
          sourceLabel: s[7],
          sourceValue: s[8],
          categories: orderedCategories.map((c) => catMap[c] ?? c),
        });
      });
    });
    return () => { cancelled = true; };
  }, [language, orderedCategories]);

  useEffect(() => {
    if (language === "en") {
      setMetaMap({});
      return;
    }
    // Seed from cache immediately.
    const seeded: Record<string, TopicMetaTranslation> = {};
    for (const t of topics) {
      const m = getCachedMeta(t.slug, language);
      if (m) seeded[t.slug] = m;
    }
    setMetaMap(seeded);

    let cancelled = false;
    setPrefetching(true);
    prefetchTopicListMeta(
      language,
      topics.map((t) => ({ slug: t.slug, title: t.title, summary: t.summary }))
    )
      .then(() => {
        if (cancelled) return;
        const next: Record<string, TopicMetaTranslation> = {};
        for (const t of topics) {
          const m = getCachedMeta(t.slug, language);
          if (m) next[t.slug] = m;
        }
        setMetaMap(next);
      })
      .finally(() => {
        if (!cancelled) setPrefetching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [language]);

  const display = (slug: string, fallbackTitle: string, fallbackSummary: string) => {
    const m = metaMap[slug];
    return {
      title: m?.title ?? fallbackTitle,
      summary: m?.summary ?? fallbackSummary,
    };
  };

  useSeo({
    title: "First Aid Knowledge Base – quick-reference guides | First Aid Angel",
    description:
      "Free, plain-English first aid guides for Australia — CPR, choking, burns, bleeding, anaphylaxis and more. Adapted from The St John of God First Aid Manual 5th Edition.",
    canonical: `${SITE_URL}/kb`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "First Aid Knowledge Base",
      description:
        "Plain-English first aid guides for Australia, adapted from The St John of God First Aid Manual 5th Edition.",
      url: `${SITE_URL}/kb`,
      hasPart: topics.map((t) => ({
        "@type": "MedicalWebPage",
        name: t.title,
        url: `${SITE_URL}/kb/${t.slug}`,
        about: t.section,
      })),
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {ui.backToChat}
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <BookOpen className="h-4 w-4 text-primary" />
              {ui.knowledgeBase}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-3">
            <Link to="/" className="hover:text-foreground">{ui.appName}</Link>
            <span className="mx-1">/</span>
            <span className="text-foreground">{ui.knowledgeBase}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            {ui.pageTitle}
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mb-2">
            {ui.intro}
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mb-4">
            {ui.disclaimer}
          </p>

          {prefetching && language !== "en" && (
            <div className="mb-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              {ui.translating}
            </div>
          )}

          <div className="space-y-8">
            {orderedCategories.map((cat, catIdx) => (
              <section key={cat}>
                <h2 lang={language} className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                  {ui.categories[catIdx]}
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {grouped[cat].map((t) => {
                    const d = display(t.slug, t.title, t.summary);
                    return (
                      <li key={t.slug}>
                        <Link
                          to={`/kb/${t.slug}`}
                          className="block p-4 rounded-2xl border border-border bg-card hover:border-primary hover:shadow-sm transition-all"
                        >
                          <h3 lang={language} className="font-semibold text-foreground mb-1">{d.title}</h3>
                          <p lang={language} className="text-sm text-muted-foreground line-clamp-2">{d.summary}</p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-12 p-4 rounded-2xl border border-border bg-card text-sm text-muted-foreground">
            <p className="mb-1">
              <strong className="text-foreground">{ui.sourceLabel}</strong>{" "}
              {ui.sourceValue}
            </p>
          </div>
        </div>
      </main>

      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
};

export default KbIndex;
