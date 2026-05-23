import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, AlertCircle, Loader2, Navigation, X, Cross, LocateFixed } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import { useCountry } from "@/hooks/useCountry";
import { useLanguage } from "@/contexts/LanguageContext";
import { emergencyNumberForCountry } from "@/lib/donations";
import { Button } from "@/components/ui/button";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

async function fetchMapsKey(): Promise<{ key: string; trackingId: string }> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/get-maps-key`);
  if (!res.ok) throw new Error("Failed to fetch Maps key");
  return res.json();
}

// OpenAEDMap exposes precomputed per-country GeoJSON files keyed by ISO-2 code.
// We fetch the file for the country in view once, cache it in memory + localStorage
// for 7 days, and then filter to the current map bounds client-side. This avoids
// hitting Overpass on every pan/zoom and gives instant subsequent results.
const OAM_COUNTRY_URL = (iso2: string) =>
  `https://openaedmap.org/api/v1/countries/${iso2.toUpperCase()}.geojson`;
const OAM_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type Aed = {
  id: string;
  lat: number;
  lng: number;
  name?: string;
  operator?: string;
  access?: string;
  indoor?: string;
  location?: string;
  opening_hours?: string;
  phone?: string;
  description?: string;
};

declare global {
  interface Window {
    google: any;
    __initFaaMap?: () => void;
  }
}

async function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") throw new Error("No window");
  if (window.google?.maps) return;

  const { key, trackingId } = await fetchMapsKey();
  if (!key) throw new Error("Missing Google Maps key");

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("faa-gmaps-script") as HTMLScriptElement | null;
    window.__initFaaMap = () => resolve();
    if (existing) {
      if (window.google?.maps) resolve();
      return;
    }
    const s = document.createElement("script");
    s.id = "faa-gmaps-script";
    const channel = trackingId ? `&channel=${trackingId}` : "";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__initFaaMap${channel}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
}

function accessLabel(access?: string) {
  switch ((access || "").toLowerCase()) {
    case "yes":
    case "public":
      return { label: "Public access", color: "#059669" };
    case "permissive":
      return { label: "Permissive access", color: "#10b981" };
    case "customers":
      return { label: "Customers only", color: "#d97706" };
    case "permit":
      return { label: "Permit required", color: "#d97706" };
    case "private":
      return { label: "Private", color: "#dc2626" };
    case "no":
      return { label: "No public access", color: "#dc2626" };
    default:
      return { label: "Access unknown", color: "#6b7280" };
  }
}

// In-memory cache of per-country AED arrays.
const countryCache: Record<string, Aed[]> = {};
const inflight: Record<string, Promise<Aed[]>> = {};

function pickLocation(props: Record<string, unknown>): string | undefined {
  // OpenAEDMap exposes localized location keys like `defibrillator:location:pl`.
  const direct =
    (props["defibrillator:location"] as string | undefined) ??
    (props["location"] as string | undefined);
  if (direct) return direct;
  for (const k of Object.keys(props)) {
    if (k.startsWith("defibrillator:location")) {
      const v = props[k];
      if (typeof v === "string" && v) return v;
    }
  }
  return undefined;
}

