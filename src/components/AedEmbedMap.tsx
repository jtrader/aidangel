import { useState } from "react";
import { MapPin, Play } from "lucide-react";

interface AedEmbedMapProps {
  /** Free-text query used as the search term (e.g. "Sydney, Australia"). */
  query: string;
  height?: number;
}

/**
 * Click-to-reveal Google Maps embed for AED searches.
 * Keeps API requests down by deferring the iframe load until the user clicks.
 */
export function AedEmbedMap({ query, height = 360 }: AedEmbedMapProps) {
  const [revealed, setRevealed] = useState(false);
  const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;

  const embedSrc = key
    ? `https://www.google.com/maps/embed/v1/search?key=${key}&q=${encodeURIComponent(
        `AED defibrillator in ${query}`
      )}&zoom=13`
    : null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-border bg-card"
      style={{ height }}
    >
      {revealed && embedSrc ? (
        <iframe
          title={`AED locations in ${query}`}
          src={embedSrc}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          aria-label={`Load AED map for ${query}`}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,hsl(var(--accent)/0.6),hsl(var(--primary)/0.08))] hover:bg-[linear-gradient(135deg,hsl(var(--accent)/0.8),hsl(var(--primary)/0.15))] transition"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition group-hover:scale-105">
            <Play className="h-6 w-6 fill-current" />
          </div>
          <div className="text-center px-4">
            <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-primary" /> Load AED map for {query}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tap to load the interactive Google map</p>
          </div>
        </button>
      )}
    </div>
  );
}
