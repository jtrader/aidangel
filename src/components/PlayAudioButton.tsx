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

/**
 * Reads topic text aloud using the browser's built-in SpeechSynthesis API.
 * Free, no API key, works offline on most devices, supports 48+ languages
 * (voice availability depends on the user's OS/browser).
 */
const PlayAudioButton = ({ text, language, label = "Listen", stopLabel = "Stop" }: Props) => {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop playback when language or text changes
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [text, language]);

  const pickVoice = (langTag: string): SpeechSynthesisVoice | undefined => {
    const voices = window.speechSynthesis.getVoices();
    const lower = langTag.toLowerCase();
    const base = lower.split("-")[0];
    return (
      voices.find((v) => v.lang.toLowerCase() === lower) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(base + "-")) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(base))
    );
  };

  const handleClick = () => {
    if (!supported) return;
    const synth = window.speechSynthesis;

    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }

    // Strip markdown for cleaner reading
    const clean = text
      .replace(/```[\s\S]*?```/g, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[#>*_`~]/g, "")
      .replace(/\n{2,}/g, ". ")
      .replace(/\s+/g, " ")
      .trim();

    if (!clean) return;

    const langTag = HREFLANG[language] || language;
    const speak = () => {
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = langTag;
      const v = pickVoice(langTag);
      if (v) utter.voice = v;
      utter.rate = 0.95;
      utter.pitch = 1;
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      utteranceRef.current = utter;
      synth.cancel();
      synth.speak(utter);
      setSpeaking(true);
    };

    // Voices load asynchronously in some browsers
    if (synth.getVoices().length === 0) {
      const onVoices = () => {
        synth.removeEventListener("voiceschanged", onVoices);
        speak();
      };
      synth.addEventListener("voiceschanged", onVoices);
      // Fallback in case event never fires
      setTimeout(speak, 250);
    } else {
      speak();
    }
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={speaking ? stopLabel : label}
      className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 hover:border-primary transition-colors"
    >
      {speaking ? (
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
