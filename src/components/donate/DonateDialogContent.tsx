// Donate dialogue body: amount presets + custom, frequency toggle.
// Destination is the nearest St John Ambulance donation site based on
// the site-wide country selector. Falls back to the international
// (UK) St John site for countries without a national St John presence.

import { useEffect, useState } from "react";
import { HandHeart, ExternalLink } from "lucide-react";
import stJohnIcon from "@/assets/stjohn-icon.png";
import { CountryCode, type Country } from "@/lib/donations";
import { currencyFor, type Frequency } from "@/lib/donationAmount";
import { trackGiveClick } from "@/lib/giveAnalytics";
import { cn } from "@/lib/utils";

const ST_JOHN_NAME = "St John Ambulance";

interface StJohnSite {
  /** Country code(s) this site serves as the national site. */
  base: string;
  donatePath: string;
  /** Display host. */
  host: string;
  /** Region label shown under the name. */
  region: string;
  /** True if the site uses Raisely params (amount, frequency=MONTHLY|ONE_OFF). */
  raisely: boolean;
}

// Map ISO country codes to the nearest applicable St John Ambulance site.
// Australia → Victoria appeal (Raisely); UK/Ireland/Commonwealth → sja.org.uk;
// NZ → stjohn.org.nz; Canada → sja.ca; others → UK as international hub.
const ST_JOHN_BY_COUNTRY: Record<string, StJohnSite> = {
  AU: { base: "https://appeal.stjohnvic.com.au", donatePath: "/donate", host: "appeal.stjohnvic.com.au", region: "Australia", raisely: true },
  NZ: { base: "https://www.stjohn.org.nz", donatePath: "/donate", host: "stjohn.org.nz", region: "New Zealand", raisely: false },
  CA: { base: "https://www.sja.ca", donatePath: "/en-ca/about-us/donate", host: "sja.ca", region: "Canada", raisely: false },
  IE: { base: "https://www.stjohn.ie", donatePath: "/donate", host: "stjohn.ie", region: "Ireland", raisely: false },
  GB: { base: "https://www.sja.org.uk", donatePath: "/donate", host: "sja.org.uk", region: "United Kingdom", raisely: false },
};

const ST_JOHN_INTERNATIONAL: StJohnSite = {
  base: "https://www.sja.org.uk",
  donatePath: "/donate",
  host: "sja.org.uk",
  region: "International",
  raisely: false,
};

function siteForCountry(code: string): StJohnSite {
  return ST_JOHN_BY_COUNTRY[code] ?? ST_JOHN_INTERNATIONAL;
}

interface DonateDialogContentProps {
  country: Country;
  onCountryChange: (code: CountryCode) => void;
  language: string;
  variant?: "header" | "footer";
  labels: {
    heading: string;
    subhead: string;
    amountLabel: string;
    custom: string;
    once: string;
    monthly: string;
    donateCta: string;
  };
}

function buildDonateUrl(site: StJohnSite, amount: number, frequency: Frequency) {
  const url = new URL(site.base + site.donatePath);
  if (amount > 0) url.searchParams.set("amount", String(amount));
  if (site.raisely) {
    // Raisely-powered sites (e.g. appeal.stjohnvic.com.au) expect uppercase enums.
    url.searchParams.set("frequency", frequency === "monthly" ? "MONTHLY" : "ONE_OFF");
  } else {
    // Generic hint — harmless on sites that ignore it.
    url.searchParams.set("frequency", frequency === "monthly" ? "monthly" : "single");
  }
  url.searchParams.set("utm_source", "firstaidangel");
  url.searchParams.set("utm_medium", "donate_dialog");
  url.searchParams.set("utm_campaign", "give");
  return url.toString();
}

