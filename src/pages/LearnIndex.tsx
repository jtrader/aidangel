import { Link } from "react-router-dom";
import { ArrowLeft, GraduationCap, MapPin, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SeoHead } from "@/components/SeoHead";
import { useCountry } from "@/hooks/useCountry";
import { COUNTRIES } from "@/lib/donations";
import NetworkFooter from "@/components/NetworkFooter";
import LanguageSelector from "@/components/LanguageSelector";

export default function LearnIndex() {
  const { language } = useLanguage();
  const { country } = useCountry();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SeoHead lang={language}
        title="Learn First Aid Near You — Courses by Country & City"
        description="Find accredited first aid training providers worldwide. St John Ambulance, Red Cross and online courses in your language."
        basePath="/learn"
      />
      <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-background">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <LanguageSelector />
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <GraduationCap className="h-10 w-10 mx-auto text-primary mb-3" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Learn First Aid</h1>
          <p className="text-muted-foreground">
            In-person courses from St John Ambulance, Red Cross and trusted local educators — plus online training in your language.
          </p>
        </div>

        <Link
          to={`/learn/${country.code.toLowerCase()}`}
          className="block bg-primary text-primary-foreground rounded-xl p-5 mb-6 hover:bg-primary/90 transition-colors"
        >
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5" />
            <div>
              <div className="text-xs uppercase tracking-wide opacity-80">Courses near you</div>
              <div className="font-semibold text-lg">{country.flag} {country.name}</div>
            </div>
          </div>
        </Link>

        <h2 className="font-heading text-lg font-semibold mb-3">Browse by country</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COUNTRIES.map((c) => (
            <li key={c.code}>
              <Link
                to={`/learn/${c.code.toLowerCase()}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors text-sm"
              >
                <span className="text-base">{c.flag}</span>
                <span className="truncate">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 p-4 bg-accent/40 rounded-xl flex items-start gap-3">
          <Search className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-foreground mb-1">Need help right now?</div>
            <p className="text-muted-foreground">
              In an emergency call <a href="tel:000" className="font-semibold text-primary underline">000</a> (Australia). Otherwise{" "}
              <Link to="/symptoms" className="text-primary underline">find by symptom</Link>.
            </p>
          </div>
        </div>
      </main>

      <NetworkFooter currentApp="First Aid Angel" />
    </div>
  );
}
