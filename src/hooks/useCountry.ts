import { useCallback, useEffect, useState } from "react";
import {
  COUNTRIES,
  CountryCode,
  DEFAULT_COUNTRY,
  getCountry,
  guessCountryFromLocale,
} from "@/lib/donations";

const STORAGE_KEY = "faa.country";

function readInitial(): CountryCode {
  if (typeof window === "undefined") return DEFAULT_COUNTRY;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved && COUNTRIES.some((c) => c.code === saved)) {
    return saved as CountryCode;
  }
  return guessCountryFromLocale(window.navigator.language);
}

export function useCountry() {
  const [code, setCode] = useState<CountryCode>(DEFAULT_COUNTRY);

  useEffect(() => {
    setCode(readInitial());
  }, []);

  const update = useCallback((next: CountryCode) => {
    setCode(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  return { code, country: getCountry(code), setCountry: update };
}
