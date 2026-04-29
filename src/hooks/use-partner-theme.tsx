import { useEffect } from "react";

/**
 * Detects ?partner=<slug> and ?theme=<slug> in the URL and applies
 * `partner-<slug>` / `theme-<slug>` classes to the <html> element so
 * scoped CSS variables can override the default theme. Persists each
 * selection across navigation via localStorage so refreshes without the
 * query param keep the branding.
 */
const PARTNER_STORAGE_KEY = "aidangel-partner";
const THEME_STORAGE_KEY = "aidangel-theme-variant";

const SUPPORTED_PARTNERS = ["cvgt"] as const;
const SUPPORTED_THEMES = ["blue", "red", "teal", "yellow"] as const;

type Partner = (typeof SUPPORTED_PARTNERS)[number];
type ThemeVariant = (typeof SUPPORTED_THEMES)[number];

const isSupportedPartner = (value: string | null): value is Partner =>
  !!value && (SUPPORTED_PARTNERS as readonly string[]).includes(value);

const isSupportedTheme = (value: string | null): value is ThemeVariant =>
  !!value && (SUPPORTED_THEMES as readonly string[]).includes(value);

export const usePartnerTheme = () => {
  useEffect(() => {
    const apply = () => {
      const params = new URLSearchParams(window.location.search);
      const root = document.documentElement;

      // ----- Partner branding -----
      const partnerFromUrl = params.get("partner");
      let activePartner: Partner | null = null;
      if (partnerFromUrl !== null) {
        if (isSupportedPartner(partnerFromUrl)) {
          activePartner = partnerFromUrl;
          localStorage.setItem(PARTNER_STORAGE_KEY, partnerFromUrl);
        } else {
          localStorage.removeItem(PARTNER_STORAGE_KEY);
        }
      } else {
        const stored = localStorage.getItem(PARTNER_STORAGE_KEY);
        if (isSupportedPartner(stored)) activePartner = stored;
      }

      // ----- Theme variant -----
      const themeFromUrl = params.get("theme");
      let activeTheme: ThemeVariant | null = null;
      if (themeFromUrl !== null) {
        if (isSupportedTheme(themeFromUrl)) {
          activeTheme = themeFromUrl;
          localStorage.setItem(THEME_STORAGE_KEY, themeFromUrl);
        } else {
          localStorage.removeItem(THEME_STORAGE_KEY);
        }
      } else {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (isSupportedTheme(stored)) activeTheme = stored;
      }

      // Strip existing partner-* and theme-* classes
      root.classList.forEach((cls) => {
        if (cls.startsWith("partner-") || cls.startsWith("theme-")) {
          root.classList.remove(cls);
        }
      });
      if (activePartner) root.classList.add(`partner-${activePartner}`);
      if (activeTheme) root.classList.add(`theme-${activeTheme}`);
    };

    apply();
    window.addEventListener("popstate", apply);
    return () => window.removeEventListener("popstate", apply);
  }, []);
};
