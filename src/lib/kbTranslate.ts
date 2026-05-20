import { supabase } from "@/integrations/supabase/client";
import type { LanguageCode } from "@/contexts/LanguageContext";

export type TranslatedTopic = { title: string; summary: string; body: string };
export type TopicMetaTranslation = { title: string; summary: string };

const VERSION = "v1";

function fullKey(slug: string, language: LanguageCode) {
  return `kb-tr:${VERSION}:${language}:${slug}`;
}
function metaKey(slug: string, language: LanguageCode) {
  return `kb-tr-meta:${VERSION}:${language}:${slug}`;
}

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota — ignore
  }
}

/** Translate a single topic (title + summary + body). Falls back to source on error. */
export async function translateTopic(
  slug: string,
  language: LanguageCode,
  source: TranslatedTopic
): Promise<TranslatedTopic> {
  if (language === "en") return source;

  const cached = readCache<TranslatedTopic>(fullKey(slug, language));
  if (cached) return cached;

  const { data, error } = await supabase.functions.invoke("translate-kb", {
    body: { language, ...source },
  });
  if (error || !data || (data as { error?: string }).error) return source;
  const result = data as TranslatedTopic;
  writeCache(fullKey(slug, language), result);
  // Also seed the meta cache so the list page is instant.
  writeCache(metaKey(slug, language), { title: result.title, summary: result.summary });
  return result;
}

/** Read cached title+summary for a topic in the given language, if present. */
export function getCachedMeta(
  slug: string,
  language: LanguageCode
): TopicMetaTranslation | null {
  if (language === "en") return null;
  const meta = readCache<TopicMetaTranslation>(metaKey(slug, language));
  if (meta) return meta;
  // Fall back to a full translation cache hit.
  const full = readCache<TranslatedTopic>(fullKey(slug, language));
  return full ? { title: full.title, summary: full.summary } : null;
}

/**
 * Prefetch title+summary translations for many topics in a single batch call.
 * Skips items already cached. Safe to call repeatedly.
 */
export async function prefetchTopicListMeta(
  language: LanguageCode,
  topics: Array<{ slug: string; title: string; summary: string }>
): Promise<void> {
  if (language === "en") return;
  const missing = topics.filter((t) => !getCachedMeta(t.slug, language));
  if (missing.length === 0) return;

  // Chunk to keep individual AI calls reasonable.
  const CHUNK = 12;
  for (let i = 0; i < missing.length; i += CHUNK) {
    const slice = missing.slice(i, i + CHUNK);
    const { data, error } = await supabase.functions.invoke("translate-kb", {
      body: { language, items: slice },
    });
    if (error || !data) continue;
    const items = (data as { items?: Array<{ slug: string; title: string; summary: string }> }).items;
    if (!Array.isArray(items)) continue;
    for (const it of items) {
      if (it?.slug && it.title && it.summary) {
        writeCache(metaKey(it.slug, language), { title: it.title, summary: it.summary });
      }
    }
  }
}
