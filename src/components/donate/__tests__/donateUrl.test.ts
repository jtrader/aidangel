import { describe, it, expect } from "vitest";
import {
  ST_JOHN_BY_COUNTRY,
  ST_JOHN_INTERNATIONAL,
  buildDonateUrl,
  siteForCountry,
} from "../DonateDialogContent";

describe("siteForCountry — country → St John site mapping", () => {
  const cases: Array<[string, string, string]> = [
    // [countryCode, expectedHost, expectedRegion]
    ["AU", "appeal.stjohnvic.com.au", "Australia"],
    ["NZ", "stjohn.org.nz", "New Zealand"],
    ["CA", "sja.ca", "Canada"],
    ["IE", "stjohn.ie", "Ireland"],
    ["GB", "sja.org.uk", "United Kingdom"],
  ];

  it.each(cases)("%s → %s (%s)", (code, host, region) => {
    const site = siteForCountry(code);
    expect(site.host).toBe(host);
    expect(site.region).toBe(region);
    expect(ST_JOHN_BY_COUNTRY[code]).toBe(site);
  });

  it.each(["US", "DE", "FR", "JP", "IN", "BR", "ZZ", ""])(
    "%s (no national site) → International (sja.org.uk)",
    (code) => {
      const site = siteForCountry(code);
      expect(site).toBe(ST_JOHN_INTERNATIONAL);
      expect(site.host).toBe("sja.org.uk");
      expect(site.region).toBe("International");
    }
  );

  it("AU is the only Raisely-powered site", () => {
    expect(siteForCountry("AU").raisely).toBe(true);
    ["NZ", "CA", "IE", "GB", "US"].forEach((c) => {
      expect(siteForCountry(c).raisely).toBe(false);
    });
  });
});

describe("buildDonateUrl — params per destination", () => {
  it("AU (Raisely) one-time: /donate?amount=35&frequency=ONE_OFF + utm", () => {
    const site = siteForCountry("AU");
    const url = new URL(buildDonateUrl(site, 35, "once"));
    expect(url.origin + url.pathname).toBe("https://appeal.stjohnvic.com.au/donate");
    expect(url.searchParams.get("amount")).toBe("35");
    expect(url.searchParams.get("frequency")).toBe("ONE_OFF");
    expect(url.searchParams.get("utm_source")).toBe("firstaidangel");
    expect(url.searchParams.get("utm_medium")).toBe("donate_dialog");
    expect(url.searchParams.get("utm_campaign")).toBe("give");
  });

  it("AU (Raisely) monthly: frequency=MONTHLY (uppercase)", () => {
    const url = new URL(buildDonateUrl(siteForCountry("AU"), 50, "monthly"));
    expect(url.searchParams.get("frequency")).toBe("MONTHLY");
    expect(url.searchParams.get("amount")).toBe("50");
  });

  it("Non-Raisely sites use lowercase 'monthly' / 'single' hints", () => {
    const nzOnce = new URL(buildDonateUrl(siteForCountry("NZ"), 25, "once"));
    expect(nzOnce.searchParams.get("frequency")).toBe("single");

    const gbMonthly = new URL(buildDonateUrl(siteForCountry("GB"), 25, "monthly"));
    expect(gbMonthly.searchParams.get("frequency")).toBe("monthly");
  });

  it("Canada uses its specific /en-ca/about-us/donate path", () => {
    const url = new URL(buildDonateUrl(siteForCountry("CA"), 20, "once"));
    expect(url.origin + url.pathname).toBe("https://www.sja.ca/en-ca/about-us/donate");
  });

  it.each([
    ["NZ", "https://www.stjohn.org.nz/donate"],
    ["IE", "https://www.stjohn.ie/donate"],
    ["GB", "https://www.sja.org.uk/donate"],
  ])("%s donate URL → %s", (code, expected) => {
    const url = new URL(buildDonateUrl(siteForCountry(code), 10, "once"));
    expect(url.origin + url.pathname).toBe(expected);
  });

  it("Fallback country (US) uses International site (sja.org.uk/donate)", () => {
    const url = new URL(buildDonateUrl(siteForCountry("US"), 100, "monthly"));
    expect(url.origin + url.pathname).toBe("https://www.sja.org.uk/donate");
    expect(url.searchParams.get("frequency")).toBe("monthly");
    expect(url.searchParams.get("amount")).toBe("100");
  });

  it("Amount <= 0 is omitted from URL", () => {
    const url = new URL(buildDonateUrl(siteForCountry("AU"), 0, "once"));
    expect(url.searchParams.has("amount")).toBe(false);
    expect(url.searchParams.get("frequency")).toBe("ONE_OFF");
  });
});