async function fetchCountryAeds(iso2: string): Promise<Aed[]> {
  const key = iso2.toUpperCase();
  if (countryCache[key]) return countryCache[key];
  if (inflight[key]) return inflight[key];

  // Try localStorage cache first.
  try {
    const raw = localStorage.getItem(`faa.oam.${key}`);
    if (raw) {
      const parsed = JSON.parse(raw) as { ts: number; data: Aed[] };
      if (Date.now() - parsed.ts < OAM_CACHE_TTL_MS && Array.isArray(parsed.data)) {
        countryCache[key] = parsed.data;
        return parsed.data;
      }
    }
  } catch {
    /* ignore */
  }

  const promise = (async () => {
    const res = await fetch(OAM_COUNTRY_URL(key));
    if (!res.ok) throw new Error(`OpenAEDMap ${key} ${res.status}`);
    const json = await res.json();
    const features: any[] = json.features || [];
    const aeds: Aed[] = features.map((f) => {
      const [lng, lat] = f.geometry?.coordinates || [0, 0];
      const p = f.properties || {};
      return {
        id: String(p["@osm_id"] ?? `${lat},${lng}`),
        lat,
        lng,
        name: p.name,
        operator: p.operator,
        access: p.access,
        indoor: p.indoor,
        location: pickLocation(p),
        opening_hours: p.opening_hours,
        phone: p.phone,
        description: p.description,
      };
    });
    countryCache[key] = aeds;
    try {
      localStorage.setItem(`faa.oam.${key}`, JSON.stringify({ ts: Date.now(), data: aeds }));
    } catch {
      /* quota — skip */
    }
    return aeds;
  })();
  inflight[key] = promise;
  try {
    return await promise;
  } finally {
    delete inflight[key];
  }
}

function filterByBounds(
  aeds: Aed[],
  b: { south: number; west: number; north: number; east: number },
  cap = 800,
): Aed[] {
  const out: Aed[] = [];
  for (const a of aeds) {
    if (a.lat >= b.south && a.lat <= b.north && a.lng >= b.west && a.lng <= b.east) {
      out.push(a);
      if (out.length >= cap) break;
    }
  }
  return out;
}

