import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCachedTranslation, translateStrings } from "@/lib/uiTranslate";

/**
 * Auto-translate a static bag of English UI strings into the user's
 * currently-selected language via the existing translateStrings pipeline
 * (Lovable AI Gateway + localStorage cache).
 *
 * Returns an object with the same keys as the input. Each value is the
 * translated string, falling back to the original English while the network
 * round-trip resolves. For `en` it returns the input verbatim.
 *
 * Example:
 *   const tr = useUiStrings({ title: "My learning", empty: "No courses yet" });
 *   return <h1>{tr.title}</h1>;
 */
export function useUiStrings<T extends Record<string, string>>(strings: T): T {
  const { language } = useLanguage();

  // Snapshot input keys/values once per mount to keep referential stability.
  const initialRef = useRef(strings);
  const keys = Object.keys(initialRef.current) as (keyof T)[];
  const values = keys.map((k) => initialRef.current[k]);

  // Optimistic initial state: cached translations if available, else English.
  const compute = (lang: string): T => {
    const out = {} as Record<keyof T, string>;
    keys.forEach((k, i) => {
      const original = values[i];
      if (lang === "en") {
        out[k] = original;
      } else {
        out[k] = getCachedTranslation(lang, original) ?? original;
      }
    });
    return out as T;
  };

  const [translated, setTranslated] = useState<T>(() => compute(language));

  useEffect(() => {
    let cancelled = false;
    if (language === "en") {
      setTranslated(compute("en"));
      return;
    }
    // Seed with cache (or English) immediately so we never flash empty UI.
    setTranslated(compute(language));
    translateStrings(language, values).then((arr) => {
      if (cancelled) return;
      const next = {} as Record<keyof T, string>;
      keys.forEach((k, i) => {
        next[k] = arr[i] || values[i];
      });
      setTranslated(next as T);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return translated;
}
