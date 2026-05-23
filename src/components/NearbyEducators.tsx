import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, GraduationCap, Navigation, Sparkles } from "lucide-react";

import { Educator, EducatorLocation, getNearestVenues, getCountryEducators } from "@/lib/educators";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { useCountry } from "@/hooks/useCountry";
import { getCountry } from "@/lib/donations";
import { trackLearnClick } from "@/lib/giveAnalytics";
import { Favicon } from "@/components/Favicon";

type NearbyVenue = EducatorLocation & { educator: Educator; distance_km: number | null };

interface Props {
  heading?: string;
  subtitle?: string;
  language: string;
  limit?: number;
}

export default function NearbyEducators({
  heading = "Get certified",
  subtitle = "Learn first aid hands-on from accredited educators near you.",
  language,
  limit = 3,
}: Props) {
  const { code: countryCode } = useCountry();
  const country = getCountry(countryCode) ?? getCountry("AU")!;
  const { geo } = useGeoLocation();
  const [venues, setVenues] = useState<NearbyVenue[]>([]);
  const [fallback, setFallback] = useState<Educator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const hasCoords = !!(geo?.lat && geo?.lng);
      const hasLocation = hasCoords || !!(geo?.city || geo?.region);

      let nearby: NearbyVenue[] = [];
      if (hasLocation) {
        nearby = await getNearestVenues(
          hasCoords ? geo!.lat : null,
          hasCoords ? geo!.lng : null,
          { countryCode: country.code, region: geo?.region, city: geo?.city, limit },
        );
      }
      if (cancelled) return;
      setVenues(nearby);

      if (nearby.length === 0) {
        const { inPerson, online } = await getCountryEducators(country.code, language);
        if (cancelled) return;
        const list = [...inPerson, ...(online ? [online] : [])].slice(0, limit);
        setFallback(list);
      } else {
        setFallback([]);
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [country.code, geo?.lat, geo?.lng, geo?.region, geo?.city, language, limit]);

  const showHeader = loading || venues.length > 0 || fallback.length > 0;
  if (!showHeader) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary inline-flex items-center gap-1.5">
          <GraduationCap className="h-4 w-4" /> {heading}
        </h2>
        <Link
          to={`/learn/${country.code.toLowerCase()}`}
          className="text-xs font-medium text-primary hover:underline"
        >
          See all in {country.name} →
        </Link>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        {subtitle}
        {geo?.city ? (
          <span className="ml-1 inline-flex items-center gap-1">
            <Navigation className="h-3 w-3" /> Near {geo.city}{geo.region ? `, ${geo.region}` : ""}
          </span>
        ) : null}
      </p>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-3 rounded-xl border border-border bg-card animate-pulse h-20" />
          ))}
        </div>
      ) : venues.length > 0 ? (
        <ul className="grid sm:grid-cols-2 gap-3">
          {venues.map((v) => (
            <li key={v.id} className="p-3 rounded-xl border border-border bg-card hover:border-primary transition-all">
              <div className="flex items-start gap-2.5">
                <Favicon
                  url={v.educator.website ?? v.educator.booking_url}
                  logoUrl={v.educator.logo_url}
                  alt=""
                  size={28}
                  className="mt-0.5 rounded-md border border-border bg-background p-0.5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-wide text-primary font-semibold truncate">
                    {v.educator.name}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm truncate">
                    {v.address ?? v.city ?? `${country.name}-wide`}
                  </h3>
                  <div className="text-[11px] text-muted-foreground">
                    {v.distance_km == null
                      ? `Serves ${[v.city, v.region].filter(Boolean).join(", ") || country.name}`
                      : `${Math.round(v.distance_km)} km away`}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Link
                      to={`/learn/provider/${v.educator.slug}`}
                      className="inline-flex items-center text-[11px] px-2 py-1 rounded-full border border-border hover:bg-accent"
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
                        className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Book <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-3">
          {fallback.map((ed) => (
            <li key={ed.id} className="p-3 rounded-xl border border-border bg-card hover:border-primary transition-all">
              <div className="flex items-start gap-2.5">
                <Favicon
                  url={ed.website ?? ed.booking_url}
                  logoUrl={ed.logo_url}
                  alt=""
                  size={28}
                  className="mt-0.5 rounded-md border border-border bg-background p-0.5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground text-sm truncate">{ed.name}</h3>
                  {ed.blurb && <p className="text-[11px] text-muted-foreground line-clamp-2">{ed.blurb}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Link
                      to={`/learn/provider/${ed.slug}`}
                      className="inline-flex items-center text-[11px] px-2 py-1 rounded-full border border-border hover:bg-accent"
                    >
                      Profile
                    </Link>
                    {ed.booking_url && (
                      <a
                        href={ed.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackLearnClick({
                            ngoId: ed.slug,
                            countryCode: country.code,
                            countryName: country.name,
                            destinationUrl: ed.booking_url!,
                            isNational: (ed.hq_country_code ?? "").toUpperCase() === country.code,
                            language,
                            variant: "booking",
                          })
                        }
                        data-analytics-event="learn_click"
                        data-analytics-educator={ed.slug}
                        className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Book <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
