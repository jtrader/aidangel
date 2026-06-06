# First Aid Angel — Copilot Instructions

This file is read automatically by GitHub Copilot in VS Code.
It provides project context, conventions, and constraints that cannot be
inferred from the code alone.

---

## What this project is

**First Aid Angel** (`firstaidangel.org`) is a multilingual first aid
reference app and CPD learning platform. It is a React + TypeScript SPA
(Vite, Tailwind CSS, shadcn/ui) backed by Supabase (Postgres + Edge Functions)
with Shopify used as a payment and product backend.

Primary audience: general public seeking first aid guidance, particularly in
Australia. Secondary: employers who need to demonstrate staff training compliance.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix) |
| State / data | TanStack Query, Zustand (cart only), Supabase JS client |
| Backend | Supabase (Postgres + Row Level Security + Edge Functions) |
| Edge functions | Deno runtime — import via `npm:` specifier, not Node |
| Payments | Shopify Checkout — direct `/cart/` permalink, no Stripe or Paddle |
| Commerce | Shopify Storefront API (kit catalogue); Shopify Admin API (scripts) |
| Maps | Mapbox GL |
| Auth | Supabase Auth (email + password, Google OAuth, Apple OAuth) via `lovable.auth` |
| Email | Custom queue via `process-email-queue` + `send-transactional-email` |
| i18n | 48 languages; JSON locale files in `src/locales/`; auto-translate via `useUiStrings` hook |
| Testing | Vitest |
| Path alias | `@/` maps to `src/` |

---

## Architecture decisions — do not second-guess these

### Shopify is a backend, not a storefront
Shopify is used purely as a payment processor and product/image CDN.
- Credit pack products and affiliate kit products are **not** for direct
  storefront browsing — they are `ACTIVE` status so the checkout URL works,
  but they are never surfaced via the public shop UI
- Do not suggest adding these products to collections visible to shoppers
- Do not suggest using the Shopify Admin checkout or the Storefront Cart API
  when the `/cart/` permalink approach is already in use — the permalink skips
  the cart page intentionally and is the correct pattern here

### Direct `/cart/` permalink for checkout
Credit pack purchases use:
```
https://<domain>/cart/<variantId>:1?checkout[email]=...&attributes[_user_id]=...
```
This bypasses the Shopify cart page entirely. Do not replace this with
`cartCreate` mutations — the current approach is intentional and simpler.
Cart attributes flow through to `note_attributes` on the order webhook payload.

### Two separate Shopify checkout flows
- `cert-checkout` edge function → single certificate purchase (existing, working)
- `create-credit-checkout` edge function → credit pack purchase (new)

These are separate functions on purpose. Do not merge them.

### Certificate credits are one-off purchases
All certificate credit packs are **one-off purchases**, not subscriptions.
Never suggest `mode: "subscription"` for any credit pack checkout.
The `subscriptions` table exists in the DB for historical reasons but is no
longer written to by new code.

### `consume_certificate_credit` is an atomic RPC
The function `public.consume_certificate_credit(_user, _env)` uses
`SELECT ... FOR UPDATE` to atomically deduct a credit. Never replace this
with a direct `UPDATE` query — it would introduce a race condition.

### Shopify webhook handles both cert issuance and credit grants
`supabase/functions/shopify-cert-webhook/index.ts` handles `orders/paid` for
both certificate purchases (dispatched on `_eligibility_token` attribute) and
credit pack purchases (dispatched on `_price_id` attribute). Do not split this
into two separate webhook endpoints.

### English is the default — no `/en/` prefix
The app routes English content at the root path (e.g. `/kb/cpr`, not `/en/kb/cpr`).
Non-English routes use a `/:lang/` prefix. The `LangRoute` component handles
validation and redirects invalid lang codes to the English equivalent.

---

## Supabase edge function conventions

These apply to every file in `supabase/functions/`:

```typescript
// ✅ Correct Deno import style
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// ❌ Wrong — this is Node/npm syntax, not Deno
import { createClient } from "@supabase/supabase-js";
```

- Always handle `OPTIONS` preflight: `if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })`
- Always spread `...corsHeaders` in every response header
- Service role key (`SUPABASE_SERVICE_ROLE_KEY`) is only ever used inside edge
  functions — never suggest passing it to the client
