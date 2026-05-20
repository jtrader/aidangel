import { supabase } from "@/integrations/supabase/client";

const CACHE_PREFIX = "ui-tr:v1:";
const key = (lang: string, text: string) => `${CACHE_PREFIX}${lang}:${text}`;

export function getCachedTranslation(lang: string, text: string): string | null {
  if (lang === "en") return text;
  try {
    return localStorage.getItem(key(lang, text));
  } catch {
    return null;
  }
}

function setCached(lang: string, text: string, value: string) {
  try {
    localStorage.setItem(key(lang, text), value);
  } catch {
    /* ignore quota errors */
  }
}

/**
 * Translate an array of short UI strings to the selected language.
 * Returns strings in the same order, falling back to the original on failure.
 * Results are cached in localStorage per (language, text).
 */
export async function translateStrings(
  lang: string,
  texts: string[],
): Promise<string[]> {
  if (!texts.length) return [];
  if (lang === "en") return texts.slice();

  const result = new Array<string>(texts.length);
  const missingIdx: number[] = [];
  const missingTexts: string[] = [];

  texts.forEach((t, i) => {
    const cached = getCachedTranslation(lang, t);
    if (cached !== null) {
      result[i] = cached;
    } else {
      missingIdx.push(i);
      missingTexts.push(t);
    }
  });

  if (missingTexts.length === 0) return result;

  // Deduplicate to keep payload small.
  const uniq = Array.from(new Set(missingTexts));
  const chunkSize = 30;

  for (let i = 0; i < uniq.length; i += chunkSize) {
    const slice = uniq.slice(i, i + chunkSize);
    try {
      const { data, error } = await supabase.functions.invoke("translate-ui", {
        body: { language: lang, texts: slice },
      });
      if (error) throw error;
      const translations: string[] =
        (data as { translations?: string[] } | null)?.translations ?? slice;
      translations.forEach((tr, k) => {
        const value = tr || slice[k];
        setCached(lang, slice[k], value);
      });
    } catch {
      // Cache the original so we don't retry forever this session.
      slice.forEach((s) => setCached(lang, s, s));
    }
  }

  // Re-read from cache for everything missing.
  missingIdx.forEach((origIdx, k) => {
    const original = missingTexts[k];
    result[origIdx] =
      getCachedTranslation(lang, original) ?? original;
  });

  return result;
}
