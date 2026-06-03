import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, MapPin, Phone, RefreshCw, Share2, AlertTriangle, Check, Settings, ChevronRight, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MAX_AUTO_RETRIES = 3;
// Exponential backoff: 2s, 4s, 8s
const RETRY_DELAYS_SEC = [2, 4, 8];

interface Coords { lat: number; lng: number; accuracy: number; }

interface GeoErrorState {
  code: number;
  title: string;
  message: string;
  steps: string[];
  actionLabel: string;
}

type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; data: T }
  | { status: "error"; message: string };

async function fetchW3W(lat: number, lng: number): Promise<string> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/what3words-convert?lat=${lat}&lng=${lng}`;
  const r = await fetch(url, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error ?? `http_${r.status}`);
  return j.words as string;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const r = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
    { headers: { "Accept-Language": "en" } },
  );
  if (!r.ok) throw new Error("Address lookup failed");
  const j = await r.json();
  if (!j?.display_name) throw new Error("No address found");
  return j.display_name as string;
}

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          toast({ title: "Copied", description: label ?? value });
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast({ title: "Copy failed", description: "Long-press to copy manually." });
        }
      }}
      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border border-border hover:bg-accent transition-colors"
      aria-label={`Copy ${label ?? "value"}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ErrorCard({
  error,
  onRetry,
  retry,
  onCancelRetry,
}: {
  error: GeoErrorState;
  onRetry: () => void;
  retry: { attempt: number; secondsLeft: number; total: number } | null;
  onCancelRetry: () => void;
}) {
  const isAutoRetrying = retry !== null;
  return (
    <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 rounded-full bg-primary/10 p-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-primary text-base">{error.title}</h2>
          <p className="text-sm text-foreground mt-1">{error.message}</p>

          <ol className="mt-3 space-y-2">
            {error.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {i + 1}
                </span>
                <span className="leading-snug">{step}</span>
              </li>
            ))}
          </ol>

          {isAutoRetrying && (
            <div
              role="status"
              aria-live="polite"
              className="mt-4 rounded-xl border border-primary/30 bg-background p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <RefreshCw className="h-4 w-4 text-primary animate-spin" aria-hidden />
                  Retrying in {retry.secondsLeft}s
                  <span className="text-muted-foreground font-normal">
                    (attempt {retry.attempt} of {retry.total})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onCancelRetry}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border border-border hover:bg-accent"
                  aria-label="Cancel automatic retry"
                >
                  <X className="h-3.5 w-3.5" /> Stop
                </button>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-[width] duration-1000 ease-linear"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(
                        100,
                        ((RETRY_DELAYS_SEC[retry.attempt - 1] - retry.secondsLeft) /
                          Math.max(1, RETRY_DELAYS_SEC[retry.attempt - 1])) *
                          100,
                      ),
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.99] transition"
          >
            <RefreshCw className="h-4 w-4" />
            {isAutoRetrying ? "Retry now" : error.actionLabel}
          </button>

          <p className="mt-4 text-xs text-muted-foreground border-t border-border pt-3">
            Still not working? Tell the{" "}
            <a href="tel:000" className="text-primary font-semibold underline-offset-2 hover:underline">
              000
            </a>{" "}
            operator your street address, nearest intersection, suburb, and any nearby landmarks.
          </p>
        </div>
      </div>
    </div>
  );
}

function getErrorState(code: number): GeoErrorState {
  switch (code) {
    case 1: // PERMISSION_DENIED
      return {
        code,
        title: "Location access is blocked",
        message: "Your browser or device is not allowing this page to read your GPS location.",
        steps: [
          "Look for the location icon in your browser's address bar and allow permission.",
          "On iPhone: Settings → Privacy & Security → Location Services → Safari → Allow.",
          "On Android: Settings → Apps → Browser → Permissions → Location → Allow.",
          "Reload this page and tap Get My Location again.",
        ],
        actionLabel: "Try again",
      };
    case 2: // POSITION_UNAVAILABLE
      return {
        code,
        title: "GPS signal not available",
        message: "Your device cannot determine its position right now. This often happens indoors or in areas with poor signal.",
        steps: [
          "Move outdoors or closer to a window.",
          "Make sure Wi-Fi and mobile data are turned on (they help locate you faster).",
          "Check that your device's Location/GPS setting is turned on in system settings.",
          "Tap Try again below.",
        ],
        actionLabel: "Try again",
      };
    case 3: // TIMEOUT
      return {
        code,
        title: "Location request timed out",
        message: "It took too long to get a GPS fix. Your device may be struggling to connect to satellites.",
        steps: [
          "Move to an open area away from tall buildings or heavy tree cover.",
          "Ensure mobile data or Wi-Fi is enabled to assist positioning.",
          "Wait a few seconds, then tap Try again below.",
        ],
        actionLabel: "Try again",
      };
    default:
      return {
        code,
        title: "Could not get your location",
        message: "An unexpected error occurred while trying to read your position.",
        steps: [
          "Check that your browser supports location services.",
          "Make sure Location/GPS is enabled in your device settings.",
          "Refresh the page and try again.",
        ],
        actionLabel: "Try again",
      };
  }
}

