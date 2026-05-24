// Build schema.org JSON-LD for a first-aid lesson.
//
// Produces a graph combining:
//   - MedicalWebPage (page-level health content signal)
//   - HowTo / "FirstAidInstructions" (ordered actionable steps)
//   - MedicalCondition (optional — when the lesson treats a condition)
// plus MedicalWarning entries for any safety callouts.
//
// Steps are extracted from a markdown body by stripping remark-directive
// blocks, splitting on blank lines, and treating each remaining paragraph
// or list item as one HowToStep — mapping the existing markdown content
// directly to structured actions without authoring duplicates.

export interface LessonSchemaStep {
  name: string;
  text: string;
  image?: string;
}

export interface LessonSchemaWarning {
  /** Short headline, e.g. "Look for the pictures". */
  name: string;
  /** Full safety/warning copy. */
  text: string;
}

export interface LessonSchemaInput {
  title: string;
  description?: string;
  /** Canonical absolute URL of the lesson page. */
  url: string;
  /** BCP-47 language tag, e.g. "en-AU". */
  inLanguage?: string;
  /** Optional medical condition the lesson addresses (e.g. "Cardiac arrest"). */
  condition?: string;
  /** Markdown body — steps will be auto-extracted. Ignored if `steps` provided. */
  body?: string | null;
  /** Pre-computed step list. Overrides `body` extraction. */
  steps?: LessonSchemaStep[];
  warnings?: LessonSchemaWarning[];
  /** Lesson illustration / hero image URL (absolute). */
  image?: string;
  /** Total time, ISO-8601 duration (e.g. "PT5M"). */
  totalTime?: string;
  provider?: { name: string; url: string };
}

/** Strip markdown noise so a paragraph can be reused as schema text. */
function clean(text: string): string {
  return text
    .replace(/:::[a-z][\w-]*(?:\[[^\]]*\])?(?:\{[^}]*\})?[\s\S]*?:::/gi, " ")
    .replace(/:[a-z][\w-]*(?:\[[^\]]*\])?(?:\{[^}]*\})?/gi, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^[ \t]*[#>][ \t]+/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Derive a short step name from the step text. */
function nameFor(text: string, fallbackIndex: number): string {
  const firstSentence = text.split(/(?<=[.!?])\s+/)[0] ?? text;
  const short = firstSentence.length > 80
    ? firstSentence.slice(0, 77).trimEnd() + "…"
    : firstSentence;
  return short || `Step ${fallbackIndex + 1}`;
}

/**
 * Extract ordered HowToStep candidates from a lesson markdown body.
 * - List items (`- ...`, `1. ...`) each become their own step.
 * - Otherwise, non-empty paragraphs become steps.
 * - Directive blocks are stripped before splitting.
 */
export function extractStepsFromMarkdown(body: string | null | undefined): LessonSchemaStep[] {
  if (!body) return [];
  const stripped = body
    .replace(/:::[a-z][\w-]*(?:\[[^\]]*\])?(?:\{[^}]*\})?[\s\S]*?:::/gi, "\n")
    .replace(/```[\s\S]*?```/g, "\n");

  const listLines = stripped
    .split(/\r?\n/)
    .map((l) => l.match(/^\s*(?:[-*+]|\d+\.)\s+(.+)$/)?.[1])
    .filter((x): x is string => !!x);

  let chunks: string[];
  if (listLines.length >= 2) {
    chunks = listLines;
  } else {
    chunks = stripped
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  return chunks
    .map((c) => clean(c))
    .filter((t) => t.length > 0)
    .map((text, i) => ({ name: nameFor(text, i), text }));
}

/**
 * Build a schema.org JSON-LD @graph for a first-aid lesson.
 * Returns a plain object — caller stringifies it inside a
 * <script type="application/ld+json"> tag (or via <Helmet>).
 */
export function buildLessonSchema(input: LessonSchemaInput): Record<string, unknown> {
  const steps = input.steps && input.steps.length > 0
    ? input.steps
    : extractStepsFromMarkdown(input.body);

  const howToId = `${input.url}#howto`;
  const pageId = `${input.url}#webpage`;
  const conditionId = input.condition ? `${input.url}#condition` : undefined;

  const howTo: Record<string, unknown> = {
    "@type": ["HowTo", "FirstAidInstructions"],
    "@id": howToId,
    name: input.title,
    description: input.description,
    inLanguage: input.inLanguage,
    ...(input.image ? { image: input.image } : {}),
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${input.url}#step-${i + 1}`,
      ...(s.image ? { image: s.image } : {}),
    })),
  };

  if (input.warnings && input.warnings.length > 0) {
    (howTo as Record<string, unknown>).safetyConsideration = input.warnings.map((w) => ({
      "@type": "MedicalWarning",
      name: w.name,
      text: w.text,
    }));
  }

  const webPage: Record<string, unknown> = {
    "@type": ["WebPage", "MedicalWebPage"],
    "@id": pageId,
    url: input.url,
    name: input.title,
    description: input.description,
    inLanguage: input.inLanguage,
    medicalAudience: ["Patient", "https://schema.org/Public"],
    mainContentOfPage: { "@id": howToId },
    ...(conditionId ? { about: { "@id": conditionId } } : {}),
    ...(input.provider
      ? {
          publisher: {
            "@type": "Organization",
            name: input.provider.name,
            url: input.provider.url,
          },
        }
      : {}),
  };

  const graph: Record<string, unknown>[] = [webPage, howTo];

  if (input.condition && conditionId) {
    graph.push({
      "@type": "MedicalCondition",
      "@id": conditionId,
      name: input.condition,
      relevantSpecialty: "EmergencyMedicine",
      possibleTreatment: { "@id": howToId },
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
