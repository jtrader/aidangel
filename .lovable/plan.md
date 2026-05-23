
# Multilingual refresh — 47 languages

Doing all of this in a single turn would either time out or produce sloppy output. I'm splitting it into 3 phases. **I'll do Phase 1 now**, then ship Phase 2 and Phase 3 in follow-up turns once you confirm Phase 1 looks good.

The translation pipeline uses Lovable AI Gateway (`google/gemini-3-flash-preview`) with a strict safety prompt:
- Preserve "000", "Triple Zero", phone numbers, dosages, brand names verbatim
- Never invent medical instructions; translate only
- Keep markdown structure intact for lesson bodies
- Mark every machine output with `_machine: true` so a community reviewer can audit later

---

## Phase 1 — UI strings refresh (this turn)

Refresh + expand the existing 19-key `LanguageContext` translation map. The current map only covers the welcome screen + a handful of quick-action labels.

**Scope:**
1. Replace the inline `translations` map with a per-language JSON file under `src/locales/{lang}.json` so the file isn't one 856-line monolith
2. Add new keys for common UI we currently render in English only: nav labels, footer, course list page chrome ("All courses", "Continue", "Start course"), quiz UI ("Submit quiz", "Retake quiz", "Passed"), source labels, emergency banner variants
3. Auto-translate every key for all 46 non-English languages using the AI gateway
4. Skip Yolŋu Matha / Pitjantjatjara / Arrernte / Kriol / Yumplatok with an English fallback + TODO comment (MT quality for these is unreliable — needs a community speaker)
5. Build still passes; no visual changes besides newly-translated strings appearing in their target languages

**Output:** ~50 keys × 41 reliably-translated languages ≈ 2,050 strings.

## Phase 2 — Extract hardcoded JSX strings (next turn)

Scan `src/` with an AST pass to find every hardcoded English string in JSX (text nodes, `alt`, `title`, `placeholder`, `aria-label`) and replace with `t("…")`.

**Scope:**
- Pages: `Index`, `Courses`, `CourseDetail`, `CourseLesson`, `CourseQuiz`, `LearnIndex`, `AedFinder`, `MyLearning`, plus headers/footers
- Skip admin pages (`/admin/*`) — internal tooling, not user-facing
- Skip raw markdown bodies (covered in Phase 3)
- Re-run the AI translator on the new keys for all 41 languages

**Expected:** ~300–500 new keys → ~12k–20k translation calls. This will take a few minutes of compute and should be done in its own turn.

## Phase 3 — Course / lesson / quiz content (final turn)

Course descriptions, lesson markdown bodies, quiz questions/choices/explanations, and source labels live in the database and dwarf the UI strings.

**Scope:**
1. New tables: `course_translations`, `lesson_translations`, `quiz_question_translations` (FK to source row + `lang` + translated fields + `is_machine` flag)
2. Read endpoints fall back to English when no translation exists
3. Frontend uses current `language` to fetch the right translation row for the active lesson/course/quiz
4. Run a one-off Python script (via `code--exec`) that streams every course row, translates each field via the AI gateway with the safety prompt, and inserts rows for the ~41 reliable languages
5. Admin UI gets a "Re-translate this lesson" button so editors can refresh after content changes

**Expected:** ~12 courses × 4 lessons × markdown body + 5 quiz Qs × 4 choices × explanations × 41 languages — roughly 25k–40k translation calls. This will take 15–25 minutes of compute and should be its own turn so you can interrupt if needed.

---

## Out of scope
- Translating educator directory entries (`educators.blurb`, etc.) — not requested, can be added later
- AI chatbot replies (already handled per-language by the chat edge function)
- RTL layout sweep beyond Tailwind logical properties (the existing build already sets `dir="rtl"` for ar/he/ur via `LanguageContext`)
- Currency / date formatting (separate concern from string translation)

---

## Technical notes
- All translation calls go through a single `/tmp/translate.py` script that the `ai-gateway` skill provides; one batched call per language using a JSON tool-call schema so we keep keys identical across languages
- The script writes results to `src/locales/{lang}.json` and re-imports them at build time — no runtime fetches
- Indigenous Australian languages stay flagged as needing human translation
