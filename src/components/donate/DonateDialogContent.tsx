// Donate dialogue body: amount presets + custom, frequency toggle.
// Hardcoded to St John Ambulance (appeal.stjohnvic.com.au).
// Country switcher remains to localize currency presets.

import { useEffect, useState } from "react";
import { Check, Globe, HandHeart, ExternalLink } from "lucide-react";
import stJohnIcon from "@/assets/stjohn-icon.png";
import { COUNTRIES, CountryCode, type Country } from "@/lib/donations";
import { currencyFor, type Frequency } from "@/lib/donationAmount";
import { trackGiveClick } from "@/lib/giveAnalytics";
import { cn } from "@/lib/utils";

const ST_JOHN_BASE = "https://appeal.stjohnvic.com.au";
const ST_JOHN_DONATE_URL = `${ST_JOHN_BASE}/donate`;
const ST_JOHN_NAME = "St John Ambulance";

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
    changeCountry: string;
    showing: string;
  };
}

function buildStJohnUrl(amount: number, frequency: Frequency) {
  // Raisely-powered campaign: /donate accepts ?amount=<dollars>&frequency=MONTHLY|ONE_OFF
  const url = new URL(ST_JOHN_DONATE_URL);
  if (amount > 0) url.searchParams.set("amount", String(amount));
  url.searchParams.set("frequency", frequency === "monthly" ? "MONTHLY" : "ONE_OFF");
  url.searchParams.set("utm_source", "firstaidangel");
  url.searchParams.set("utm_medium", "donate_dialog");
  url.searchParams.set("utm_campaign", "give");
  return url.toString();
}

export function DonateDialogContent({
  country,
  onCountryChange,
  language,
  variant = "header",
  labels,
}: DonateDialogContentProps) {
  const currency = currencyFor(country);

  const [amount, setAmount] = useState<number>(currency.presets[1] ?? currency.presets[0]);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const currencyKey = currency.code;
  useEffect(() => {
    setAmount(currency.presets[1] ?? currency.presets[0]);
    setCustomMode(false);
    setCustomValue("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyKey]);

  const finalAmount = customMode ? Math.max(1, Math.floor(Number(customValue) || 0)) : amount;
  const canDonate = finalAmount > 0;
  const href = buildStJohnUrl(finalAmount, frequency);

  const handleDonate = () => {
    trackGiveClick({
      ngoId: "stjohn" as never,
      countryCode: country.code,
      countryName: country.name,
      destinationUrl: href,
      isNational: country.code === "AU",
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

      {/* St John card */}
      <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-primary/30 bg-primary/5">
        <Favicon url={ST_JOHN_URL} alt="" size={32} className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">
            {ST_JOHN_NAME}
          </div>
          <div className="text-[11px] text-muted-foreground truncate">
            appeal.stjohnvic.com.au
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
        {ST_JOHN_NAME} · appeal.stjohnvic.com.au
      </p>

      {/* Country switcher (currency localization) */}
      <div className="border-t border-border pt-3">
        <button
          type="button"
          onClick={() => setShowCountryPicker((v) => !v)}
          className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="inline-flex items-center gap-1.5 min-w-0">
            <Globe className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">
              {labels.showing}{" "}
              <span className="font-semibold text-foreground">
                {country.flag} {country.name}
              </span>
            </span>
          </span>
          <span className="underline flex-shrink-0 ml-2">{labels.changeCountry}</span>
        </button>
        {showCountryPicker && (
          <div className="mt-3 max-h-56 overflow-y-auto rounded-xl border border-border bg-background">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onCountryChange(c.code as CountryCode);
                  setShowCountryPicker(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors",
                  c.code === country.code && "bg-muted/60"
                )}
              >
                <span className="text-base">{c.flag}</span>
                <span className="flex-1 text-left">{c.name}</span>
                {c.code === country.code && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
