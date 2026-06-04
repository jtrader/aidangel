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

/**
 * IANA timezone → locale_id. Only timezones that map unambiguously to a
 * single published locale are listed. Shared zones (e.g. Europe/London is
 * used across UK/IE) are deliberately omitted so they don't masquerade as
 * a confident signal.
 */
export const timezoneToLocale: Record<string, string> = {
  // Australia
  'Australia/Sydney': 'au',
  'Australia/Melbourne': 'au',
  'Australia/Brisbane': 'au',
  'Australia/Perth': 'au',
  'Australia/Adelaide': 'au',
  'Australia/Hobart': 'au',
  'Australia/Darwin': 'au',
  'Australia/Canberra': 'au',
  'Australia/Lord_Howe': 'au',
  'Australia/Eucla': 'au',
  'Australia/Broken_Hill': 'au',
  'Australia/Currie': 'au',
  'Australia/Lindeman': 'au',
  'Antarctica/Macquarie': 'au',
  // New Zealand
  'Pacific/Auckland': 'nz',
  'Pacific/Chatham': 'nz',
  // United Kingdom
  'Europe/London': 'gb',
  'Europe/Belfast': 'gb',
  // Ireland
  'Europe/Dublin': 'ie',
  // Hong Kong
  'Asia/Hong_Kong': 'hk',
  // Singapore
  'Asia/Singapore': 'sg',
  // Canada (sample of the common zones — all map to ca)
  'America/Toronto': 'ca',
  'America/Vancouver': 'ca',
  'America/Edmonton': 'ca',
  'America/Winnipeg': 'ca',
  'America/Halifax': 'ca',
  'America/St_Johns': 'ca',
  'America/Montreal': 'ca',
  // United States (sample of common zones)
  'America/New_York': 'us',
  'America/Chicago': 'us',
  'America/Denver': 'us',
  'America/Los_Angeles': 'us',
  'America/Phoenix': 'us',
  'America/Anchorage': 'us',
  'Pacific/Honolulu': 'us',
};

function getBrowserTimezone(): string | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
  } catch {
    return null;
  }
}

/** Extract the region subtag (e.g. "AU") from a BCP-47 tag, if present. */
function extractRegion(tag: string): string | null {
  // e.g. "en-AU" → "AU", "zh-Hant-HK" → "HK", "en" → null
  const parts = tag.split('-');
  for (const p of parts.slice(1)) {
    if (/^[A-Za-z]{2}$/.test(p)) return p.toUpperCase();
  }
  return null;
}

/** All BCP-47 tags the browser advertises, in preference order. */
function getBrowserLanguages(): string[] {
  if (typeof navigator === 'undefined') return [];
  const list = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? [...navigator.languages]
    : [];
  if (navigator.language && !list.includes(navigator.language)) list.unshift(navigator.language);
  return list;
}

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
 *
 * IMPORTANT: We deliberately do NOT map generic `en-GB` or `en-US` to a
 * locale here. Both are commonly set as the OS language by users outside
 * the UK / US (Australians in particular frequently run "English (UK)" or
 * "English (US)"). Auto-switching them to 999 / 911 would put the wrong
 * emergency number in front of Australian users, which is the opposite of
 * what this app exists for. Only unambiguous regional variants (en-AU,
 * en-NZ, en-IE, zh-HK, yue) trigger a switch. Everything else returns null
 * so the caller falls back to AU (the primary audience) — users in other
 * countries can still pick their locale from the Availability page.
 */
export function detectLocaleFromBrowser(): string | null {
  return detectLocaleConfident().localeId;
}

export type LocaleDetectionConfidence = 'high' | 'medium' | 'none';

export interface LocaleDetection {
  localeId: string | null;
  /**
   * - 'high'   — language region AND timezone both point to the same locale
   *             (or one signal is so unambiguous it stands alone, e.g. yue).
   * - 'medium' — only one signal matches a known locale.
   * - 'none'   — no usable signal; caller should fall back to AU.
   */
  confidence: LocaleDetectionConfidence;
  signals: { language: string | null; region: string | null; timezone: string | null };
}

/**
 * Conservative locale auto-detection. We combine language + region subtag
 * + IANA timezone and only return a locale when the signals agree (or one
 * signal is unambiguous on its own). This matters because Crisis Compass
 * is primarily Australian: misclassifying an AU user as UK/US would put
 * 999 / 911 in front of them instead of 000.
 *
 * Rules:
 * 1. Walk navigator.languages in order, pick the first tag with an
 *    explicit region subtag (e.g. en-AU, zh-HK). A bare "en" is ignored.
 * 2. Resolve the browser's IANA timezone to a locale where possible.
 * 3. If the language-region locale matches the timezone locale → high
 *    confidence, return it.
 * 4. If only the timezone resolves, return it at medium confidence
 *    (timezone is a strong physical-location signal — much harder to
 *    accidentally misconfigure than OS language).
 * 5. If only the language region resolves, return that locale at medium
 *    confidence — UNLESS the region is GB or US, which Australians
 *    commonly set as their UI language without leaving Australia. Those
 *    fall through to 'none' so the caller defaults to AU.
 * 6. Unambiguous language tags with no region (yue → hk) count as a
 *    medium signal.
 * 7. Otherwise return 'none'.
 */
export function detectLocaleConfident(): LocaleDetection {
  const tz = getBrowserTimezone();
  const tzLocale = tz ? timezoneToLocale[tz] ?? null : null;

  const langs = getBrowserLanguages();
  const primaryLang = langs[0] ?? null;

  let langLocale: string | null = null;
  let regionMatched: string | null = null;
  for (const tag of langs) {
    const lower = tag.toLowerCase();
    // Unambiguous non-regional tags
    if (lower === 'yue' || lower.startsWith('yue-')) {
      langLocale = 'hk';
      regionMatched = null;
      break;
    }
    const region = extractRegion(tag);
    if (region && countryCodeToLocale[region]) {
      langLocale = countryCodeToLocale[region];
      regionMatched = region;
      break;
    }
  }

  const signals = { language: primaryLang, region: regionMatched, timezone: tz };

  // High confidence: both signals agree.
  if (langLocale && tzLocale && langLocale === tzLocale) {
    return { localeId: langLocale, confidence: 'high', signals };
  }

  // Timezone alone — physical-location signal, trustworthy.
  if (tzLocale) {
    return { localeId: tzLocale, confidence: 'medium', signals };
  }

  // Language alone — trust regional English variants EXCEPT en-GB / en-US,
  // which Australians commonly run as their OS UI language.
  if (langLocale) {
    if (regionMatched === 'GB' || regionMatched === 'US') {
      return { localeId: null, confidence: 'none', signals };
    }
    return { localeId: langLocale, confidence: 'medium', signals };
  }

  return { localeId: null, confidence: 'none', signals };
}

// =============================================================
// [SHARED] Language normalisation — copy unchanged to:
//   Guardian Guide · AidAngel · FirstAidAngel · LoveKey Link
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
