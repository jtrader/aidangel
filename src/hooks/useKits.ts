import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { countriesInZone, type KitZone } from "@/lib/kitZones";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";

export interface Kit {
  id: string;
  route_slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  destination_url: string | null;
  country: string | null;
  price: number | null;
  currency: string | null;
  shopify_handle?: string | null;
}

// Normalize a kit title so Shopify product master data can be matched
// to per-country route_catalogue rows (must mirror the rule used when the
// Shopify products were created).
function normalizeTitle(t: string): string {
  return t
    .replace(/\s*BS[-\s]?8599[-\s]?1[:\-]?2019\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function titleToHandle(t: string): string {
  return normalizeTitle(t)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Cache Shopify product master data per zone for the session.
const shopifyCache = new Map<KitZone, Promise<Map<string, ShopifyProduct["node"]>>>();

// Zone → Shopify smart collection handle (created via
// scripts/shopify-create-kit-zone-collections.ts). Curating membership in
// Shopify admin (collection rules) is now the source of truth for which kits
// appear per region — replaces the previous `tag:faa-affiliate-kit AND tag:zone-*`
// filter.
const ZONE_COLLECTION_HANDLE: Record<KitZone, string> = {
  AU: "kits-au",
  UK_IE: "kits-uk-ie",
  NORTH_AM: "kits-north-am",
  EU_MENA: "kits-eu-mena",
};

function fetchShopifyMastersForZone(zone: KitZone) {
  let p = shopifyCache.get(zone);
  if (!p) {
    p = (async () => {
      const handle = ZONE_COLLECTION_HANDLE[zone];
      const query = `collection:${handle}`;
      const res = await storefrontApiRequest<{ products: { edges: ShopifyProduct[] } }>(
        PRODUCTS_QUERY,
        { first: 50, query },
      );
      const map = new Map<string, ShopifyProduct["node"]>();
      for (const edge of res?.data?.products?.edges ?? []) {
        map.set(edge.node.handle, edge.node);
      }
      return map;
    })();
    shopifyCache.set(zone, p);
  }
  return p;
}

export function useKitsForZone(zone: KitZone, opts?: { limit?: number; preferCountry?: string }) {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const countries = countriesInZone(zone);

    (async () => {
      try {
        const [routesRes, shopifyMap] = await Promise.all([
          supabase
            .from("route_catalogue")
            .select(
              "id, route_slug, title, description, image_url, destination_url, country, price, currency",
            )
            // Exclude rows explicitly marked unavailable; allow null/unknown to surface.
            .neq("availability_status", "unavailable")
            .in("country", countries),
          fetchShopifyMastersForZone(zone),
        ]);

        if (cancelled) return;
        const data = (routesRes as any)?.data as Kit[] | null;
        if (!data) {
          setKits([]);
          setLoading(false);
          return;
        }

        // Dedupe by Shopify handle — prefer exact country match, then any.
        const byHandle = new Map<string, Kit>();
        const preferred = opts?.preferCountry?.toUpperCase();
        for (const row of data as Kit[]) {
          const handle = titleToHandle(row.title);
          const shop = (await shopifyMap)?.get(handle);
          // Merge: Shopify owns title/image/description; route_catalogue owns price + affiliate URL.
          const merged: Kit = {
            ...row,
            title: shop?.title ?? row.title,
            description: shop?.description ?? row.description,
            image_url: shop?.images?.edges?.[0]?.node?.url ?? row.image_url,
            shopify_handle: shop?.handle ?? null,
          };
          const existing = byHandle.get(handle);
          if (!existing) {
            byHandle.set(handle, merged);
          } else if (preferred && row.country === preferred && existing.country !== preferred) {
            byHandle.set(handle, merged);
          }
        }
        let result = Array.from(byHandle.values()).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        if (opts?.limit) result = result.slice(0, opts.limit);
        setKits(result);
      } catch (e: any) {
        setError(e?.message ?? String(e));
        setKits([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [zone, opts?.limit, opts?.preferCountry]);

  return { kits, loading, error };
}