- Webhook functions that receive external HTTP calls (Shopify, Paddle) must
  set `verify_jwt = false` in `supabase/config.toml`
- New functions that require an authenticated user should set `verify_jwt = false`
  and verify the JWT manually via `supabase.auth.getUser()` using the
  Authorization header — this gives access to the user object within the function
- Use `maybeSingle()` not `single()` for queries that may return no rows

### `supabase/config.toml` — add an entry for every new function
```toml
[functions.my-new-function]
verify_jwt = false   # or true, depending on whether it receives external webhooks
```

---

## Database conventions

### RLS is enabled on every table
Every table has Row Level Security enabled. Service role bypasses RLS;
authenticated users are subject to policies. When adding a new table, always:
1. `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
2. Add appropriate policies for `anon`, `authenticated`, and service role
3. Explicitly `GRANT` access rather than relying on defaults

### Key tables
| Table | Purpose |
|---|---|
| `certificate_credits` | Credit balance per user. PK is `user_id`. |
| `program_certificates` | Credits-issued certs (free path via RPC) |
| `shopify_certificates` | Paid certs issued via Shopify webhook |
| `shopify_credit_orders` | Idempotency log for credit pack orders |
| `certificate_eligibility_tokens` | 24h single-use tokens for cert checkout |
| `webhook_events` | Idempotency log for all incoming webhooks |
| `route_catalogue` | Affiliate kit links (St John, etc.) |
| `route_clicks` | Click tracking for affiliate links |
| `organisations` | Employer orgs |
| `org_members` | Org membership; active members have program access via employer plan |
| `educators` | Approved first aid training providers |
| `courses` | Individual topics (e.g. CPR, Burns) |
| `programs` | Multi-topic courses with a final quiz and certificate |

### `certificate_credits` upsert conflict target
The primary key is `user_id` alone (not composite). The correct upsert is:
```typescript
supabase.from("certificate_credits").upsert({ ... }, { onConflict: "user_id" })
```

### Migration naming
Follow the existing pattern: `YYYYMMDDHHMMSS_description.sql`
Latest migrations are in the `20260606` range.

---

## Frontend conventions

### Component structure
- UI primitives live in `src/components/ui/` (shadcn/ui — do not hand-roll)
- Shared cross-feature components live in `src/components/shared/`
- Feature components live in `src/components/<feature>/`
- Page components live in `src/pages/`

### Styling
- Use Tailwind utility classes exclusively — no inline styles, no CSS modules
- Use CSS custom properties from `src/index.css` for semantic colours:
  `bg-primary`, `text-muted-foreground`, `bg-card`, `border-border`, etc.
- Brand primary colour is red (`hsl(0 72% 51%)`)
- Custom semantic tokens: `--emergency`, `--safe`, `--warning`
- Border radius token: `--radius: 0.75rem` → use `rounded-2xl` for cards
- Font: Inter (body), display font for headings via `font-display` class

### Data fetching
- Use TanStack Query (`useQuery`, `useMutation`) for server state where a hook
  already exists — don't add raw `useEffect` + `fetch` patterns
- For simple one-off fetches in a page component, `useEffect` + Supabase client
  is acceptable (existing pattern throughout the codebase)
- Never call Supabase directly from a component if a typed hook already exists

### i18n
- All user-facing strings in page/component code should use `useUiStrings()`
  for auto-translation: `const tr = useUiStrings({ heading: "My heading" })`
- Do not hardcode English strings directly into JSX in new components
- Static locale strings (navigation, common labels) live in `src/locales/en.json`
  and are accessed via `const { t } = useLanguage()`
- RTL languages: `ar`, `he`, `ur` — set `dir="rtl"` on root elements for these

### Routing
- Routes are defined in `src/App.tsx` — add new routes there
- Protected routes wrap with `<RequireAuth>` (and optionally `<RequireAuth adminOnly>`)
- Every new public page needs a `<SeoHead>` component with `title`, `description`,
  and `basePath` for canonical URL generation

---

## Knowledge base (KB)

- Source files live in `kb/` as Markdown — one file per topic
- Translations live in `kb/<lang>/` subdirectories (e.g. `kb/ar/cpr.md`)
- Metadata index is `kb/_meta.json` — must be updated when adding a topic
- KB content is sourced from *The St John of God First Aid Manual 5th Edition*
- Do not modify KB content files programmatically — they are editorial
- The KB embed system (`src/lib/kb.ts`) loads files at runtime; no build step needed

---

## What not to touch

Unless a task explicitly mentions these areas, do not modify:

- `src/pages/KbIndex.tsx`
- `src/pages/KbTopic.tsx` — except to insert `<KbCourseHandoff>` and `<KbProgramHandoff>` per the funnel spec below
- `src/components/TopicCover.tsx` — contains the authoritative `KB_TO_COURSE` map; do not modify
- Anything in `src/pages/AedFinder.tsx`, `src/pages/AedIndex.tsx`, `src/pages/AedCity.tsx`, `src/pages/AedCountry.tsx`
- Anything in `src/components/kits/`, `src/hooks/useKits.ts`, `src/lib/kitZones.ts`
- Anything in `src/pages/Employer*.tsx` (employer dashboard pages — distinct from EmployerMarketing)
- Anything in `src/pages/Admin*.tsx`
- `src/lib/certificate.ts` — PDF generation logic
- `src/pages/ProgramCertificate.tsx` — certificate redemption page
- `src/pages/CertificateVerify.tsx` — public verification page
- `supabase/functions/cert-checkout/index.ts` — single cert Shopify flow
- `src/lib/i18n.ts` and `src/locales/` — i18n infrastructure
- `kb/` directory Markdown content files — editorial content, never programmatically modified
- `src/lib/kbHandoffMap.ts` and `src/components/kb/KBHandoffCard.tsx` — separate sister-site handoff, not the course funnel

---

## Security rules

- Never suggest logging or returning `SUPABASE_SERVICE_ROLE_KEY`, API keys,
  or webhook secrets in responses or console output
- Never suggest storing sensitive keys in `localStorage` or client-accessible env vars
  (`VITE_` prefix exposes to browser — only non-secret config goes there)
- All webhook handlers must verify the request signature before processing
  (HMAC for Shopify, signature header for others)
- `learner_initial` is shown instead of full name on the public certificate
  verify page — this is intentional privacy design, do not change it
- RLS policies must always accompany new table creation

---

## Payment flow summary (current state)

```
Unauthenticated user clicks "Buy credit pack"
  → handleBuy() sets pendingPriceId, opens EnrolAuthDialog (variant="purchase-personal/employer")
  → User signs up or signs in
  → onAuthSuccess() calls openCheckout({ priceId: pendingPriceId })
  → useShopifyCheckout hook
  → supabase.functions.invoke("create-credit-checkout", { priceId })
  → Edge function builds /cart/<variantId>:1?attributes[_user_id]=...
  → window.location.href = checkoutUrl  (direct to Shopify payment page)
  → User pays on Shopify
  → Shopify fires orders/paid webhook
  → supabase/functions/shopify-cert-webhook dispatches on _price_id attribute
  → handleCreditPackOrder() upserts certificate_credits
  → User sees credits in ProgramCertificate page
  → User clicks "Use 1 credit & issue certificate"
  → consume_certificate_credit RPC (atomic)
  → program_certificates row inserted
  → generateCertificatePdf() downloads PDF
