# Multilingual SEO routing for First Aid Angel

Make every language in the picker a real, crawlable URL on `firstaidangel.org` with pre-translated content, hreflang signals, and a complete sitemap — so Google and AI assistants index the localized pages as first-class content.

## Outcome

- **Primary domain:** `firstaidangel.org`. All canonicals point here. Other hosts (`www`, `.lovekeyring.org`, `.lovable.app`) will 301 to it once the user sets it as Primary in Lovable's Domains panel.
- **URL shape (subdirectories, not subdomains):**
  ```text
  /                       English home (x-default)
  /kb                     English KB index
  /kb/:slug               English KB topic
  /:lang/                 Localized home (zh, yue, ar, vi, pa, el, it, kriol, yolngu, pitjantjatjara, arrernte, tsi)
  /:lang/kb               Localized KB index
  /:lang/kb/:slug         Localized KB topic
  ```
- **Real translated HTML at every URL** — not runtime-only — so crawlers see Arabic content under `/ar/kb/cpr`, not the English shell.
- **hreflang** alternates linking every language version of each page, plus `x-default` → English.
- **Sitemap** ~470 entries (35 pages × 13 languages), each with `<xhtml:link rel="alternate" hreflang>` pairs.

## What gets built

### 1. Pre-translate KB to static files
- New script `scripts/translate-kb.ts` walks every topic in `kb/_meta.json`, calls the existing `translate-kb` edge function for each of the 12 non-English languages, and writes:
  - `kb/{lang}/{slug}.md` — full translated body
  - `kb/{lang}/_meta.json` — translated `title` + `summary` for each slug, plus translated category names
- Idempotent: skips files that already exist; `--force` flag re-translates.
- Run once now (~408 translations); future runs cover only new/changed topics.
- Also translates a small `ui-strings.json` (header/footer/landing copy) once per language, so the home page ships translated text too.

### 2. Per-language content loader
- Update `src/lib/kb.ts` to accept a language parameter: `getTopic(slug, lang)`, `getBody(slug, lang)`, `topicsByCategory(lang)`. Falls back to English if a translation is missing.
- Add `src/lib/uiStrings.ts` — typed accessor for the pre-translated UI strings.

### 3. Routing
- Add language-prefixed routes in `src/App.tsx`:
  - `/:lang` → `Index`
  - `/:lang/kb` → `KbIndex`
  - `/:lang/kb/:slug` → `KbTopic`
- Each page reads `lang` from the URL params, syncs it into `LanguageContext`, and renders pre-translated content.
- `LanguageSelector` navigates (`useNavigate`) to the equivalent URL under the chosen language instead of only mutating context.
- Invalid `:lang` → redirect to English equivalent.

### 4. Per-route head meta
- Install `react-helmet-async`; wrap app in `<HelmetProvider>`.
- New helper `src/lib/seoHead.tsx` emits per-route:
  - `<html lang="…" dir="rtl|ltr">`
  - `<title>` + `<meta description>` in the page's language
  - `<link rel="canonical" href="https://firstaidangel.org/{lang-path}">`
  - 13 `<link rel="alternate" hreflang="…">` tags + one `hreflang="x-default"`
  - `og:locale`, `og:url`, JSON-LD with `inLanguage`
- Remove canonical/og:url from `index.html` (moves to per-route).
- Update `index.html` `<html lang>` to be set client-side per route (Helmet handles it).

### 5. Sitemap + robots
- Rewrite `scripts/generate-sitemap.ts`:
  - `BASE_URL = "https://firstaidangel.org"`
  - For each route × each language, emit a `<url>` with `<xhtml:link rel="alternate" hreflang>` for every other language + `x-default`.
  - English versions get `hreflang="en-AU"`.
- Update `public/robots.txt` to add `Sitemap: https://firstaidangel.org/sitemap.xml`.

### 6. Domain setup (user action, documented in chat)
- In Lovable → Project Settings → Domains: set `firstaidangel.org` as **Primary**. The subdomain and `www` then auto-redirect there.

## Technical details

**Languages (13):** `en` (default, no prefix), `zh`, `yue`, `ar` (RTL), `vi`, `pa`, `el`, `it`, `kriol`, `yolngu`, `pitjantjatjara`, `arrernte`, `tsi`.

**hreflang codes used:** `en-AU`, `zh-CN`, `yue-HK`, `ar`, `vi`, `pa`, `el`, `it`, plus the indigenous codes (`rop` for Kriol, `tcs` for Yumplatok); the 4 Aboriginal languages without ISO codes use BCP-47 private-use tags (`x-yolngu`, `x-pitjantjatjara`, `x-arrernte`) — these still help users and don't break crawlers.

**Layout after build:**
```text
kb/
  cpr.md
  _meta.json
  zh/
    cpr.md
    _meta.json
  ar/
    cpr.md
    _meta.json
  ... (one folder per language)
```

**Edge function usage:** translation runs at build time only via the existing `translate-kb` function. The runtime `translate-ui` cache becomes a fallback for any UI string not pre-bundled.

**Cost & time:** one-time ~408 calls to `translate-kb` (Gemini Flash), runs in ~5–10 minutes. After this, builds are instant — no runtime translation needed on translated pages.

## What this plan does NOT do

- Does not switch to SSR/SSG framework (Next, Astro, etc.). Pre-translating content into the bundle gives crawlers what they need without changing stacks.
- Does not change the chat experience — the chat assistant on `/` and `/:lang/` already respects the language toggle.
- Does not buy or configure DNS. User sets primary domain in Lovable; redirects from subdomain happen automatically.

## Rollout order

1. Pre-translate script + run it.
2. Per-language content loader.
3. Routing + LanguageSelector navigation.
4. Per-route head (Helmet) with hreflang.
5. Sitemap + robots.txt update.
6. User flips Primary domain in Lovable settings.
