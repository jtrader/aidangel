/**
 * Pre-translate every KB topic + _meta.json for every non-English language.
 * Idempotent: skips files that already exist. Pass `--force` to re-translate.
 *
 * Output layout:
 *   kb/{lang}/{slug}.md         – full translated body
 *   kb/{lang}/_meta.json        – array of { slug, title, summary, categoryTranslated }
 *
 * Usage:
 *   bun run scripts/translate-kb-bulk.ts          # only missing
 *   bun run scripts/translate-kb-bulk.ts --force  # re-translate everything
 *   bun run scripts/translate-kb-bulk.ts --lang ar,vi   # only some languages
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { resolve, join } from "path";

const SUPABASE_URL = "https://luocpjawdzwreskitrqj.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1b2NwamF3ZHp3cmVza2l0cnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MDQxNTAsImV4cCI6MjA4NzE4MDE1MH0.XPXKkh2aIJ8sq-mXR9kfKiLTnIVMYQohtA_HK-YsE84";

const ALL_LANGS = ["zh", "yue", "ar", "vi", "pa", "el", "it", "kriol", "yolngu", "pitjantjatjara", "arrernte", "tsi"];

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const langArgIdx = args.indexOf("--lang");
const LANGS: string[] =
  langArgIdx >= 0 && args[langArgIdx + 1] ? args[langArgIdx + 1].split(",") : ALL_LANGS;

const CONCURRENCY = 8;

type TopicMeta = {
  slug: string;
  title: string;
  category: string;
  section: string;
  summary: string;
  keywords: string[];
  related: string[];
};

const meta: TopicMeta[] = JSON.parse(readFileSync(resolve("kb/_meta.json"), "utf8"));

async function translateOne(
  language: string,
  title: string,
  summary: string,
  body: string,
): Promise<{ title: string; summary: string; body: string }> {
  const resp = await fetch(`${SUPABASE_URL}/functions/v1/translate-kb`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ANON_KEY}`,
      apikey: ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ language, title, summary, body }),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  const json = (await resp.json()) as { title?: string; summary?: string; body?: string; error?: string };
  if (json.error) throw new Error(json.error);
  return {
    title: json.title ?? title,
    summary: json.summary ?? summary,
    body: json.body ?? body,
  };
}

async function translateCategories(language: string, cats: string[]): Promise<Record<string, string>> {
  const resp = await fetch(`${SUPABASE_URL}/functions/v1/translate-ui`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ANON_KEY}`,
      apikey: ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ language, texts: cats }),
  });
  if (!resp.ok) {
    console.warn(`  ! category translation failed (${resp.status}); falling back to English`);
    return Object.fromEntries(cats.map((c) => [c, c]));
  }
  const json = (await resp.json()) as { translations?: string[] };
  const out: Record<string, string> = {};
  cats.forEach((c, i) => (out[c] = json.translations?.[i] || c));
  return out;
}

async function runForLanguage(lang: string) {
  const dir = resolve("kb", lang);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  // Identify missing topics
  const todo = meta.filter((t) => {
    const f = join(dir, `${t.slug}.md`);
    return FORCE || !existsSync(f);
  });

  console.log(`\n[${lang}] ${todo.length} topics to translate (${meta.length - todo.length} cached)`);

  // Translate bodies with concurrency
  let done = 0;
  const queue = todo.slice();
  async function worker() {
    while (queue.length) {
      const topic = queue.shift();
      if (!topic) return;
      const sourcePath = resolve("kb", `${topic.slug}.md`);
      const sourceBody = readFileSync(sourcePath, "utf8");
      try {
        const out = await translateOne(lang, topic.title, topic.summary, sourceBody);
        writeFileSync(join(dir, `${topic.slug}.md`), out.body);
        // Also stash the translated title/summary on the topic for the meta file
        (topic as any)._tr = { title: out.title, summary: out.summary };
        done++;
        process.stdout.write(`  [${lang}] ${done}/${todo.length} ${topic.slug}\n`);
      } catch (e) {
        console.error(`  ! [${lang}] ${topic.slug} failed:`, (e as Error).message);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Build/refresh _meta.json. Re-use existing translations for skipped topics.
  const existingMetaPath = join(dir, "_meta.json");
  const existing: Array<{ slug: string; title: string; summary: string }> =
    !FORCE && existsSync(existingMetaPath) ? JSON.parse(readFileSync(existingMetaPath, "utf8")).topics ?? [] : [];
  const existingBySlug = Object.fromEntries(existing.map((e) => [e.slug, e]));

  const metaOut = meta.map((t) => {
    const tr = (t as any)._tr;
    if (tr) return { slug: t.slug, title: tr.title, summary: tr.summary };
    if (existingBySlug[t.slug]) return existingBySlug[t.slug];
    return { slug: t.slug, title: t.title, summary: t.summary };
  });

  // Translate the unique category names once
  const uniqueCats = Array.from(new Set(meta.map((t) => t.category)));
  console.log(`  [${lang}] translating ${uniqueCats.length} category names…`);
  const catMap = await translateCategories(lang, uniqueCats);

  writeFileSync(
    existingMetaPath,
    JSON.stringify({ language: lang, categories: catMap, topics: metaOut }, null, 2),
  );
  console.log(`  [${lang}] wrote _meta.json`);
}

async function main() {
  console.log(`Translating ${meta.length} topics × ${LANGS.length} languages = ${meta.length * LANGS.length} max calls`);
  console.log(`Languages: ${LANGS.join(", ")}`);
  console.log(`Force: ${FORCE}, Concurrency: ${CONCURRENCY}`);
  for (const lang of LANGS) {
    await runForLanguage(lang);
  }
  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
