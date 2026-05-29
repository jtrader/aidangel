import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CmsBlock = {
  id: string;
  block_key: string;
  block_type: string;
  sort_order: number;
  title: string | null;
  body_md: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  data: Record<string, unknown>;
};

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_published: boolean;
  blocks: CmsBlock[];
};

export function useCmsPage(slug: string) {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: p, error: pErr } = await supabase
        .from("cms_pages")
        .select("id, slug, title, description, is_published")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      if (pErr || !p) {
        setError(pErr?.message ?? "Page not found");
        setPage(null);
        setLoading(false);
        return;
      }
      const { data: blocks } = await supabase
        .from("cms_blocks")
        .select("id, block_key, block_type, sort_order, title, body_md, image_url, cta_label, cta_url, data")
        .eq("page_id", p.id)
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      setPage({ ...p, blocks: (blocks as CmsBlock[]) ?? [] });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { page, loading, error };
}
