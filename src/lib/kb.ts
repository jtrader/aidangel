// Knowledge base loader. Source of truth lives in /kb/*.md and /kb/_meta.json.
import metaRaw from "/kb/_meta.json?raw";

export type TopicMeta = {
  slug: string;
  title: string;
  category: string;
  /** Section name as cited in chat replies, e.g. "Burns" or "Anaphylaxis". */
  section: string;
  summary: string;
  keywords: string[];
  related: string[];
};

const bodies = import.meta.glob("/kb/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const topics: TopicMeta[] = (JSON.parse(metaRaw) as TopicMeta[])
  .slice()
  .sort((a, b) => a.title.localeCompare(b.title));

export const categories: string[] = Array.from(
  new Set(topics.map((t) => t.category)),
).sort();

export function getTopic(slug: string): TopicMeta | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getBody(slug: string): string {
  return bodies[`/kb/${slug}.md`] ?? "";
}

export function topicsByCategory(): Record<string, TopicMeta[]> {
  const out: Record<string, TopicMeta[]> = {};
  for (const t of topics) {
    (out[t.category] ||= []).push(t);
  }
  return out;
}

/**
 * Try to match a free-form section name (as cited by the chat assistant) to a KB slug.
 * Examples that should all match the same topic:
 *   "Burns", "burns", "Burn", "Burns (Adult)"
 */
export function findTopicBySection(name: string): TopicMeta | undefined {
  const n = name.trim().toLowerCase().replace(/\([^)]*\)/g, "").trim();
  if (!n) return undefined;
  // exact section match
  const exact = topics.find((t) => t.section.toLowerCase() === n);
  if (exact) return exact;
  // title match
  const byTitle = topics.find((t) => t.title.toLowerCase() === n);
  if (byTitle) return byTitle;
  // substring either way
  const sub = topics.find(
    (t) =>
      n.includes(t.section.toLowerCase()) ||
      t.section.toLowerCase().includes(n) ||
      t.title.toLowerCase().includes(n),
  );
  if (sub) return sub;
  // keyword hit
  return topics.find((t) =>
    t.keywords.some((k) => n.includes(k.toLowerCase())),
  );
}
