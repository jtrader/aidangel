import { useEffect, useState } from "react";
import { ShoppingBag, Check, Globe, Truck } from "lucide-react";
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
import { COUNTRIES, CountryCode } from "@/lib/donations";
import { SHOPS, shopsForCountry, type ShopId } from "@/lib/shops";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateStrings } from "@/lib/uiTranslate";
import { trackShopClick } from "@/lib/giveAnalytics";

interface ShopMenuProps {
  variant?: "header" | "footer";
}

const STATIC = [
  "Shop",
  "First Aid Shop",
  "First aid kits & supplies",
  "Change country",
  "Showing shops for",
  "Ships nationally",
  "International store",
];

export default function ShopMenu({ variant = "footer" }: ShopMenuProps) {
  const { country, setCountry } = useCountry();
  const { language } = useLanguage();
  const items = shopsForCountry(country.code);

  const [tr, setTr] = useState({
    shopShort: "Shop",
    shopLong: "First Aid Shop",
    heading: "First aid kits & supplies",
    change: "Change country",
    showing: "Showing shops for",
    shipsNat: "Ships nationally",
    intl: "International store",
  });

  useEffect(() => {
    if (language === "en") {
      setTr({
        shopShort: STATIC[0], shopLong: STATIC[1], heading: STATIC[2],
        change: STATIC[3], showing: STATIC[4], shipsNat: STATIC[5], intl: STATIC[6],
      });
      return;
    }
    let cancelled = false;
    translateStrings(language, STATIC).then((s) => {
      if (cancelled) return;
      setTr({
        shopShort: s[0], shopLong: s[1], heading: s[2],
        change: s[3], showing: s[4], shipsNat: s[5], intl: s[6],
      });
    });
    return () => { cancelled = true; };
  }, [language]);

  const triggerClasses =
    "inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={triggerClasses}
        aria-label={`${tr.shopLong} — ${country.name}`}
      >
        <ShoppingBag className="h-4 w-4" />
        <span className="sm:hidden">{tr.shopShort}</span>
        <span className="hidden sm:inline">{tr.shopLong}</span>
        <span aria-hidden="true" className="text-base leading-none">{country.flag}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 bg-popover">
        <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {tr.heading}
        </DropdownMenuLabel>
        <p className="px-2 pb-2 text-[11px] text-muted-foreground">
          {tr.showing} <span className="font-medium text-foreground">{country.flag} {country.name}</span>
        </p>
        <DropdownMenuSeparator />
        {items.map(({ id, url, isNational }) => {
          const meta = SHOPS[id];
          return (
            <DropdownMenuItem key={id} asChild>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackShopClick({
                    ngoId: id,
                    countryCode: country.code,
                    countryName: country.name,
                    destinationUrl: url,
                    isNational,
                    language,
                    variant,
                  })
                }
                data-analytics-event="shop_click"
                data-analytics-shop={id}
                data-analytics-country={country.code}
                className="flex flex-col items-start gap-0.5 cursor-pointer"
              >
                <span className="text-sm font-medium text-foreground">{meta.short}</span>
                <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                  {isNational ? (
                    <><Truck className="h-3 w-3" /> {tr.shipsNat} — {country.name}</>
                  ) : (
                    <><Globe className="h-3 w-3" /> {tr.intl}</>
                  )}
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
