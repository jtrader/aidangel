import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import type { CmsBlock, CmsPage } from "@/hooks/useCmsPage";

function CmsBlockRender({ block }: { block: CmsBlock }) {
  const hasImage = !!block.image_url;
  const hasBody = !!block.body_md;
  const hasCta = !!block.cta_label && !!block.cta_url;

  return (
    <section className="bg-card border border-border rounded-2xl p-6 sm:p-8">
      {block.title && (
        <h2 className="text-2xl font-bold text-foreground mb-4">
          {block.title}
        </h2>
      )}

      {hasImage && (
        <img
          src={block.image_url!}
          alt={block.title ?? ""}
          className="w-full h-auto max-h-80 object-cover rounded-xl mb-5 border border-border"
          loading="lazy"
        />
      )}

      {hasBody && (
        <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {block.body_md!}
          </ReactMarkdown>
        </div>
      )}

      {hasCta && (
        <div className="mt-5">
          <Button asChild>
            <a href={block.cta_url!}>{block.cta_label}</a>
          </Button>
        </div>
      )}
    </section>
  );
}

export function CmsBlocksRenderer({ page }: { page: CmsPage }) {
  if (!page.blocks.length) {
    return (
      <p className="text-muted-foreground text-center py-10">
        This page has no content blocks yet.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {page.blocks.map((block) => (
        <CmsBlockRender key={block.id} block={block} />
      ))}
    </div>
  );
}
