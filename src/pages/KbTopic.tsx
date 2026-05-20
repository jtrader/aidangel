import { Link, useParams, Navigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, BookOpen, ExternalLink, MessageCircle } from "lucide-react";
import { getTopic, getBody, topics } from "@/lib/kb";
import { useSeo, SITE_URL } from "@/lib/seo";
import NetworkFooter from "@/components/NetworkFooter";

const KbTopic = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const topic = getTopic(slug);

  if (!topic) {
    return <Navigate to="/kb" replace />;
  }

  const body = getBody(slug);
  // Strip the first "# Title" — we render it as a real <h1> ourselves.
  const bodyWithoutTitle = body.replace(/^#\s+.*\n+/, "");

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
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/kb"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All topics
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80"
          >
            <MessageCircle className="h-4 w-4" />
            Ask the assistant
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-3">
            <Link to="/" className="hover:text-foreground">First Aid Angel</Link>
            <span className="mx-1">/</span>
            <Link to="/kb" className="hover:text-foreground">Knowledge base</Link>
            <span className="mx-1">/</span>
            <span className="text-foreground">{topic.title}</span>
          </nav>

          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
            {topic.category}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {topic.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {topic.summary}
          </p>

          <div className="prose prose-sm sm:prose-base max-w-none prose-headings:text-foreground prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3 prose-p:text-card-foreground prose-strong:text-foreground prose-li:text-card-foreground prose-ol:text-card-foreground prose-ul:text-card-foreground prose-a:text-primary prose-a:font-medium prose-a:underline">
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
              {bodyWithoutTitle}
            </ReactMarkdown>
          </div>

          {related.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
                Related topics
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
            <p className="text-foreground font-semibold mb-1 inline-flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-primary" />
              Source
            </p>
            <p className="text-muted-foreground mb-2">
              Adapted from <strong className="text-foreground">The St John of God First Aid Manual 5th Edition</strong>{" "}
              — section <em>{topic.section}</em>.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              In an emergency call <a href="tel:000" className="text-primary font-semibold underline">000</a>.
              These guides are for learning and refresher use — not a substitute for professional medical care.
            </p>
          </aside>
        </article>
      </main>

      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
};

export default KbTopic;
