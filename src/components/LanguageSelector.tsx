import { Globe, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage, languages, LanguageCode } from "@/contexts/LanguageContext";
import { stripLangPrefix, localizedPath } from "@/lib/i18n";
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
  const currentLabel = isAuto
    ? `🌐 Auto — ${language.toUpperCase()}`
    : languages.find((l) => l.code === language)?.nativeName ?? language;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center gap-1.5 w-9 h-9 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors"
        aria-label="Select language"
        title="Select language"
      >
        <Globe className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-popover max-h-80 overflow-y-auto">
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
        <DropdownMenuSeparator />
        {languages.map((lang) => (
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
