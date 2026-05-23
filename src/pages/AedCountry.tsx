import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Cross, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { SeoHead } from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAedCountryBySlug, AED_COUNTRIES } from "@/lib/aedLocations";
import { fetchCountryAeds } from "@/lib/openAedMap";
import { emergencyNumberForCountry } from "@/lib/donations";
import NetworkFooter from "@/components/NetworkFooter";


export default function AedCountry() {
  const { language } = useLanguage();
  const { country: slug } = useParams<{ country: string }>();
  const country = getAedCountryBySlug(slug ?? "");
  const [count, setCount] = useState<number | null>(null);
  const emergency = emergencyNumberForCountry(country?.code);

  useEffect(() => {
    if (!country) return;
    let cancelled = false;
    fetchCountryAeds(country.code)
      .then((a) => !cancelled && setCount(a.length))
      .catch(() => !cancelled && setCount(null));
    return () => { cancelled = true; };
  }, [country?.code]);

  if (!country) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F7F7F7] p-6">
        <div className="bg-white rounded-2xl border p-8 text-center max-w-md">
          <h1 className="font-heading text-xl font-bold mb-2">Country not found</h1>
          <p className="text-sm text-muted-foreground mb-4">
            We don't have a dedicated AED hub for that country yet.
          </p>
          <Link to="/aed" className="text-primary underline text-sm">Browse all countries</Link>
        </div>
      </main>
    );
  }

  const title = `AED Locations in ${country.name} — Find a Defibrillator Near You`;
  const desc = `Find publicly accessible AEDs (automated external defibrillators) across ${country.name}. Browse maps by city, get directions, and learn what to do in a cardiac emergency.`;
  const basePath = `/aed/${country.slug}`;

  const faqs = [
    {
      q: `How do I find the nearest AED in ${country.name}?`,
      a: `Open the city page closest to you below to see an interactive map of publicly accessible AEDs. In an emergency, call ${emergency} first — dispatchers can also direct you to the nearest defibrillator.`,
    },
    {
      q: `Are AEDs free to use in ${country.name}?`,
      a: `Yes. Publicly accessible AEDs are designed for use by any bystander. They give voice prompts and only deliver a shock if needed. There are no legal penalties for trying to save a life with one.`,
    },
    {
      q: "Where is AED location data sourced from?",
      a: "AED pins come from OpenAEDMap and OpenStreetMap — a community-maintained dataset. Coverage varies by region; please verify on arrival and consider adding any missing AEDs to openaedmap.org.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "AED Finder", item: "https://firstaidangel.org/aed" },
        { "@type": "ListItem", position: 2, name: country.name, item: `https://firstaidangel.org${basePath}` },
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
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7]">
      <SeoHead lang={language} title={title} description={desc} basePath={basePath} jsonLd={jsonLd} />

      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <Link to="/aed" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All countries
        </Link>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" aria-hidden>{country.flag}</span>
          <h1 className="font-heading text-3xl font-bold">AED Locations in {country.name}</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Publicly accessible automated external defibrillators across {country.name}.
          {count !== null && (
            <> Currently tracking <strong>{count.toLocaleString()}</strong> AEDs (OpenAEDMap).</>
          )}
        </p>

        <div className="bg-white border rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong>In a cardiac emergency:</strong> call{" "}
            <a href={`tel:${emergency}`} className="text-primary font-semibold">{emergency}</a>{" "}
            immediately, start{" "}
            <Link to="/cpr" className="text-primary underline">CPR</Link>, and send someone for the nearest AED.
          </div>
        </div>

        <h2 className="font-heading text-xl font-bold mb-3">Find AEDs by city</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {country.cities.map((c) => (
            <Link
              key={c.slug}
              to={`/aed/${country.slug}/${c.slug}`}
              className="bg-white border rounded-xl p-4 hover:border-primary hover:shadow-sm transition flex items-center gap-3"
            >
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">AED map · {c.name}, {country.name}</div>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="font-heading text-xl font-bold mb-3">Live interactive map</h2>
        <Link
          to="/aed-finder"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-semibold mb-8"
        >
          <Cross className="w-4 h-4" /> Open AED Finder
        </Link>

        <h2 className="font-heading text-xl font-bold mb-3">Frequently asked questions</h2>
        <div className="space-y-3 mb-8">
          {faqs.map((f) => (
            <div key={f.q} className="bg-white border rounded-xl p-4">
              <h3 className="font-semibold mb-1">{f.q}</h3>
              <p className="text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>

        <h2 className="font-heading text-xl font-bold mb-3">More countries</h2>
        <div className="flex flex-wrap gap-2">
          {AED_COUNTRIES.filter((c) => c.code !== country.code).map((c) => (
            <Link
              key={c.code}
              to={`/aed/${c.slug}`}
              className="bg-white border rounded-full px-3 py-1.5 text-sm hover:border-primary"
            >
              {c.flag} {c.name}
            </Link>
          ))}
        </div>
      </main>

      <NetworkFooter />
    </div>
  );
}
