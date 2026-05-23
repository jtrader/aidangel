import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, HandHeart, Globe, MapPin, ExternalLink, Check } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import HamburgerMenu from "@/components/HamburgerMenu";
import EmergencyCallButton from "@/components/EmergencyCallButton";
import NetworkFooter from "@/components/NetworkFooter";
import { useCountry } from "@/hooks/useCountry";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  COUNTRIES,
  CountryCode,
  NGOS,
  NgoId,
  donationUrl,
} from "@/lib/donations";
import { trackGiveClick } from "@/lib/giveAnalytics";
import { Favicon } from "@/components/Favicon";
import { localizedPath } from "@/lib/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NGO_DESCRIPTIONS: Record<NgoId, string> = {
  redcross:
    "The world's largest humanitarian network. National Red Cross and Red Crescent societies deliver first aid training, disaster response and emergency relief in nearly every country.",
  msf:
    "An international medical humanitarian organisation that provides emergency medical care to people affected by conflict, epidemics, disasters and exclusion from healthcare.",
  stjohn:
    "A global first aid charity that trains millions of people each year and provides volunteer ambulance and event medical services across the Commonwealth and beyond.",
};

const NGO_ORDER: NgoId[] = ["redcross", "msf", "stjohn"];

export default function Partners() {
  const { country, setCountry } = useCountry();
  const { language } = useLanguage();

  const partners = useMemo(
    () =>
      NGO_ORDER.map((id) => {
        const ngo = NGOS[id];
        const url = donationUrl(country, id);
        const isNational = !!country.donations[id];
        return { id, ngo, url, isNational };
      }),
    [country],
  );

  const nationalCount = partners.filter((p) => p.isNational).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead
        lang={language}
        basePath="/partners"
        title="Donation Partners · Support First Aid Worldwide"
        description={`Donate to trusted first aid and humanitarian organisations in ${country.name} — Red Cross / Red Crescent, Doctors Without Borders and St John Ambulance.`}
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
              <HandHeart className="h-7 w-7" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
              Donation Partners
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Support first aid in {country.flag} {country.name}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              First Aid Angel is free for everyone. If our guidance helped, please
              consider supporting one of these trusted organisations that train
              first-aiders and save lives every day.
            </p>
          </div>

          {/* Country switcher */}
          <div className="mb-8 bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Showing partners for {country.flag} {country.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {nationalCount > 0
                    ? `${nationalCount} of 3 partners have a local fundraising site here.`
                    : "No local fundraising sites — international donation links shown."}
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

          {/* Partner cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map(({ id, ngo, url, isNational }) => (
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
                      {ngo.short}
                    </h2>
                    <p className="text-[11px] text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                      {isNational ? (
                        <>
                          <Check className="h-3 w-3 text-primary" />
                          {country.name} site
                        </>
                      ) : (
                        <>
                          <Globe className="h-3 w-3" />
                          International site
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                  {NGO_DESCRIPTIONS[id]}
                </p>

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
                      variant: "partners_page",
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <HandHeart className="h-4 w-4" />
                  Donate to {ngo.short}
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>
              </article>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-10 bg-muted/40 border border-border rounded-2xl p-5 text-sm text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">A note on these links.</strong>{" "}
              First Aid Angel is an independent project and is not affiliated with
              any of these organisations. Donation links go directly to each
              charity's official website. Where a national fundraising site
              exists for {country.name}, we link there so your gift stays local;
              otherwise we link to the international donation page.
            </p>
          </div>
        </div>
      </main>

      <EmergencyCallButton />
      <NetworkFooter />
    </div>
  );
}
