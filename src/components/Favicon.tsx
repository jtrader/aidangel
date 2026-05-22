import { useState } from "react";
import { Globe } from "lucide-react";

/**
 * Renders a favicon for an outbound URL. Uses Google's S2 favicon service
 * with a graceful fallback to a Globe icon if loading fails or the URL is
 * invalid. Used everywhere we surface an outbound link (educator profiles,
 * shop menu, donate menu) so users get a visual brand cue.
 */
interface FaviconProps {
  url?: string | null;
  /** Optional explicit logo URL (e.g. educator.logo_url) — preferred when present. */
  logoUrl?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}

function hostnameFromUrl(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export function Favicon({ url, logoUrl, alt = "", size = 16, className = "" }: FaviconProps) {
  const [errored, setErrored] = useState(false);
  const host = url ? hostnameFromUrl(url) : null;
  const src = logoUrl || (host ? `https://www.google.com/s2/favicons?domain=${host}&sz=64` : null);

  const dim = { width: size, height: size };

  if (!src || errored) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-sm bg-muted text-muted-foreground shrink-0 ${className}`}
        style={dim}
        aria-hidden="true"
      >
        <Globe className="h-3 w-3" />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`rounded-sm shrink-0 object-contain ${className}`}
      style={dim}
    />
  );
}
