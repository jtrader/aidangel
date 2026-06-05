import { Loader2 } from "lucide-react";
import { useKitsForZone } from "@/hooks/useKits";
import { ZONE_SHIPS_FROM, type KitZone } from "@/lib/kitZones";
import { KitCard } from "./KitCard";

export function KitGrid({
  zone,
  limit,
  preferCountry,
}: {
  zone: KitZone;
  limit?: number;
  preferCountry?: string;
}) {
  const { kits, loading } = useKitsForZone(zone, { limit, preferCountry });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!kits.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {kits.map((kit) => (
        <KitCard key={kit.id} kit={kit} zone={zone} shipsFromLabel={ZONE_SHIPS_FROM[zone]} />
      ))}
    </div>
  );
}
