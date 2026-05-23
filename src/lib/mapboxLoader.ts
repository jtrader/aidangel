// Shared Mapbox token loader + CSS injection. Single-flight.
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

let tokenPromise: Promise<string> | null = null;

export async function loadMapboxToken(): Promise<string> {
  if (mapboxgl.accessToken) return mapboxgl.accessToken as string;
  if (tokenPromise) return tokenPromise;
  tokenPromise = (async () => {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/get-mapbox-token`);
    if (!res.ok) throw new Error("Failed to fetch Mapbox token");
    const { token } = await res.json();
    if (!token) throw new Error("Missing Mapbox token");
    mapboxgl.accessToken = token;
    return token as string;
  })();
  return tokenPromise;
}

export { mapboxgl };

/** Reverse-geocode lat/lng to an ISO 3166-1 alpha-2 country code via Mapbox Geocoding v6. */
const reverseCountryCache = new Map<string, string | null>();
export async function reverseGeocodeCountry(
  lat: number,
  lng: number,
): Promise<string | null> {
  const key = `${lat.toFixed(1)},${lng.toFixed(1)}`;
  if (reverseCountryCache.has(key)) return reverseCountryCache.get(key) ?? null;
  const token = await loadMapboxToken();
  try {
    const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&types=country&access_token=${token}`;
    const res = await fetch(url);
    if (!res.ok) {
      reverseCountryCache.set(key, null);
      return null;
    }
    const data = await res.json();
    const f = data?.features?.[0];
    const iso = (f?.properties?.context?.country?.country_code as string | undefined)
      ?? (f?.properties?.country_code as string | undefined)
      ?? null;
    const upper = iso ? iso.toUpperCase() : null;
    reverseCountryCache.set(key, upper);
    return upper;
  } catch {
    reverseCountryCache.set(key, null);
    return null;
  }
}
