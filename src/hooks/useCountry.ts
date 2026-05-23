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
const EVENT_NAME = "faa:country-change";

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
    if (isAuto) {
      const preferred = asSupportedLang(languageForCountry(initial));
      if (preferred) setLanguage(preferred);
    }
    // Listen for country changes from other hook instances so every
    // component (CountrySelector, LanguageSelector, etc.) stays in sync.
    const onChange = (e: Event) => {
      const next = (e as CustomEvent<CountryCode>).detail;
      if (next && COUNTRIES.some((c) => c.code === next)) setCode(next);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && COUNTRIES.some((c) => c.code === e.newValue)) {
        setCode(e.newValue as CountryCode);
      }
    };
    window.addEventListener(EVENT_NAME, onChange as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, onChange as EventListener);
      window.removeEventListener("storage", onStorage);
    };
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
      try {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
      } catch {
        /* ignore */
      }
      const ranked = languagesForCountry(next);
      const topSupported = ranked.map(asSupportedLang).find((l): l is LanguageCode => !!l);
      const preferred = topSupported ?? asSupportedLang(languageForCountry(next));
      if (preferred) setLanguage(preferred);
    },
    [setLanguage],
  );

  return { code, country: getCountry(code), setCountry: update };
}
