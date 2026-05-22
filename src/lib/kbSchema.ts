// Build JSON-LD HowTo / FAQPage schemas from a KB topic markdown body.
// Steps come from numbered lists ("1. …") inside H2 sections.
// FAQs come from H2 headings phrased as questions (end with "?").

export type HowToStep = { name: string; text: string };
export type FaqItem = { question: string; answer: string };

function stripInlineMd(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](href) -> text
    .replace(/\*\*([^*]+)\*\*/g, "$1")        // **bold** -> bold
    .replace(/\*([^*]+)\*/g, "$1")            // *em* -> em
    .replace(/`([^`]+)`/g, "$1")              // `code` -> code
    .replace(/\s+/g, " ")
    .trim();
}

type Section = { heading: string; lines: string[] };

function splitSections(body: string): Section[] {
  const lines = body.split(/\r?\n/);
  const sections: Section[] = [];
  let current: Section | null = null;
  for (const line of lines) {
    const h = /^##\s+(.*)$/.exec(line);
    if (h) {
      if (current) sections.push(current);
      current = { heading: stripInlineMd(h[1]), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

/** Pull all numbered list items as HowTo steps. Section heading is used as step name prefix. */
export function extractHowToSteps(body: string): HowToStep[] {
  const out: HowToStep[] = [];
  for (const sec of splitSections(body)) {
    let stepIdx = 0;
    for (const line of sec.lines) {
      const m = /^\s*\d+\.\s+(.+)$/.exec(line);
      if (!m) continue;
      stepIdx += 1;
      const text = stripInlineMd(m[1]);
      // Use section heading + first ~6 words as step name for readability.
      const short = text.split(" ").slice(0, 8).join(" ");
      const name = sec.heading ? `${sec.heading} — step ${stepIdx}` : short;
      out.push({ name, text });
    }
  }
  return out;
}

/** Truncate at a sentence boundary close to `max` so answers don't get cut mid-word. */
function clampSentence(s: string, max: number): string {
  if (s.length <= max) return s;
  const slice = s.slice(0, max);
  const lastStop = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("! "), slice.lastIndexOf("? "));
  if (lastStop > max * 0.6) return slice.slice(0, lastStop + 1).trim();
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim() + "…";
}

/** Treat any H2 ending with "?" (allowing trailing punctuation/emoji) as a FAQ. */
function isQuestionHeading(h: string): boolean {
  // Strip trailing whitespace, emoji, and non-question punctuation, then test for "?".
  const tail = h.replace(/[\s\p{Extended_Pictographic}.!,;:\-–—]+$/u, "");
  return /\?$/.test(tail);
}

/**
 * Build a FAQ answer from every block under the question H2:
 * paragraphs, bullet/numbered lists, blockquotes, and H3 sub-sections
 * (whose subheading becomes a lead-in sentence). Code fences and images
 * are skipped.
 */
export function extractFaqs(body: string): FaqItem[] {
  const out: FaqItem[] = [];
  for (const sec of splitSections(body)) {
    if (!isQuestionHeading(sec.heading)) continue;
    const question = sec.heading.replace(/\s+/g, " ").trim();

    const blocks: string[] = [];
    let para: string[] = [];
    let listItems: string[] = [];
    let listKind: "ul" | "ol" | null = null;
    let inFence = false;

    const flushPara = () => {
      if (para.length) {
        blocks.push(stripInlineMd(para.join(" ")));
        para = [];
      }
    };
    const flushList = () => {
      if (listItems.length) {
        // Render as "Item 1; Item 2; Item 3." — readable in a schema answer.
        blocks.push(listItems.map(stripInlineMd).join("; ").replace(/\.?$/, "."));
        listItems = [];
        listKind = null;
      }
    };

    for (const raw of sec.lines) {
      const line = raw.replace(/\t/g, "  ");
      const trimmed = line.trim();

      // Toggle fenced code blocks and skip their contents.
      if (/^```/.test(trimmed)) {
        flushPara(); flushList();
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;

      // Skip standalone images, horizontal rules, HTML comments.
      if (!trimmed || /^!\[/.test(trimmed) || /^([-*_])\1{2,}$/.test(trimmed) || /^<!--/.test(trimmed)) {
        flushPara(); flushList();
        continue;
      }

      // H3+ subheading inside the FAQ section — include as lead-in.
      const sub = /^#{3,6}\s+(.+)$/.exec(trimmed);
      if (sub) {
        flushPara(); flushList();
        const t = stripInlineMd(sub[1]).replace(/[.:]\s*$/, "");
        if (t) blocks.push(`${t}:`);
        continue;
      }

      // Bullet / numbered list item.
      const ul = /^[-*+]\s+(.+)$/.exec(trimmed);
      const ol = /^\d+\.\s+(.+)$/.exec(trimmed);
      if (ul || ol) {
        flushPara();
        const kind: "ul" | "ol" = ul ? "ul" : "ol";
        if (listKind && listKind !== kind) flushList();
        listKind = kind;
        listItems.push((ul ?? ol)![1]);
        continue;
      }

      // Blockquote — treat as regular paragraph text.
      const bq = /^>\s?(.*)$/.exec(trimmed);
      if (bq) {
        flushList();
        para.push(bq[1]);
        continue;
      }

      // Default: paragraph continuation.
      flushList();
      para.push(trimmed);
    }
    flushPara(); flushList();

    const answer = clampSentence(blocks.join(" ").replace(/\s+/g, " ").trim(), 1500);
    if (answer) out.push({ question, answer });
  }
  return out;
}


export function buildHowToJsonLd(opts: {
  title: string;
  description: string;
  url: string;
  body: string;
  inLanguage: string;
}): Record<string, unknown> | null {
  const steps = extractHowToSteps(opts.body);
  if (steps.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.title,
    description: opts.description,
    inLanguage: opts.inLanguage,
    totalTime: "PT5M",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${opts.url}#step-${i + 1}`,
    })),
  };
}

export function buildFaqJsonLd(opts: {
  body: string;
  inLanguage: string;
}): Record<string, unknown> | null {
  const faqs = extractFaqs(opts.body);
  if (faqs.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: opts.inLanguage,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Speakable schema — tells Google Assistant / voice search which parts of
 *  the page are suitable for text-to-speech (titles, summaries, step text). */
export function buildSpeakableJsonLd(url: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".prose p", ".prose li"],
    },
  };
}

