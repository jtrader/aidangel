// Donate dialogue body: amount presets + custom, frequency toggle, NGO picker,
// country switcher. Deep-links to the selected NGO with amount/frequency hints.

import { useEffect, useMemo, useState } from "react";
import { Check, Globe, HandHeart, ExternalLink } from "lucide-react";
import { Favicon } from "@/components/Favicon";
import {
  COUNTRIES,
  CountryCode,
  NGOS,
  NgoId,
  donationUrl,
  type Country,
} from "@/lib/donations";
import {
  buildDonateUrl,
  currencyFor,
  type Frequency,
} from "@/lib/donationAmount";
import { trackGiveClick } from "@/lib/giveAnalytics";
import { cn } from "@/lib/utils";

interface DonateDialogContentProps {
  country: Country;
  onCountryChange: (code: CountryCode) => void;
  language: string;
  ngos?: NgoId[];
  variant?: "header" | "footer";
  labels: {
    heading: string;
    subhead: string;
    amountLabel: string;
    custom: string;
    once: string;
    monthly: string;
    chooseNgo: string;
    donateCta: string;
    nationalSite: string;
    internationalSite: string;
    changeCountry: string;
    showing: string;
  };
}

export function DonateDialogContent({
  country,
  onCountryChange,
  language,
  ngos,
  variant = "header",
  labels,
}: DonateDialogContentProps) {
  const list = ngos ?? (Object.keys(NGOS) as NgoId[]);
  const currency = useMemo(() => currencyFor(country), [country]);

  const [amount, setAmount] = useState<number>(currency.presets[1] ?? currency.presets[0]);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [selectedNgo, setSelectedNgo] = useState<NgoId>(list[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // Reset amount when country/currency changes
  const currencyKey = currency.code;
  useMemo(() => {
    setAmount(currency.presets[1] ?? currency.presets[0]);
    setCustomMode(false);
    setCustomValue("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyKey]);

  const finalAmount = customMode ? Math.max(1, Math.floor(Number(customValue) || 0)) : amount;
  const canDonate = finalAmount > 0;
  const ngo = NGOS[selectedNgo];
  const isNational = !!country.donations[selectedNgo];
  const href = canDonate
    ? buildDonateUrl(country, selectedNgo, finalAmount, frequency)
    : donationUrl(country, selectedNgo);

  const handleDonate = () => {
    trackGiveClick({
      ngoId: selectedNgo,
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

      {/* NGO picker */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {labels.chooseNgo}
        </div>
        <div className="space-y-2">
          {list.map((id) => {
            const meta = NGOS[id];
            const national = !!country.donations[id];
            const previewUrl = donationUrl(country, id);
            const active = selectedNgo === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedNgo(id)}
                aria-pressed={active}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <Favicon url={previewUrl} alt="" size={28} className="flex-shrink-0" />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-foreground truncate">
                    {meta.short}
                  </span>
                  <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                    {national ? (
                      `${country.flag} ${country.name} site`
                    ) : (
                      <>
                        <Globe className="h-3 w-3" /> {labels.internationalSite}
                      </>
                    )}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full border-2",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  )}
                  aria-hidden="true"
                >
                  {active && <Check className="h-3 w-3" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDonate}
        data-analytics-event="give_click"
        data-analytics-ngo={selectedNgo}
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
        {ngo.short} · {isNational ? `${country.name} site` : labels.internationalSite}
      </p>

      {/* Country switcher */}
      <div className="border-t border-border pt-3">
        <button
          type="button"
          onClick={() => setShowCountryPicker((v) => !v)}
          className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="inline-flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            {labels.showing}{" "}
            <span className="font-semibold text-foreground">
              {country.flag} {country.name}
            </span>
          </span>
          <span className="underline">{labels.changeCountry}</span>
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
