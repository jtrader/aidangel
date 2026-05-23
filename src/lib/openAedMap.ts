// Shared OpenAEDMap data layer.
// Per-country GeoJSON is fetched once, cached in memory + localStorage for 7 days,
// then filtered client-side. Used by AedFinder map and by /aed/* local SEO pages.

export type Aed = {
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

const OAM_COUNTRY_URL = (iso2: string) =>
  `https://openaedmap.org/api/v1/countries/${iso2.toUpperCase()}.geojson`;
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

const countryCache: Record<string, Aed[]> = {};
const inflight: Record<string, Promise<Aed[]>> = {};

function pickLocation(props: Record<string, unknown>): string | undefined {
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

export async function fetchCountryAeds(iso2: string): Promise<Aed[]> {
  const key = iso2.toUpperCase();
  if (countryCache[key]) return countryCache[key];
  if (inflight[key]) return inflight[key];

  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(`faa.oam.${key}`);
      if (raw) {
        const parsed = JSON.parse(raw) as { ts: number; data: Aed[] };
        if (Date.now() - parsed.ts < TTL_MS && Array.isArray(parsed.data)) {
          countryCache[key] = parsed.data;
          return parsed.data;
        }
      }
    } catch {
      /* ignore */
    }
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
        lat, lng,
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
    } catch { /* quota */ }
    return aeds;
  })();
  inflight[key] = promise;
  try {
    return await promise;
  } finally {
    delete inflight[key];
  }
}

export function filterByBounds(
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

// Approximate bounding box (degrees) around a lat/lng for a given radius (km).
export function bboxAround(lat: number, lng: number, radiusKm: number) {
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
  return {
    south: lat - latDelta,
    north: lat + latDelta,
    west: lng - lngDelta,
    east: lng + lngDelta,
  };
}

export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function accessLabel(access?: string) {
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
