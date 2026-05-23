import { supabase } from "@/integrations/supabase/client";

export type EducatorType = "st_john" | "red_cross" | "other_ngo" | "commercial" | "online" | "community";

export interface Educator {
  id: string;
  slug: string;
  name: string;
  type: EducatorType;
  blurb: string | null;
  website: string | null;
  booking_url: string | null;
  logo_url: string | null;
  hq_country_code: string | null;
  is_online: boolean;
  is_verified: boolean;
  is_claimed?: boolean;
  claimed_at?: string | null;
  priority: number;
}

export interface EducatorLocation {
  id: string;
  educator_id: string;
  country_code: string;
  region: string | null;
  city: string | null;
  address: string | null;
  postcode: string | null;
  lat: number | null;
  lng: number | null;
  booking_url: string | null;
  phone: string | null;
}

export interface EducatorServiceArea {
  id: string;
  educator_id: string;
  country_code: string;
  region: string | null;
  city: string | null;
  radius_km: number | null;
  notes: string | null;
}

export interface EducatorFull extends Educator {
  locations: EducatorLocation[];
  service_areas: EducatorServiceArea[];
  languages: string[];
}

const TYPE_RANK: Record<EducatorType, number> = {
  st_john: 0,
  red_cross: 1,
  other_ngo: 2,
  community: 3,
  commercial: 4,
  online: 5,
};

export function sortEducators(list: Educator[]): Educator[] {
  return [...list].sort((a, b) => {
    if (TYPE_RANK[a.type] !== TYPE_RANK[b.type]) return TYPE_RANK[a.type] - TYPE_RANK[b.type];
    return b.priority - a.priority;
  });
}

/** Top 3 educators for a country, biased to in-person St John + Red Cross, plus one online in language. */
export async function getCountryEducators(countryCode: string, languageCode: string): Promise<{
  inPerson: Educator[];
  online: Educator | null;
}> {
  const upper = countryCode.toUpperCase();

  // In-person: educators with a service area in this country
  const { data: areaRows } = await supabase
    .from("educator_service_areas")
    .select("educator_id, educators!inner(*)")
    .eq("country_code", upper);

  const seen = new Set<string>();
  const inPersonAll: Educator[] = [];
  for (const row of (areaRows ?? []) as Array<{ educator_id: string; educators: Educator }>) {
    if (seen.has(row.educator_id)) continue;
    seen.add(row.educator_id);
    if (!row.educators.is_online) inPersonAll.push(row.educators);
  }
  const inPerson = sortEducators(inPersonAll).slice(0, 3);

  // Online: First Aid Angel is the only worldwide online course we surface.
  const { data: faa } = await supabase
    .from("educators")
    .select("*")
    .eq("slug", "first-aid-angel")
    .maybeSingle();
  const online: Educator | null = (faa as Educator | null) ?? null;

  return { inPerson, online };
}

export async function getEducatorBySlug(slug: string): Promise<EducatorFull | null> {
  const { data: ed } = await supabase.from("educators").select("*").eq("slug", slug).maybeSingle();
  if (!ed) return null;
  const [{ data: locations }, { data: areas }, { data: langs }] = await Promise.all([
    supabase.from("educator_locations").select("*").eq("educator_id", ed.id),
    supabase.from("educator_service_areas").select("*").eq("educator_id", ed.id),
    supabase.from("educator_languages").select("language_code").eq("educator_id", ed.id),
  ]);
  return {
    ...(ed as Educator),
    locations: (locations ?? []) as EducatorLocation[],
    service_areas: (areas ?? []) as EducatorServiceArea[],
    languages: ((langs ?? []) as Array<{ language_code: string }>).map((l) => l.language_code),
  };
}

export async function getCityLocations(countryCode: string, city: string): Promise<Array<EducatorLocation & { educator: Educator }>> {
  const { data } = await supabase
    .from("educator_locations")
    .select("*, educator:educators(*)")
    .eq("country_code", countryCode.toUpperCase())
    .ilike("city", city);
  return (data ?? []) as Array<EducatorLocation & { educator: Educator }>;
}

