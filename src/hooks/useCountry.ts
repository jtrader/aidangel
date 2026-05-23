import { useCallback, useEffect, useState } from "react";
import {
  COUNTRIES,
  CountryCode,
  DEFAULT_COUNTRY,
  getCountry,
  guessCountryFromLocale,
  languageForCountry,
  languagesForCountry,
} from "@/lib/donations";
import { useLanguage, LanguageCode, languages } from "@/contexts/LanguageContext";

const STORAGE_KEY = "faa.country";

function readInitial(): CountryCode {
  if (typeof window === "undefined") return DEFAULT_COUNTRY;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved && COUNTRIES.some((c) => c.code === saved)) {
    return saved as CountryCode;
  }
  return guessCountryFromLocale(window.navigator.language);
}

function asSupportedLang(code: string): LanguageCode | null {
  return languages.some((l) => l.code === code) ? (code as LanguageCode) : null;
}

export function useCountry() {
  const [code, setCode] = useState<CountryCode>(DEFAULT_COUNTRY);
  const { isAuto, setLanguage } = useLanguage();

  useEffect(() => {
    const initial = readInitial();
    setCode(initial);
    // On first load, if the language is in auto mode and the country's primary
    // language differs from current, sync to country-preferred language.
    if (isAuto) {
      const preferred = asSupportedLang(languageForCountry(initial));
      if (preferred) setLanguage(preferred);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback(
    (next: CountryCode) => {
      setCode(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      // Manual country change switches the UI to that country's top
      // most-spoken supported language (ranked list, same source the
      // picker uses for its "Popular in {country}" section).
      const ranked = languagesForCountry(next);
      const topSupported = ranked.map(asSupportedLang).find((l): l is LanguageCode => !!l);
      const preferred = topSupported ?? asSupportedLang(languageForCountry(next));
      if (preferred) setLanguage(preferred);
    },
    [setLanguage],
  );

  return { code, country: getCountry(code), setCountry: update };
}
