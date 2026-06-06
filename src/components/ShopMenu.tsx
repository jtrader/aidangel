// Header/footer "Shop" pill. On tap, opens a responsive Shop dialogue:
// - mobile (< 768px): bottom sheet via vaul Drawer
// - tablet/desktop (>= 768px): centered Dialog
// The dialog body is rendered by <ShopDialogContent />, which is the
// integration point for the future marketing/audience routing layer.

import { useEffect, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCountry } from "@/hooks/useCountry";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { ShopDialogContent } from "@/components/shop/ShopDialogContent";
import { trackShopClick } from "@/lib/giveAnalytics";
import { fetchProducts } from "@/lib/shopify";

interface ShopMenuProps {
  variant?: "header" | "footer";
}

export default function ShopMenu({ variant = "footer" }: ShopMenuProps) {
  const { language, t } = useLanguage();
  const { country } = useCountry();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [prefetched, setPrefetched] = useState(false);

  const label = t("navShop");
  const title = t("shopDialogTitle");
  const tagline = t("shopDialogTagline");

  const triggerClasses =
    variant === "header"
      ? "inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
      : "inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors";

  const fireOpenAnalytics = () => {
    try {
      trackShopClick({
        ngoId: "faa-store",
        countryCode: country?.code ?? "",
        countryName: country?.name ?? "",
        destinationUrl: "/store",
        isNational: false,
        language: language ?? "en",
        variant: variant === "header" ? "header" : "footer",
      });
    } catch {
      /* noop */
    }
  };

  const fireCtaAnalytics = (kind: "primary" | "secondary") => {
    try {
      trackShopClick({
        ngoId: "faa-store",
        countryCode: country?.code ?? "",
        countryName: country?.name ?? "",
        destinationUrl: kind === "primary" ? "/store" : "/shop/kits",
        isNational: false,
        language: language ?? "en",
        variant: kind === "primary" ? "dialog_cta_primary" : "dialog_cta_secondary",
      });
    } catch {
      /* noop */
    }
  };

  // Prefetch products + cart drawer on first open for snappy UX.
  useEffect(() => {
    if (!open || prefetched) return;
    let cancelled = false;
    (async () => {
      try {
        const products = await fetchProducts(6);
        if (cancelled) return;
        for (const p of products) {
          const url = p.node.images?.edges?.[0]?.node?.url;
          if (url) {
            const img = new Image();
            img.src = url;
          }
        }
        void import("@/components/shop/CartDrawer");
        setPrefetched(true);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("ShopMenu prefetch failed", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, prefetched]);

  const handleTriggerClick = () => {
    setOpen(true);
    fireOpenAnalytics();
  };

  const Body = (
    <>
      <ShopDialogContent
        surface="shop_dialog"
        country={country}
        language={language}
        autoplay={open}
      />
      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex items-center justify-center h-11 px-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
        >
          {t("shopDialogClose")}
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button
            type="button"
            onClick={handleTriggerClick}
            className={triggerClasses}
            aria-label={label}
            data-analytics-event="shop_pill_click"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span>{label}</span>
          </button>
        </DrawerTrigger>
        <DrawerContent
          className="max-h-[90vh] bg-card border-border focus:outline-none motion-reduce:transition-none overflow-hidden"
          lang={language}
        >
          <DrawerHeader className="px-4 pb-2 pr-14 text-left">
            <DrawerTitle className="font-display text-lg text-foreground">
              {title}
            </DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground">
              {tagline}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-[max(env(safe-area-inset-bottom),1.25rem)] overflow-y-auto overflow-x-hidden">
            {Body}
          </div>
          <DrawerClose asChild>
            <button
              type="button"
              aria-label={t("shopDialogClose")}
              className="absolute top-3 right-3 inline-flex items-center justify-center w-11 h-11 rounded-full text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={handleTriggerClick}
          className={triggerClasses}
          aria-label={label}
          data-analytics-event="shop_pill_click"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          <span>{label}</span>
        </button>
      </DialogTrigger>
      <DialogContent
        className="w-[calc(100vw-2rem)] max-w-xl lg:max-w-2xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-xl ring-1 ring-border/50 p-5 sm:p-6 lg:p-8 motion-reduce:animate-none"
        lang={language}
      >
        <DialogHeader className="pr-10 shrink-0">
          <DialogTitle className="font-display text-lg lg:text-xl text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {tagline}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          {Body}
        </div>
        <DialogClose asChild>
          <button
            type="button"
            aria-label={t("shopDialogClose")}
            className="absolute top-3 right-3 inline-flex items-center justify-center w-11 h-11 rounded-full text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
