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

  // Online in language
  const { data: langRows } = await supabase
    .from("educator_languages")
    .select("educator_id, educators!inner(*)")
    .eq("language_code", languageCode)
    .eq("educators.is_online", true);

  let online: Educator | null = null;
  const onlineList = sortEducators(
    ((langRows ?? []) as Array<{ educators: Educator }>).map((r) => r.educators),
  );
  online = onlineList[0] ?? null;

  // Fallback to English if no online match
  if (!online && languageCode !== "en") {
    const { data: enRows } = await supabase
      .from("educator_languages")
      .select("educator_id, educators!inner(*)")
      .eq("language_code", "en")
      .eq("educators.is_online", true);
    online = sortEducators(((enRows ?? []) as Array<{ educators: Educator }>).map((r) => r.educators))[0] ?? null;
  }

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
 * Returns up to `limit` items, each annotated with `distance_km`.
 */
export async function getNearestVenues(
  lat: number,
  lng: number,
  opts: { countryCode?: string; limit?: number } = {},
): Promise<Array<EducatorLocation & { educator: Educator; distance_km: number }>> {
  const limit = opts.limit ?? 3;
  let query = supabase
    .from("educator_locations")
    .select("*, educator:educators(*)")
    .not("lat", "is", null)
    .not("lng", "is", null);
  if (opts.countryCode) query = query.eq("country_code", opts.countryCode.toUpperCase());
  const { data } = await query;
  const rows = (data ?? []) as Array<EducatorLocation & { educator: Educator }>;
  return rows
    .map((r) => ({ ...r, distance_km: distanceKm(lat, lng, r.lat as number, r.lng as number) }))
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit);
}