export default function MyLocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [geoError, setGeoError] = useState<GeoErrorState | null>(null);
  const [busy, setBusy] = useState(false);
  const [w3w, setW3w] = useState<LoadState<string>>({ status: "idle" });
  const [address, setAddress] = useState<LoadState<string>>({ status: "idle" });
  const resultsRef = useRef<HTMLDivElement>(null);

  const runW3W = useCallback((lat: number, lng: number) => {
    setW3w({ status: "loading" });
    fetchW3W(lat, lng)
      .then((words) => setW3w({ status: "ok", data: words }))
      .catch((e) => setW3w({ status: "error", message: e?.message ?? "Failed" }));
  }, []);

  const runAddress = useCallback((lat: number, lng: number) => {
    setAddress({ status: "loading" });
    reverseGeocode(lat, lng)
      .then((a) => setAddress({ status: "ok", data: a }))
      .catch((e) => setAddress({ status: "error", message: e?.message ?? "Failed" }));
  }, []);

  const getLocation = useCallback(() => {
    setGeoError(null);
    if (!("geolocation" in navigator)) {
      setGeoError({
        code: -1,
        title: "Location not supported",
        message: "Your browser does not support location sharing.",
        steps: [
          "Open this page in a modern browser like Chrome, Safari, or Edge.",
          "Make sure you are not using a private/incognito mode that blocks location.",
        ],
        actionLabel: "Retry",
      });
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(false);
        const c: Coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setCoords(c);
        runW3W(c.lat, c.lng);
        runAddress(c.lat, c.lng);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      },
      (err) => {
        setBusy(false);
        setGeoError(getErrorState(err.code));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }, [runW3W, runAddress]);

  const accuracyWarning = coords && coords.accuracy > 500
    ? { icon: "🔴", text: "Location is imprecise. Give your coordinates and what3words address to 000." }
    : coords && coords.accuracy > 100
    ? { icon: "⚠️", text: "Location may be approximate. Move outdoors for better GPS signal." }
    : null;

  const shareLocation = async () => {
    if (!coords) return;
    const w3wWords = w3w.status === "ok" ? w3w.data : null;
    const addr = address.status === "ok" ? address.data : null;
    const lines = [
      "My location:",
      w3wWords ? `what3words: ///${w3wWords}` : null,
      `Coordinates: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
      addr ? `Address: ${addr}` : null,
      `Accuracy: within ${Math.round(coords.accuracy)}m`,
      w3wWords ? `Map: https://w3w.co/${w3wWords}` : `Map: https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}&zoom=18`,
    ].filter(Boolean).join("\n");
    try {
      if (navigator.share) {
        await navigator.share({ title: "My location — First Aid Angel", text: lines });
      } else {
        await navigator.clipboard.writeText(lines);
        toast({ title: "Location copied", description: "Paste it into a message to share." });
      }
    } catch { /* user cancelled */ }
  };

  // Keep view fresh on mount — no auto-run; user must press the button (per spec)
  useEffect(() => { /* noop */ }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="h-7 w-7 text-primary" aria-hidden /> My Location
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Get your exact location to share with <a href="tel:000" className="text-primary font-semibold underline-offset-2 hover:underline">000</a> emergency services.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Tap the button, then read your what3words address or coordinates to the operator.
        </p>
      </header>

      <button
        type="button"
        onClick={getLocation}
        disabled={busy}
        className="w-full min-h-[56px] rounded-xl bg-primary text-primary-foreground font-bold text-lg sm:text-xl shadow-md hover:bg-primary/90 active:scale-[0.99] transition disabled:opacity-70 disabled:cursor-wait inline-flex items-center justify-center gap-2"
      >
        {busy ? (
          <>
            <span className="h-5 w-5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" aria-hidden />
            Getting your location…
          </>
        ) : (
          <>📍 {coords ? "Update location" : "Get My Location"}</>
        )}
      </button>

      <a
        href="tel:000"
        className="mt-3 w-full min-h-[56px] rounded-xl bg-primary text-primary-foreground font-bold text-lg sm:text-xl shadow-md hover:bg-primary/90 inline-flex items-center justify-center gap-2"
      >
        <Phone className="h-5 w-5" aria-hidden /> Call 000
      </a>
      <p className="hidden sm:block text-xs text-muted-foreground text-center mt-1">
        In Australia, call 000 for police, fire or ambulance.
      </p>

      {geoError && <ErrorCard error={geoError} onRetry={getLocation} />}

      {coords && (
        <div ref={resultsRef} className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Read these to the <a href="tel:000" className="text-primary font-semibold">000</a> operator, or tap to copy and share.
          </p>

          {/* what3words */}
          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">what3words address</h2>
              {w3w.status === "ok" && <CopyButton value={`///${w3w.data}`} label="what3words address" />}
            </div>
            {w3w.status === "loading" && (
              <p className="text-sm text-muted-foreground animate-pulse">Getting what3words address…</p>
            )}
            {w3w.status === "error" && (
              <div className="text-sm">
                <p className="text-primary">Could not load what3words address. Your coordinates below are still accurate.</p>
                <button
                  onClick={() => runW3W(coords.lat, coords.lng)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border border-border hover:bg-accent"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Retry
                </button>
              </div>
            )}
            {w3w.status === "ok" && (
              <>
                <p className="font-bold leading-tight" style={{ fontSize: "clamp(1.5rem, 6vw, 2rem)" }}>
                  <span className="text-primary">///</span>
                  <span className="text-foreground">{w3w.data}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Say <span className="font-medium text-foreground">"what3words: {w3w.data.split(".").join(" dot ")}"</span> to the 000 operator.
                </p>
                <a
                  href={`https://w3w.co/${w3w.data}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-medium text-primary hover:underline mt-2"
                >
                  Open on what3words map →
                </a>
                <p className="text-[11px] text-muted-foreground mt-2">
                  what3words is accepted by Australian ambulance, police and SES services. Each address refers to a unique 3m × 3m square.
                </p>
              </>
            )}
          </section>

          {/* Coordinates */}
          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">GPS coordinates</h2>
              <CopyButton value={`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`} label="Coordinates" />
            </div>
            <dl className="font-mono text-base sm:text-lg space-y-1">
              <div className="flex items-center gap-3">
                <dt className="text-muted-foreground w-24">Latitude</dt>
                <dd className="font-semibold text-foreground">{coords.lat.toFixed(6)}</dd>
              </div>
              <div className="flex items-center gap-3">
                <dt className="text-muted-foreground w-24">Longitude</dt>
                <dd className="font-semibold text-foreground">{coords.lng.toFixed(6)}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground mt-2">
              Accuracy: within ~{Math.round(coords.accuracy)} metres
            </p>
            {accuracyWarning && (
              <p className="text-sm mt-2 font-medium text-primary">
                {accuracyWarning.icon} {accuracyWarning.text}
              </p>
            )}
          </section>

          {/* Address */}
          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nearest address</h2>
              {address.status === "ok" && <CopyButton value={address.data} label="Address" />}
            </div>
            {address.status === "loading" && (
              <p className="text-sm text-muted-foreground animate-pulse">Getting nearest address…</p>
            )}
            {address.status === "error" && (
              <p className="text-sm text-primary">Could not load nearest address. Use your coordinates or what3words address.</p>
            )}
            {address.status === "ok" && (
              <>
                <p className="text-base text-foreground">{address.data}</p>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Address is approximate — coordinates and what3words above are more precise.
                </p>
              </>
            )}
          </section>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={shareLocation}
              className="min-h-[48px] rounded-xl border border-border bg-card hover:bg-accent font-semibold inline-flex items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4" /> Share my location
            </button>
            <button
              type="button"
              onClick={getLocation}
              className="min-h-[48px] rounded-xl border border-border bg-card hover:bg-accent font-semibold inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Update location
            </button>
          </div>

          {/* Map preview */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Map preview — approximate location
            </h2>
            <div className="rounded-2xl overflow-hidden border border-border bg-muted aspect-video">
              <iframe
                key={`${coords.lat},${coords.lng}`}
                title="Map preview"
                className="w-full h-full"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.005},${coords.lat - 0.005},${coords.lng + 0.005},${coords.lat + 0.005}&layer=mapnik&marker=${coords.lat},${coords.lng}`}
                loading="lazy"
              />
            </div>
          </section>
        </div>
      )}

      <footer className="mt-8 text-xs text-muted-foreground space-y-2 border-t border-border pt-4">
        <p>
          This page uses your device's GPS. The what3words address and coordinates are more reliable than the street address — especially outdoors or in unfamiliar areas. For best accuracy, use this page outdoors or near a window.
        </p>
        <p>what3words is accepted by Australian ambulance, police and SES services.</p>
      </footer>
    </div>
  );
}

