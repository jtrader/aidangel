// Reverse geocode proxy — server-side Nominatim wrapper.
//
// Why this exists (Rule 4 of the LoveKey HELP Network architecture):
//   - Nominatim requires a proper User-Agent header.
//   - Browsers block setting User-Agent from JavaScript.
//   - Therefore the request MUST happen server-side.
//
// Privacy:
//   - Coordinates are NEVER logged, written to a DB, or sent to analytics.
//   - Cache key is rounded to 4 decimal places (~11m precision) and lives in
//     memory only (per-instance Map). It expires after 60s.
//   - Returns 200 with {address: null} on any Nominatim failure (never 500).

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

type CacheEntry = { address: string | null; expires: number };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;
let lastNominatimCallAt = 0;
const MIN_INTERVAL_MS = 1100; // Nominatim policy: <= 1 req/sec, with margin.

function roundCoord(n: number) {
  return Math.round(n * 10_000) / 10_000;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'GET' && req.method !== 'POST') {
    return jsonResponse({ address: null }, 405);
  }

  let lat: number;
  let lng: number;
  try {
    if (req.method === 'GET') {
      const url = new URL(req.url);
      lat = Number.parseFloat(url.searchParams.get('lat') ?? '');
      lng = Number.parseFloat(url.searchParams.get('lng') ?? '');
    } else {
      const body = await req.json();
      lat = Number.parseFloat(String(body?.lat));
      lng = Number.parseFloat(String(body?.lng));
    }
  } catch {
    return jsonResponse({ address: null }, 400);
  }

  if (Number.isNaN(lat) || Number.isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return jsonResponse({ address: null }, 400);
  }

  const cacheKey = `${roundCoord(lat)},${roundCoord(lng)}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();
  if (cached && cached.expires > now) {
    return jsonResponse({ address: cached.address, cached: true });
  }

  // Polite client: enforce >=1s between Nominatim calls per instance.
  const wait = lastNominatimCallAt + MIN_INTERVAL_MS - now;
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }
  lastNominatimCallAt = Date.now();

  const siteName = Deno.env.get('SITE_NAME') ?? 'FirstAidAngel';
  const siteDomain = Deno.env.get('SITE_DOMAIN') ?? 'firstaidangel.org';

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': `${siteName}/1.0 (${siteDomain})`,
          'Accept-Language': 'en',
        },
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!res.ok) {
      cache.set(cacheKey, { address: null, expires: Date.now() + CACHE_TTL_MS });
      return jsonResponse({ address: null });
    }

    const data = await res.json();
    const address: string | null = data?.display_name ?? null;
    cache.set(cacheKey, { address, expires: Date.now() + CACHE_TTL_MS });
    return jsonResponse({ address });
  } catch {
    // Do not log coordinates — privacy rule.
    cache.set(cacheKey, { address: null, expires: Date.now() + CACHE_TTL_MS });
    return jsonResponse({ address: null });
  }
});
