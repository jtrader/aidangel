import { useEffect, useState } from "react";

export interface GeoInfo {
  city: string | null;
  region: string | null;
  country: string | null; // ISO alpha-2
  lat: number | null;
  lng: number | null;
  source: "ip" | "manual" | "cached";
  fetchedAt: number;
}

const STORAGE_KEY = "faa.geo";
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function readCached(): GeoInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GeoInfo;
    if (Date.now() - parsed.fetchedAt > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function save(geo: GeoInfo) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(geo));
  } catch {
    /* ignore */
  }
}

export function setManualGeo(partial: Partial<Omit<GeoInfo, "fetchedAt" | "source">>) {
  const cur = readCached();
  const next: GeoInfo = {
    city: partial.city ?? cur?.city ?? null,
    region: partial.region ?? cur?.region ?? null,
    country: partial.country ?? cur?.country ?? null,
    lat: partial.lat ?? cur?.lat ?? null,
    lng: partial.lng ?? cur?.lng ?? null,
    source: "manual",
    fetchedAt: Date.now(),
  };
  save(next);
  window.dispatchEvent(new CustomEvent("faa-geo-updated"));
  return next;
}

async function fetchIpGeo(): Promise<GeoInfo | null> {
  try {
    // ipapi.co — free tier, no key, ~1k req/day per IP. Returns city-level data.
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.error) return null;
    return {
      city: data.city ?? null,
      region: data.region ?? null,
      country: data.country_code ?? null,
      lat: typeof data.latitude === "number" ? data.latitude : null,
      lng: typeof data.longitude === "number" ? data.longitude : null,
      source: "ip",
      fetchedAt: Date.now(),
    };
  } catch {
    return null;
  }
}

export function useGeoLocation() {
  const [geo, setGeo] = useState<GeoInfo | null>(() => readCached());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cached = readCached();
    if (cached) {
      setGeo(cached);
      return;
    }
    setLoading(true);
    fetchIpGeo().then((g) => {
      if (g) {
        save(g);
        setGeo(g);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const handler = () => setGeo(readCached());
    window.addEventListener("faa-geo-updated", handler);
    return () => window.removeEventListener("faa-geo-updated", handler);
  }, []);

  return { geo, loading, setManualGeo };
}
