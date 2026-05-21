import { useCallback, useEffect, useState } from "react";
import {
  COUNTRIES,
  CountryCode,
  DEFAULT_COUNTRY,
  getCountry,
  guessCountryFromLocale,
  languageForCountry,
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
      // Manual country change always coordinates the UI language to the
      // country's preferred translation (when we support it).
      const preferred = asSupportedLang(languageForCountry(next));
      if (preferred) setLanguage(preferred);
    },
    [setLanguage],
  );

  return { code, country: getCountry(code), setCountry: update };
}
