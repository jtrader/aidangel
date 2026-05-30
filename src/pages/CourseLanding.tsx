import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SeoHead } from "@/components/SeoHead";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, Clock, Layers, ShieldCheck, BookOpen } from "lucide-react";
import { getCategoryByProgramSlug, listPostsByCategory, type BlogCategory, type BlogPost } from "@/lib/blog";

type Program = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  cover_url: string | null;
};

type Topic = {
  course_id: string;
  sort_order: number;
  courses: { slug: string; title: string; duration_minutes: number | null } | null;
};

export default function CourseLanding() {
  const { slugGuide } = useParams<{ slugGuide: string }>();
  const isGuide = !!slugGuide && slugGuide.endsWith("-guide");
  const programSlug = isGuide ? slugGuide!.replace(/-guide$/, "") : "";

  const [program, setProgram] = useState<Program | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isGuide) return;
    (async () => {
      setLoading(true);
      const { data: p } = await supabase
        .from("programs")
        .select("id, slug, title, description, duration_minutes, cover_url")
        .eq("slug", programSlug)
        .maybeSingle();
      setProgram((p as Program) ?? null);
      if (p) {
        const [{ data: pt }, cat] = await Promise.all([
          supabase
            .from("program_topics")
            .select("course_id, sort_order, courses(slug, title, duration_minutes)")
            .eq("program_id", p.id)
            .order("sort_order"),
          getCategoryByProgramSlug(programSlug),
        ]);
        setTopics((pt as Topic[]) ?? []);
        setCategory(cat);
        if (cat) {
          const ps = await listPostsByCategory(cat.id, 6);
          setPosts(ps);
        }
      }
      setLoading(false);
    })();
  }, [programSlug, isGuide]);

  if (!isGuide) return <Navigate to="/topics" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-background">
        <CoursesHeader />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-2">Course not found</h1>
          <Link to="/topics" className="text-primary underline">Browse all courses</Link>
        </div>
      </div>
    );
  }

  const basePath = `/courses/${programSlug}-guide`;
  const title = `${program.title} — Complete Australian First Aid Guide`;
  const description =
    program.description?.slice(0, 160) ??
    `${program.title}: free, government-aligned Australian first aid course. Step-by-step lessons, video demos, quizzes and a digital certificate.`;

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.title,
    description,
    provider: { "@type": "Organization", name: "First Aid Angel", url: "https://firstaidangel.org" },
    inLanguage: "en-AU",
    url: `https://firstaidangel.org${basePath}`,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://firstaidangel.org/" },
      { "@type": "ListItem", position: 2, name: "Courses", item: "https://firstaidangel.org/topics" },
      { "@type": "ListItem", position: 3, name: program.title, item: `https://firstaidangel.org${basePath}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        lang="en"
        basePath={basePath}
        title={title}
        description={description}
        ogType="website"
        jsonLd={[courseJsonLd, breadcrumbJsonLd] as any}
      />
      <CoursesHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <Badge variant="secondary" className="mb-3">Free • Australian First Aid 5th Edition</Badge>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mb-3">{program.title}</h1>
            <p className="text-lg text-muted-foreground mb-5 max-w-2xl">{description}</p>
            <div className="flex flex-wrap gap-2 mb-6 text-sm">
              <span className="inline-flex items-center gap-1 bg-card border border-border rounded-full px-3 py-1">
                <Layers className="h-4 w-4 text-primary" /> {topics.length} lessons
              </span>
              {program.duration_minutes && (
                <span className="inline-flex items-center gap-1 bg-card border border-border rounded-full px-3 py-1">
                  <Clock className="h-4 w-4 text-primary" /> ~{program.duration_minutes} min
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-card border border-border rounded-full px-3 py-1">
                <ShieldCheck className="h-4 w-4 text-primary" /> Digital certificate
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={`/programs/${programSlug}`}>Start the course <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#guide">Read the guide</a>
              </Button>
            </div>
          </div>
          {program.cover_url && (
            <img
              src={program.cover_url}
              alt={`${program.title} cover`}
              width={320}
              height={320}
              loading="eager"
              className="rounded-2xl border border-border w-full max-w-xs object-cover hidden md:block"
            />
          )}
        </div>
      </section>

      {/* What you'll learn */}
      {topics.length > 0 && (
        <section id="guide" className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">What you'll learn</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {topics.map((t, i) => (
              <Card key={t.course_id} className="p-4 rounded-2xl flex items-start gap-3">
                <span className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="font-display font-semibold truncate">{t.courses?.title}</div>
                  {t.courses?.duration_minutes && (
                    <div className="text-xs text-muted-foreground">{t.courses.duration_minutes} min</div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Why take it */}
      <section className="bg-muted/30 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 py-12 grid sm:grid-cols-3 gap-6">
          {[
            { t: "Built on Australian First Aid 5th Edition", d: "Aligned with ANZCOR and the Australian Resuscitation Council guidelines." },
            { t: "Free to start. Certificate when you pass.", d: "Take the lessons and quiz at your pace. Get a verifiable digital certificate." },
            { t: "Works on any device, even offline.", d: "Read on the train, demonstrate at the scene. No app required." },
          ].map((b) => (
            <div key={b.t}>
              <ShieldCheck className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-display font-semibold mb-1">{b.t}</h3>
              <p className="text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest from the blog */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Latest articles</h2>
            {category && (
              <p className="text-muted-foreground text-sm mt-1">
                From the <Link to={`/blog/${category.slug}`} className="text-primary underline">{category.name}</Link> blog
              </p>
            )}
          </div>
          {category && (
            <Button asChild variant="outline">
              <Link to={`/blog/${category.slug}`}>All articles</Link>
            </Button>
          )}
        </div>

        {posts.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground rounded-2xl">
            New articles coming soon.
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${category?.slug}/${p.slug}`}
                className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition"
              >
                {p.cover_image_url ? (
                  <img src={p.cover_image_url} alt={p.cover_alt ?? p.title} loading="lazy" className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-primary/60" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display font-semibold text-lg leading-snug mb-1 group-hover:text-primary">{p.title}</h3>
                  {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>}
                  {p.reading_minutes && <p className="text-xs text-muted-foreground mt-3">{p.reading_minutes} min read</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Ready to start?</h2>
        <p className="text-muted-foreground mb-6">Free, government-aligned, ~30 minutes. Certificate on completion.</p>
        <Button asChild size="lg">
          <Link to={`/programs/${programSlug}`}>Start {program.title} <ArrowRight className="h-4 w-4 ml-1" /></Link>
        </Button>
      </section>

      <NetworkFooter />
    </div>
  );
}
