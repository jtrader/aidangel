import { useEffect, useRef, useState } from "react";
import { AlertCircle, ChevronDown, Loader2, PlayCircle } from "lucide-react";
import type { CountryCode } from "@/lib/donations";

// Country → localized DRSABCD explainer asset slug. The same slug resolves both
// the MP4 and the WebVTT captions in the public `explainer-videos` bucket.
const ASSET_SLUGS: Partial<Record<CountryCode, { slug: string; lang: string; label: string }>> = {
  au: { slug: "au-en-drsabcd", lang: "en", label: "English (AU)" },
  us: { slug: "us-en-drsabcd", lang: "en", label: "English (US)" },
  gb: { slug: "gb-en-drsabcd", lang: "en", label: "English (UK)" },
  ca: { slug: "ca-en-drsabcd", lang: "en", label: "English (CA)" },
  nz: { slug: "nz-en-drsabcd", lang: "en", label: "English (NZ)" },
  ie: { slug: "ie-en-drsabcd", lang: "en", label: "English (IE)" },
  sg: { slug: "sg-en-drsabcd", lang: "en", label: "English (SG)" },
  za: { slug: "za-en-drsabcd", lang: "en", label: "English (ZA)" },
  in: { slug: "in-hi-drsabcd", lang: "hi", label: "हिन्दी" },
  de: { slug: "de-de-drsabcd", lang: "de", label: "Deutsch" },
  fr: { slug: "fr-fr-drsabcd", lang: "fr", label: "Français" },
  es: { slug: "es-es-drsabcd", lang: "es", label: "Español" },
};

const FALLBACK = { slug: "au-en-drsabcd", lang: "en", label: "English (AU)" };
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

function assetUrl(slug: string, ext: "mp4" | "vtt"): string {
  return `${SUPABASE_URL}/storage/v1/object/public/explainer-videos/${slug}.${ext}`;
}

type Status = "idle" | "loading" | "ready" | "error";

export function CprExplainerVideo({ countryCode }: { countryCode: CountryCode }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const meta = ASSET_SLUGS[countryCode] ?? FALLBACK;
  const localized = countryCode in ASSET_SLUGS;
  const videoSrc = assetUrl(meta.slug, "mp4");
  const captionSrc = assetUrl(meta.slug, "vtt");

  // Reset state when the source changes (e.g. country switch while open).
  useEffect(() => {
    if (open) setStatus("loading");
  }, [open, videoSrc]);

  const handleRetry = () => {
    setStatus("loading");
    const v = videoRef.current;
    if (v) {
      v.load();
    }
  };

  return (
    <section className="mb-4 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/40"
      >
        <span className="flex items-center gap-2 text-left">
          <PlayCircle className="h-5 w-5 text-primary shrink-0" />
          <span>
            <span className="block text-sm font-semibold leading-tight">
              Watch the 60-second DRSABCD explainer
            </span>
            <span className="block text-[11px] text-muted-foreground">
              {localized
                ? `Localized for your region · ${meta.label} captions`
                : "Default version (your region coming soon)"}
            </span>
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="relative bg-black">
          {/* Aspect-ratio box keeps layout stable while the video loads. */}
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <video
              ref={videoRef}
              key={videoSrc}
              controls
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
              className="absolute inset-0 w-full h-full"
              onLoadStart={() => setStatus("loading")}
              onWaiting={() => setStatus((s) => (s === "ready" ? s : "loading"))}
              onLoadedData={() => setStatus("ready")}
              onCanPlay={() => setStatus("ready")}
              onError={() => setStatus("error")}
            >
              <source src={videoSrc} type="video/mp4" />
              <track
                kind="captions"
                src={captionSrc}
                srcLang={meta.lang}
                label={meta.label}
                default
              />
              Your browser does not support embedded video.
            </video>

            {status === "loading" && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white pointer-events-none"
                aria-live="polite"
              >
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-xs opacity-80">Loading video…</span>
              </div>
            )}

            {status === "error" && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 text-white p-4 text-center"
                role="alert"
              >
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm">We couldn't load the video. Check your connection and try again.</p>
                <button
                  onClick={handleRetry}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
