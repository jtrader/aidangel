import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Layers, Loader2 } from "lucide-react";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { SeoHead } from "@/components/SeoHead";

export default function Programs() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: ps } = await supabase.from("programs")
        .select("id,slug,title,summary,cover_url,duration_minutes")
        .eq("is_published", true).order("sort_order");
      setPrograms(ps ?? []);
      if (ps?.length) {
        const { data: t } = await supabase.from("program_topics").select("program_id").in("program_id", ps.map(p => p.id));
        const c: Record<string, number> = {};
        (t ?? []).forEach(r => { c[r.program_id] = (c[r.program_id] ?? 0) + 1; });
        setCounts(c);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead lang="en" basePath="/programs"
        title="First Aid Programs & CPD Bundles | First Aid Angel"
        description="Multi-topic first aid programs that bundle CPR, choking, bleeding and more into a single certified course." />
      <CoursesHeader />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-10">
        <header className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold mb-3">Programs</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Multi-topic programs that bundle several first aid topics and award a single program certificate when you complete them all.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : programs.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground rounded-2xl">
            No programs published yet.
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p) => (
              <Link key={p.id} to={`/programs/${p.slug}`} className="block group">
                <Card className="overflow-hidden rounded-2xl h-full hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative">
                    {p.cover_url ? (
                      <img src={p.cover_url} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <Layers className="h-12 w-12 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 text-center">
                    <div className="flex gap-2 mb-2 flex-wrap justify-center">
                      <Badge variant="secondary" className="gap-1"><Layers className="h-3 w-3" />{counts[p.id] ?? 0} topics</Badge>
                      <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />{p.slug === "emergency-response-program" ? "60-90 min" : `${p.duration_minutes} min`}</Badge>
                      <Badge>Course</Badge>
                    </div>
                    <h2 className="font-display font-bold text-lg mb-1 group-hover:text-primary">{p.title}</h2>
                    {p.summary && <p className="text-sm text-muted-foreground line-clamp-2">{p.summary}</p>}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <NetworkFooter />
    </div>
  );
}
