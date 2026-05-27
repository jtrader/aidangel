import { useEffect, useRef, useState } from "react";
import { Volume2, Square, Loader2 } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { HREFLANG } from "@/lib/i18n";

interface Props {
  text: string;
  language: Lang;
  label?: string;
  stopLabel?: string;
}

// Top-10 most widely spoken languages we have ElevenLabs coverage for.
// Other languages fall back to the browser SpeechSynthesis API.
const ELEVEN_LANGS = new Set<Lang>([
  "en", "zh", "es", "ar", "fr", "pt", "bn", "ur", "id", "ja",
]);

const MAX_CHARS = 2000;

function cleanForSpeech(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~]/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

// Split into <= MAX_CHARS chunks at sentence boundaries.
function chunkText(text: string, max = MAX_CHARS): string[] {
  if (text.length <= max) return [text];
  const sentences = text.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) ?? [text];
  const out: string[] = [];
  let buf = "";
  for (const s of sentences) {
    if ((buf + s).length > max) {
      if (buf) out.push(buf.trim());
      if (s.length > max) {
        // Hard split very long sentence by words.
        const words = s.split(/\s+/);
        let w = "";
        for (const word of words) {
          if ((w + " " + word).length > max) { out.push(w.trim()); w = word; }
          else { w = w ? `${w} ${word}` : word; }
        }
        if (w) buf = w;
        else buf = "";
      } else {
        buf = s;
      }
    } else {
      buf += s;
    }
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

const PlayAudioButton = ({ text, language, label = "Listen", stopLabel = "Stop" }: Props) => {
  const [supportsBrowserTTS, setSupportsBrowserTTS] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const cancelRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setSupportsBrowserTTS(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => stopAll();
  }, []);

  // Stop playback when language or text changes
  useEffect(() => {
    stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, language]);

  function stopAll() {
    cancelRef.current = true;
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch { /* ignore */ }
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
    }
    setSpeaking(false);
    setLoading(false);
  }

  async function speakWithElevenLabs(chunks: string[]): Promise<boolean> {
    const base = import.meta.env.VITE_SUPABASE_URL as string;
    const anon = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
    if (!base || !anon) return false;

    for (let i = 0; i < chunks.length; i++) {
      if (cancelRef.current) return true;
      try {
        const resp = await fetch(`${base}/functions/v1/kb-tts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: anon,
            Authorization: `Bearer ${anon}`,
          },
          body: JSON.stringify({ text: chunks[i], lang: language }),
        });
        if (!resp.ok) return false;
        const ct = resp.headers.get("content-type") || "";
        if (ct.includes("application/json")) return false; // fallback signal
        const blob = await resp.blob();
        if (!blob.size) return false;
        if (cancelRef.current) return true;
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        if (i === 0) setLoading(false);
        await audio.play();
        await new Promise<void>((resolve) => {
          audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
          audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
        });
        if (cancelRef.current) return true;
      } catch (e) {
        console.warn("kb-tts chunk failed", e);
        return false;
      }
    }
    return true;
  }

  function speakWithBrowser(clean: string) {
    if (!supportsBrowserTTS) return;
    const synth = window.speechSynthesis;
    const langTag = HREFLANG[language] || language;
    const voices = synth.getVoices();
    const lower = langTag.toLowerCase();
    const base = lower.split("-")[0];
    const voice =
      voices.find((v) => v.lang.toLowerCase() === lower) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(base + "-")) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(base));
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = langTag;
    if (voice) utter.voice = voice;
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(utter);
  }

  const handleClick = async () => {
    if (speaking || loading) {
      stopAll();
      return;
    }
    const clean = cleanForSpeech(text);
    if (!clean) return;

    cancelRef.current = false;
    setSpeaking(true);

    if (ELEVEN_LANGS.has(language)) {
      setLoading(true);
      const chunks = chunkText(clean);
      const ok = await speakWithElevenLabs(chunks);
      setLoading(false);
      if (!ok && !cancelRef.current) {
        // Fallback to browser TTS on failure
        speakWithBrowser(clean);
        return;
      }
      setSpeaking(false);
      return;
    }

    // Non-supported language → browser TTS path
    if (!supportsBrowserTTS) { setSpeaking(false); return; }
    speakWithBrowser(clean);
  };

  // If neither path works, hide the button
  if (!supportsBrowserTTS && !ELEVEN_LANGS.has(language)) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={speaking ? stopLabel : label}
      className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 hover:border-primary transition-colors"
    >
      {loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {label}
        </>
      ) : speaking ? (
        <>
          <Square className="h-3.5 w-3.5 fill-current" />
          {stopLabel}
        </>
      ) : (
        <>
          <Volume2 className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </button>
  );
};

export default PlayAudioButton;
