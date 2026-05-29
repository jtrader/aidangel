import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CmsBlocksRenderer } from "@/components/CmsBlocksRenderer";
import { SeoHead } from "@/components/SeoHead";
import { Loader2 } from "lucide-react";
import type { CmsPage, CmsBlock } from "@/hooks/useCmsPage";

export default function CmsPreview() {
  const { slug } = useParams<{ slug: string }>();
  const [params] = useSearchParams();
  const token = params.get("token");
  const lang = params.get("lang") ?? "en";

  const [page, setPage] = useState<CmsPage | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "denied" | "error">("loading");

  useEffect(() => {
    if (!slug || !token) { setStatus("denied"); return; }
    let cancelled = false;
    (async () => {
      setStatus("loading");
      const { data, error } = await supabase.rpc("get_cms_preview", {
        p_slug: slug, p_token: token, p_lang: lang,
      });
      if (cancelled) return;
      if (error || !data) { setStatus(error ? "error" : "denied"); return; }
      const d = data as any;
      const blocks: CmsBlock[] = (d.blocks ?? []).map((b: any) => ({
        id: b.id, block_key: b.block_key, block_type: b.block_type,
        sort_order: b.sort_order, title: b.title, body_md: b.body_md,
        image_url: b.image_url, cta_label: b.cta_label, cta_url: b.cta_url,
        data: b.data ?? {},
      }));
      const trMap = new Map<string, any>();
      (d.block_translations ?? []).forEach((t: any) => trMap.set(t.block_id, t));
      const merged = blocks.map((b) => {
        const t = trMap.get(b.id);
        return t ? { ...b, title: t.title ?? b.title, body_md: t.body_md ?? b.body_md, cta_label: t.cta_label ?? b.cta_label } : b;
      });
      const pt = d.page_translation;
      setPage({
        id: d.page.id, slug: d.page.slug,
        title: pt?.title ?? d.page.title,
        description: pt?.description ?? d.page.description,
        is_published: d.page.is_published,
        blocks: merged.sort((a, b) => a.sort_order - b.sort_order),
      });
      setStatus("ok");
    })();
    return () => { cancelled = true; };
  }, [slug, token, lang]);

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <SeoHead lang="en" basePath="/cms-preview" title="CMS preview" description="Tokenized preview of an unpublished CMS page." />
      <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-sm px-4 py-2 text-center">
        Preview mode {page && !page.is_published ? "· Draft (not visible to visitors)" : page?.is_published ? "· Published" : ""}
      </div>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {status === "loading" && (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 text-primary animate-spin" /></div>
        )}
        {status === "denied" && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
            Invalid or missing preview token.
          </div>
        )}
        {status === "error" && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center text-destructive">
            Couldn’t load preview.
          </div>
        )}
        {status === "ok" && page && (
          <div className="bg-background rounded-2xl p-4 sm:p-8 shadow-sm">
            <CmsBlocksRenderer page={page} />
          </div>
        )}
      </div>
    </div>
  );
}
