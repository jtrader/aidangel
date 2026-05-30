import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { Card } from "@/components/ui/card";
import { Loader2, BookOpen } from "lucide-react";
import { listCategories, listAllPublishedPosts, type BlogCategory, type BlogPost } from "@/lib/blog";

export default function BlogIndex() {
  const [cats, setCats] = useState<BlogCategory[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [c, p] = await Promise.all([listCategories(), listAllPublishedPosts(30)]);
      setCats(c);
      setPosts(p);
      setLoading(false);
    })();
  }, []);

  const catBySlug = (id: string) => cats.find((c) => c.id === id);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        lang="en"
        basePath="/blog"
        title="First Aid Blog — Practical Guides & Latest Updates"
        description="Australian first aid guides, video walkthroughs and updates from First Aid Angel. Written for parents, workers, carers and outdoor adventurers."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "First Aid Angel Blog",
          url: "https://firstaidangel.org/blog",
        }}
      />
      <CoursesHeader />
      <section className="bg-gradient-to-br from-primary/5 via-background to-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">First Aid Blog</h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl">
            Practical, evidence-based first aid guides for everyday Australians.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="font-display text-xl font-semibold mb-4">Browse by topic</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {cats.map((c) => (
            <Link
              key={c.id}
              to={`/blog/${c.slug}`}
              className="block bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition"
            >
              <h3 className="font-display font-semibold text-lg">{c.name}</h3>
              {c.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>}
            </Link>
          ))}
        </div>

        <h2 className="font-display text-xl font-semibold mb-4">Latest articles</h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : posts.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground rounded-2xl">No posts yet.</Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((p) => {
              const cat = catBySlug(p.category_id);
              return (
                <Link
                  key={p.id}
                  to={`/blog/${cat?.slug}/${p.slug}`}
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
                    {cat && <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">{cat.name}</p>}
                    <h3 className="font-display font-semibold text-lg leading-snug mb-1 group-hover:text-primary">{p.title}</h3>
                    {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
      <NetworkFooter />
    </div>
  );
}