export default function AedFinder() {
  const { country } = useCountry();
  const { language } = useLanguage();
  const emergency = emergencyNumberForCountry(country as unknown as string);

  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const infoRef = useRef<any>(null);
  const fetchAbort = useRef<AbortController | null>(null);
  const debounceTimer = useRef<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [fetchingAeds, setFetchingAeds] = useState(false);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Reverse-geocode a lat/lng to an ISO-2 country code (cached on the Geocoder instance).
  const geocoderRef = useRef<any>(null);
  const reverseCountryCache = useRef<Map<string, string | null>>(new Map());
  const reverseCountry = useCallback(async (lat: number, lng: number): Promise<string | null> => {
    const key = `${lat.toFixed(1)},${lng.toFixed(1)}`;
    if (reverseCountryCache.current.has(key)) return reverseCountryCache.current.get(key)!;
    const google = window.google;
    if (!google?.maps?.Geocoder) return null;
    if (!geocoderRef.current) geocoderRef.current = new google.maps.Geocoder();
    return new Promise((resolve) => {
      geocoderRef.current.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
        if (status !== "OK" || !results?.length) {
          reverseCountryCache.current.set(key, null);
          return resolve(null);
        }
        let iso: string | null = null;
        for (const r of results) {
          const c = r.address_components?.find((c: any) => c.types?.includes("country"));
          if (c?.short_name) {
            iso = c.short_name;
            break;
          }
        }
        reverseCountryCache.current.set(key, iso);
        resolve(iso);
      });
    });
  }, []);

  const loadInBounds = useCallback(async () => {
    const map = mapRef.current;
    if (!map) return;
    const b = map.getBounds();
    if (!b) return;
    const ne = b.getNorthEast();
    const sw = b.getSouthWest();
    const bounds = { south: sw.lat(), west: sw.lng(), north: ne.lat(), east: ne.lng() };

    fetchAbort.current?.abort();
    const ctrl = new AbortController();
    fetchAbort.current = ctrl;
    setFetchingAeds(true);
    setError(null);

    try {
      // Figure out which country file(s) we need. Start with the user's detected
      // country, then add the country under the current map center.
      const isoCodes = new Set<string>();
      if (country && typeof country === "string") isoCodes.add(country.toUpperCase());
      const center = map.getCenter();
      if (center) {
        const iso = await reverseCountry(center.lat(), center.lng());
        if (iso) isoCodes.add(iso);
      }
      if (isoCodes.size === 0) isoCodes.add("AU");

      const lists = await Promise.all(
        Array.from(isoCodes).map((c) => fetchCountryAeds(c).catch(() => [] as Aed[])),
      );
      if (ctrl.signal.aborted) return;
      const all = lists.flat();
      const aeds = filterByBounds(all, bounds);

      const google = window.google;
      const seen = new Set<string>();

      aeds.forEach((aed) => {
        seen.add(aed.id);
        if (markersRef.current.has(aed.id)) return;
        const meta = accessLabel(aed.access);
        const marker = new google.maps.Marker({
          position: { lat: aed.lat, lng: aed.lng },
          map,
          title: aed.name || "AED",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: meta.color,
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });
        marker.addListener("click", () => {
          const info = infoRef.current;
          const directions = `https://www.google.com/maps/dir/?api=1&destination=${aed.lat},${aed.lng}`;
          const lines = [
            `<div style="font-family: system-ui, sans-serif; max-width: 240px;">`,
            `<div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${aed.name || "Defibrillator (AED)"}</div>`,
            `<div style="font-size: 12px; color: ${meta.color}; font-weight: 600; margin-bottom: 6px;">${meta.label}</div>`,
            aed.location ? `<div style="font-size: 12px; color: #374151; margin-bottom: 2px;">📍 ${aed.location}</div>` : "",
            aed.operator ? `<div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">Operator: ${aed.operator}</div>` : "",
            aed.opening_hours ? `<div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">🕐 ${aed.opening_hours}</div>` : "",
            aed.indoor === "yes" ? `<div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">Indoor</div>` : aed.indoor === "no" ? `<div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">Outdoor</div>` : "",
            aed.phone ? `<div style="font-size: 12px; margin-bottom: 2px;"><a href="tel:${aed.phone}" style="color: #dc2626;">📞 ${aed.phone}</a></div>` : "",
            `<a href="${directions}" target="_blank" rel="noopener" style="display:inline-block;margin-top:6px;background:#dc2626;color:#fff;padding:6px 10px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;">Get directions</a>`,
            `<div style="margin-top:6px;font-size:10px;color:#9ca3af;">Source: OpenAEDMap / OpenStreetMap</div>`,
            `</div>`,
          ].join("");
          info.setContent(lines);
          info.open({ anchor: marker, map });
        });
        markersRef.current.set(aed.id, marker);
      });

      // Remove markers that have scrolled out of the current view.
      markersRef.current.forEach((m, id) => {
        if (!seen.has(id)) {
          const pos = m.getPosition();
          if (pos && !b.contains(pos)) {
            m.setMap(null);
            markersRef.current.delete(id);
          }
        }
      });

      setCount(markersRef.current.size);
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setError("Couldn't load AED locations. Try again in a moment.");
      }
    } finally {
      setFetchingAeds(false);
    }
  }, [country, reverseCountry]);

  useEffect(() => {
    let cancelled = false;


    loadGoogleMaps()
      .then(() => {
        if (cancelled || !mapEl.current) return;
        const google = window.google;
        const map = new google.maps.Map(mapEl.current, {
          center: { lat: -25.2744, lng: 133.7751 },
          zoom: 4,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        });
        mapRef.current = map;
        infoRef.current = new google.maps.InfoWindow();

        map.addListener("idle", () => {
          if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
          debounceTimer.current = window.setTimeout(() => loadInBounds(), 350);
        });

        setLoading(false);

        // Try geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              map.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
              map.setZoom(14);
            },
            () => {
              // Fallback: stay at country view
            },
            { enableHighAccuracy: true, timeout: 8000 }
          );
        }
      })
      .catch((e) => {
        console.error(e);
        setError("Failed to load Google Maps.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
      fetchAbort.current?.abort();
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    };
  }, [loadInBounds]);

  const recenter = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        mapRef.current.setZoom(15);
      },
      () => {}
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

          {/* Floating status badge */}
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
            Zoom in (level 9+) to load nearby AEDs. Data © OpenStreetMap contributors via{" "}
            <a href="https://openaedmap.org/" target="_blank" rel="noopener" className="text-primary underline">
              OpenAEDMap
            </a>.
          </div>
        </div>
      </main>
    </>
  );
}
