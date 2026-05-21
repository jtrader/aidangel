// i18n routing + hreflang utilities.
// English is the default and lives at the root (no /en/ prefix).
import type { LanguageCode } from "@/contexts/LanguageContext";

export type Lang = LanguageCode;

export const LANGS: Lang[] = [
  "en", "zh", "yue", "ar", "vi", "pa", "el", "it",
  "kriol", "yolngu", "pitjantjatjara", "arrernte", "tsi",
];

export const NON_EN_LANGS: Lang[] = LANGS.filter((l) => l !== "en");

/** BCP-47 hreflang for each language. Use private-use tags for unassigned indigenous langs. */
export const HREFLANG: Record<Lang, string> = {
  en: "en-AU",
  zh: "zh-CN",
  yue: "yue-HK",
  ar: "ar",
  vi: "vi",
  pa: "pa",
  el: "el",
  it: "it",
  kriol: "rop",            // ISO 639-3 for Australian Kriol
  tsi: "tcs",              // ISO 639-3 for Torres Strait Creole / Yumplatok
  yolngu: "x-yolngu",      // BCP-47 private-use
  pitjantjatjara: "x-pitjantjatjara",
  arrernte: "x-arrernte",
};

export const RTL_LANGS: Set<Lang> = new Set(["ar"]);

export const dirFor = (lang: Lang): "ltr" | "rtl" => (RTL_LANGS.has(lang) ? "rtl" : "ltr");

/** Canonical production origin. All canonicals + sitemap entries point here. */
export const SITE_ORIGIN = "https://firstaidangel.org";

/** True if the first URL segment is a known non-English language code. */
export function isLangSegment(seg: string | undefined): seg is Lang {
  return !!seg && (LANGS as string[]).includes(seg) && seg !== "en";
}

/** Build the localized path for a given language + base (English) path. */
export function localizedPath(lang: Lang, basePath: string): string {
  const clean = basePath.startsWith("/") ? basePath : `/${basePath}`;
  if (lang === "en") return clean === "" ? "/" : clean;
  if (clean === "/") return `/${lang}`;
  return `/${lang}${clean}`;
}

/** Strip the lang prefix from a pathname, returning the English-equivalent path. */
export function stripLangPrefix(pathname: string): { lang: Lang; basePath: string } {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return { lang: "en", basePath: "/" };
  if (isLangSegment(parts[0])) {
    const rest = "/" + parts.slice(1).join("/");
    return { lang: parts[0] as Lang, basePath: rest === "/" ? "/" : rest };
  }
  return { lang: "en", basePath: "/" + parts.join("/") };
}

/** Build absolute canonical URL for a (lang, basePath) pair. */
export function canonicalUrl(lang: Lang, basePath: string): string {
  return SITE_ORIGIN + localizedPath(lang, basePath);
}

/** All hreflang alternates for a base (English) path, including x-default. */
export function alternates(basePath: string): Array<{ hreflang: string; href: string }> {
  const out = LANGS.map((l) => ({
    hreflang: HREFLANG[l],
    href: canonicalUrl(l, basePath),
  }));
  out.push({ hreflang: "x-default", href: canonicalUrl("en", basePath) });
  return out;
}