```

Already authenticated user clicks "Buy" — dialog is skipped, goes straight to
`openCheckout()`.

Single certificate (no credits) flow:
```
User clicks "Purchase certificate — AU$29"
  → ProgramCertificate.tsx calls supabase.functions.invoke("cert-checkout")
  → cert-checkout verifies eligibility, mints token, creates Shopify cart
  → User pays on Shopify
  → shopify-cert-webhook dispatches on _eligibility_token attribute
  → shopify_certificates row inserted, token marked used
  → User downloads PDF
```

---

## KB → Course + Program funnels

### Overview
Every KB topic page embeds one of two contextual handoff cards that link
readers into the learning platform. This is the primary organic conversion
path from the knowledge base to courses and programs.

- **34 topics** → `KbCourseHandoff` — "Test your knowledge" / course CTA
- **3 topics** → `KbProgramHandoff` — program-level CTA (workplace, remote, elderly)
- `mental-health-first-aid` → `KbCourseHandoff` with **sensitive variant** (soft copy,
  no quiz language) + existing `KBHandoffCard` for Guardian Guide sister-site

### Key files
| File | Purpose |
|---|---|
| `src/lib/kbCourseMap.ts` | `KB_COURSE_MAP`, `KB_PROGRAM_MAP`, and helper functions |
| `src/components/kb/KbCourseHandoff.tsx` | Course CTA card — 34 topics including mental health |
| `src/components/kb/KbProgramHandoff.tsx` | Program CTA card — workplace, remote, elderly only |
| `src/components/kb/KBHandoffCard.tsx` | Sister-site handoff — mental health + remote (do not touch) |
| `src/components/TopicCover.tsx` | Contains authoritative `KB_TO_COURSE` map — source of truth for course slugs |

### Course slug source of truth
`TopicCover.tsx` contains `KB_TO_COURSE` — the authoritative mapping of KB
slugs to live LMS course slugs. `KB_COURSE_MAP` in `kbCourseMap.ts` is derived
from this. **Never guess course slugs** — many differ from KB slugs:

```
cpr               → cpr-essentials
bleeding          → severe-bleeding
burns             → burns-scalds
heart-attack      → stroke-heart-attack   (shared with stroke)
stroke            → stroke-heart-attack   (shared with heart-attack)
head-injury       → head-injuries-seizures (shared with seizures)
seizures          → head-injuries-seizures (shared with head-injury)
snake-bite        → bites-and-stings      (shared with spider-bite, jellyfish-stings)
heat-illness      → heat-emergencies
hypothermia       → cold-emergencies
drsabcd           → recovery-drsabcd      (shared with recovery-position)
mental-health-first-aid → mental-health-first-aid
```

### Program slugs
All program slugs have an `-essentials` suffix. Confirmed from production:
```
emergency-response-essentials
parents-childcare-essentials
workplace-trades-essentials
outdoor-remote-essentials
aged-care-essentials
```
Files that hardcode program slugs (`Programs.tsx`, `TopicsSidebar.tsx`,
`ProgramDetail.tsx`) must use these exact values. The old slugs without
`-essentials` are stale — do not reintroduce them.

### Rendering order per KB topic type

| Topic type | KbCourseHandoff | KbProgramHandoff | KBHandoffCard |
|---|---|---|---|
| 31 standard topics | ✅ Quiz CTA | — | — |
| `mental-health-first-aid` | ✅ Soft ALGEE CTA (no quiz language) | — | ✅ Guardian Guide |
| `remote-first-aid` | — | ✅ Outdoor & Remote program | ✅ Crisis Compass |
| `workplace-first-aid` | — | ✅ Workplace & Trades program | — |
| `elderly-care` | — | ✅ Aged Care program | — |

Both `KbCourseHandoff` and `KbProgramHandoff` return null for slugs outside
their maps — exactly one renders per page, never both.

Position in `KbTopic.tsx` article (after `<AngelActionDownload>`):
```tsx
<AngelActionDownload />
<KbCourseHandoff kbSlug={topicEn.slug} lang={language} />
<KbProgramHandoff kbSlug={topicEn.slug} lang={language} />
[Q&A accordion]
[Related topics]
<NearbyEducators />
[Source aside]
<KBHandoffCard />
```

### The `?from=kb&kbSlug=<slug>` query parameter
Set by `KbCourseHandoff` on click. Carried through the entire course flow
so the "Back to article" link works at lesson completion.

```
/kb/cpr  →  click "Test your knowledge"
  → KbCourseHandoff fires fireKbCourseConversion() RSP signal
  → /topics/cpr-essentials?from=kb&kbSlug=cpr
  → CourseDetail auto-enrolls, deep-links to first lesson:
      /topics/cpr-essentials/lesson/<slug>?from=kb&kbSlug=cpr
  → CourseLesson carries param through next-lesson hrefs
  → On last lesson or mark-complete: "← Back to cpr article" link → /kb/cpr