export async function getCitiesForCountry(countryCode: string): Promise<string[]> {
  const { data } = await supabase
    .from("educator_locations")
    .select("city")
    .eq("country_code", countryCode.toUpperCase())
    .not("city", "is", null);
  const set = new Set<string>();
  for (const row of (data ?? []) as Array<{ city: string | null }>) {
    if (row.city) set.add(row.city);
  }
  return [...set].sort();
}

export function citySlug(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function cityFromSlug(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Great-circle distance in km between two lat/lng points. */
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Nearest physical venues to a lat/lng, optionally scoped to a country.
 * Returns up to `limit` items, each annotated with `distance_km` (null when
 * the match came from an educator's declared service area rather than a
 * geocoded venue).
 *
 * Fallback: if fewer than `limit` geocoded venues exist for the country, we
 * top up with educators whose `service_areas` cover the user's country —
 * preferring matches on `region`/`city` when supplied. This lets countries
 * that only have country-wide providers (no per-venue coordinates) still
 * surface a "Nearest training venues" section.
 *
 * When lat/lng are omitted, distance-based sorting is skipped and we rely
 * entirely on service-area scoring (region/city/country matches).
 */
export async function getNearestVenues(
  lat?: number | null,
  lng?: number | null,
  opts: { countryCode?: string; region?: string | null; city?: string | null; limit?: number } = {},
): Promise<Array<EducatorLocation & { educator: Educator; distance_km: number | null }>> {
  const limit = opts.limit ?? 3;
  const hasCoords = typeof lat === "number" && typeof lng === "number";

  let geocoded: Array<EducatorLocation & { educator: Educator; distance_km: number | null }> = [];

  if (hasCoords) {
    let query = supabase
      .from("educator_locations")
      .select("*, educator:educators(*)")
      .not("lat", "is", null)
      .not("lng", "is", null);
    if (opts.countryCode) query = query.eq("country_code", opts.countryCode.toUpperCase());
    const { data } = await query;
    const rows = (data ?? []) as Array<EducatorLocation & { educator: Educator }>;
    geocoded = rows
      .map((r) => ({ ...r, distance_km: distanceKm(lat, lng, r.lat as number, r.lng as number) }))
      .sort((a, b) => (a.distance_km as number) - (b.distance_km as number))
      .slice(0, limit);

    if (geocoded.length >= limit || !opts.countryCode) return geocoded;
  }

  // Top up via service areas (no coordinates required).
  if (!opts.countryCode) return geocoded;

  const upper = opts.countryCode.toUpperCase();
  const { data: areaRows } = await supabase
    .from("educator_service_areas")
    .select("*, educator:educators(*)")
    .eq("country_code", upper);

  const usedEducatorIds = new Set(geocoded.map((r) => r.educator_id));
  const normalize = (s?: string | null) => (s ?? "").trim().toLowerCase();
  const userRegion = normalize(opts.region);
  const userCity = normalize(opts.city);

  const scored = ((areaRows ?? []) as Array<EducatorServiceArea & { educator: Educator }>)
    .filter((a) => !usedEducatorIds.has(a.educator_id) && !a.educator.is_online)
    .map((a) => {
      const cityMatch = userCity && normalize(a.city) === userCity ? 3 : 0;
      const regionMatch = userRegion && normalize(a.region) === userRegion ? 2 : 0;
      const countryOnly = !a.city && !a.region ? 1 : 1; // always 1 so country-wide providers appear
      const typeBoost = a.educator.type === "st_john" ? 1 : a.educator.type === "red_cross" ? 0.8 : 1;
      return { area: a, score: cityMatch + regionMatch + countryOnly + typeBoost + a.educator.priority * 0.01 };
    })
    .sort((a, b) => b.score - a.score);

  const seen = new Set(usedEducatorIds);
  const fallback: Array<EducatorLocation & { educator: Educator; distance_km: number | null }> = [];
  for (const { area } of scored) {
    if (seen.has(area.educator_id)) continue;
    seen.add(area.educator_id);
    fallback.push({
      id: `sa-${area.id}`,
      educator_id: area.educator_id,
      country_code: area.country_code,
      region: area.region,
      city: area.city,
      address: null,
      postcode: null,
      lat: null,
      lng: null,
      booking_url: area.educator.booking_url,
      phone: null,
      educator: area.educator,
      distance_km: null,
    });
    if (geocoded.length + fallback.length >= limit) break;
  }

  return [...geocoded, ...fallback];
}

