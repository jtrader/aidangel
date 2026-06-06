// Audience-routing seam for the Shop dialogue.
// Today: renders the standard kit carousel.
// Tomorrow: a marketing/audience layer will swap this surface
// (different kits, country bundles, donation upsell, banners…)
// via a hook like `useAudienceVariant("shop_dialog")`.
// Keep ShopMenu dumb — all variant logic belongs HERE.

import { KitCarousel } from "@/components/kits/KitCarousel";
import type { LanguageCode } from "@/contexts/LanguageContext";

export type ShopDialogSurface = "shop_dialog";

interface ShopDialogContentProps {
  surface: ShopDialogSurface;
  country: { code?: string; name?: string } | null | undefined;
  language: LanguageCode;
  autoplay?: boolean;
}

export function ShopDialogContent({ autoplay = true }: ShopDialogContentProps) {
  // TODO(marketing): const variant = useAudienceVariant("shop_dialog");
  // switch on variant.kind to render different surfaces.
  return <KitCarousel limit={6} autoplay={autoplay} compact />;
}
