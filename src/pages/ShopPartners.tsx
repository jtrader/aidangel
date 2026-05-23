import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Globe, MapPin, ExternalLink, Check, Package } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import HamburgerMenu from "@/components/HamburgerMenu";
import EmergencyCallButton from "@/components/EmergencyCallButton";
import NetworkFooter from "@/components/NetworkFooter";
import { useCountry } from "@/hooks/useCountry";
import { useLanguage } from "@/contexts/LanguageContext";
import { COUNTRIES, CountryCode } from "@/lib/donations";
import { SHOPS, ShopId, shopsForCountry } from "@/lib/shops";
import { trackShopClick } from "@/lib/giveAnalytics";
import { Favicon } from "@/components/Favicon";
import { localizedPath } from "@/lib/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SHOP_DESCRIPTIONS: Record<ShopId, string> = {
  stjohn:
    "Official St John Ambulance first aid shop — workplace-compliant kits, refills, defibrillators, and training supplies trusted by schools, businesses, and families.",
  redcross:
    "Red Cross / Red Crescent first aid shop — quality kits and refills where every purchase helps fund the humanitarian work of the world's largest first aid charity.",
  national:
    "A reputable national supplier of first aid kits, refills, and emergency supplies that ships within your country with fast local delivery.",
};

export default function ShopPartners() {
  const { country, setCountry } = useCountry();
  const { language } = useLanguage();

  const shops = shopsForCountry(country.code);
  const nationalCount = shops.filter((s) => s.isNational).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang={language}
        basePath="/shop"
        title="First Aid Kit & Supplies Partners · Shop Locally"
        description={`Buy first aid kits, refills and emergency supplies in ${country.name} from trusted partners — St John Ambulance, Red Cross and national first aid shops.`}
      />

      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link
            to={localizedPath(language, "/")}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            First Aid Angel
          </Link>
          <HamburgerMenu />
        </div>
      </header>

      <main className="flex-1 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-sm">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
              First Aid Kit & Supplies
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Shop first aid kits in {country.flag} {country.name}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The best emergency response starts before the emergency. These
              trusted partners stock workplace-compliant kits, refills,
              defibrillators and home essentials that ship locally.
            </p>
          </div>

          {/* Country switcher */}
          <div className="mb-8 bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Showing shops for {country.flag} {country.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {nationalCount > 0
                    ? `${nationalCount} local supplier${nationalCount === 1 ? "" : "s"} that ship within ${country.name}.`
                    : "No local suppliers configured — international shops shown."}
                </p>
              </div>
            </div>
            <div className="sm:w-64">
              <Select
                value={country.code}
                onValueChange={(v) => setCountry(v as CountryCode)}
              >
                <SelectTrigger aria-label="Change country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-80 bg-popover">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="mr-2">{c.flag}</span>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Shop cards */}
          {shops.length === 0 ? (
            <div className="text-center bg-card border border-border rounded-2xl p-10">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-base font-semibold text-foreground mb-1">
                No shop partners configured for {country.name} yet
              </p>
              <p className="text-sm text-muted-foreground">
                Try changing your country above, or check back soon as we expand our partner network.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shops.map(({ id, url, isNational }) => {
                const shop = SHOPS[id];
                return (
                  <article
                    key={id}
                    className="flex flex-col bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <Favicon url={url} alt="" size={28} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-bold text-foreground leading-tight">
                          {shop.short}
                        </h2>
                        <p className="text-[11px] text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                          {isNational ? (
                            <>
                              <Check className="h-3 w-3 text-primary" />
                              Ships in {country.name}
                            </>
                          ) : (
                            <>
                              <Globe className="h-3 w-3" />
                              International shop
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                      {SHOP_DESCRIPTIONS[id]}
                    </p>

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
                          variant: "shop_page",
                        })
                      }
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Shop {shop.short}
                      <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                    </a>
                  </article>
                );
              })}
            </div>
          )}

          {/* Footer note */}
          <div className="mt-10 bg-muted/40 border border-border rounded-2xl p-5 text-sm text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">A note on these links.</strong>{" "}
              First Aid Angel is an independent project and is not affiliated
              with any of these retailers. Where a national online shop exists
              for {country.name}, we link there so you get fast local delivery
              and country-appropriate supplies; otherwise we link to the
              partner's international store.
            </p>
          </div>
        </div>
      </main>

      <EmergencyCallButton />
      <NetworkFooter />
    </div>
  );
}
