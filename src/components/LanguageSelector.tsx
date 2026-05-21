import { Globe } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage, languages, LanguageCode } from "@/contexts/LanguageContext";
import { stripLangPrefix, localizedPath } from "@/lib/i18n";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (next: LanguageCode) => {
    setLanguage(next);
    const { basePath } = stripLangPrefix(location.pathname);
    const target = localizedPath(next, basePath);
    if (target !== location.pathname) navigate(target);
  };

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <select
        value={language}
        onChange={(e) => handleChange(e.target.value as LanguageCode)}
        aria-label="Select language"
        title="Select language"
        className="appearance-none bg-transparent border border-border rounded-lg px-2 py-1 pr-6 text-xs font-medium text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName} — {lang.region}
          </option>
        ))}
      </select>
      <svg className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 5l3 3 3-3" />
      </svg>
    </div>
  );
};

export default LanguageSelector;