export function DonateDialogContent({
  country,
  language,
  variant = "header",
  labels,
}: DonateDialogContentProps) {
  const currency = currencyFor(country);
  const site = siteForCountry(country.code);

  const [amount, setAmount] = useState<number>(currency.presets[1] ?? currency.presets[0]);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("once");

  const currencyKey = currency.code;
  useEffect(() => {
    setAmount(currency.presets[1] ?? currency.presets[0]);
    setCustomMode(false);
    setCustomValue("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyKey]);

  const finalAmount = customMode ? Math.max(1, Math.floor(Number(customValue) || 0)) : amount;
  const canDonate = finalAmount > 0;
  const href = buildDonateUrl(site, finalAmount, frequency);
  const isNational = !!ST_JOHN_BY_COUNTRY[country.code];

  const handleDonate = () => {
    trackGiveClick({
      ngoId: "stjohn" as never,
      countryCode: country.code,
      countryName: country.name,
      destinationUrl: href,
      isNational,
      language,
      variant,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-1">
          <HandHeart className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
          {labels.heading}
        </h2>
        <p className="text-sm text-muted-foreground">
          {labels.subhead}
        </p>
      </div>

      {/* St John card — dynamic per country */}
      <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-primary/30 bg-primary/5">
        <img
          src={stJohnIcon}
          alt={`${ST_JOHN_NAME} logo`}
          width={32}
          height={32}
          loading="lazy"
          className="flex-shrink-0 w-8 h-8 rounded-md bg-white object-contain p-0.5 ring-1 ring-border"
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">
            {ST_JOHN_NAME}{" "}
            <span className="font-normal text-muted-foreground">· {site.region}</span>
          </div>
          <div className="text-[11px] text-muted-foreground truncate">
            {site.host}
          </div>
        </div>
      </div>

      {/* Frequency toggle */}
      <div
        role="tablist"
        aria-label={labels.amountLabel}
        className="grid grid-cols-2 gap-1 p-1 rounded-full bg-muted"
      >
        {(["once", "monthly"] as Frequency[]).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={frequency === f}
            type="button"
            onClick={() => setFrequency(f)}
            className={cn(
              "h-9 rounded-full text-sm font-medium transition-colors",
              frequency === f
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f === "once" ? labels.once : labels.monthly}
          </button>
        ))}
      </div>

      {/* Amount presets */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {labels.amountLabel} ({currency.code})
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {currency.presets.map((p) => {
            const active = !customMode && amount === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => { setCustomMode(false); setAmount(p); }}
                aria-pressed={active}
                className={cn(
                  "h-12 rounded-xl border-2 text-base font-semibold transition-all",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                )}
              >
                {currency.symbol}{p}
              </button>
            );
          })}
        </div>
        <div
          className={cn(
            "flex items-center gap-2 mt-2 rounded-xl border-2 px-3 transition-colors",
            customMode ? "border-primary bg-primary/5" : "border-border bg-card"
          )}
        >
          <span className="text-sm font-semibold text-muted-foreground">
            {currency.symbol}
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            placeholder={labels.custom}
            value={customValue}
            onFocus={() => setCustomMode(true)}
            onChange={(e) => {
              setCustomMode(true);
              setCustomValue(e.target.value);
            }}
            className="flex-1 h-11 bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground/70 placeholder:font-normal"
            aria-label={labels.custom}
          />
        </div>
      </div>

      {/* CTA */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDonate}
        data-analytics-event="give_click"
        data-analytics-ngo="stjohn"
        data-analytics-country={country.code}
        aria-disabled={!canDonate}
        className={cn(
          "w-full inline-flex items-center justify-center gap-2 h-14 rounded-full bg-primary text-primary-foreground text-base font-semibold shadow-sm transition-all",
          canDonate ? "hover:bg-primary/90 hover:shadow-md" : "opacity-50 pointer-events-none"
        )}
      >
        <HandHeart className="h-5 w-5" aria-hidden="true" />
        <span>
          {labels.donateCta} {currency.symbol}{finalAmount || 0}
          {frequency === "monthly" ? `/mo` : ""}
        </span>
        <ExternalLink className="h-4 w-4 opacity-80" aria-hidden="true" />
      </a>
      <p className="text-[11px] text-center text-muted-foreground -mt-2">
        {ST_JOHN_NAME} · {site.host}
      </p>
    </div>
  );
}
