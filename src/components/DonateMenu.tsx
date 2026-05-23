import { useEffect, useState } from "react";
import { HandHeart, Check, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCountry } from "@/hooks/useCountry";
import {
  COUNTRIES,
  CountryCode,
  NGOS,
  NgoId,
  donationUrl,
} from "@/lib/donations";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateStrings } from "@/lib/uiTranslate";
import { trackGiveClick } from "@/lib/giveAnalytics";
import { Favicon } from "@/components/Favicon";

interface DonateMenuProps {
  variant?: "header" | "footer";
  /** Restrict to a single NGO (e.g. on a CPR topic). Defaults to all three. */
  ngos?: NgoId[];
}

const STATIC = [
  "Give",
  "Donate",
  "Support first aid worldwide",
  "Change country",
  "Showing donation links for",
];

export default function DonateMenu({ variant = "header", ngos }: DonateMenuProps) {
  const { country, setCountry } = useCountry();
  const { language } = useLanguage();
  const list = ngos ?? (Object.keys(NGOS) as NgoId[]);
  const [tr, setTr] = useState({
    give: "Give",
    donate: "Donate",
    heading: "Support first aid worldwide",
    change: "Change country",
    showing: "Showing donation links for",
  });

  useEffect(() => {
    if (language === "en") {
      setTr({ give: STATIC[0], donate: STATIC[1], heading: STATIC[2], change: STATIC[3], showing: STATIC[4] });
      return;
    }
    let cancelled = false;
    translateStrings(language, STATIC).then((s) => {
      if (cancelled) return;
      setTr({ give: s[0], donate: s[1], heading: s[2], change: s[3], showing: s[4] });
    });
    return () => { cancelled = true; };
  }, [language]);

  const triggerClasses =
    variant === "header"
      ? "inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      : "inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={triggerClasses}
        aria-label={`${tr.give} — ${country.name}`}
      >
        <HandHeart className="h-4 w-4" aria-hidden="true" />
        <span className="sm:hidden" aria-hidden="true">{tr.give}</span>
        <span className="hidden sm:inline" aria-hidden="true">{tr.donate}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 bg-popover">
        <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {tr.heading}
        </DropdownMenuLabel>
        <p className="px-2 pb-2 text-[11px] text-muted-foreground">
          {tr.showing} <span className="font-medium text-foreground">{country.flag} {country.name}</span>
        </p>
        <DropdownMenuSeparator />
        {list.map((id) => {
          const ngo = NGOS[id];
          const url = donationUrl(country, id);
          const isNational = !!country.donations[id];
          return (
            <DropdownMenuItem key={id} asChild>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackGiveClick({
                    ngoId: id,
                    countryCode: country.code,
                    countryName: country.name,
                    destinationUrl: url,
                    isNational,
                    language,
                    variant,
                  })
                }
                data-analytics-event="give_click"
                data-analytics-ngo={id}
                data-analytics-country={country.code}
                className="flex items-start gap-2.5 cursor-pointer"
              >
                <Favicon url={url} alt="" size={18} className="mt-0.5" />
                <span className="flex flex-col items-start gap-0.5 min-w-0">
                  <span className="text-sm font-medium text-foreground">{ngo.short}</span>
                  <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                    {isNational ? `${country.name} site` : (
                      <><Globe className="h-3 w-3" /> International site</>
                    )}
                  </span>
                </span>
              </a>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            {tr.change}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="max-h-80 overflow-y-auto bg-popover">
            {COUNTRIES.map((c) => (
              <DropdownMenuItem
                key={c.code}
                onSelect={() => setCountry(c.code as CountryCode)}
                className="cursor-pointer"
              >
                <span className="mr-2 text-base">{c.flag}</span>
                <span className="flex-1 text-sm">{c.name}</span>
                {c.code === country.code && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
