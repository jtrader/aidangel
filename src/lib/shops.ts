// Curated directory of online first aid shops that ship to each country.
// Currently lists St John Ambulance only (Red Cross + generic national-supplier
// profiles were removed from the site).

import { COUNTRIES, type CountryCode, getCountry, DEFAULT_COUNTRY } from "@/lib/donations";

export type ShopId = "stjohn";

export type ShopMeta = {
  id: ShopId;
  name: string;
  short: string;
  international: string;
};

export const SHOPS: Record<ShopId, ShopMeta> = {
  stjohn: {
    id: "stjohn",
    name: "St John First Aid Shop",
    short: "St John First Aid",
    international: "https://shop.stjohn.org.au/",
  },
};

/** Per-country St John online shops (where one exists). */
export const COUNTRY_SHOPS: Record<string, Partial<Record<ShopId, string>>> = {
  AU: { stjohn: "https://shop.stjohn.org.au/" },
  NZ: { stjohn: "https://shop.stjohn.org.nz/" },
  GB: { stjohn: "https://www.sja.org.uk/first-aid-supplies/" },
  CA: { stjohn: "https://www.sja.ca/en/shop" },
  ZA: { stjohn: "https://stjohn.org.za/shop/" },
  KE: { stjohn: "https://www.stjohnkenya.org/shop/" },
  HK: { stjohn: "https://www.stjohn.org.hk/en/shop/" },
};

export function shopsForCountry(
  code: string | null | undefined,
): Array<{ id: ShopId; url: string; isNational: boolean }> {
  const country = getCountry(code ?? DEFAULT_COUNTRY);
  const national = COUNTRY_SHOPS[country.code] ?? {};
  const out: Array<{ id: ShopId; url: string; isNational: boolean }> = [];
  const url = national.stjohn;
  if (url) {
    out.push({ id: "stjohn", url, isNational: true });
  } else {
    out.push({ id: "stjohn", url: SHOPS.stjohn.international, isNational: false });
  }
  return out;
}

export function shopUrl(code: string | null | undefined, id: ShopId): string {
  const national = COUNTRY_SHOPS[(code ?? DEFAULT_COUNTRY) as CountryCode];
  return national?.[id] ?? SHOPS[id].international;
}

export { COUNTRIES };
