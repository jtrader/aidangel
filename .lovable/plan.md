## Deliverable

A self-contained build prompt you (or I, in a later build-mode turn) can paste back to rebuild `src/components/ShopMenu.tsx`'s dialog. Responsive on every device, sleek, and leaves a clean seam where the future marketing/audience-routing layer can decide *what* to render.

---

## The prompt

```
Rebuild the Shop dialogue in src/components/ShopMenu.tsx (used in
header + footer of First Aid Angel) as a single sleek, responsive
surface. Keep the existing trigger pill (red, ShoppingBag icon, i18n
`t("shop")` label, analytics `trackShopClick`) and the prefetch
behavior (warm 6 products + lazy-import CartDrawer on first open).
Replace ONLY the dialog body.

# Responsive shell (mandatory)
- < 640px  : bottom sheet, full-width, rounded-t-2xl, max-h 85vh,
             grab-handle, swipe-down to close.
- 640–1024 : centered modal, max-w-xl, rounded-2xl, padded 24px.
- ≥ 1024px : centered modal, max-w-3xl, rounded-2xl, padded 32px,
             two-column layout (kits left, CTA rail right).
Use shadcn `Drawer` < 640 and shadcn `Dialog` ≥ 640 via a single
breakpoint hook (`useMediaQuery("(min-width: 640px)")`).
Respect `prefers-reduced-motion` (skip slide-in, fade only).

# Design system (mandatory — no raw colors)
- Surface: bg-card, border border-border, shadow-xl, ring-1
  ring-border/50.
- Title: font-display, text-foreground, text-lg/xl.
- Subtitle: text-muted-foreground, text-sm.
- Primary CTA: bg-primary text-primary-foreground (RED token),
  rounded-full, h-11, focus-visible:ring-2 ring-primary/40.
- Secondary CTA: variant="outline" with border-border.
- Close affordance: top-right ghost X, 44×44 hit area.
- Spacing: 16px gap mobile, 24px desktop. No hard-coded HSL.

# Body content (current + audience seam)
1. Header row: brand mark + localized title (`t("shopDialogTitle")`)
   + 1-line tagline (`t("shopDialogTagline")`).
2. Slot: <ShopDialogContent surface="shop_dialog" /> — a NEW
   component that, today, renders <KitCarousel limit={6} autoplay />
   exactly like the current dialog. Tomorrow this slot is what the
   marketing/audience layer will swap (different kits, banners,
   donation upsell, country-specific bundles, etc.). The slot
   receives `{ country, language, surface }` props and is the
   ONLY place that decides what to show — keep ShopMenu dumb.
3. Footer rail: primary CTA Link to /store ("Open full store"),
   secondary CTA Link to /shop/kits ("Browse kits"). Both close the
   dialog on click and fire `trackShopClick` with
   variant: "dialog_cta_primary" | "dialog_cta_secondary".

# Accessibility (mandatory)
- DialogTitle present (visually shown, not sr-only).
- Trap focus, return focus to trigger on close.
- Esc closes; mobile sheet also closes on swipe-down + backdrop tap.
- All buttons keyboard-reachable, aria-label localized.
- Color contrast AA against bg-card on every text/CTA pair.

# i18n (mandatory)
- All static strings via `t()` from useLanguage.
- Add to en.json: shopDialogTitle, shopDialogTagline,
  shopDialogOpenStore, shopDialogBrowseKits, shopDialogClose.
- After adding keys, run the update-translations skill to fan out
  to all 47 locales.

# State (out of scope today, but leave the seam)
- Audience routing layer is NOT built in this turn. The
  <ShopDialogContent /> slot is the integration point. Do not add
  feature flags, A/B logic, or marketing fetches now — just the
  prop surface and a TODO comment naming the future hook
  (`useAudienceVariant("shop_dialog")`).

# Out of scope
- Cart drawer internals, Shopify product schema, checkout flow,
  KitCarousel itself.

# Done = 
- Trigger pill unchanged visually.
- Mobile shows a sheet, desktop shows a modal, both feel native.
- Lighthouse a11y ≥ 95 on /; no contrast warnings.
- `npx tsc --noEmit` clean.
- Manual check: open in EN + one RTL locale (ar) + one CJK (ja) —
  no overflow, no clipped text.
```

---

## Notes

- "RSP States" is parked per your note — the prompt leaves a single, named integration point (`ShopDialogContent` slot + future `useAudienceVariant("shop_dialog")` hook) so when the marketing/audience layer lands, it plugs in without touching the dialog chrome.
- Translation fan-out is folded into the prompt so the new keys reach all 47 locales the same turn the dialog ships.
- Prompt avoids design choices that would clash with the existing First Aid Angel system (RED primary, DM Sans, light grey-cream surfaces, rounded cards) — all styling routes through semantic tokens.

When you're ready, switch me to build mode and say "execute the Shop dialogue prompt" and I'll implement it.
