// LoveKey HELP Network — canonical language and locale code mappings
// [SHARED] — copy unchanged to Crisis Compass, Guardian Guide, AidAngel.
//
// Locale IDs are stored lowercase and match locale_packs.locale_id.
// 'gb' is canonical, NOT 'uk'.
// Language codes are BCP 47 (e.g. en-AU, zh-CN, yue-HK) plus ISO 639-3 for
// languages without a BCP 47 tag (e.g. rop = Kriol, tcs = Torres Strait Creole)
// and IANA x- prefixes for First Nations languages.

export const localeAliases: Record<string, string> = {
  uk: 'gb',
  england: 'gb',
  britain: 'gb',
  au: 'au',
  nz: 'nz',
  gb: 'gb',
  us: 'us',
  ca: 'ca',
  ie: 'ie',
  hk: 'hk',
  sg: 'sg',
};

export const languageAliases: Record<string, string> = {
  zh: 'zh-CN',
  yue: 'yue-HK',
  kriol: 'rop',
  tsi: 'tcs',
  'en-au': 'en-AU',
  'en-gb': 'en-GB',
  'en-us': 'en-US',
  'en-nz': 'en-NZ',
  'en-ca': 'en-CA',
  'zh-cn': 'zh-CN',
  'yue-hk': 'yue-HK',
};

export const countryCodeToLocale: Record<string, string> = {
  AU: 'au',
  NZ: 'nz',
  GB: 'gb',
  US: 'us',
  CA: 'ca',
  IE: 'ie',
  HK: 'hk',
  SG: 'sg',
};

export const rtlLanguages = new Set(['ar', 'he', 'fa', 'ur']);

export function normaliseLocale(input: string | null | undefined): string {
  if (!input) return '';
  return localeAliases[input.toLowerCase()] ?? input.toLowerCase();
}

export function normaliseLanguage(input: string | null | undefined): string {
  if (!input) return '';
  return languageAliases[input.toLowerCase()] ?? input;
}

export function isRTL(languageCode: string): boolean {
  const base = normaliseLanguage(languageCode).split('-')[0].toLowerCase();
  return rtlLanguages.has(base);
}

/**
 * Detect locale_id from navigator.language. Returns null when unknown — callers
 * MUST handle null and never fall back to a hardcoded country/locale.
 */
export function detectLocaleFromBrowser(): string | null {
  if (typeof navigator === 'undefined') return null;
  const lang = navigator.language?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    'en-au': 'au',
    'en-nz': 'nz',
    'en-gb': 'gb',
    'en-us': 'us',
    'en-ca': 'ca',
    'en-ie': 'ie',
    'zh-hk': 'hk',
    yue: 'hk',
  };
  for (const [prefix, locale] of Object.entries(map)) {
    if (lang.startsWith(prefix)) return locale;
  }
  return null;
}

// =============================================================
// [SHARED] Language normalisation — copy unchanged to:
//   Guardian Guide · Crisis Compass · AidAngel · LoveKey Link
//
// Added: language normalisation map for cross-site handoffs.
// Canonical codes are the shortest unambiguous BCP 47 form.
// x-yolngu is the agreed network standard for Yolŋu Matha.
// =============================================================

export const LANGUAGE_CODE_MAP: Record<string, string> = {
  'en': 'en', 'en-AU': 'en', 'en-GB': 'en',
  'en-US': 'en', 'en-NZ': 'en', 'en-IE': 'en', 'en-SG': 'en',
  'zh': 'zh', 'zh-CN': 'zh', 'zh-TW': 'zh', 'zh-SG': 'zh',
  'yue': 'yue', 'yue-HK': 'yue', 'zh-HK': 'yue',
  'ar': 'ar', 'el': 'el', 'it': 'it', 'pa': 'pa',
  'vi': 'vi', 'hi': 'hi', 'es': 'es', 'tl': 'tl',
  'aer': 'aer', 'x-arrernte': 'aer',
  'pjt': 'pjt', 'x-pitjantjatjara': 'pjt',
  'wbp': 'wbp', 'rop': 'rop', 'tcs': 'tcs',
  'x-yolngu': 'x-yolngu', 'yolngu': 'x-yolngu', 'x-yol': 'x-yolngu',
}

export function normaliseLanguageCode(
  raw: string | null | undefined
): string | null {
  if (!raw) return null
  return LANGUAGE_CODE_MAP[raw] ?? raw
}

export function buildHandoffUrl(
  baseUrl: string,
  countryCode: string,
  rawLanguageCode: string,
  path: string
): string {
  const lang = normaliseLanguageCode(rawLanguageCode) ?? 'en'
  const cc = countryCode.toLowerCase()
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${baseUrl}/${cc}/${lang}/${cleanPath}`
}

export const INDIGENOUS_AUSTRALIAN_CODES = new Set([
  'aer', 'pjt', 'wbp', 'rop', 'tcs', 'x-yolngu',
])

export function isIndigenousAustralianLanguage(
  code: string | null | undefined
): boolean {
  if (!code) return false
  return INDIGENOUS_AUSTRALIAN_CODES.has(normaliseLanguageCode(code) ?? '')
}

// [SHARED] END — language normalisation
// =============================================================
