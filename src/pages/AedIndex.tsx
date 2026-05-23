import { Link } from "react-router-dom";
import { Cross, MapPin } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { AED_COUNTRIES } from "@/lib/aedLocations";
import NetworkFooter from "@/components/NetworkFooter";
import LanguageSelector from "@/components/LanguageSelector";

export default function AedIndex() {
  const { language } = useLanguage();

  const title = "AED Finder — Defibrillator Locations Worldwide | First Aid Angel";
  const desc =
    "Find publicly accessible AEDs (automated external defibrillators) by country and city. Maps, directions, and cardiac emergency guidance powered by OpenAEDMap.";
  const basePath = "/aed";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: desc,
    url: "https://firstaidangel.org/aed",
    hasPart: AED_COUNTRIES.map((c) => ({
      "@type": "WebPage",
      name: `AED Locations in ${c.name}`,
      url: `https://firstaidangel.org/aed/${c.slug}`,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7]">
      <SeoHead lang={language} title={title} description={desc} basePath={basePath} jsonLd={jsonLd} />

      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-heading font-bold text-primary inline-flex items-center gap-2">
          <Cross className="w-5 h-5" /> First Aid Angel
        </Link>
        <LanguageSelector />
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-2">Find an AED Anywhere</h1>
        <p className="text-muted-foreground mb-6">
          Browse publicly accessible automated external defibrillators by country and city.
          Or jump straight into the{" "}
          <Link to="/aed-finder" className="text-primary underline">live interactive map</Link>.
        </p>

        <h2 className="font-heading text-xl font-bold mb-3">Countries</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {AED_COUNTRIES.map((c) => (
            <Link
              key={c.code}
              to={`/aed/${c.slug}`}
              className="bg-white border rounded-xl p-4 hover:border-primary hover:shadow-sm transition flex items-center gap-3"
            >
              <span className="text-2xl" aria-hidden>{c.flag}</span>
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">
                  <MapPin className="inline w-3 h-3 mr-0.5" />
                  {c.cities.length} cities mapped
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          AED data: <a href="https://openaedmap.org" target="_blank" rel="noopener" className="underline">OpenAEDMap</a> /
          OpenStreetMap contributors.
        </p>
      </main>

      <NetworkFooter />
    </div>
  );
}
