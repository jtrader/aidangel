import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, MapPin, Globe, Heart, Search, Navigation, Loader2 } from "lucide-react";
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
import { useGeoLocation, setManualGeo, GeoInfo } from "@/hooks/useGeoLocation";
import NetworkFooter from "@/components/NetworkFooter";
import LanguageSelector from "@/components/LanguageSelector";
import { trackLearnClick } from "@/lib/giveAnalytics";
import { Favicon } from "@/components/Favicon";
import { CityAutocomplete, SelectedPlace } from "@/components/CityAutocomplete";

async function geocodeNominatim(query: string): Promise<GeoInfo | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const place = data[0];
    const display = place.display_name ?? "";
    const parts = display.split(",").map((s: string) => s.trim());
    return {
      city: parts[0] ?? null,
      region: parts[1] ?? null,
      country: place.address?.country_code?.toUpperCase() ?? null,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      source: "manual",
      fetchedAt: Date.now(),
    };
  } catch {
    return null;
  }
}

function NearbySkeleton() {
  return (
    <div className="grid gap-3">
      {[1, 2].map((i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-start gap-2.5 min-w-1 flex-1">
              <div className="h-7 w-7 rounded-md bg-muted shrink-0" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            </div>
            <div className="h-5 w-16 rounded-full bg-muted shrink-0" />
          </div>
          <div className="flex gap-2 mt-3">
            <div className="h-7 w-16 rounded-full bg-muted" />
            <div className="h-7 w-24 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}


type NearbyVenue = EducatorLocation & { educator: Educator; distance_km: number | null };

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
        <div className="flex items-start gap-3 min-w-0">
          <Favicon url={ed.website ?? ed.booking_url} logoUrl={ed.logo_url} alt="" size={36} className="mt-0.5 rounded-md border border-border bg-background p-0.5" />
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wide text-primary font-semibold">
              {TYPE_LABELS[ed.type]}
            </div>
            <h3 className="font-heading text-lg font-semibold">{ed.name}</h3>
          </div>
        </div>
        {ed.is_verified && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">
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
            onClick={() => track(ed.booking_url!, "booking")}
            data-analytics-event="learn_click"
            data-analytics-educator={ed.slug}
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
            onClick={() => track(ed.website!, "website")}
            data-analytics-event="learn_click"
            data-analytics-educator={ed.slug}
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
  const { geo, loading: geoLoading, error: geoError } = useGeoLocation();
  const [inPerson, setInPerson] = useState<Educator[]>([]);
  const [online, setOnline] = useState<Educator | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [nearby, setNearby] = useState<NearbyVenue[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const activeGeo = geo;
  const hasCoords = !!(activeGeo?.lat && activeGeo?.lng);
  const hasLocation = hasCoords || !!(activeGeo?.city || activeGeo?.region);
  const showNearbySection = geoLoading || hasLocation || geoError;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQ.trim()) return;
    setSearching(true);
    setSearchError(null);
    const result = await geocodeNominatim(`${searchQ.trim()}, ${country.name}`);
    setSearching(false);
    if (result && result.lat != null && result.lng != null) {
      setManualGeo(result);
    } else {
      setSearchError("Location not found. Try a nearby city or suburb.");
    }
  };

  const handlePlaceSelect = (p: SelectedPlace) => {
    setSearchError(null);
    setManualGeo({
      city: p.city,
      region: p.region,
      country: (p.country ?? country.code).toUpperCase(),
      lat: p.lat,
      lng: p.lng,
      source: "manual",
      fetchedAt: Date.now(),
    });
  };

  const handleClear = () => {
    try { window.localStorage.removeItem("faa.geo"); } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent("faa-geo-updated"));
    setSearchQ("");
    setSearchError(null);
  };

  useEffect(() => {
    let cancelled = false;
    getCountryEducators(country.code, language).then(({ inPerson, online }) => {
      if (cancelled) return;
      setInPerson(inPerson);
      setOnline(online);
    });
    getCitiesForCountry(country.code).then((c) => !cancelled && setCities(c));

    if (hasCoords) {
      setNearbyLoading(true);
      getNearestVenues(activeGeo.lat, activeGeo.lng, {
        countryCode: country.code,
        region: activeGeo.region,
        city: activeGeo.city,
        limit: 3,
      }).then((v) => {
        if (!cancelled) setNearby(v);
        setNearbyLoading(false);
      });
    } else if (hasLocation && activeGeo) {
      // No lat/lng but we have city/region — use service-area fallback
      setNearbyLoading(true);
      getNearestVenues(null, null, {
        countryCode: country.code,
        region: activeGeo.region,
        city: activeGeo.city,
        limit: 3,
      }).then((v) => {
        if (!cancelled) setNearby(v);
        setNearbyLoading(false);
      });
    } else {
      setNearby([]);
      setNearbyLoading(false);
    }
    return () => { cancelled = true; };
  }, [country.code, language, activeGeo?.lat, activeGeo?.lng, activeGeo?.region, activeGeo?.city, hasCoords, hasLocation]);

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
          <form onSubmit={handleSearch} className="mt-3 flex items-center gap-2">
            <CityAutocomplete
              value={searchQ}
              onChange={setSearchQ}
              onSelect={handlePlaceSelect}
              countryCode={country.code}
              placeholder={`Enter city or suburb in ${country.name}`}
              disabled={searching}
            />
            <button
              type="submit"
              disabled={searching || !searchQ.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              Use my location
            </button>
          </form>
          {searchError && <p className="text-xs text-red-500 mt-1.5">{searchError}</p>}
          {activeGeo?.city && (
            <p className="text-sm text-muted-foreground mt-2 inline-flex items-center gap-1">
              <Navigation className="h-3.5 w-3.5" /> Showing courses near {activeGeo.city}
              {activeGeo.region ? `, ${activeGeo.region}` : ""}
              {activeGeo.source === "manual" && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="ml-1 text-xs underline text-primary hover:text-primary/80"
                >
                  Reset
                </button>
              )}
            </p>
          )}
          {geoError && !activeGeo && (
            <p className="text-sm text-muted-foreground mt-2 inline-flex items-center gap-1">
              <Navigation className="h-3.5 w-3.5" />
              Couldn’t detect your location automatically. Enter your city above to find nearby venues.
            </p>
          )}
        </div>

        {showNearbySection && (
          <section aria-labelledby="nearby" className="mb-8">
            <h2 id="nearby" className="font-heading text-xl font-semibold mb-3 inline-flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" /> Nearest training venues
            </h2>
            {geoLoading || nearbyLoading ? (
              <NearbySkeleton />
            ) : nearby.length > 0 ? (
              <div className="grid gap-3">
                {nearby.map((v) => (
                  <article key={v.id} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <Favicon url={v.educator.website ?? v.educator.booking_url} logoUrl={v.educator.logo_url} alt="" size={28} className="mt-0.5 rounded-md border border-border bg-background p-0.5" />
                        <div className="min-w-0">
                          <div className="text-[11px] uppercase tracking-wide text-primary font-semibold">
                            {v.educator.name}
                          </div>
                          <h3 className="font-heading text-base font-semibold">
                            {v.address ?? v.city ?? `${country.name}-wide`}
                          </h3>
                          <div className="text-xs text-muted-foreground">
                            {[v.city, v.region].filter(Boolean).join(", ") || `Serves ${country.name}`}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">
                        {v.distance_km == null ? "Serves your area" : `${Math.round(v.distance_km)} km away`}
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
                          onClick={() =>
                            trackLearnClick({
                              ngoId: v.educator.slug,
                              countryCode: country.code,
                              countryName: country.name,
                              destinationUrl: v.booking_url ?? v.educator.booking_url ?? "",
                              isNational: (v.educator.hq_country_code ?? "").toUpperCase() === country.code,
                              language,
                              variant: "booking",
                            })
                          }
                          data-analytics-event="learn_click"
                          data-analytics-educator={v.educator.slug}
                          className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Book a course <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-5 text-sm text-muted-foreground">
                {geoError || !activeGeo
                  ? "We couldn’t detect your location automatically. Enter your city or suburb above to see nearby training venues."
                  : `No nearby training venues found for ${activeGeo.city ?? country.name}. Try browsing in-person providers below.`}
              </div>
            )}
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
              {inPerson.map((ed) => <EducatorCard key={ed.id} ed={ed} countryCode={country.code} countryName={country.name} language={language} />)}
            </div>
          )}
        </section>

        {online && (
          <section aria-labelledby="online" className="mb-8">
            <h2 id="online" className="font-heading text-xl font-semibold mb-3 inline-flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Online course in your language
            </h2>
            <EducatorCard ed={online} countryCode={country.code} countryName={country.name} language={language} />
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

        <section aria-labelledby="aed" className="mb-8 p-5 bg-gradient-to-r from-primary/10 to-accent/30 border border-primary/20 rounded-xl">
          <h2 id="aed" className="font-heading text-base font-semibold mb-1 inline-flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" /> Find an AED near me
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Know where the nearest defibrillator is. Survival rates from cardiac arrest double when an AED is used in the first few minutes.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/aed-finder"
              className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Navigation className="h-3.5 w-3.5" /> Find an AED near me
            </Link>
            <Link
              to="/symptoms"
              className="inline-flex items-center gap-1 text-sm px-3 py-2 rounded-full border border-border hover:bg-accent"
            >
              <Search className="h-3 w-3" /> Find by symptom
            </Link>
            <Link
              to="/kb"
              className="inline-flex items-center gap-1 text-sm px-3 py-2 rounded-full border border-border hover:bg-accent"
            >
              Knowledge base
            </Link>
          </div>
          {activeGeo?.city && (
            <p className="text-xs text-muted-foreground mt-3 inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Searching around {activeGeo.city}
              {activeGeo.region ? `, ${activeGeo.region}` : ""}
            </p>
          )}
        </section>
      </main>

      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
}
