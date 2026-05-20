import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { topicsByCategory, topics } from "@/lib/kb";
import { useSeo, SITE_URL } from "@/lib/seo";
import NetworkFooter from "@/components/NetworkFooter";

const KbIndex = () => {
  const grouped = topicsByCategory();
  const orderedCategories = Object.keys(grouped).sort();

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
            Back to chat
          </Link>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            Knowledge base
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-3">
            <Link to="/" className="hover:text-foreground">First Aid Angel</Link>
            <span className="mx-1">/</span>
            <span className="text-foreground">Knowledge base</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            First Aid Knowledge Base
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mb-2">
            Plain-English first aid guides for everyday Australians, organised by topic
            and adapted from <strong className="text-foreground">The St John of God First Aid Manual 5th Edition</strong>.
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mb-8">
            In a real emergency, call <a href="tel:000" className="text-primary font-semibold underline">000</a>{" "}
            first. These guides are for learning and refresher use — not a substitute for professional medical care.
          </p>

          <div className="space-y-8">
            {orderedCategories.map((cat) => (
              <section key={cat}>
                <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                  {cat}
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {grouped[cat].map((t) => (
                    <li key={t.slug}>
                      <Link
                        to={`/kb/${t.slug}`}
                        className="block p-4 rounded-2xl border border-border bg-card hover:border-primary hover:shadow-sm transition-all"
                      >
                        <h3 className="font-semibold text-foreground mb-1">{t.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{t.summary}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-12 p-4 rounded-2xl border border-border bg-card text-sm text-muted-foreground">
            <p className="mb-1">
              <strong className="text-foreground">Source:</strong>{" "}
              The St John of God First Aid Manual 5th Edition (AFA5).
            </p>
          </div>
        </div>
      </main>

      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
};

export default KbIndex;
