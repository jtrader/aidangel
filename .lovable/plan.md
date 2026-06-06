# Translation prompt for menu & nav items

Add a reusable system prompt that the AI gateway can use whenever it translates header/menu/nav UI strings (DonateMenu, ShopMenu, LearnMenu, LanguageSelector, mobile drawer, footer nav, AED Finder button, etc.) into any of the 48 supported locales.

## Where it lives

New file: `src/lib/prompts/navTranslationPrompt.ts`

Exports:
- `NAV_TRANSLATION_SYSTEM_PROMPT(langName: string): string` — full system prompt, language-name interpolated.
- `NAV_PRESERVE_TERMS: string[]` — brand / non-translatable tokens reused elsewhere.

## What the prompt enforces

1. **Role & tone** — "You translate short navigation and menu labels for First Aid Angel, an Australian first aid web app, into {langName}. Calm, clear, friendly, action-oriented. Match the register of native mobile app navigation in {langName}."
2. **Length discipline** — Keep each label as short as the English source (ideally ≤ 2 words / ≤ 18 characters). Prefer the conventional nav word used by major apps in that language over a literal translation (e.g. "Home" → 首页, not 家).
3. **Preserve verbatim** (`NAV_PRESERVE_TERMS`):
   `First Aid Angel`, `AED`, `CPR`, `DRSABCD`, `000`, `Triple Zero`, `LoveKey`, `HELP Network`, `St John`, `Red Cross`, brand product names, emoji, and any `{placeholder}` tokens.
4. **Emergency numbers** — never translate or localize `000`; keep as `tel:000` anchor text untouched.
5. **Capitalization** — follow the target language's standard nav casing (Title Case for English-like scripts; sentence case for de/fr/es; no case for CJK/Arabic).
6. **Formatting** — preserve leading icons, trailing arrows, ellipses, em-dashes, and any HTML/markdown.
7. **No additions** — no explanations, no parentheticals, no transliterations in brackets.
8. **Output shape** — strict JSON: `{"translations": ["...", "..."]}`, same length and order as the input `texts` array. Blank or untranslatable items echo the English source.

## Wiring (optional, same change)

Update `supabase/functions/translate-ui/index.ts` to accept a `surface: "nav" | "generic"` field on the request body. When `surface === "nav"`, swap in `NAV_TRANSLATION_SYSTEM_PROMPT(langName)` instead of the current generic system prompt; otherwise behavior is unchanged. `useUiStrings` callers used by header/menu components pass `surface: "nav"`; everything else stays on the generic prompt.

## Out of scope

- No locale JSON edits, no DB translation backfill, no new languages.
- LMS topic translations (separate plan already in `.lovable/plan.md`).
