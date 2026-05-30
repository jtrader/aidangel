import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, BookOpen, ArrowRight } from "lucide-react";
import { getCategoryBySlug, listPostsByCategory, type BlogCategory, type BlogPost } from "@/lib/blog";

export default function BlogCategoryPage() {
  const { category: slug } = useParams<{ category: string }>();
  const [cat, setCat] = useState<BlogCategory | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const c = await getCategoryBySlug(slug);
      setCat(c);
      if (c) setPosts(await listPostsByCategory(c.id, 50));
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="min-h-screen bg-background">
        <CoursesHeader />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-2">Category not found</h1>
          <Link to="/blog" className="text-primary underline">Back to blog</Link>
        </div>
      </div>
    );
  }

  const basePath = `/blog/${cat.slug}`;
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        lang="en"
        basePath={basePath}
        title={`${cat.name} — First Aid Blog`}
        description={cat.description ?? `${cat.name} first aid articles and guides.`}
      />
      <CoursesHeader />
      <section className="bg-gradient-to-br from-primary/5 via-background to-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <nav className="text-xs text-muted-foreground mb-3">
            <Link to="/blog" className="hover:text-foreground">Blog</Link> <span>/</span> <span className="text-foreground">{cat.name}</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">{cat.name}</h1>
          {cat.description && <p className="text-muted-foreground mt-2 max-w-2xl">{cat.description}</p>}
          {cat.program_slug && (
            <Button asChild className="mt-5">
              <Link to={`/courses/${cat.program_slug}-guide`}>Explore the {cat.name} course <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        {posts.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground rounded-2xl">No articles in this category yet.</Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((p) => (
              <Link key={p.id} to={`/blog/${cat.slug}/${p.slug}`}
                className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition">
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
      <NetworkFooter />
    </div>
  );
}
