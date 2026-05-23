// ElevenLabs voice-over helper for the Live CPR Guide.
// Fetches MP3 audio from the cpr-tts edge function, caches blob URLs by
// (lang, phrase) key, and plays them through a single shared <audio> element.
// If the edge function signals { fallback: true } (e.g. ElevenLabs is rate
// limited), falls back to the browser SpeechSynthesis API for that language.

import { supabase } from "@/integrations/supabase/client";
import { CPR_PHRASES, CPR_LANGUAGES, type CprLangCode, type CprPhraseKey } from "@/data/cprTranslations";

const audioCache = new Map<string, string>(); // key -> blob URL
const inflight = new Map<string, Promise<string | null>>(); // key -> fetch promise (null = use browser TTS)
const fallbackLangs = new Set<CprLangCode>(); // languages where ElevenLabs is unavailable

let currentAudio: HTMLAudioElement | null = null;

function cacheKey(lang: CprLangCode, key: CprPhraseKey) {
  return `${lang}:${key}`;
}

function bcp47For(lang: CprLangCode): string {
  return CPR_LANGUAGES.find((l) => l.code === lang)?.bcp47 ?? "en-US";
}

// Returns blob URL, or null when caller should use browser SpeechSynthesis.
async function fetchAudio(lang: CprLangCode, key: CprPhraseKey): Promise<string | null> {
  if (fallbackLangs.has(lang)) return null;
  const ck = cacheKey(lang, key);
  const cached = audioCache.get(ck);
  if (cached) return cached;
  const pending = inflight.get(ck);
  if (pending) return pending;

  const text = CPR_PHRASES[lang]?.[key] ?? CPR_PHRASES.en[key];

  const promise = (async () => {
    const { data, error } = await supabase.functions.invoke("cpr-tts", { body: { text } });
    if (error) {
      console.warn("cpr-tts invoke error, falling back", error);
      fallbackLangs.add(lang);
      inflight.delete(ck);
      return null;
    }
    // JSON fallback signal
    if (data && typeof data === "object" && !(data instanceof Blob) && (data as { fallback?: boolean }).fallback) {
      fallbackLangs.add(lang);
      inflight.delete(ck);
      return null;
    }
    const blob = data instanceof Blob ? data : new Blob([data as ArrayBuffer], { type: "audio/mpeg" });
    if (!blob.type.startsWith("audio")) {
      fallbackLangs.add(lang);
      inflight.delete(ck);
      return null;
    }
    const url = URL.createObjectURL(blob);
    audioCache.set(ck, url);
    inflight.delete(ck);
    return url;
  })();

  inflight.set(ck, promise);
  return promise;
}

function speakWithBrowser(lang: CprLangCode, key: CprPhraseKey): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return resolve();
    try {
      window.speechSynthesis.cancel();
      const text = CPR_PHRASES[lang]?.[key] ?? CPR_PHRASES.en[key];
      const u = new SpeechSynthesisUtterance(text);
      u.lang = bcp47For(lang);
      u.rate = 1.0;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    } catch {
      resolve();
    }
  });
}

export function stopCprVoice() {
  if (currentAudio) {
    try { currentAudio.pause(); currentAudio.currentTime = 0; } catch { /* ignore */ }
    currentAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
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
    if (!url) {
      await speakWithBrowser(lang, key);
      return;
    }
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
    await speakWithBrowser(lang, key);
  }
}

// Warm up cache for a given language by pre-fetching phrases sequentially.
// Sequential fetching avoids ElevenLabs' low concurrent-request limits.
export function prefetchCprVoice(
  lang: CprLangCode,
  keys: CprPhraseKey[] = ["D","R","S","A","B","AED","breath","startCpr","C"]
) {
  void (async () => {
    for (const k of keys) {
      if (fallbackLangs.has(lang)) return;
      try { await fetchAudio(lang, k); } catch { /* ignore */ }
    }
  })();
}
