import { useEffect } from "react";

/**
 * Detects ?partner=<slug> in the URL and applies a `partner-<slug>` class
 * to the <html> element so partner-scoped CSS variables can override the
 * default theme. Persists the partner across navigation via localStorage
 * so refreshes without the query param keep the branding.
 */
const STORAGE_KEY = "aidangel-partner";
const SUPPORTED = ["cvgt"] as const;

type Partner = (typeof SUPPORTED)[number];

const isSupported = (value: string | null): value is Partner =>
  !!value && (SUPPORTED as readonly string[]).includes(value);

export const usePartnerTheme = () => {
  useEffect(() => {
    const apply = () => {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get("partner");
      let active: Partner | null = null;

      if (fromUrl !== null) {
        if (isSupported(fromUrl)) {
          active = fromUrl;
          localStorage.setItem(STORAGE_KEY, fromUrl);
        } else {
          // Explicit empty/unknown value clears the partner branding.
          localStorage.removeItem(STORAGE_KEY);
        }
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (isSupported(stored)) active = stored;
      }

      const root = document.documentElement;
      // Remove any existing partner-* classes
      root.classList.forEach((cls) => {
        if (cls.startsWith("partner-")) root.classList.remove(cls);
      });
      if (active) root.classList.add(`partner-${active}`);
    };

    apply();
    window.addEventListener("popstate", apply);
    return () => window.removeEventListener("popstate", apply);
  }, []);
};
