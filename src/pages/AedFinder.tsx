import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, AlertCircle, Loader2, Navigation, X, Cross, LocateFixed } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import { useCountry } from "@/hooks/useCountry";
import { useLanguage } from "@/contexts/LanguageContext";
import { emergencyNumberForCountry } from "@/lib/donations";
import { Button } from "@/components/ui/button";

const BROWSER_KEY = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
const TRACKING_ID = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string | undefined;

const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";

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

function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.google?.maps) return Promise.resolve();
  if (!BROWSER_KEY) return Promise.reject(new Error("Missing Google Maps key"));

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("faa-gmaps-script") as HTMLScriptElement | null;
    window.__initFaaMap = () => resolve();
    if (existing) {
      if (window.google?.maps) resolve();
      return;
    }
    const s = document.createElement("script");
    s.id = "faa-gmaps-script";
    const channel = TRACKING_ID ? `&channel=${TRACKING_ID}` : "";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${BROWSER_KEY}&loading=async&callback=__initFaaMap${channel}`;
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
    case "private":
      return { label: "Private", color: "#dc2626" };
    case "no":
      return { label: "No public access", color: "#dc2626" };
    default:
      return { label: "Access unknown", color: "#6b7280" };
  }
}

async function fetchAeds(bounds: { south: number; west: number; north: number; east: number }, signal?: AbortSignal): Promise<Aed[]> {
  const { south, west, north, east } = bounds;
  // Limit query to reasonable bbox area to avoid massive responses
  const query = `[out:json][timeout:25];node["emergency"="defibrillator"](${south},${west},${north},${east});out body 500;`;
  const res = await fetch(OVERPASS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
    signal,
  });
  if (!res.ok) throw new Error(`Overpass error ${res.status}`);
  const json = await res.json();
  return (json.elements || []).map((el: any) => ({
    id: String(el.id),
    lat: el.lat,
    lng: el.lon,
    name: el.tags?.name,
    operator: el.tags?.operator,
    access: el.tags?.access,
    indoor: el.tags?.indoor,
    location: el.tags?.["defibrillator:location"] || el.tags?.location,
    opening_hours: el.tags?.opening_hours,
    phone: el.tags?.phone,
    description: el.tags?.description,
  }));
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

  const loadInBounds = useCallback(async () => {
    const map = mapRef.current;
    if (!map) return;
    const b = map.getBounds();
    if (!b) return;
    const ne = b.getNorthEast();
    const sw = b.getSouthWest();
    const bounds = { south: sw.lat(), west: sw.lng(), north: ne.lat(), east: ne.lng() };

    // Bail if zoomed too far out (Overpass would return too much)
    if (map.getZoom() < 9) {
      setCount(0);
      // Clear markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current.clear();
      return;
    }

    fetchAbort.current?.abort();
    const ctrl = new AbortController();
    fetchAbort.current = ctrl;
    setFetchingAeds(true);
    setError(null);

    try {
      const aeds = await fetchAeds(bounds, ctrl.signal);
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
            `<div style="margin-top:6px;font-size:10px;color:#9ca3af;">Source: OpenStreetMap</div>`,
            `</div>`,
          ].join("");
          info.setContent(lines);
          info.open({ anchor: marker, map });
        });
        markersRef.current.set(aed.id, marker);
      });

      // Remove markers no longer in result set (keep cache simple: only remove if outside current view)
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
  }, []);

  useEffect(() => {
    if (!BROWSER_KEY) {
      setError("Google Maps is not configured.");
      setLoading(false);
      return;
    }

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