```

**Rules:**
- Always carry `?from=kb&kbSlug=<slug>` forward in next-lesson hrefs inside `CourseLesson`
- `CourseDetail` auto-enrol + deep-link only fires when `from=kb` is in the URL — not on every visit
- Never strip this param when navigating within the course flow
- Do not apply `?from=kb` to `ProgramDetail` — programs have their own flow, no deep-linking needed

### Mental health sensitive handling
- `KbCourseHandoff` renders with `isSensitive = true` for `mental-health-first-aid`
- Copy says "Learn the ALGEE framework" — never "Test your knowledge" or quiz language
- Uses `Heart` icon instead of `GraduationCap`
- RSP signal fires with `suppression_active: true` — counts for analytics, never retargeted
- `KBHandoffCard` (Guardian Guide sister-site) renders below it unchanged
- `KbProgramHandoff` does NOT render for mental health — it has its own course

### What NOT to do
- Do not merge `KbCourseHandoff` with `KBHandoffCard` — different purposes
- Do not merge `KbCourseHandoff` with `KbProgramHandoff` — different targets
- Do not add quiz language or a quiz CTA to the mental health topic
- Do not apply `?from=kb` deep-linking to programs — courses only
- Do not invent course slugs — always derive from `TopicCover.tsx` `KB_TO_COURSE`
- Do not reintroduce program slugs without the `-essentials` suffix

---

## Authentication and user sync

### OAuth providers
The `lovable` integration (`src/integrations/lovable/index.ts`) supports
`"google"`, `"apple"`, `"microsoft"`, and `"lovable"` as OAuth providers.
Google and Apple are wired up. Use `lovable.auth.signInWithOAuth(provider, opts)`
— never call `supabase.auth.signInWithOAuth` directly.

### LMS ↔ Shopify customer sync
Every new user gets a matching Shopify customer record created automatically.
This ensures their email is pre-filled at Shopify checkout.

- **On signup** — `Auth.tsx` fires `shopify-customer-sync` edge function after
  `supabase.auth.signUp()` returns a session
- **On sign-in** — `useAuth.ts` fires it once per browser session via a
  `sessionStorage` flag, so Google/Apple OAuth users are also synced
- **The sync is always fire-and-forget** — `.catch()` only, never `await`
- Stores `shopify_customer_id` on the `profiles` table
- `profiles` table has a DB trigger that auto-creates a row on every new user

Never add a second call to `shopify-customer-sync` — the `useAuth` hook
already handles all sign-in cases. Only `Auth.tsx` (signup path) and
`EnrolAuthDialog.tsx` (signup path) need to call it directly.

### Consent fields stored in `user_metadata`
On signup, `privacy_accepted: true`, `privacy_accepted_at`, and
`marketing_opt_in` are stored in `supabase.auth.signUp` `options.data`.
They land in `auth.users.raw_user_meta_data`. Do not create a separate table
for consent — `user_metadata` is the source of truth.

---

## `EnrolAuthDialog` — inline auth for enrolment and purchase intents

### Overview
`src/components/EnrolAuthDialog.tsx` is a Dialog component that opens inline
over the current page when an unauthenticated user attempts to enrol in a
course, start a program, or purchase a credit pack. It replaces the old
pattern of `navigate('/auth?redirect=...')`.

`src/pages/Auth.tsx` is kept unchanged — it still serves `RequireAuth`
redirects, email confirmation return URLs, and password reset flows.

### Variants

The dialog has a `variant` prop that controls heading and subtext copy:

| Variant | Used in | Audience | Post-auth action |
|---|---|---|---|
| `"enrol"` (default) | CourseDetail, ProgramDetail, KbCourseHandoff, KbProgramHandoff | Individual learner | Enrol + navigate to lesson/program |
| `"purchase-personal"` | PersonalMarketing | Individual buyer | Open Shopify checkout |
| `"purchase-employer"` | EmployerMarketing | HR / manager / business owner | Open Shopify checkout |

### Key behaviours
- **Google and Apple OAuth** both supported — use `lovable.auth.signInWithOAuth`
- **Logo** — imports `@/assets/aidangel-logo.png` (same as Auth.tsx and headers)
- **Signup mode default** — dialog always opens in signup mode since it targets
  new users; returning users toggle to sign-in via a link at the bottom
- **`onSuccess` callback** — called after successful auth so the parent can
  proceed with enrolment or checkout immediately, without a second navigation
- **`pendingPriceId` pattern** — purchase pages stash the priceId in state
  before opening the dialog; `onAuthSuccess` reads it and fires `openCheckout`
- **`onAuthSuccess` uses `getSession()`** — not `useAuth`'s `user` state, which
  is async. `supabase.auth.getSession()` gives the userId synchronously
  within the callback

### Consent checkboxes (email signup only)
Two checkboxes appear in the email signup form:
1. **Privacy policy** (required, pre-checked) — links to `/privacy`
   Blocks submission if unchecked with `toast.error`
2. **Marketing opt-in** (optional, pre-checked) — "Send me first aid tips..."

Both stored in `options.data` on `supabase.auth.signUp`. Neither shown for
OAuth flows (handled by the provider).

### What NOT to do
- Do not replace `Auth.tsx` — the dialog is additive, not a replacement
- Do not add Apple or Google OAuth anywhere except via `lovable.auth.signInWithOAuth`
- Do not `await` the `shopify-customer-sync` call — always fire-and-forget
- Do not open the dialog for users who are already signed in — check `user`
  before calling `setAuthDialogOpen(true)`
- Do not use the `"enrol"` variant for purchase flows — wrong copy, wrong intent

---

## RSP (Real-time Signal Pipeline)

### Overview
The RSP captures anonymised behavioural signals from key user journeys and
writes them to the `rsp_signals` table in Supabase. These signals power
downstream marketing retargeting and engagement analytics.

### Key files
| File | Purpose |
|---|---|
| `src/lib/rsp/types.ts` | `FAAEventType` union + `FAASignal` interface |
| `src/lib/rsp/faaAdapter.ts` | URL classifier (`classifyPath`) + `fireSignal` + named helpers |
| `src/lib/rsp/signalStore.ts` | `writeSignal()` — writes to `rsp_signals`, always silent-fails |
| `src/lib/rsp/session.ts` | `getSessionId()` — stable session UUID from sessionStorage |
| `src/hooks/useRSPAdapter.ts` | Fires a signal on every route change via `useLocation` |

### Signal types (current)
| Event type | Fired when |
|---|---|
| `kb_article_viewed` | User views any KB topic page |
| `kb_course_conversion` | User clicks course CTA on a KB topic page (all tiers, tier 3 suppressed) |
| `kb_program_handoff` | User clicks program CTA on a KB topic page (tiers 1–2 only, never tier 3) |
| `course_viewed` | User views a `/topics/` or `/courses/` page |
| `symptom_lookup` | User views a `/symptoms/<slug>` page |
| `aed_location_search` | User views an `/aed/<country>` page |
| `workplace_vertical_viewed` | User views a `/workplace/<sector>` page |
| `angel_action_viewed` | User views the Angel Action page |

### Sensitivity tiers
Signals carry a `sensitivity_tier` (1–3) that controls downstream suppression:
- **Tier 1** — low sensitivity (sprains, sunburn, nosebleed) — always retargetable
- **Tier 2** — moderate (CPR, bleeding, cardiac) — retargetable with care
- **Tier 3** — high sensitivity (`mental-health-first-aid` only) — `suppression_active: true`;
  signal still fires for analytics but is **never used for retargeting**

`kb_course_conversion` fires for all tiers including tier 3 (mental health),
but with `suppression_active: true`. `kb_program_handoff` never fires for tier 3.

The tier map lives in `faaAdapter.ts` as `KB_TOPIC_TIERS`. When adding new KB
topics, add them to this map with an appropriate tier before firing signals.

### Rules
- Signal writes always use fire-and-forget (`void writeSignal(...)`) —
  never `await` them in a user interaction path
- `writeSignal` catches and silently logs all errors — never surface RSP
  errors to the user or let them block navigation
- Never send PII (name, email, user ID) in an RSP signal — session ID only
- `suppression_active: true` must be set for any tier-3 topic signal
- When adding a new `FAAEventType`, add it to the union in `types.ts` first,
  then add the corresponding helper function in `faaAdapter.ts`, then wire
  it up at the call site
