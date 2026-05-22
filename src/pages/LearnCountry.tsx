import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, MapPin, Globe, Heart, Search, Navigation } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { COUNTRIES, getCountry } from "@/lib/donations";
import {
  Educator,
  EducatorLocation,
  getCountryEducators,
  getCitiesForCountry,
  getNearestVenues,
  citySlug,
} from "@/lib/educators";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import NetworkFooter from "@/components/NetworkFooter";
import LanguageSelector from "@/components/LanguageSelector";
import { trackLearnClick } from "@/lib/giveAnalytics";


type NearbyVenue = EducatorLocation & { educator: Educator; distance_km: number };

const TYPE_LABELS: Record<string, string> = {
  st_john: "St John Ambulance",
  red_cross: "Red Cross / Red Crescent",
  other_ngo: "Humanitarian NGO",
  commercial: "Accredited trainer",
  online: "Online course",
  community: "Community provider",
};

function EducatorCard({ ed, countryCode, countryName, language }: { ed: Educator; countryCode: string; countryName: string; language: string }) {
  const isNational = (ed.hq_country_code ?? "").toUpperCase() === countryCode.toUpperCase();
  const track = (url: string, variant: "booking" | "website") =>
    trackLearnClick({
      ngoId: ed.slug,
      countryCode,
      countryName,
      destinationUrl: url,
      isNational,
      language,
      variant,
    });
  return (
    <article className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-primary font-semibold">
            {TYPE_LABELS[ed.type]}
          </div>
          <h3 className="font-heading text-lg font-semibold">{ed.name}</h3>
        </div>
        {ed.is_verified && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            Verified
          </span>
        )}
      </div>
      {ed.blurb && <p className="text-sm text-muted-foreground mb-3">{ed.blurb}</p>}
      <div className="flex flex-wrap gap-2">
        <Link
          to={`/learn/provider/${ed.slug}`}
          className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-border hover:bg-accent"
        >
          Profile
        </Link>
        {ed.booking_url && (
          <a
            href={ed.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Book a course <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {ed.website && (
          <a
            href={ed.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-border hover:bg-accent"
          >
            Website <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </article>
  );
}

export default function LearnCountry() {
  const { country: countryParam } = useParams<{ country: string }>();
  const code = (countryParam ?? "au").toUpperCase();
  const country = getCountry(code) ?? COUNTRIES[0];
  const { language } = useLanguage();
  const { geo } = useGeoLocation();
  const [inPerson, setInPerson] = useState<Educator[]>([]);
  const [online, setOnline] = useState<Educator | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [nearby, setNearby] = useState<NearbyVenue[]>([]);

  const showNearby = !!(geo?.lat && geo?.lng && geo.country?.toUpperCase() === country.code);

  useEffect(() => {
    let cancelled = false;
    getCountryEducators(country.code, language).then(({ inPerson, online }) => {
      if (cancelled) return;
      setInPerson(inPerson);
      setOnline(online);
    });
    getCitiesForCountry(country.code).then((c) => !cancelled && setCities(c));
    if (showNearby && geo?.lat && geo?.lng) {
      getNearestVenues(geo.lat, geo.lng, { countryCode: country.code, limit: 3 }).then(
        (v) => !cancelled && setNearby(v),
      );
    } else {
      setNearby([]);
    }
    return () => { cancelled = true; };
  }, [country.code, language, geo?.lat, geo?.lng, showNearby]);

  const title = `First Aid Courses in ${country.name} — St John, Red Cross & Online`;
  const desc = `Find accredited first aid training in ${country.name}. In-person courses from St John Ambulance and Red Cross, plus online options.`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SeoHead lang={language} title={title} description={desc} basePath={`/learn/${country.code.toLowerCase()}`} />
      <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-background">
        <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All countries
        </Link>
        <LanguageSelector />
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-1">Learn first aid in</div>
          <h1 className="font-heading text-3xl font-bold">
            {country.flag} First Aid Courses — {country.name}
          </h1>
          {geo?.city && showNearby && (
            <p className="text-sm text-muted-foreground mt-1 inline-flex items-center gap-1">
              <Navigation className="h-3.5 w-3.5" /> Showing courses near {geo.city}
              {geo.region ? `, ${geo.region}` : ""}.
            </p>
          )}
        </div>

        {showNearby && nearby.length > 0 && (
          <section aria-labelledby="nearby" className="mb-8">
            <h2 id="nearby" className="font-heading text-xl font-semibold mb-3 inline-flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" /> Nearest training venues
            </h2>
            <div className="grid gap-3">
              {nearby.map((v) => (
                <article key={v.id} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-primary font-semibold">
                        {v.educator.name}
                      </div>
                      <h3 className="font-heading text-base font-semibold">
                        {v.address ?? v.city}
                      </h3>
                      <div className="text-xs text-muted-foreground">
                        {[v.city, v.region].filter(Boolean).join(", ")}
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">
                      {Math.round(v.distance_km)} km away
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Link
                      to={`/learn/provider/${v.educator.slug}`}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-border hover:bg-accent"
                    >
                      Profile
                    </Link>
                    {(v.booking_url ?? v.educator.booking_url) && (
                      <a
                        href={v.booking_url ?? v.educator.booking_url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Book a course <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}


        <section aria-labelledby="in-person" className="mb-8">
          <h2 id="in-person" className="font-heading text-xl font-semibold mb-3 inline-flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> In-person training
          </h2>
          {inPerson.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              We're still verifying local providers for {country.name}. In the meantime, try{" "}
              <a href="https://www.redcross.org" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                Red Cross International
              </a>.
            </p>
          ) : (
            <div className="grid gap-3">
              {inPerson.map((ed) => <EducatorCard key={ed.id} ed={ed} />)}
            </div>
          )}
        </section>

        {online && (
          <section aria-labelledby="online" className="mb-8">
            <h2 id="online" className="font-heading text-xl font-semibold mb-3 inline-flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Online course in your language
            </h2>
            <EducatorCard ed={online} />
          </section>
        )}

        {cities.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-lg font-semibold mb-3">Cities with local training</h2>
            <ul className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <li key={city}>
                  <Link
                    to={`/learn/${country.code.toLowerCase()}/${citySlug(city)}`}
                    className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-card border border-border hover:bg-accent"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="aed" className="mb-4 p-5 bg-accent/40 rounded-xl">
          <h2 id="aed" className="font-heading text-base font-semibold mb-1 inline-flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" /> While you're here
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Know where the nearest defibrillator is. Survival rates from cardiac arrest double when an AED is used in the first few minutes.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.google.com/maps/search/AED+defibrillator+near+me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Find an AED near me
            </a>
            <Link
              to="/symptoms"
              className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border border-border hover:bg-accent"
            >
              <Search className="h-3 w-3" /> Find by symptom
            </Link>
            <Link
              to="/kb"
              className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border border-border hover:bg-accent"
            >
              Knowledge base
            </Link>
          </div>
        </section>
      </main>

      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
}
