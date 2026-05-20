import { supabase } from "@/integrations/supabase/client";
import type { LanguageCode } from "@/contexts/LanguageContext";

export type TranslatedTopic = { title: string; summary: string; body: string };

const VERSION = "v1";

function cacheKey(slug: string, language: LanguageCode) {
  return `kb-tr:${VERSION}:${language}:${slug}`;
}

export async function translateTopic(
  slug: string,
  language: LanguageCode,
  source: TranslatedTopic
): Promise<TranslatedTopic> {
  if (language === "en") return source;

  const key = cacheKey(slug, language);
  try {
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached) as TranslatedTopic;
  } catch {
    // ignore
  }

  const { data, error } = await supabase.functions.invoke("translate-kb", {
    body: { language, ...source },
  });
  if (error || !data || (data as { error?: string }).error) {
    return source;
  }
  const result = data as TranslatedTopic;
  try {
    localStorage.setItem(key, JSON.stringify(result));
  } catch {
    // quota — ignore
  }
  return result;
}
