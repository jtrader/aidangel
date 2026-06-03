import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin } from "lucide-react";

interface PartnerRoute {
  id: string;
  route_slug: string;
  title: string | null;
  description: string | null;
  vendor: string | null;
  image_url: string | null;
  cta_label: string | null;
  country: string | null;
  partner_entity: string | null;
}

interface Props {
  programSlug: string;
  /** Optional matcher tags that may be on the route (e.g. program code "ERE") */
  programCode?: string;
  sourcePage?: string;
}

export function PartnerRoutes({ programSlug, programCode, sourcePage }: Props) {
  const [routes, setRoutes] = useState<PartnerRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tokens = [programSlug, programCode].filter(Boolean) as string[];
      const { data } = await supabase
        .from("public_route_catalogue" as any)
        .select("id,route_slug,title,description,vendor,image_url,cta_label,country,partner_entity,related_program,availability_status")
        .in("related_program", tokens.length ? tokens : [programSlug])
        .eq("availability_status", "available")
        .order("vendor", { ascending: true });
      setRoutes(((data ?? []) as any[]) as PartnerRoute[]);
      setLoading(false);
    })();
  }, [programSlug, programCode]);

  if (loading || routes.length === 0) return null;

  const src = sourcePage ?? (typeof window !== "undefined" ? window.location.pathname : "");

  return (
    <Card className="p-6 rounded-2xl mt-6">
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold">In-person courses & official certifications</h2>
        <p className="text-sm text-muted-foreground">Trusted partners offering accredited training related to this program.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map((r) => (
          <div key={r.id} className="border rounded-xl p-4 flex gap-3 items-start">
            {r.image_url ? (
              <img src={r.image_url} alt={r.title ?? ""} width={72} height={72} loading="lazy" className="w-18 h-18 rounded-lg object-cover shrink-0" />
            ) : null}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {r.vendor && <Badge variant="secondary">{r.vendor}</Badge>}
                {r.country && (
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{r.country}
                  </span>
                )}
              </div>
              <h3 className="font-semibold leading-tight">{r.title}</h3>
              {r.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{r.description}</p>
              )}
              <Button asChild size="sm" className="mt-3">
                <a
                  href={`/go/${encodeURIComponent(r.route_slug)}?src=${encodeURIComponent(src)}`}
                  rel="sponsored noopener"
                >
                  {r.cta_label || "Learn more"}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
