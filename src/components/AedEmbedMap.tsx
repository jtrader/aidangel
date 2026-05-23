import { useEffect, useRef, useState } from "react";
import { MapPin, Play, Loader2 } from "lucide-react";
import { loadMapboxToken, mapboxgl } from "@/lib/mapboxLoader";
import {
  Aed,
  fetchCountryAeds,
  bboxAround,
  distanceKm,
  accessLabel,
} from "@/lib/openAedMap";

interface AedEmbedMapProps {
  /** Free-text query used as the search term (e.g. "Sydney, Australia"). */
  query: string;
  /** Optional explicit centre — skips forward-geocoding the query. */
  lat?: number;
  lng?: number;
  /** Optional ISO-2 country code — skips reverse-geocoding for the AED file. */
  countryCode?: string;
  /** Search radius in km when an explicit centre is provided (default 8 km). */
  radiusKm?: number;
  height?: number;
}

/**
 * Click-to-reveal Mapbox map showing AEDs (from OpenAEDMap) around a city/query.
 * Defers map load until the user taps to keep first paint cheap.
 */
export function AedEmbedMap({
  query,
  lat,
  lng,
  countryCode,
  radiusKm = 8,
  height = 360,
}: AedEmbedMapProps) {
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!revealed || !containerRef.current || mapRef.current) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const token = await loadMapboxToken();

        // Resolve centre + country.
        let centerLat = lat;
        let centerLng = lng;
        let iso = countryCode?.toUpperCase();
        if (centerLat == null || centerLng == null || !iso) {
          const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
            query,
          )}&limit=1&access_token=${token}`;
          const res = await fetch(url);
          const data = await res.json();
          const f = data?.features?.[0];
          if (!f) throw new Error("Place not found");
          const [glng, glat] = f.geometry?.coordinates ?? [];
          centerLng = centerLng ?? glng;
          centerLat = centerLat ?? glat;
          iso =
            iso ??
            (f?.properties?.context?.country?.country_code as string | undefined)?.toUpperCase();
        }
        if (cancelled || centerLat == null || centerLng == null || !iso) {
          throw new Error("Couldn't resolve location");
        }

        const map = new mapboxgl.Map({
          container: containerRef.current!,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [centerLng, centerLat],
          zoom: 13,
          attributionControl: true,
        });
        mapRef.current = map;
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

        // Fetch AEDs for the country, filter to a bbox around centre.
        const all = await fetchCountryAeds(iso);
        if (cancelled) return;
        const bbox = bboxAround(centerLat, centerLng, radiusKm);
        const inArea: Aed[] = all
          .filter(
            (a) =>
              a.lat >= bbox.south &&
              a.lat <= bbox.north &&
              a.lng >= bbox.west &&
              a.lng <= bbox.east,
          )
          .map((a) => ({ ...a, _d: distanceKm(centerLat!, centerLng!, a.lat, a.lng) }) as Aed & { _d: number })
          .sort((a: any, b: any) => a._d - b._d)
          .slice(0, 300);

        map.on("load", () => {
          if (cancelled) return;
          for (const a of inArea) {
            const meta = accessLabel(a.access);
            const el = document.createElement("div");
            el.style.cssText = `width:14px;height:14px;border-radius:9999px;background:${meta.color};border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3);cursor:pointer`;
            const directions = `https://www.openstreetmap.org/directions?from=&to=${a.lat}%2C${a.lng}`;
            const html = `
              <div style="font-family:system-ui,sans-serif;max-width:240px">
                <div style="font-weight:600;font-size:14px;margin-bottom:4px">${a.name || "Defibrillator (AED)"}</div>
                <div style="font-size:12px;color:${meta.color};font-weight:600;margin-bottom:6px">${meta.label}</div>
                ${a.location ? `<div style="font-size:12px;color:#374151;margin-bottom:2px">📍 ${a.location}</div>` : ""}
                ${a.operator ? `<div style="font-size:12px;color:#6b7280;margin-bottom:2px">Operator: ${a.operator}</div>` : ""}
                ${a.opening_hours ? `<div style="font-size:12px;color:#6b7280;margin-bottom:2px">🕐 ${a.opening_hours}</div>` : ""}
                <a href="${directions}" target="_blank" rel="noopener" style="display:inline-block;margin-top:6px;background:#dc2626;color:#fff;padding:6px 10px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none">Get directions</a>
              </div>`;
            new mapboxgl.Marker({ element: el })
              .setLngLat([a.lng, a.lat])
              .setPopup(new mapboxgl.Popup({ offset: 14 }).setHTML(html))
              .addTo(map);
          }
          setLoading(false);
        });
      } catch (e) {
        if (cancelled) return;
        console.error(e);
        setError("Couldn't load the map.");
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [revealed, query, lat, lng, countryCode, radiusKm]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-border bg-card"
      style={{ height }}
    >
      {revealed ? (
        <>
          <div ref={containerRef} className="absolute inset-0" />
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/95 p-4 text-center text-sm text-muted-foreground">
              {error}
            </div>
          )}
        </>
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
            <p className="text-xs text-muted-foreground mt-1">Tap to load the interactive map</p>
          </div>
        </button>
      )}
    </div>
  );
}
