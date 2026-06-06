## Goal

Make LMS content (topic titles/summaries/descriptions, lesson bodies, quiz questions/choices/explanations) display in the user's selected language, with English as the fallback. UI chrome is already localized — this plan covers the **content** stored in `courses`, `lessons`, and `quiz_questions`.

## Current state

- 28 published topics, ~all lessons and quiz questions are English-only.
- `course_translations`, `lesson_translations`, `quiz_question_translations` tables exist with correct shape and RLS (public-read for published courses, admin-write) — all currently empty.
- No reader code uses the `*_translations` tables yet.
- `.translation-manifest/db.json` doesn't exist — first run will be a full bootstrap.

## Scope

**42 target languages** (skip 5 indigenous: arrernte, kriol, pitjantjatjara, tsi, yolngu — English fallback only, per project policy):
`ar bg bn cs da de el es et fi fr he hr hu id is it ja ko lt lv ms ne nl no pa pl pt ro si sk sl sr sv th tl tr uk ur vi yue zh`

**Fields translated:**
- courses: `title`, `summary`, `description`
- lessons: `title`, `body` (markdown preserved)
- quiz_questions: `question`, `choices` (JSON array), `explanation`

## Steps

### 1. Backfill translations (one-off bootstrap)

Use the bundled `update-translations` skill:
- Run `scripts/update_db.py` against the live DB. It exports rows via `psql`, diffs against `.translation-manifest/db.json` (missing → treat all as changed), batches each language to Lovable AI Gateway (`google/gemini-3-flash-preview`) with the medical-safety system prompt (preserves `000`, drug names, dosages, markdown, placeholders), and emits one idempotent UPSERT SQL file per language in `/tmp/sql-update/`.
- Apply each `/tmp/sql-update/{lang}.sql` via `supabase--insert` (42 tool calls, one per language). Each row is `INSERT … ON CONFLICT (id, lang) DO UPDATE`.
- Commit the new `.translation-manifest/db.json` so future content edits only re-translate the diff.

### 2. Wire the reader pages

Add a tiny helper `src/lib/lmsI18n.ts` exporting `pickTranslated<T>(row, translations, fields)` that returns the row with `fields` overwritten from the matching `lang` row when present, falling back to English.

Update each reader to fetch the active language's translation row in parallel with the base row and merge:

- **`src/pages/Courses.tsx`** — topic catalog grid (title + summary). Join with `course_translations` filtered by `lang = currentLang`.
- **`src/pages/CourseDetail.tsx`** — topic page (title, summary, description). Same join.
- **`src/pages/CourseLesson.tsx`** — lesson page (title, body markdown). Join with `lesson_translations`.
- **`src/pages/CourseQuiz.tsx`** — quiz (question, choices, explanation). Join with `quiz_question_translations`.
- **`src/components/TopicsSidebar.tsx`** and **`src/components/TopicCover.tsx`** — display titles. Same pattern.
- **`src/components/kb/KbCourseHandoff.tsx`** — topic title preview. Same pattern.
- **`src/pages/MyLearning.tsx`** — enrolled-topic cards. Same pattern.

Reader queries stay scoped to `lang = currentLang` (single round-trip per page); when the translation row is missing the English base row is shown as-is.

**Out of scope for the reader pass:**
- Admin LMS pages (`AdminCourses`, `AdminLearners`, `AdminGraduates`, `AdminVideos`, `AdminPrograms`) — admins edit the English source, so they keep showing English.
- Employer reporting pages — internal English-only by design.

### 3. Keep translations fresh

Document the workflow in `README.md`: whenever a course/lesson/quiz row is edited in admin, re-run `scripts/update_db.py`; only changed fields are re-translated and pushed via `supabase--insert`. No webhook automation in v1.

### 4. QA

- Switch language to `de`, `ja`, `ar` on `/topics`, open one topic, one lesson, and one quiz — confirm content is translated, falls back gracefully if a row is missing, and markdown/placeholders render correctly.
- Confirm `ar` lays out RTL on lesson body.
- Re-run `bun run build` and `tsc --noEmit` — must stay clean.

## Technical notes

- **Active language source**: `useLanguage()` from `src/contexts/LanguageContext.tsx` (already used across reader pages).
- **Locale code mapping**: project uses BCP-47-ish codes that match the translation table `lang` column (e.g. `de`, `zh`, `yue`, `pt-BR` if present). Verify before run; add a small alias map only if mismatched codes surface.
- **Cost guard**: bootstrap is ~28 topics × 3 fields + lessons + quiz, × 42 langs. Run with the script's built-in batching/parallelism, no extra loops needed.
- **No schema changes** — tables, indexes, grants, and RLS are all already in place.
- **No edge function** required for v1; translation runs are operator-initiated.

## Deliverables

- Populated `course_translations`, `lesson_translations`, `quiz_question_translations` for 42 languages.
- New `src/lib/lmsI18n.ts` helper.
- Updated reader pages/components listed above.
- New `.translation-manifest/db.json` checked in.
- README note describing the re-run workflow after content edits.