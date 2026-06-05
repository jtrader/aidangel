import { ExternalLink } from "lucide-react";
import { formatPrice, type KitZone } from "@/lib/kitZones";
import type { Kit } from "@/hooks/useKits";

export function KitCard({
  kit,
  zone,
  shipsFromLabel,
}: {
  kit: Kit;
  zone?: KitZone;
  shipsFromLabel?: string;
}) {
  const params = new URLSearchParams();
  params.set(
    "src",
    typeof window !== "undefined" ? window.location.pathname : "",
  );
  if (zone) params.set("zone", zone);
  if (kit.shopify_handle) params.set("handle", kit.shopify_handle);
  const href = `/go/${encodeURIComponent(kit.route_slug)}?${params.toString()}`;

  return (
    <article className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <a href={href} target="_blank" rel="noopener sponsored" className="block aspect-square bg-muted overflow-hidden">
        {kit.image_url ? (
          <img
            src={kit.image_url}
            alt={kit.title}
            loading="lazy"
            className="w-full h-full object-contain hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
      </a>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
          {kit.title}
        </h3>
        <p className="text-lg font-bold text-foreground">
          {formatPrice(kit.price, kit.currency)}
        </p>
        {shipsFromLabel && (
          <p className="text-[11px] text-muted-foreground">{shipsFromLabel}</p>
        )}
        <a
          href={href}
          target="_blank"
          rel="noopener sponsored"
          className="mt-auto inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Buy at St John
          <ExternalLink className="h-3.5 w-3.5 opacity-80" />
        </a>
      </div>
    </article>
  );
}
