import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/kitZones";
import { useCountry } from "@/hooks/useCountry";
import { useKitsForZone } from "@/hooks/useKits";

interface Props {
  className?: string;
  limit?: number;
}

export default function KbKitRecommendation({ className, limit = 1 }: Props) {
  const { code } = useCountry();
  const zone = ((): any => {
    // naive mapping: reuse kitZones utility if available elsewhere; default to UK_IE
    // This component only needs a best-effort zone for kit selection.
    if (!code) return "UK_IE" as any;
    const c = code.toUpperCase();
    if (["AU"].includes(c)) return "AU";
    if (["US", "CA"].includes(c)) return "NORTH_AM";
    if (["GB", "IE"].includes(c)) return "UK_IE";
    return "EU_MENA";
  })();

  const { kits, loading, error } = useKitsForZone(zone, { limit, preferCountry: code });

  if (loading || error || kits.length === 0) return null;

  const kit = kits[0];

  return (
    <Card className={"p-6 rounded-2xl mt-6 " + (className ?? "")}>
      <div className="mb-2 text-sm text-muted-foreground uppercase">Recommended kit</div>
      <div className="flex items-start gap-4">
        {kit.image_url ? <img src={kit.image_url} alt={kit.title} width={96} height={96} loading="lazy" className="w-24 h-24 rounded-lg object-cover" /> : null}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{kit.title}</h3>
          {kit.description ? <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{kit.description}</p> : null}
          <div className="mt-4 flex items-center gap-3">
            <div className="font-semibold">{formatPrice(kit.price, kit.currency, kit.destination_url)}</div>
            <Button asChild size="sm">
              <a href={kit.destination_url ?? "#"} rel="noopener noreferrer sponsored">Buy kit</a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
