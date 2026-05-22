import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SeoHead } from "@/components/SeoHead";
import { COUNTRIES, getCountry } from "@/lib/donations";
import {
  EducatorLocation,
  Educator,
  getCityLocations,
  cityFromSlug,
} from "@/lib/educators";
import NetworkFooter from "@/components/NetworkFooter";
import LanguageSelector from "@/components/LanguageSelector";
import { trackLearnClick } from "@/lib/giveAnalytics";

export default function LearnCity() {
  const { language } = useLanguage();
  const { country: countryParam, city: citySlugParam } = useParams<{ country: string; city: string }>();
  const code = (countryParam ?? "au").toUpperCase();
  const country = getCountry(code) ?? COUNTRIES[0];
  const cityName = cityFromSlug(citySlugParam ?? "");
  const [rows, setRows] = useState<Array<EducatorLocation & { educator: Educator }>>([]);

  useEffect(() => {
    let cancelled = false;
    getCityLocations(country.code, cityName).then((r) => !cancelled && setRows(r));
    return () => { cancelled = true; };
  }, [country.code, cityName]);

  const title = `First Aid Courses in ${cityName}, ${country.name}`;
  const desc = `Accredited first aid and CPR training in ${cityName}, ${country.name}. St John, Red Cross and local providers.`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SeoHead lang={language} title={title} description={desc} basePath={`/learn/${country.code.toLowerCase()}/${citySlugParam}`} />
      <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-background">
        <Link to={`/learn/${country.code.toLowerCase()}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {country.flag} {country.name}
        </Link>
        <LanguageSelector />
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-2">
          First Aid Courses in {cityName}
        </h1>
        <p className="text-muted-foreground mb-6">
          Local training venues in {cityName}, {country.name}.
        </p>

        {rows.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground">
              We don't have a verified venue listed in {cityName} yet. Try{" "}
              <Link to={`/learn/${country.code.toLowerCase()}`} className="text-primary underline">
                country-wide providers for {country.name}
              </Link>{" "}
              — most offer mobile/onsite training.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {rows.map((row) => (
              <article key={row.id} className="bg-card border border-border rounded-xl p-5">
                <div className="text-[11px] uppercase tracking-wide text-primary font-semibold mb-1">
                  {row.educator.name}
                </div>
                <h2 className="font-heading text-base font-semibold mb-1">{row.address ?? cityName}</h2>
                {row.region && <div className="text-xs text-muted-foreground mb-3">{row.region}</div>}
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/learn/provider/${row.educator.slug}`}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-border hover:bg-accent"
                  >
                    Provider profile
                  </Link>
                  {(row.booking_url ?? row.educator.booking_url) && (
                    <a
                      href={row.booking_url ?? row.educator.booking_url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackLearnClick({
                          ngoId: row.educator.slug,
                          countryCode: country.code,
                          countryName: country.name,
                          destinationUrl: row.booking_url ?? row.educator.booking_url ?? "",
                          isNational: (row.educator.hq_country_code ?? "").toUpperCase() === country.code,
                          language,
                          variant: "booking",
                        })
                      }
                      data-analytics-event="learn_click"
                      data-analytics-educator={row.educator.slug}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Book a course <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <section className="mt-8 p-5 bg-accent/40 rounded-xl">
          <h2 className="font-heading text-base font-semibold mb-1 inline-flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" /> Find an AED in {cityName}
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Locate the nearest public defibrillator before you need it.
          </p>
          <a
            href={`https://www.google.com/maps/search/AED+defibrillator+${encodeURIComponent(cityName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Find an AED near me
          </a>
        </section>
      </main>

      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
}
