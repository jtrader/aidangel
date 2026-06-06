// Helpers for the Donate dialog: per-country currency + URL builders that
// append amount/frequency hints. Most NGO checkouts don't honour query
// params, but several MSF national sites (AU, UK, CA, US) and St John AU
// do — for the rest the user can adjust on the NGO page.

import { NGOS, NgoId, type Country, donationUrl } from "./donations";

export type Frequency = "once" | "monthly";

export interface CurrencyInfo {
  code: string;   // ISO 4217
  symbol: string;
  presets: number[];
}

const DEFAULT_PRESETS = [10, 25, 50, 100];

const CURRENCY_BY_COUNTRY: Record<string, CurrencyInfo> = {
  AU: { code: "AUD", symbol: "$",   presets: [20, 50, 100, 250] },
  NZ: { code: "NZD", symbol: "$",   presets: [20, 50, 100, 250] },
  US: { code: "USD", symbol: "$",   presets: [15, 35, 75, 150] },
  CA: { code: "CAD", symbol: "$",   presets: [20, 50, 100, 250] },
  GB: { code: "GBP", symbol: "£",   presets: [10, 25, 50, 100] },
  IE: { code: "EUR", symbol: "€",   presets: [10, 25, 50, 100] },
  DE: { code: "EUR", symbol: "€",   presets: [10, 25, 50, 100] },
  FR: { code: "EUR", symbol: "€",   presets: [10, 25, 50, 100] },
  NL: { code: "EUR", symbol: "€",   presets: [10, 25, 50, 100] },
  BE: { code: "EUR", symbol: "€",   presets: [10, 25, 50, 100] },
  AT: { code: "EUR", symbol: "€",   presets: [10, 25, 50, 100] },
  LU: { code: "EUR", symbol: "€",   presets: [10, 25, 50, 100] },
  IT: { code: "EUR", symbol: "€",   presets: [10, 25, 50, 100] },
  ES: { code: "EUR", symbol: "€",   presets: [10, 25, 50, 100] },
  PT: { code: "EUR", symbol: "€",   presets: [10, 25, 50, 100] },
  GR: { code: "EUR", symbol: "€",   presets: [10, 25, 50, 100] },
  FI: { code: "EUR", symbol: "€",   presets: [10, 25, 50, 100] },
  CH: { code: "CHF", symbol: "CHF", presets: [10, 25, 50, 100] },
  SE: { code: "SEK", symbol: "kr",  presets: [100, 250, 500, 1000] },
  NO: { code: "NOK", symbol: "kr",  presets: [100, 250, 500, 1000] },
  DK: { code: "DKK", symbol: "kr",  presets: [75, 150, 300, 750] },
  JP: { code: "JPY", symbol: "¥",   presets: [1000, 3000, 5000, 10000] },
  HK: { code: "HKD", symbol: "HK$", presets: [100, 250, 500, 1000] },
  SG: { code: "SGD", symbol: "S$",  presets: [20, 50, 100, 250] },
  IN: { code: "INR", symbol: "₹",   presets: [500, 1000, 2500, 5000] },
  ZA: { code: "ZAR", symbol: "R",   presets: [100, 250, 500, 1000] },
  BR: { code: "BRL", symbol: "R$",  presets: [25, 50, 100, 250] },
  AE: { code: "AED", symbol: "AED", presets: [50, 100, 250, 500] },
  IL: { code: "ILS", symbol: "₪",   presets: [50, 100, 250, 500] },
  EG: { code: "EGP", symbol: "E£",  presets: [100, 250, 500, 1000] },
};

export function currencyFor(country: { code?: string } | null | undefined): CurrencyInfo {
  const code = country?.code ?? "";
  return CURRENCY_BY_COUNTRY[code] ?? { code: "USD", symbol: "$", presets: DEFAULT_PRESETS };
}

/** Append amount/frequency hints to NGO donate URL when sensible. */
export function buildDonateUrl(
  country: Country,
  ngo: NgoId,
  amount: number,
  frequency: Frequency,
): string {
  const base = donationUrl(country, ngo);
  try {
    const url = new URL(base);
    // Generic hints — picked up by some MSF national sites and harmless elsewhere.
    url.searchParams.set("amount", String(amount));
    url.searchParams.set("frequency", frequency);
    if (frequency === "monthly") url.searchParams.set("recurring", "1");
    // FAA-side attribution
    url.searchParams.set("utm_source", "firstaidangel");
    url.searchParams.set("utm_medium", "donate_dialog");
    url.searchParams.set("utm_campaign", ngo);
    return url.toString();
  } catch {
    return base;
  }
}

export function ngoLabel(id: NgoId): string {
  return NGOS[id].short;
}
