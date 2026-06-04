## Goal
Append the provided [SHARED] language normalisation block to the end of `src/lib/localeCodes.ts` without changing any existing content.

## What to do
1. Read `src/lib/localeCodes.ts` to confirm current content.
2. Use `code--line_replace` (or `code--write`) to append the new block after the final line (`export function detectLocaleFromBrowser...}`).

## Block to append
```typescript
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
```

## Verification
- Run `bunx tsc --noEmit` to confirm no TypeScript errors.
- Spot-check exports: `LANGUAGE_CODE_MAP`, `normaliseLanguageCode`, `buildHandoffUrl`, `INDIGENOUS_AUSTRALIAN_CODES`, `isIndigenousAustralianLanguage` are all exported.

## Constraints
- No existing content in `localeCodes.ts` may be changed.
- No other files may be touched.