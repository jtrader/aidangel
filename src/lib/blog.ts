import { supabase } from "@/integrations/supabase/client";

export type BlogCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  program_slug: string | null;
  sort_order: number;
};

export type BlogPost = {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_alt: string | null;
  author: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  reading_minutes: number | null;
  created_at: string;
  updated_at: string;
};

export type BlogBlock = {
  id: string;
  post_id: string;
  sort_order: number;
  block_type:
    | "richtext"
    | "heading"
    | "image"
    | "video"
    | "audio"
    | "infographic"
    | "embed"
    | "callout"
    | "quote"
    | "cta"
    | "faq"
    | "divider";
  title: string | null;
  body_md: string | null;
  media_url: string | null;
  media_poster_url: string | null;
  media_alt: string | null;
  caption: string | null;
  embed_html: string | null;
  cta_label: string | null;
  cta_url: string | null;
  data: Record<string, unknown>;
};

export async function listCategories(): Promise<BlogCategory[]> {
  const { data } = await supabase
    .from("blog_categories")
    .select("*")
    .order("sort_order");
  return (data as BlogCategory[]) ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const { data } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as BlogCategory) ?? null;
}

export async function getCategoryByProgramSlug(programSlug: string): Promise<BlogCategory | null> {
  const { data } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("program_slug", programSlug)
    .maybeSingle();
  return (data as BlogCategory) ?? null;
}

export async function listPostsByCategory(categoryId: string, limit = 50): Promise<BlogPost[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data as BlogPost[]) ?? [];
}

export async function listAllPublishedPosts(limit = 100): Promise<BlogPost[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data as BlogPost[]) ?? [];
}

export async function getPostBySlug(slug: string): Promise<{ post: BlogPost; blocks: BlogBlock[] } | null> {
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!post) return null;
  const { data: blocks } = await supabase
    .from("blog_post_blocks")
    .select("*")
    .eq("post_id", post.id)
    .order("sort_order");
  return { post: post as BlogPost, blocks: (blocks as BlogBlock[]) ?? [] };
}
