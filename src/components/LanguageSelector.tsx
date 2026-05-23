import { Globe, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage, languages, LanguageCode } from "@/contexts/LanguageContext";
import { stripLangPrefix, localizedPath } from "@/lib/i18n";
import { useCountry } from "@/hooks/useCountry";
import { languagesForCountry } from "@/lib/donations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AUTO_VALUE = "__auto__";

const LanguageSelector = () => {
  const { language, isAuto, setLanguage, setAuto } = useLanguage();
  const { code: countryCode, country } = useCountry();
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToLang = (lang: LanguageCode) => {
    const { basePath } = stripLangPrefix(location.pathname);
    const target = localizedPath(lang, basePath);
    if (target !== location.pathname) navigate(target);
  };

  const handleSelect = (value: string) => {
    if (value === AUTO_VALUE) {
      const detected = setAuto();
      navigateToLang(detected);
      return;
    }
    const next = value as LanguageCode;
    setLanguage(next);
    navigateToLang(next);
  };

  const selectValue = isAuto ? AUTO_VALUE : language;

  // Ranked languages for the visitor's detected country, filtered to ones we support.
  const supportedSet = new Set(languages.map((l) => l.code));
  const popularCodes = languagesForCountry(countryCode).filter((c): c is LanguageCode =>
    supportedSet.has(c as LanguageCode),
  );
  const popular = popularCodes
    .map((code) => languages.find((l) => l.code === code)!)
    .filter(Boolean);
  const popularSet = new Set(popularCodes);
  const rest = languages.filter((l) => !popularSet.has(l.code));

  const currentLang = languages.find((l) => l.code === language);
  const label = isAuto ? "Auto" : (currentLang?.nativeName ?? language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors text-xs font-medium"
        aria-label="Select language"
        title="Select language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="truncate max-w-[100px]">{label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-popover max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Language
        </DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={() => handleSelect(AUTO_VALUE)}
          className="cursor-pointer"
        >
          <span className="flex-1">🌐 Auto-detect</span>
          {selectValue === AUTO_VALUE && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>

        {popular.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Popular in {country.flag} {country.name}
            </DropdownMenuLabel>
            {popular.map((lang) => (
              <DropdownMenuItem
                key={`pop-${lang.code}`}
                onSelect={() => handleSelect(lang.code)}
                className="cursor-pointer"
              >
                <span className="flex-1">{lang.nativeName} — {lang.region}</span>
                {selectValue === lang.code && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          All languages
        </DropdownMenuLabel>
        {rest.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => handleSelect(lang.code)}
            className="cursor-pointer"
          >
            <span className="flex-1">{lang.nativeName} — {lang.region}</span>
            {selectValue === lang.code && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
