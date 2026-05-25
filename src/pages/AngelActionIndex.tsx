import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, Printer } from "lucide-react";
import { topicsByCategory, topicsFor } from "@/lib/kb";
import { SeoHead } from "@/components/SeoHead";
import { localizedPath } from "@/lib/i18n";
import NetworkFooter from "@/components/NetworkFooter";
import SupportUsBar from "@/components/SupportUsBar";
import { useLanguage } from "@/contexts/LanguageContext";
import EmergencyCallButton from "@/components/EmergencyCallButton";
import HamburgerMenu from "@/components/HamburgerMenu";

const AngelActionIndex = () => {
  const { language } = useLanguage();
  const byCategory = topicsByCategory(language);
  const all = topicsFor(language);
  const categories = Object.keys(byCategory);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang={language}
        basePath="/angel-action"
        title="Angel Action Cards · Printable First Aid PDFs"
        description={`Download free A4 printable first aid quick-reference cards for all ${all.length} topics — CPR, choking, anaphylaxis, bleeding, burns and more.`}
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
          <div className="flex items-center gap-2">
            <Link
              to={localizedPath(language, "/kb")}
              className="text-sm font-semibold text-primary hover:text-primary/80"
            >
              Knowledge base →
            </Link>
            <HamburgerMenu />
          </div>
        </div>
      </header>
      <SupportUsBar />

      <main className="flex-1 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-sm">
              <Printer className="h-7 w-7" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
              Angel Action Cards
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Printable first aid quick-reference PDFs
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Free A4 cards distilled from the First Aid Angel knowledge base. Print one for
              your fridge, first-aid kit, car glovebox or workplace noticeboard.
            </p>
          </div>

          {categories.map((cat) => (
            <section key={cat} className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-4 pl-3 border-l-4 border-primary">
                {cat}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {byCategory[cat].map((t) => (
                  <li key={t.slug}>
                    <div className="h-full flex items-start gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={localizedPath(language, `/kb/${t.slug}`)}
                          className="block font-semibold text-foreground text-sm hover:text-primary transition-colors"
                        >
                          {t.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {t.summary}
                        </p>
                        <a
                          href={`/angel-action/${t.slug}.pdf`}
                          download={`${t.slug}-angel-action.pdf`}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:bg-primary/90 transition-colors"
                          aria-label={`Download ${t.title} PDF`}
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <aside className="mt-8 p-5 rounded-2xl border border-border bg-card text-sm text-muted-foreground">
            <p className="text-foreground font-semibold mb-1">About these cards</p>
            <p>
              Adapted from the <em>St John Australian First Aid 5th Edition</em> and aligned with
              Australian Resuscitation Council guidelines. For learning and refresher use —
              in an emergency, call your local emergency number (000 in Australia).
            </p>
          </aside>
        </div>
      </main>

      <EmergencyCallButton />
      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
};

export default AngelActionIndex;
