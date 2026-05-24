// Dynamic SEO metadata utility for lesson routes.
//
// Builds a translation-aware <title>, a meta description summarizing the
// lesson's key life-saving steps, and the canonical base path used by
// `SeoHead` to emit `hreflang` alternates across our 48 supported locales.
//
// Usage:
//   const meta = buildLessonSeo({ lesson, course, lang, t });
//   <SeoHead lang={lang} basePath={meta.basePath} title={meta.title}
//            description={meta.description} jsonLd={meta.jsonLd} />

import type { Lang } from "@/lib/i18n";

export interface LessonLike {
  slug: string;
  title: string;
  body?: string | null;
}

export interface CourseLike {
  slug: string;
  title: string;
}

export interface LessonSeoInput {
  lesson: LessonLike;
  course: CourseLike;
  lang: Lang;
  /** Optional translator for the brand suffix / fallback copy. */
  t?: (key: string) => string;
}

export interface LessonSeoMeta {
  title: string;
  description: string;
  /** English-equivalent base path. `SeoHead` prefixes the active lang and
   *  generates hreflang alternates for every supported locale. */
  basePath: string;
  canonicalPath: string;
  jsonLd: Record<string, unknown>;
}

const BRAND = "First Aid Angel";
const MAX_DESC = 158; // <160 incl. ellipsis
const MIN_DESC = 80;

/**
 * Strip markdown, remark-directive blocks, HTML, and collapse whitespace so
 * the result is safe to drop into <meta name="description">.
 */
export function stripMarkdown(input: string): string {
  return input
    // remark-directive containers (:::name[...]{...} ... :::)
    .replace(/:::[a-z][\w-]*(?:\[[^\]]*\])?(?:\{[^}]*\})?[\s\S]*?:::/gi, " ")
    // inline directives :name[label]{attrs}
    .replace(/:[a-z][\w-]*(?:\[[^\]]*\])?(?:\{[^}]*\})?/gi, " ")
    // fenced code blocks
    .replace(/```[\s\S]*?```/g, " ")
    // inline code
    .replace(/`[^`]*`/g, " ")
    // images ![alt](url)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    // links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // headings, blockquotes, list markers, emphasis chars
    .replace(/^[ \t]*[#>\-*+][ \t]+/gm, "")
    .replace(/[*_~]/g, "")
    // raw HTML tags
    .replace(/<[^>]+>/g, " ")
    // collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pull the most informative ~158-char summary from the lesson body —
 * favouring the first 1–2 sentences (typically the key life-saving steps).
 */
export function summarizeLessonBody(body: string | null | undefined): string {
  if (!body) return "";
  const text = stripMarkdown(body);
  if (!text) return "";
  if (text.length <= MAX_DESC) return text;

  // Try to compose from whole sentences up to the limit.
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  let out = "";
  for (const s of sentences) {
    const next = (out ? out + " " : "") + s.trim();
    if (next.length > MAX_DESC) {
      if (out.length >= MIN_DESC) break;
      // First sentence already too long — fall through to char-cut.
      out = next;
      break;
    }
    out = next;
  }

  if (out.length <= MAX_DESC) return out;

  const cut = out.slice(0, MAX_DESC - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > MIN_DESC ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

export function buildLessonSeo({
  lesson,
  course,
  lang,
  t,
}: LessonSeoInput): LessonSeoMeta {
  const title = `${lesson.title} — ${course.title} | ${BRAND}`;

  const summary = summarizeLessonBody(lesson.body);
  const fallback = t
    ? t("lessonSeoFallbackDescription")
    : `Step-by-step first aid guidance for ${lesson.title.toLowerCase()} as part of the ${course.title} course.`;
  const description = summary && summary.length >= MIN_DESC ? summary : (summary || fallback);

  // English-equivalent base path. SeoHead generates per-locale variants
  // (e.g. /es/topics/<slug>/lesson/<slug>) and the hreflang alternates.
  const basePath = `/topics/${course.slug}/lesson/${lesson.slug}`;
  const canonicalPath = basePath;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    headline: lesson.title,
    description,
    inLanguage: lang,
    learningResourceType: "Lesson",
    isPartOf: {
      "@type": "Course",
      name: course.title,
      url: `https://firstaidangel.org/topics/${course.slug}`,
    },
    provider: {
      "@type": "Organization",
      name: BRAND,
      url: "https://firstaidangel.org",
    },
  };

  return { title, description, basePath, canonicalPath, jsonLd };
}
