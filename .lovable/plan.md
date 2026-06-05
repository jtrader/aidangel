## Goal
Turn the 34 St-John rows in `stjohn-prices.csv` + the 28 images in `product-images.zip` into a tracked, country-aware affiliate kit catalogue on firstaidangel.org.

## 1. Data model — reuse `route_catalogue`
The existing `route_catalogue` table already has every column we need (`country`, `image_url`, `destination_url`, `vendor`, `referral_code`, `utm_*`). No new table needed.

One row per CSV entry, keyed by `id` from the CSV:
- `route_slug` = `kits/stjohn/{id}`
- `vendor = "St John Ambulance"`, `route_type = "kit"`, `partner_entity = "stjohn"`
- `title` = `resolved_product`, `destination_url` = `resolved_url`
- `country` = CSV country
- `utm_campaign = "faa-kits"`, `utm_content = {id}`
- Price/currency stored in two new columns added by migration: `price numeric`, `currency text` (kept on this table so we don't need a second store).

## 2. Images → Shopify product backing
Per the user's note ("using shopify as a backend"), each unique `resolved_product` becomes (or matches) one Shopify product so images live in Shopify CDN and we get one canonical price source.

Approach:
- Group CSV rows by `resolved_product` (≈14 unique kits).
- For each group, find or create a Shopify product (vendor `St John Ambulance`, tag `faa:affiliate-kit`, status `draft` so it doesn't appear in our own checkout).
- Upload the matching image from `product-images.zip` to that product (pick the highest-quality file per group; for groups with only AU images use the AU image, etc.).
- Store the Shopify CDN `image_url` on every `route_catalogue` row in the group.
- Shopify variant `price` stays at the GBP/AUD source value; the route_catalogue row also stores price+currency for direct rendering without an extra Shopify call per card.

## 3. Zones (4) — `src/lib/kitZones.ts`
```
AU         → AU
UK_IE      → GB, IE
NORTH_AM   → US, CA
EU_MENA    → DE, FR, NL, SE, BE, AE
```
Visitor's country (from existing `useCountry`) maps to a zone; cards shown = all CSV rows whose country is in that zone, deduped by `resolved_product` (prefer exact country match, fall back to first row).

## 4. Affiliate redirect — `/go/stjohn/:id`
New React route `src/pages/GoRedirect.tsx`:
1. Look up `route_catalogue` by `route_slug = kits/stjohn/{id}`.
2. Fire `insert into route_clicks` via existing edge function pattern (re-use `give_clicks` style; new edge function `log-route-click` so RLS `no_client` stays intact).
3. Build outbound URL: `destination_url` + `?utm_source=firstaidangel&utm_medium=affiliate&utm_campaign=faa-kits&utm_content={id}&country={visitorCountry}`.
4. `window.location.replace(outbound)` after click logged (fire-and-forget; 300 ms max wait).

Sitemap excluded; `robots.txt` already disallows `/go/`.

## 5. Pricing display
- Card shows the source currency as it will be charged at checkout (e.g. "£10.50", "A$54.95"). No FX conversion in v1 — avoids stale rates and matches what the partner actually charges.
- Small "ships from UK · GBP" / "ships from AU · AUD" subtext per card so EU/MENA visitors aren't surprised.

## 6. UI surfaces
- **`/shop`** — new "Recommended first aid kits in {country}" section above existing partner cards; up to 6 cards from the visitor's zone.
- **`/shop/kits`** — new page, full grid of all zone kits with country dropdown to switch zones; SEO `title`/`description` per zone.
- **KB embed** — new `<KbKitRecommendation theme="…" />` shown after the "Prevention" section of matching KB articles. Mapping (theme → kit-name keyword):
  - `burns` → "Burn"
  - `workplace-first-aid` → "Workplace"
  - `bleeding` / `cpr` / `drsabcd` / `choking` / `anaphylaxis` → zone's "Universal" or "Home" kit
  - `remote-first-aid` → "Field Hip Pouch" (AU) / "Universal Plus" (others)
  - default: hide

All three use one shared `<KitCard>` component (`src/components/kits/KitCard.tsx`).

## 7. Files to add / change
**New**
- `supabase/migrations/<ts>_route_catalogue_kits.sql` — add `price numeric`, `currency text`; seed 34 rows.
- `supabase/functions/log-route-click/index.ts` — server-side insert into `route_clicks`.
- `scripts/upload-kit-images-to-shopify.ts` — one-off; groups CSV, creates/updates Shopify draft products, writes the resolved CDN URL back into a generated `src/data/kitImageMap.json`.
- `src/lib/kitZones.ts`, `src/data/kits.ts` (loads route_catalogue rows), `src/components/kits/KitCard.tsx`, `src/components/kits/KitGrid.tsx`, `src/components/kits/KbKitRecommendation.tsx`, `src/pages/GoRedirect.tsx`, `src/pages/ShopKits.tsx`.

**Edited**
- `src/App.tsx` — register `/go/stjohn/:id` and `/shop/kits`.
- `src/pages/ShopPartners.tsx` — inject `<KitGrid zone={…} limit={6} />`.
- `src/components/kb/KbArticle.tsx` (or equivalent renderer) — render `<KbKitRecommendation />` for mapped themes.
- `scripts/generate-sitemap.ts` — add `/shop/kits`.

## 8. Out of scope (v1)
- Live FX conversion / currency switching.
- Shipping-cost estimates.
- Red Cross / Amazon catalogue rows (separate CSVs).
- Rotating affiliate IDs per partner — `utm_content={id}` is the only tracker until SJA gives us a real affiliate ID.

## Technical notes
- Shopify products created as `status: draft` + tag `faa:affiliate-kit` so they don't appear in `fetchProducts()` storefront calls (filter by `-tag:faa:affiliate-kit` in the existing query).
- Click logging uses an edge function (not direct insert) because `route_clicks` has `no_client` RLS.
- Image upload via `shopify--update_product`'s `images[]` field (file_path = local path after unzip to `/tmp/`).
- Visitor country comes from existing `useCountry()` hook — no new geo logic.
