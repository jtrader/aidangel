import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Layers, Loader2, ArrowRight, Award, CheckCircle2 } from "lucide-react";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { SeoHead } from "@/components/SeoHead";

const AUDIENCE: Record<string, { label: string; tag: string }> = {
  "emergency-response-program": { label: "Core program", tag: "All Australians" },
  "parents-childcare": { label: "Family", tag: "Parents & Childcare" },
  "workplace-trades": { label: "Workplace", tag: "Workplace & Trades" },
  "outdoor-remote": { label: "Outdoor", tag: "Outdoor & Remote" },
  "aged-care": { label: "Carers", tag: "Aged Care & Carers" },
};

export default function Programs() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [finalCounts, setFinalCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: ps } = await supabase.from("programs")
        .select("id,slug,title,summary,cover_url,duration_minutes")
        .eq("is_published", true).order("sort_order");
      setPrograms(ps ?? []);
      if (ps?.length) {
        const ids = ps.map(p => p.id);
        const [{ data: t }, { data: q }] = await Promise.all([
          supabase.from("program_topics").select("program_id").in("program_id", ids),
          supabase.from("program_quiz_questions").select("program_id").in("program_id", ids),
        ]);
        const c: Record<string, number> = {};
        (t ?? []).forEach(r => { c[r.program_id] = (c[r.program_id] ?? 0) + 1; });
        setCounts(c);
        const f: Record<string, number> = {};
        (q ?? []).forEach(r => { f[r.program_id] = (f[r.program_id] ?? 0) + 1; });
        setFinalCounts(f);
      }
      setLoading(false);
    })();
  }, []);

  const featured = programs.find(p => p.slug === "emergency-response-program");
  const niches = programs.filter(p => p.slug !== "emergency-response-program");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead lang="en" basePath="/programs"
        title="First Aid Courses & Certifications | First Aid Angel"
        description="Choose a curated first aid course — for parents, workplaces, outdoor adventurers or carers. Each ends with a final exam and course certificate." />
      <CoursesHeader />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-10">
        <header className="mb-10 text-center">
          <Badge variant="secondary" className="mb-3">Australian First Aid · 5th Edition aligned</Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">First Aid Courses</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Curated 12-topic learning paths with a final exam and printable course certificate. Pick the course that matches your life.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <>
            {featured && (
              <Link to={`/programs/${featured.slug}`} className="block mb-12 group">
                <Card className="overflow-hidden rounded-3xl border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="grid md:grid-cols-2">
                    <div className="aspect-video md:aspect-auto bg-muted relative">
                      {featured.cover_url ? (
                        <img src={featured.cover_url} alt={featured.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                          <Layers className="h-16 w-16 text-primary/40" />
                        </div>
                      )}
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Featured · Core Program</Badge>
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <Badge variant="secondary" className="gap-1"><Layers className="h-3 w-3" />{counts[featured.id] ?? 12} topics</Badge>
                        <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />60–90 min</Badge>
                        <Badge variant="outline" className="gap-1"><Award className="h-3 w-3" />Certificate</Badge>
                      </div>
                      <h2 className="font-display font-bold text-2xl md:text-3xl mb-2 group-hover:text-primary transition-colors">{featured.title}</h2>
                      <p className="text-muted-foreground mb-5">{featured.summary}</p>
                      <Button className="w-fit gap-2">Start the Core Program <ArrowRight className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </Card>
              </Link>
            )}

            {niches.length > 0 && (
              <section>
                <div className="text-center mb-6">
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Specialised Programs</h2>
                  <p className="text-muted-foreground">Same trusted guidelines, tailored to your audience.</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {niches.map((p) => {
                    const aud = AUDIENCE[p.slug];
                    return (
                      <Link key={p.id} to={`/programs/${p.slug}`} className="block group">
                        <Card className="overflow-hidden rounded-2xl h-full hover:shadow-lg hover:-translate-y-0.5 transition-all">
                          <div className="aspect-video bg-muted relative">
                            {p.cover_url ? (
                              <img src={p.cover_url} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                                <Layers className="h-12 w-12 text-primary/40" />
                              </div>
                            )}
                            {aud && <Badge className="absolute top-3 left-3 bg-background/95 text-foreground border">{aud.tag}</Badge>}
                          </div>
                          <div className="p-5">
                            <div className="flex gap-2 mb-2 flex-wrap">
                              <Badge variant="secondary" className="gap-1"><Layers className="h-3 w-3" />{counts[p.id] ?? 0} topics</Badge>
                              <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />{p.duration_minutes} min</Badge>
                              {finalCounts[p.id] > 0 && (
                                <Badge variant="outline" className="gap-1"><CheckCircle2 className="h-3 w-3" />Final exam</Badge>
                              )}
                            </div>
                            <h3 className="font-display font-bold text-xl mb-1 group-hover:text-primary transition-colors">{p.title}</h3>
                            {p.summary && <p className="text-sm text-muted-foreground line-clamp-2">{p.summary}</p>}
                            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              View program <ArrowRight className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <NetworkFooter />
    </div>
  );
}
