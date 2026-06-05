import { describe, it, expect } from "vitest";
import {
  currencyForHost,
  formatPrice,
  zoneForCountry,
  ZONE_COUNTRIES,
  type KitZone,
} from "./kitZones";

// The host shop determines the charged currency, regardless of visitor zone.
const HOST_EXPECTATIONS: Array<{ host: string; currency: string; zone: KitZone }> = [
  { host: "shop.stjohn.org.au", currency: "AUD", zone: "AU" },
  { host: "shop.sja.org.uk", currency: "GBP", zone: "UK_IE" },
];

describe("currencyForHost", () => {
  for (const { host, currency } of HOST_EXPECTATIONS) {
    it(`maps https://${host} → ${currency}`, () => {
      expect(currencyForHost(`https://${host}/products/foo`)).toBe(currency);
    });
    it(`maps http://${host} → ${currency}`, () => {
      expect(currencyForHost(`http://${host}`)).toBe(currency);
    });
    it(`preserves mapping with query + path for ${host}`, () => {
      expect(
        currencyForHost(`https://${host}/products/foo?utm_source=fa`),
      ).toBe(currency);
    });
  }

  it("returns null for unknown hosts", () => {
    expect(currencyForHost("https://example.com/x")).toBeNull();
    expect(currencyForHost("https://shop.example.org.uk")).toBeNull();
  });

  it("returns null for empty / invalid input", () => {
    expect(currencyForHost(null)).toBeNull();
    expect(currencyForHost(undefined)).toBeNull();
    expect(currencyForHost("")).toBeNull();
    expect(currencyForHost("not a url")).toBeNull();
  });
});

describe("formatPrice host-derived currency", () => {
  it("uses AUD symbol for AU host even if stored currency differs", () => {
    expect(formatPrice(19.5, "GBP", "https://shop.stjohn.org.au/products/kit")).toBe("A$19.50");
  });

  it("uses GBP symbol for UK host even if stored currency differs", () => {
    expect(formatPrice(19.5, "AUD", "https://shop.sja.org.uk/products/kit")).toBe("£19.50");
  });

  it("falls back to stored currency when host is unknown", () => {
    expect(formatPrice(10, "EUR", "https://example.com/p")).toBe("€10.00");
  });

  it("falls back to stored currency when no destinationUrl is given", () => {
    expect(formatPrice(10, "USD")).toBe("US$10.00");
    expect(formatPrice(10, "CAD")).toBe("C$10.00");
  });

  it("returns empty string when price is null", () => {
    expect(formatPrice(null, "GBP", "https://shop.sja.org.uk")).toBe("");
  });

  it("returns empty string when no currency can be resolved", () => {
    expect(formatPrice(10, null, "https://example.com")).toBe("");
  });
});

describe("zone → host currency coverage", () => {
  // Every visitor country in every zone must resolve to a charged currency
  // via one of the two supported host shops.
  const ZONE_HOST: Record<KitZone, string> = {
    AU: "https://shop.stjohn.org.au/products/x",
    UK_IE: "https://shop.sja.org.uk/products/x",
    NORTH_AM: "https://shop.sja.org.uk/products/x",
    EU_MENA: "https://shop.sja.org.uk/products/x",
  };
  const ZONE_CURRENCY: Record<KitZone, string> = {
    AU: "AUD",
    UK_IE: "GBP",
    NORTH_AM: "GBP",
    EU_MENA: "GBP",
  };

  for (const zone of Object.keys(ZONE_COUNTRIES) as KitZone[]) {
    for (const country of ZONE_COUNTRIES[zone]) {
      it(`${country} (${zone}) → ${ZONE_CURRENCY[zone]}`, () => {
        expect(zoneForCountry(country)).toBe(zone);
        expect(currencyForHost(ZONE_HOST[zone])).toBe(ZONE_CURRENCY[zone]);
      });
    }
  }
});
