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
| Auth | Supabase Auth (email + magic link) |
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

- Anything in `src/components/kb/`, `src/pages/KbIndex.tsx`, `src/pages/KbTopic.tsx`
- Anything in `src/pages/AedFinder.tsx`, `src/pages/AedIndex.tsx`, `src/pages/AedCity.tsx`, `src/pages/AedCountry.tsx`
- Anything in `src/components/kits/`, `src/hooks/useKits.ts`, `src/lib/kitZones.ts`
- Anything in `src/pages/Employer*.tsx` (employer dashboard pages — distinct from EmployerMarketing)
- Anything in `src/pages/Admin*.tsx`
- `src/lib/certificate.ts` — PDF generation logic
- `src/pages/ProgramCertificate.tsx` — certificate redemption page
- `src/pages/CertificateVerify.tsx` — public verification page
- `supabase/functions/cert-checkout/index.ts` — single cert Shopify flow
- `src/lib/i18n.ts` and `src/locales/` — i18n infrastructure
- `kb/` directory contents

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
User clicks "Buy"
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
