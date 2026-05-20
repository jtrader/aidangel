import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, BookOpen, Loader2, MessageCircle } from "lucide-react";
import { getTopic, getBody, topics } from "@/lib/kb";
import { useSeo, SITE_URL } from "@/lib/seo";
import NetworkFooter from "@/components/NetworkFooter";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateTopic } from "@/lib/kbTranslate";
import { translateStrings } from "@/lib/uiTranslate";

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
];

const KbTopic = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const topic = getTopic(slug);

  if (!topic) {
    return <Navigate to="/kb" replace />;
  }

  const body = getBody(slug);
  // Strip the first "# Title" — we render it as a real <h1> ourselves.
  const sourceBody = body.replace(/^#\s+.*\n+/, "");

  const { language } = useLanguage();
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
        category: topic.category,
      });
      return;
    }
    let cancelled = false;
    translateStrings(language, STATIC_TOPIC_STRINGS).then((s) => {
      if (cancelled) return;
      translateStrings(language, [topic.category]).then(([cat]) => {
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
          category: cat ?? topic.category,
        });
      });
    });
    return () => { cancelled = true; };
  }, [language, topic.category]);

  useEffect(() => {
    let cancelled = false;
    if (language === "en") {
      setTranslated({ title: topic.title, summary: topic.summary, body: sourceBody });
      return;
    }
    setTranslating(true);
    translateTopic(slug, language, {
      title: topic.title,
      summary: topic.summary,
      body: sourceBody,
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
  }, [slug, language, topic.title, topic.summary, sourceBody]);

  const related = topic.related
    .map((s) => topics.find((t) => t.slug === s))
    .filter((t): t is NonNullable<typeof t> => !!t);

  useSeo({
    title: `${topic.title} – First Aid Guide | First Aid Angel`,
    description: topic.summary,
    canonical: `${SITE_URL}/kb/${topic.slug}`,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: topic.title,
        description: topic.summary,
        url: `${SITE_URL}/kb/${topic.slug}`,
        about: { "@type": "MedicalCondition", name: topic.section },
        keywords: topic.keywords.join(", "),
        isPartOf: {
          "@type": "WebSite",
          name: "First Aid Angel",
          url: SITE_URL,
        },
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
          { "@type": "ListItem", position: 1, name: "First Aid Angel", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Knowledge base", item: `${SITE_URL}/kb` },
          { "@type": "ListItem", position: 3, name: topic.title, item: `${SITE_URL}/kb/${topic.slug}` },
        ],
      },
    ],
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link
            to="/kb"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {ui.allTopics}
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{ui.askAssistant}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-3">
            <Link to="/" className="hover:text-foreground">{ui.appName}</Link>
            <span className="mx-1">/</span>
            <Link to="/kb" className="hover:text-foreground">{ui.knowledgeBase}</Link>
            <span className="mx-1">/</span>
            <span className="text-foreground">{topic.title}</span>
          </nav>

          <p lang={language} className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
            {ui.category}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" lang={language}>
            {translated.title}
          </h1>
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
              {translated.body}
            </ReactMarkdown>
          </div>

          {related.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border">
              <h2 lang={language} className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
                {ui.relatedTopics}
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to={`/kb/${r.slug}`}
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
              {ui.emergencyNote.replace("000", "")}
              <a href="tel:000" className="text-primary font-semibold underline">000</a>
              {ui.emergencyNote.includes("000.") ? "." : ""}
            </p>
          </aside>
        </article>
      </main>

      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
};

export default KbTopic;
