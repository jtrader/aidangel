import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "isomorphic-dompurify";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, Lightbulb, Quote as QuoteIcon, ArrowRight } from "lucide-react";
import type { BlogBlock } from "@/lib/blog";

function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-sm sm:prose-base max-w-none text-foreground/90 prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

function Callout({ block }: { block: BlogBlock }) {
  const variant = (block.data?.variant as string) ?? "info";
  const map = {
    warning: { icon: AlertTriangle, cls: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:text-red-100" },
    info: { icon: Info, cls: "bg-sky-50 border-sky-200 text-sky-900 dark:bg-sky-950/30 dark:text-sky-100" },
    tip: { icon: Lightbulb, cls: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100" },
  } as const;
  const { icon: Icon, cls } = (map as any)[variant] ?? map.info;
  return (
    <aside className={`border rounded-2xl p-5 sm:p-6 flex gap-3 ${cls}`}>
      <Icon className="h-5 w-5 mt-1 shrink-0" />
      <div className="flex-1 min-w-0">
        {block.title && <h3 className="font-display font-semibold mb-1">{block.title}</h3>}
        {block.body_md && <Markdown>{block.body_md}</Markdown>}
        {block.cta_label && block.cta_url && (
          <Button asChild size="sm" className="mt-3">
            <a href={block.cta_url}>{block.cta_label}</a>
          </Button>
        )}
      </div>
    </aside>
  );
}

function VideoBlock({ block }: { block: BlogBlock }) {
  if (!block.media_url) {
    return (
      <div className="aspect-video rounded-2xl border border-dashed border-border bg-muted/40 flex flex-col items-center justify-center text-center px-6">
        <p className="text-sm font-medium text-muted-foreground">{block.title ?? "Video coming soon"}</p>
        {block.caption && <p className="text-xs text-muted-foreground mt-1">{block.caption}</p>}
      </div>
    );
  }
  return (
    <figure>
      <video
        controls
        playsInline
        preload="metadata"
        poster={block.media_poster_url ?? undefined}
        className="w-full rounded-2xl border border-border bg-black aspect-video"
      >
        <source src={block.media_url} />
      </video>
      {(block.title || block.caption) && (
        <figcaption className="text-xs text-muted-foreground mt-2 text-center">
          {block.title && <span className="font-medium text-foreground">{block.title}. </span>}
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

function AudioBlock({ block }: { block: BlogBlock }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      {block.title && <h3 className="font-display font-semibold mb-2">{block.title}</h3>}
      {block.media_url ? (
        <audio controls preload="metadata" className="w-full">
          <source src={block.media_url} />
        </audio>
      ) : (
        <p className="text-sm text-muted-foreground italic">Audio coming soon.</p>
      )}
      {block.caption && <p className="text-xs text-muted-foreground mt-2">{block.caption}</p>}
    </div>
  );
}

function ImageOrInfographic({ block }: { block: BlogBlock }) {
  const isInfographic = block.block_type === "infographic";
  return (
    <figure>
      {block.media_url ? (
        <img
          src={block.media_url}
          alt={block.media_alt ?? block.title ?? ""}
          loading="lazy"
          decoding="async"
          className={`w-full h-auto rounded-2xl border border-border ${isInfographic ? "bg-white p-2" : ""}`}
        />
      ) : (
        <div className="aspect-[4/3] rounded-2xl border border-dashed border-border bg-muted/40 flex items-center justify-center text-sm text-muted-foreground">
          {isInfographic ? "Infographic placeholder" : "Image placeholder"}
        </div>
      )}
      {(block.title || block.caption) && (
        <figcaption className="text-xs text-muted-foreground mt-2 text-center">
          {block.title && <span className="font-medium text-foreground">{block.title}. </span>}
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

function EmbedBlock({ block }: { block: BlogBlock }) {
  if (!block.embed_html) return null;
  const clean = DOMPurify.sanitize(block.embed_html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "referrerpolicy", "sandbox", "src", "title", "width", "height", "loading"],
  });
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-muted/40 aspect-video [&_iframe]:w-full [&_iframe]:h-full">
      <div dangerouslySetInnerHTML={{ __html: clean }} />
    </div>
  );
}

function QuoteBlock({ block }: { block: BlogBlock }) {
  return (
    <blockquote className="border-l-4 border-primary pl-5 py-2">
      <QuoteIcon className="h-5 w-5 text-primary mb-2" aria-hidden />
      {block.body_md && <Markdown>{block.body_md}</Markdown>}
      {block.title && <footer className="text-sm text-muted-foreground mt-2">— {block.title}</footer>}
    </blockquote>
  );
}

function CtaBlock({ block }: { block: BlogBlock }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8 text-center">
      {block.title && <h3 className="font-display text-xl sm:text-2xl font-bold mb-2">{block.title}</h3>}
      {block.body_md && <div className="text-muted-foreground mb-4"><Markdown>{block.body_md}</Markdown></div>}
      {block.cta_label && block.cta_url && (
        <Button asChild size="lg">
          <a href={block.cta_url}>{block.cta_label} <ArrowRight className="h-4 w-4 ml-1" /></a>
        </Button>
      )}
    </div>
  );
}

function FaqBlock({ block }: { block: BlogBlock }) {
  return (
    <section className="bg-card border border-border rounded-2xl p-6">
      {block.title && <h3 className="font-display font-semibold mb-3">{block.title}</h3>}
      {block.body_md && <Markdown>{block.body_md}</Markdown>}
    </section>
  );
}

export function BlogBlockRenderer({ block }: { block: BlogBlock }) {
  switch (block.block_type) {
    case "heading":
      return <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-4">{block.title}</h2>;
    case "divider":
      return <hr className="border-border my-2" />;
    case "richtext":
      return (
        <section>
          {block.title && <h3 className="font-display text-xl font-semibold mb-2">{block.title}</h3>}
          {block.body_md && <Markdown>{block.body_md}</Markdown>}
        </section>
      );
    case "callout":
      return <Callout block={block} />;
    case "video":
      return <VideoBlock block={block} />;
    case "audio":
      return <AudioBlock block={block} />;
    case "image":
    case "infographic":
      return <ImageOrInfographic block={block} />;
    case "embed":
      return <EmbedBlock block={block} />;
    case "quote":
      return <QuoteBlock block={block} />;
    case "cta":
      return <CtaBlock block={block} />;
    case "faq":
      return <FaqBlock block={block} />;
    default:
      return null;
  }
}

export function BlogBlocksRenderer({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((b) => (
        <BlogBlockRenderer key={b.id} block={b} />
      ))}
    </div>
  );
}
