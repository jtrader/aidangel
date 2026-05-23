import { Link, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle, Cross, Loader2, MapPin, Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SeoHead } from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAedCountryBySlug, getAedCityBySlug } from "@/lib/aedLocations";
import { Aed, fetchCountryAeds, filterByBounds, bboxAround, distanceKm, accessLabel } from "@/lib/openAedMap";
import { loadGoogleMaps } from "@/lib/googleMapsLoader";
import { emergencyNumberForCountry } from "@/lib/donations";
import NetworkFooter from "@/components/NetworkFooter";
import LanguageSelector from "@/components/LanguageSelector";

export default function AedCity() {
  const { language } = useLanguage();
  const { country: countrySlug, city: citySlug } = useParams<{ country: string; city: string }>();
  const country = getAedCountryBySlug(countrySlug ?? "");
  const city = country ? getAedCityBySlug(country, citySlug ?? "") : undefined;

  const mapEl = useRef<HTMLDivElement>(null);
  const [aeds, setAeds] = useState<Aed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const emergency = emergencyNumberForCountry(country?.code);

  useEffect(() => {
    if (!country || !city) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const all = await fetchCountryAeds(country.code);
        const bbox = bboxAround(city.lat, city.lng, city.radiusKm);
        const inCity = filterByBounds(all, bbox, 500)
          .map((a) => ({ ...a, _d: distanceKm(city.lat, city.lng, a.lat, a.lng) }))
          .sort((a: any, b: any) => a._d - b._d) as Aed[];
        if (cancelled) return;
        setAeds(inCity);

        await loadGoogleMaps();
        if (cancelled || !mapEl.current) return;
        const google = window.google;
        const map = new google.maps.Map(mapEl.current, {
          center: { lat: city.lat, lng: city.lng },
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }],
        });
        const info = new google.maps.InfoWindow();
        inCity.slice(0, 300).forEach((a) => {
          const meta = accessLabel(a.access);
          const marker = new google.maps.Marker({
            position: { lat: a.lat, lng: a.lng },
            map,
            title: a.name || "AED",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: meta.color,
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });
          marker.addListener("click", () => {
            const directions = `https://www.google.com/maps/dir/?api=1&destination=${a.lat},${a.lng}`;
            info.setContent(
              `<div style="font-family:system-ui,sans-serif;max-width:240px">
                <div style="font-weight:600;font-size:14px;margin-bottom:4px">${a.name || "Defibrillator (AED)"}</div>
                <div style="font-size:12px;color:${meta.color};font-weight:600;margin-bottom:6px">${meta.label}</div>
                ${a.location ? `<div style="font-size:12px;color:#374151;margin-bottom:2px">📍 ${a.location}</div>` : ""}
                ${a.operator ? `<div style="font-size:12px;color:#6b7280;margin-bottom:2px">Operator: ${a.operator}</div>` : ""}
                ${a.opening_hours ? `<div style="font-size:12px;color:#6b7280;margin-bottom:2px">🕐 ${a.opening_hours}</div>` : ""}
                <a href="${directions}" target="_blank" rel="noopener" style="display:inline-block;margin-top:6px;background:#dc2626;color:#fff;padding:6px 10px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none">Get directions</a>
              </div>`
            );
            info.open({ anchor: marker, map });
          });
        });
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setError("Couldn't load AED locations. Please try again.");
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [country?.code, city?.slug]);

  if (!country || !city) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F7F7F7] p-6">
        <div className="bg-white rounded-2xl border p-8 text-center max-w-md">
          <h1 className="font-heading text-xl font-bold mb-2">City not found</h1>
          <Link to="/aed" className="text-primary underline text-sm">Browse all countries</Link>
        </div>
      </main>
    );
  }

  const title = `AED Locations in ${city.name}, ${country.name} — Find a Defibrillator Near You`;
  const desc = `Map of publicly accessible AEDs (automated external defibrillators) in ${city.name}, ${country.name}. Get directions, opening hours, and what to do in a cardiac emergency.`;
  const basePath = `/aed/${country.slug}/${city.slug}`;

  const faqs = [
    {
      q: `Where can I find an AED in ${city.name}?`,
      a: `The map above shows publicly accessible AEDs across ${city.name} sourced from OpenAEDMap. Click any pin for the exact location, access type, and directions. In a cardiac emergency call ${emergency} first.`,
    },
    {
      q: "What should I do if someone collapses?",
      a: `Call ${emergency}, check for breathing, start CPR (push hard and fast in the centre of the chest), and send someone to fetch the nearest AED. Turn it on and follow the voice prompts.`,
    },
    {
      q: "Can I use an AED if I'm not trained?",
      a: "Yes. AEDs are designed for bystanders — they talk you through every step and only deliver a shock if the heart rhythm needs one. Using an AED early dramatically improves survival.",
    },
  ];

  const placeLd = aeds.slice(0, 20).map((a) => ({
    "@context": "https://schema.org",
    "@type": "Place",
    name: a.name || `AED (${city.name})`,
    description: a.location || `Publicly accessible defibrillator in ${city.name}, ${country.name}`,
    geo: { "@type": "GeoCoordinates", latitude: a.lat, longitude: a.lng },
    address: { "@type": "PostalAddress", addressLocality: city.name, addressCountry: country.code },
  }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "AED Finder", item: "https://firstaidangel.org/aed" },
        { "@type": "ListItem", position: 2, name: country.name, item: `https://firstaidangel.org/aed/${country.slug}` },
        { "@type": "ListItem", position: 3, name: city.name, item: `https://firstaidangel.org${basePath}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    ...placeLd,
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7]">
      <SeoHead lang={language} title={title} description={desc} basePath={basePath} jsonLd={jsonLd} />

      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <Link to={`/aed/${country.slug}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {country.flag} {country.name}
        </Link>
        <LanguageSelector />
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        <h1 className="font-heading text-3xl font-bold mb-1">AED Locations in {city.name}</h1>
        <p className="text-muted-foreground mb-5">
          {aeds.length > 0
            ? `${aeds.length} publicly listed defibrillator${aeds.length === 1 ? "" : "s"} within ${city.radiusKm} km of ${city.name} centre.`
            : `Map of publicly accessible AEDs in ${city.name}, ${country.name}.`}
        </p>

        <div className="bg-white border rounded-xl p-4 mb-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong>Cardiac emergency?</strong> Call{" "}
            <a href={`tel:${emergency}`} className="text-primary font-semibold">{emergency}</a>{" "}
            now, start <Link to="/cpr" className="text-primary underline">CPR</Link>, and grab the nearest AED.
          </div>
        </div>

        <div className="relative bg-white border rounded-xl overflow-hidden mb-6" style={{ height: 460 }}>
          <div ref={mapEl} className="absolute inset-0" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/95 p-4 text-center text-sm text-muted-foreground">
              {error}
            </div>
          )}
        </div>

        {aeds.length > 0 && (
          <>
            <h2 className="font-heading text-xl font-bold mb-3">Nearest AEDs to {city.name} centre</h2>
            <div className="grid gap-3 mb-8">
              {aeds.slice(0, 12).map((a) => {
                const d = distanceKm(city.lat, city.lng, a.lat, a.lng);
                const meta = accessLabel(a.access);
                return (
                  <article key={a.id} className="bg-white border rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="font-semibold">{a.name || "Defibrillator (AED)"}</div>
                      <span className="text-xs font-semibold shrink-0" style={{ color: meta.color }}>
                        {meta.label}
                      </span>
                    </div>
                    {a.location && (
                      <div className="text-sm text-muted-foreground mb-1 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {a.location}
                      </div>
                    )}
                    {a.operator && (
                      <div className="text-xs text-muted-foreground mb-2">Operator: {a.operator}</div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{d.toFixed(1)} km from centre</span>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${a.lat},${a.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Directions
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        <Link
          to="/aed-finder"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-semibold mb-8"
        >
          <Cross className="w-4 h-4" /> Open full interactive AED Finder
        </Link>

        <h2 className="font-heading text-xl font-bold mb-3">FAQ</h2>
        <div className="space-y-3 mb-8">
          {faqs.map((f) => (
            <div key={f.q} className="bg-white border rounded-xl p-4">
              <h3 className="font-semibold mb-1">{f.q}</h3>
              <p className="text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>

        <h2 className="font-heading text-lg font-bold mb-3">Other cities in {country.name}</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {country.cities.filter((c) => c.slug !== city.slug).map((c) => (
            <Link
              key={c.slug}
              to={`/aed/${country.slug}/${c.slug}`}
              className="bg-white border rounded-full px-3 py-1.5 text-sm hover:border-primary"
            >
              {c.name}
            </Link>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          AED data: <a href="https://openaedmap.org" target="_blank" rel="noopener" className="underline">OpenAEDMap</a> /
          OpenStreetMap contributors. Coverage varies; please verify on arrival.
        </p>
      </main>

      <NetworkFooter />
    </div>
  );
}
