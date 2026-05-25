// Hero cover image for KB topics. Files live in /public/kb-covers/<slug>.webp.
// Only topics with a matching file render a cover; others render nothing so the
// existing inline SVG TopicIllustration continues to handle visual context.

const COVERS = new Set([
  "asthma",
  "dental-injury",
  "diabetes",
  "drowning",
  "electric-shock",
  "eye-injuries",
  "fainting",
  "fractures",
  "nosebleed",
]);

type Props = { slug: string; title: string; className?: string };

export default function TopicCover({ slug, title, className }: Props) {
  if (!COVERS.has(slug)) return null;
  return (
    <figure
      className={
        className ??
        "mb-6 overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-sm"
      }
    >
      <img
        src={`/kb-covers/${slug}.webp`}
        alt={`${title} — illustration`}
        width={1280}
        loading="lazy"
        decoding="async"
        className="w-full h-auto block"
      />
    </figure>
  );
}
