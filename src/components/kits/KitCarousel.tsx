import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { KitCard } from "@/components/kits/KitCard";
import { useKitsForZone } from "@/hooks/useKits";
import { zoneForCountry, ZONE_LABEL, ZONE_SHIPS_FROM, type KitZone } from "@/lib/kitZones";
import { useCountry } from "@/hooks/useCountry";

interface KitCarouselProps {
  countryCode?: string;
  zone?: KitZone;
  limit?: number;
  heading?: string;
  /** When true, renders for a constrained surface (dialog/drawer): smaller
   *  vertical rhythm, no "See all" rail, items basis tuned for narrow widths,
   *  and arrows tucked inside the carousel so they don't overlap the dialog edge. */
  compact?: boolean;
}

/**
 * Horizontally scrollable carousel of affiliate first-aid kits for the
 * visitor's region. Drops onto /shop above the in-house product grid.
 */
export function KitCarousel({
  countryCode,
  zone,
  limit = 12,
  heading,
  autoplay = false,
  compact = false,
}: KitCarouselProps & { autoplay?: boolean }) {
  const { country } = useCountry();
  const code = countryCode ?? country.code;
  const resolvedZone = useMemo<KitZone>(() => zone ?? zoneForCountry(code), [zone, code]);
  const { kits, loading } = useKitsForZone(resolvedZone, { limit, preferCountry: code });
  const [api, setApi] = useState<import("@/components/ui/carousel").CarouselApi | null>(null);

  // Autoplay: advance the embla carousel every few seconds if enabled
  useEffect(() => {
    if (!autoplay || !api) return;
    let mounted = true;
    const id = setInterval(() => {
      if (!mounted || !api) return;
      try {
        api.scrollNext();
      } catch {}
    }, 3500);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [autoplay, api]);

  // Compact mode tightens per-item width so the "peek" of the next card
  // sits well inside narrow dialog widths and never feels clipped.
  const itemBasis = compact
    ? "pl-3 basis-[88%] xs:basis-4/5 sm:basis-1/2 md:basis-1/3"
    : "pl-3 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4";

  return (
    <section
      aria-labelledby="kit-carousel-heading"
      className={compact ? "mb-0" : "mb-10"}
    >
      <div className={`flex items-end justify-between gap-3 ${compact ? "mb-3" : "mb-4"}`}>
        <div className="min-w-0">
          <h2
            id="kit-carousel-heading"
            className={
              compact
                ? "text-base sm:text-lg font-semibold text-foreground truncate"
                : "text-xl sm:text-2xl font-bold text-foreground"
            }
          >
            {heading ?? `First aid kits for ${ZONE_LABEL[resolvedZone]}`}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {ZONE_SHIPS_FROM[resolvedZone]}
          </p>
        </div>
        {!compact && (
          <Link
            to="/shop/kits"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline shrink-0"
          >
            See all kits <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : kits.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No kits available for this region yet.
        </p>
      ) : (
        <Carousel opts={{ align: "start", loop: false }} setApi={setApi} className="w-full">
          <CarouselContent className="-ml-3">
            {kits.map((kit) => (
              <CarouselItem key={kit.id} className={itemBasis}>
                <KitCard kit={kit} zone={resolvedZone} shipsFromLabel={ZONE_SHIPS_FROM[resolvedZone]} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* In compact mode, tuck arrows just inside the carousel so they
              never overlap the dialog rounded edge. */}
          <CarouselPrevious
            className={compact ? "hidden sm:flex left-1" : "hidden sm:flex -left-3"}
          />
          <CarouselNext
            className={compact ? "hidden sm:flex right-1" : "hidden sm:flex -right-3"}
          />
        </Carousel>
      )}

      {!compact && (
        <div className="sm:hidden mt-4 text-center">
          <Link to="/shop/kits" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            See all kits <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}
