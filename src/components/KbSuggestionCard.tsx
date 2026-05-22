import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { getTopic } from "@/lib/kb";
import { localizedPath } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateStrings } from "@/lib/uiTranslate";

interface Props {
  slug: string;
  /** When true, frames the card as an emergency-priority link. */
  urgent?: boolean;
}

const KbSuggestionCard = ({ slug, urgent = false }: Props) => {
  const { language } = useLanguage();
  const topic = getTopic(slug, language) ?? getTopic(slug, "en");
  const [labels, setLabels] = useState({
    open: "Open full guide",
    urgent: "Emergency: open step-by-step guide",
  });

  useEffect(() => {
    if (language === "en") return;
    let cancelled = false;
    translateStrings(language, [
      "Open full guide",
      "Emergency: open step-by-step guide",
    ]).then((s) => {
      if (!cancelled) setLabels({ open: s[0], urgent: s[1] });
    });
    return () => { cancelled = true; };
  }, [language]);

  if (!topic) return null;

  const href = localizedPath(language, `/kb/${topic.slug}`);
  const cta = urgent ? labels.urgent : labels.open;

  return (
    <Link
      to={href}
      className={`ml-11 mt-2 flex items-start gap-3 rounded-2xl border p-3 transition-all hover:shadow-md ${
        urgent
          ? "border-destructive/40 bg-destructive/5 hover:border-destructive"
          : "border-primary/30 bg-primary/5 hover:border-primary"
      }`}
    >
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
          urgent ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"
        }`}
      >
        <BookOpen className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[11px] font-bold uppercase tracking-wider ${urgent ? "text-destructive" : "text-primary"}`}>
          {cta}
        </p>
        <p lang={language} className="text-sm font-semibold text-foreground leading-tight mt-0.5 truncate">
          {topic.title}
        </p>
        <p lang={language} className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
          {topic.summary}
        </p>
      </div>
      <ArrowRight className={`h-4 w-4 flex-shrink-0 mt-1 ${urgent ? "text-destructive" : "text-primary"}`} />
    </Link>
  );
};

export default KbSuggestionCard;
