import { Link } from "react-router-dom";
import { GraduationCap, MapPin, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SeoHead } from "@/components/SeoHead";
import { useCountry } from "@/hooks/useCountry";
import { COUNTRIES } from "@/lib/donations";
import NetworkFooter from "@/components/NetworkFooter";
import SiteHeader from "@/components/SiteHeader";

export default function LearnIndex() {
  const { language, t } = useLanguage();
  const { country } = useCountry();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SeoHead lang={language}
        title="Learn First Aid Near You — Courses by Country & City"
        description="Find accredited first aid training providers worldwide. St John Ambulance, Red Cross and online courses in your language."
        basePath="/learn"
      />
      <SiteHeader backTo="/" backLabel={t("navHome")} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <GraduationCap className="h-10 w-10 mx-auto text-primary mb-3" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{t("learnTitle")}</h1>
          <p className="text-muted-foreground">
            {t("learnSubtitle")}
          </p>
        </div>

        <Link
          to={`/learn/${country.code.toLowerCase()}`}
          className="block bg-primary text-primary-foreground rounded-xl p-5 mb-6 hover:bg-primary/90 transition-colors"
        >
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5" />
            <div>
              <div className="text-xs uppercase tracking-wide opacity-80">{t("learnCoursesNearYou")}</div>
              <div className="font-semibold text-lg">{country.flag} {country.name}</div>
            </div>
          </div>
        </Link>

        <h2 className="font-heading text-lg font-semibold mb-3">{t("learnBrowseByCountry")}</h2>
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
            <div className="font-medium text-foreground mb-1">{t("learnNeedHelpNow")}</div>
            <p className="text-muted-foreground">
              {t("learnEmergencyPrefix")} <a href="tel:000" className="font-semibold text-primary underline">000</a> {t("learnEmergencyCountry")} {t("learnOtherwise")}{" "}
              <Link to="/symptoms" className="text-primary underline">{t("learnFindBySymptom")}</Link>.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 border border-dashed border-border rounded-xl text-sm flex items-center justify-between gap-3">
          <div>
            <div className="font-medium text-foreground">{t("learnKnowCourse")}</div>
            <p className="text-muted-foreground text-xs">{t("learnHelpGrow")}</p>
          </div>
          <Link to="/learn/submit" className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 whitespace-nowrap">
            {t("learnSubmitCourse")}
          </Link>
        </div>
      </main>

      <NetworkFooter />
    </div>
  );
}
