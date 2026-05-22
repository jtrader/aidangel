// ElevenLabs voice-over helper for the Live CPR Guide.
// Fetches MP3 audio from the cpr-tts edge function, caches blob URLs by
// (lang, phrase) key, and plays them through a single shared <audio> element.

import { supabase } from "@/integrations/supabase/client";
import { CPR_PHRASES, type CprLangCode, type CprPhraseKey } from "@/data/cprTranslations";

const audioCache = new Map<string, string>(); // key -> blob URL
const inflight = new Map<string, Promise<string>>(); // key -> fetch promise

let currentAudio: HTMLAudioElement | null = null;

function cacheKey(lang: CprLangCode, key: CprPhraseKey) {
  return `${lang}:${key}`;
}

async function fetchAudio(lang: CprLangCode, key: CprPhraseKey): Promise<string> {
  const ck = cacheKey(lang, key);
  const cached = audioCache.get(ck);
  if (cached) return cached;
  const pending = inflight.get(ck);
  if (pending) return pending;

  const text = CPR_PHRASES[lang]?.[key] ?? CPR_PHRASES.en[key];

  const promise = (async () => {
    const { data, error } = await supabase.functions.invoke("cpr-tts", {
      body: { text },
    });
    if (error) throw error;
    // supabase-js returns Blob for binary responses
    const blob = data instanceof Blob ? data : new Blob([data as ArrayBuffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    audioCache.set(ck, url);
    inflight.delete(ck);
    return url;
  })();

  inflight.set(ck, promise);
  return promise;
}

export function stopCprVoice() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudio = null;
  }
}

export async function speakCpr(
  lang: CprLangCode,
  key: CprPhraseKey,
  opts: { interrupt?: boolean } = {}
): Promise<void> {
  const { interrupt = true } = opts;
  if (interrupt) stopCprVoice();
  try {
    const url = await fetchAudio(lang, key);
    const audio = new Audio(url);
    currentAudio = audio;
    await audio.play();
    await new Promise<void>((resolve) => {
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
    });
    if (currentAudio === audio) currentAudio = null;
  } catch (e) {
    console.error("speakCpr failed", e);
  }
}

// Warm up cache for a given language by pre-fetching the step phrases.
// Skip the long C-step to keep network usage small until needed.
export function prefetchCprVoice(lang: CprLangCode, keys: CprPhraseKey[] = ["D","R","S","A","B","AED","breath","startCpr","C"]) {
  for (const k of keys) {
    void fetchAudio(lang, k).catch(() => undefined);
  }
}
