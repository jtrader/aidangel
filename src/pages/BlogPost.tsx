import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import CoursesHeader from "@/components/CoursesHeader";
import NetworkFooter from "@/components/NetworkFooter";
import { Loader2 } from "lucide-react";
import { getCategoryBySlug, getPostBySlug, type BlogBlock, type BlogCategory, type BlogPost } from "@/lib/blog";
import { BlogBlocksRenderer } from "@/components/blog/BlogBlockRenderer";

export default function BlogPostPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const [cat, setCat] = useState<BlogCategory | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [blocks, setBlocks] = useState<BlogBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !category) return;
    (async () => {
      const [c, res] = await Promise.all([getCategoryBySlug(category), getPostBySlug(slug)]);
      setCat(c);
      if (res) {
        setPost(res.post);
        setBlocks(res.blocks);
      }
      setLoading(false);
    })();
  }, [slug, category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!post || !cat) {
    return (
      <div className="min-h-screen bg-background">
        <CoursesHeader />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-2">Article not found</h1>
          <Link to="/blog" className="text-primary underline">Back to blog</Link>
        </div>
      </div>
    );
  }

  const basePath = `/blog/${cat.slug}/${post.slug}`;
  const url = `https://firstaidangel.org${basePath}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo_description ?? post.excerpt ?? undefined,
    image: post.cover_image_url ?? undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: post.author ?? "First Aid Angel" },
    publisher: {
      "@type": "Organization",
      name: "First Aid Angel",
      logo: { "@type": "ImageObject", url: "https://firstaidangel.org/og-image.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: cat.name,
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: "https://firstaidangel.org/blog" },
      { "@type": "ListItem", position: 2, name: cat.name, item: `https://firstaidangel.org/blog/${cat.slug}` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        lang="en"
        basePath={basePath}
        title={post.seo_title ?? `${post.title} — First Aid Angel`}
        description={post.seo_description ?? post.excerpt ?? undefined}
        ogType="article"
        ogImage={post.cover_image_url ?? undefined}
        jsonLd={[articleJsonLd, breadcrumbs] as any}
      />
      <CoursesHeader />

      <article className="max-w-3xl mx-auto px-4 pt-10 pb-20">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/blog" className="hover:text-foreground">Blog</Link> <span>/</span>{" "}
          <Link to={`/blog/${cat.slug}`} className="hover:text-foreground">{cat.name}</Link>
        </nav>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mb-4">{post.title}</h1>
        {post.excerpt && <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-8 border-b border-border pb-6">
          {post.author && <span>{post.author}</span>}
          {post.published_at && (
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
            </time>
          )}
          {post.reading_minutes && <span>{post.reading_minutes} min read</span>}
        </div>

        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.cover_alt ?? post.title}
            className="w-full h-auto rounded-2xl border border-border mb-8 object-cover"
            loading="eager"
          />
        )}

        <BlogBlocksRenderer blocks={blocks} />
      </article>
      <NetworkFooter />
    </div>
  );
}
