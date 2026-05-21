// Reads the :lang param from the URL and syncs it into LanguageContext.
// Mount inside <Routes> for any localized route.
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { isLangSegment, LANGS } from "@/lib/i18n";

export function LangParamSync({ fallback = "en" }: { fallback?: "en" }) {
  const { lang } = useParams<{ lang?: string }>();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const next = lang && (LANGS as string[]).includes(lang) ? lang : fallback;
    if (next !== language) setLanguage(next as typeof language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return null;
}

export { isLangSegment };
