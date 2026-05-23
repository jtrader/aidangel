import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, AlertCircle, Loader2, X, Cross, LocateFixed } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import { useCountry } from "@/hooks/useCountry";
import { useLanguage } from "@/contexts/LanguageContext";
import { emergencyNumberForCountry } from "@/lib/donations";
import { Button } from "@/components/ui/button";
import { loadMapboxToken, mapboxgl, reverseGeocodeCountry } from "@/lib/mapboxLoader";
import {
  Aed,
  fetchCountryAeds,
  filterByBounds,
  accessLabel,
} from "@/lib/openAedMap";

export default function AedFinder() {
  const { country } = useCountry();
  const { language } = useLanguage();
  const emergency = emergencyNumberForCountry(country as unknown as string);

  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const fetchAbort = useRef<AbortController | null>(null);
  const debounceTimer = useRef<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [fetchingAeds, setFetchingAeds] = useState(false);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadInBounds = useCallback(async () => {
    const map = mapRef.current;
    if (!map) return;
    const b = map.getBounds();
    if (!b) return;
    const bounds = {
      south: b.getSouth(),
      west: b.getWest(),
      north: b.getNorth(),
      east: b.getEast(),
    };

    fetchAbort.current?.abort();
    const ctrl = new AbortController();
    fetchAbort.current = ctrl;
    setFetchingAeds(true);
    setError(null);

    try {
      const isoCodes = new Set<string>();
      const countryStr = country as unknown as string;
      if (countryStr && typeof countryStr === "string") isoCodes.add(countryStr.toUpperCase());
      const center = map.getCenter();
      const iso = await reverseGeocodeCountry(center.lat, center.lng);
      if (iso) isoCodes.add(iso);
      if (isoCodes.size === 0) isoCodes.add("AU");

      const lists = await Promise.all(
        Array.from(isoCodes).map((c) => fetchCountryAeds(c).catch(() => [] as Aed[])),
      );
      if (ctrl.signal.aborted) return;
      const all = lists.flat();
      const aeds = filterByBounds(all, bounds);

      const seen = new Set<string>();
      const popup = popupRef.current!;

      aeds.forEach((aed) => {
        seen.add(aed.id);
        if (markersRef.current.has(aed.id)) return;
        const meta = accessLabel(aed.access);
        const el = document.createElement("div");
        el.style.cssText = `width:18px;height:18px;border-radius:9999px;background:${meta.color};border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.35);cursor:pointer`;
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([aed.lng, aed.lat])
          .addTo(map);
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          const directions = `https://www.openstreetmap.org/directions?from=&to=${aed.lat}%2C${aed.lng}`;
          const html = `
            <div style="font-family:system-ui,sans-serif;max-width:240px">
              <div style="font-weight:600;font-size:14px;margin-bottom:4px">${aed.name || "Defibrillator (AED)"}</div>
              <div style="font-size:12px;color:${meta.color};font-weight:600;margin-bottom:6px">${meta.label}</div>
              ${aed.location ? `<div style="font-size:12px;color:#374151;margin-bottom:2px">📍 ${aed.location}</div>` : ""}
              ${aed.operator ? `<div style="font-size:12px;color:#6b7280;margin-bottom:2px">Operator: ${aed.operator}</div>` : ""}
              ${aed.opening_hours ? `<div style="font-size:12px;color:#6b7280;margin-bottom:2px">🕐 ${aed.opening_hours}</div>` : ""}
              ${aed.indoor === "yes" ? `<div style="font-size:12px;color:#6b7280;margin-bottom:2px">Indoor</div>` : aed.indoor === "no" ? `<div style="font-size:12px;color:#6b7280;margin-bottom:2px">Outdoor</div>` : ""}
              ${aed.phone ? `<div style="font-size:12px;margin-bottom:2px"><a href="tel:${aed.phone}" style="color:#dc2626">📞 ${aed.phone}</a></div>` : ""}
              <a href="${directions}" target="_blank" rel="noopener" style="display:inline-block;margin-top:6px;background:#dc2626;color:#fff;padding:6px 10px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none">Get directions</a>
              <div style="margin-top:6px;font-size:10px;color:#9ca3af">Source: OpenAEDMap / OpenStreetMap</div>
            </div>`;
          popup.setLngLat([aed.lng, aed.lat]).setHTML(html).addTo(map);
        });
        markersRef.current.set(aed.id, marker);
      });

      // Remove markers outside the current view.
      markersRef.current.forEach((m, id) => {
        if (!seen.has(id)) {
          const ll = m.getLngLat();
          const inView =
            ll.lat >= bounds.south &&
            ll.lat <= bounds.north &&
            ll.lng >= bounds.west &&
            ll.lng <= bounds.east;
          if (!inView) {
            m.remove();
            markersRef.current.delete(id);
          }
        }
      });

      setCount(markersRef.current.size);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setError("Couldn't load AED locations. Try again in a moment.");
      }
    } finally {
      setFetchingAeds(false);
    }
  }, [country]);

  useEffect(() => {
    let cancelled = false;

    loadMapboxToken()
      .then(() => {
        if (cancelled || !mapEl.current) return;
        const map = new mapboxgl.Map({
          container: mapEl.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [133.7751, -25.2744],
          zoom: 4,
        });
        mapRef.current = map;
        popupRef.current = new mapboxgl.Popup({ offset: 16, closeButton: true });
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

        map.on("load", () => setLoading(false));
        map.on("idle", () => {
          if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
          debounceTimer.current = window.setTimeout(() => loadInBounds(), 350);
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              map.flyTo({
                center: [pos.coords.longitude, pos.coords.latitude],
                zoom: 14,
                duration: 0,
              });
            },
            () => {},
            { enableHighAccuracy: true, timeout: 8000 },
          );
        }
      })
      .catch((e) => {
        console.error(e);
        setError("Failed to load Mapbox.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
      fetchAbort.current?.abort();
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [loadInBounds]);

  const recenter = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current!.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 15,
        });
      },
      () => {},
    );
  };

  return (
    <>
      <SeoHead
        lang={language}
        basePath="/aed-finder"
        title="AED Finder — Find a Defibrillator Near You | First Aid Angel"
        description="Locate the nearest publicly accessible AED (defibrillator) on an interactive map. Crowd-sourced data from OpenStreetMap and OpenAEDMap."
      />
      <main className="min-h-screen bg-[#F7F7F7] flex flex-col">
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <Cross className="w-6 h-6 text-primary" />
            <div className="flex-1">
              <h1 className="font-heading font-bold text-lg leading-tight">AED Finder</h1>
              <p className="text-xs text-muted-foreground">
                In an emergency, call <a href={`tel:${emergency}`} className="text-primary font-semibold">{emergency}</a> first.
              </p>
            </div>
            <a
              href="/aed"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline px-2"
            >
              Browse by city
            </a>
            <a
              href="/"
              className="p-2 rounded-full hover:bg-muted"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="relative flex-1">
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 text-sm max-w-md">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          <div ref={mapEl} className="absolute inset-0" />

          <div className="absolute bottom-4 left-4 z-10 bg-white rounded-full shadow-md px-4 py-2 flex items-center gap-2 text-sm">
            {fetchingAeds ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-muted-foreground">Searching AEDs…</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">{count}</span>
                <span className="text-muted-foreground">AED{count === 1 ? "" : "s"} in view</span>
              </>
            )}
          </div>

          <Button
            onClick={recenter}
            size="icon"
            className="absolute bottom-4 right-4 z-10 rounded-full shadow-md"
            aria-label="Find my location"
          >
            <LocateFixed className="w-5 h-5" />
          </Button>

          <div className="absolute top-4 right-4 z-10 bg-white/95 rounded-lg shadow px-3 py-2 text-[11px] text-muted-foreground max-w-[220px]">
            Pan or zoom the map to load AEDs in view. Data © OpenStreetMap contributors via{" "}
            <a href="https://openaedmap.org/" target="_blank" rel="noopener" className="text-primary underline">
              OpenAEDMap
            </a>.
          </div>
        </div>
      </main>
    </>
  );
}
