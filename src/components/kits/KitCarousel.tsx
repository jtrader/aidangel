import { useMemo } from "react";
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
}

/**
 * Horizontally scrollable carousel of affiliate first-aid kits for the
 * visitor's region. Drops onto /shop above the in-house product grid.
 */
export function KitCarousel({ countryCode, zone, limit = 12, heading }: KitCarouselProps) {
  const { country } = useCountry();
  const code = countryCode ?? country.code;
  const resolvedZone = useMemo<KitZone>(() => zone ?? zoneForCountry(code), [zone, code]);
  const { kits, loading } = useKitsForZone(resolvedZone, { limit, preferCountry: code });

  return (
    <section aria-labelledby="kit-carousel-heading" className="mb-10">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h2 id="kit-carousel-heading" className="text-xl sm:text-2xl font-bold text-foreground">
            {heading ?? `First aid kits for ${ZONE_LABEL[resolvedZone]}`}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {ZONE_SHIPS_FROM[resolvedZone]}
          </p>
        </div>
        <Link
          to="/shop/kits"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline shrink-0"
        >
          See all kits <ArrowRight className="h-3.5 w-3.5" />
        </Link>
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
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          <CarouselContent className="-ml-3">
            {kits.map((kit) => (
              <CarouselItem
                key={kit.id}
                className="pl-3 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <KitCard kit={kit} zone={resolvedZone} shipsFromLabel={ZONE_SHIPS_FROM[resolvedZone]} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-3" />
          <CarouselNext className="hidden sm:flex -right-3" />
        </Carousel>
      )}

      <div className="sm:hidden mt-4 text-center">
        <Link
          to="/shop/kits"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          See all kits <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
