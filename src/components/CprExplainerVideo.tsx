import { useState } from "react";
import { ChevronDown, PlayCircle } from "lucide-react";
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

export function CprExplainerVideo({ countryCode }: { countryCode: CountryCode }) {
  const [open, setOpen] = useState(false);
  const meta = ASSET_SLUGS[countryCode] ?? FALLBACK;
  const localized = countryCode in ASSET_SLUGS;
  const videoSrc = assetUrl(meta.slug, "mp4");
  const captionSrc = assetUrl(meta.slug, "vtt");

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
              {localized ? `Localized for your region · ${meta.label} captions` : "Default version (your region coming soon)"}
            </span>
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="bg-black">
          <video
            key={videoSrc}
            controls
            playsInline
            preload="metadata"
            crossOrigin="anonymous"
            className="w-full h-auto block max-h-[60vh] mx-auto"
          >
            <source src={videoSrc} type="video/mp4" />
            <track
              kind="captions"
              src={captionSrc}
              srcLang={meta.lang}
              label={meta.label}
              default
            />
          </video>
        </div>
      )}
    </section>
  );
}
