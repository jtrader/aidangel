# LMS expansion: 16 new topics + 4 niche programs

## What you'll have when done

- **28 topic courses total** (current 12 + 16 new), each with split lessons, interactive engagement directives, end-of-topic quiz, and topic certificate.
- **5 programs total** (current 1 + 4 new niches), each curating 12 topics + final program quiz + program certificate.

## Phase 1 — 16 new topic courses

Create courses for the remaining KB articles (skipping the 3 hub articles `elderly-care`, `remote-first-aid`, `workplace-first-aid`, which stay as KB hubs, not LMS courses):

asthma · dehydration · dental-injury · diabetes · drowning · electric-shock · eye-injuries · fainting · fractures · mental-health-first-aid · nosebleed · poisoning · shock · spinal-injury · sprains-strains · sunburn

For each:
1. Split the KB body by `##` headings into ~3–5 lessons (deterministic, no AI cost).
2. Apply the interactive directive transforms (`:::danger`, `:::steps`, `:::tip`, `:::quiz`, `:::scenario`, `:::remember`) via a heuristic rewriter — same style as the existing 12.
3. Generate a **5-question multiple-choice quiz** per topic via Lovable AI (google/gemini-2.5-flash, ~$0.01 each, ~$0.16 total).
4. Insert into `courses`, `lessons`, `quiz_questions` via migration/insert tool.

Defaults per course: 80% pass mark, `beginner` level, 20-minute duration, `is_published = true`.

## Phase 2 — 4 niche programs

Build each as a row in `programs` + 12 `program_topics` (referencing existing course IDs) + 8 final quiz questions in `program_quiz_questions`.

**Parents & Childcare** (12): CPR Essentials · Choking · Recovery & DRSABCD · Anaphylaxis · Asthma · Burns · Head Injuries & Seizures · Fainting · Nosebleed · Dental Injury · Poisoning · Drowning

**Workplace & Trades** (12): CPR Essentials · AED Use · Severe Bleeding · Burns · Eye Injuries · Electric Shock · Fractures · Spinal Injury · Sprains & Strains · Heat Emergencies · Anaphylaxis · Mental Health First Aid

**Outdoor & Remote** (12): CPR Essentials · Recovery & DRSABCD · Severe Bleeding · Bites & Stings · Heat Emergencies · Cold Emergencies · Drowning · Dehydration · Sunburn · Fractures · Spinal Injury · Head Injuries & Seizures

**Aged Care & Carers** (12): CPR Essentials · AED Use · Stroke & Heart Attack · Choking · Falls (Fractures + Head Injuries combined messaging via Fractures topic) · Diabetes · Fainting · Severe Bleeding · Burns & Scalds · Dehydration · Mental Health First Aid · Recovery & DRSABCD

## Phase 3 — Surface in UI

- Update `/courses` and `/programs` pages to display the new entries (they're already query-driven, so likely automatic — I'll verify).
- Add a small "Pick a program" hero on `/programs` grouping by audience.

## Technical notes

- Lesson-split heuristic: every `##` becomes one lesson; intro paragraph before first `##` becomes lesson 1 ("Overview"). Short sections (<200 chars) merge with the next.
- Directive rewriter rules: lines starting with "Do NOT"/"Never"/"Warning" → `:::danger`; numbered procedures → `:::steps`; "Remember"/"Key" → `:::remember`; bullet warnings → `:::warning`; "If…then" advice → `:::tip`.
- Quiz generation prompt enforces JSON schema: `{question, choices[4], correct_index, explanation}`.
- All inserts batched per phase via `supabase--insert` (data) — schema is unchanged so no migration needed.
- Final program quiz questions written by hand from cross-topic AFA5 content (≈8 per program).

## Cost & time

- AI: ~$0.30 total (16 quizzes × ~$0.01 + 4 final quizzes × ~$0.02).
- Time: ~10–15 min of tool calls. I'll checkpoint after Phase 1 so you can spot-check before I build the programs.
