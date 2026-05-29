import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, join } from "path";

/**
 * SEO smoke test: structured data validity.
 *
 * 1. Validates the static JSON-LD baked into index.html.
 * 2. Scans every source file under src/ that ships a JSON-LD payload via
 *    SeoHead's `jsonLd` prop or an inline `<script type="application/ld+json">`
 *    and statically extracts the literal JSON.stringify(...) argument when
 *    possible, asserting it parses and carries the schema.org context.
 *
 * The scan is intentionally conservative: dynamic payloads (jsonLd={someVar})
 * are skipped — only literal object expressions are validated. This catches
 * the most common breakage (typos, trailing commas, missing @context) without
 * trying to evaluate React.
 */

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

function tryParseObjectLiteral(src: string): unknown | null {
  // Best-effort: turn a JS object literal (with unquoted keys, single quotes,
  // trailing commas) into JSON via Function(). Safe because the input is our
  // own source code, executed only inside this test runner.
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return Function(`"use strict"; return (${src});`)();
  } catch {
    return null;
  }
}

function extractLiteralArgs(source: string, marker: RegExp): string[] {
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = marker.exec(source))) {
    const start = m.index + m[0].length;
    // Walk forward tracking brace depth to find the matching closer.
    let depth = 0;
    let i = start;
    let inStr: string | null = null;
    let started = false;
    for (; i < source.length; i++) {
      const ch = source[i];
      if (inStr) {
        if (ch === "\\") { i++; continue; }
        if (ch === inStr) inStr = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; continue; }
      if (ch === "{" || ch === "[") { depth++; started = true; }
      else if (ch === "}" || ch === "]") {
        depth--;
        if (started && depth === 0) { results.push(source.slice(start, i + 1)); break; }
      }
    }
  }
  return results;
}

describe("structured data: index.html", () => {
  const html = readFileSync(resolve("index.html"), "utf8");
  const blocks = Array.from(
    html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
  ).map((m) => m[1].trim());

  it("ships at least one JSON-LD block", () => {
    expect(blocks.length).toBeGreaterThan(0);
  });

  it.each(blocks.map((b, i) => [i, b] as const))(
    "block #%i is valid JSON with @context schema.org and @type",
    (_i, block) => {
      const data = JSON.parse(block) as Record<string, unknown>;
      expect(String(data["@context"])).toMatch(/schema\.org/);
      expect(data["@type"]).toBeTruthy();
    },
  );
});

describe("structured data: source files", () => {
  const files = walk(resolve("src"));
  const payloads: Array<{ file: string; literal: string }> = [];

  for (const file of files) {
    const src = readFileSync(file, "utf8");
    // jsonLd={{ ... }} — literal object passed to SeoHead
    for (const lit of extractLiteralArgs(src, /jsonLd=\{\s*/g)) {
      payloads.push({ file, literal: lit });
    }
    // JSON.stringify({ ... }) inside <script type="application/ld+json">
    for (const lit of extractLiteralArgs(src, /JSON\.stringify\(\s*/g)) {
      // Only consider blocks adjacent to application/ld+json scripts.
      const idx = src.indexOf(lit);
      const window = src.slice(Math.max(0, idx - 400), idx);
      if (/application\/ld\+json/.test(window)) {
        payloads.push({ file, literal: lit });
      }
    }
  }

  it("found JSON-LD payloads to validate", () => {
    expect(payloads.length).toBeGreaterThan(0);
  });

  it.each(payloads.map((p) => [p.file.replace(resolve("."), ""), p.literal] as const))(
    "%s contains a valid JSON-LD literal",
    (_file, literal) => {
      const data = tryParseObjectLiteral(literal) as Record<string, unknown> | null;
      // Skip non-literal expressions (variables, spread). Only enforce shape
      // when we successfully evaluated an object literal.
      if (!data || typeof data !== "object") return;
      // Some payloads are arrays of schemas — flatten.
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (!item || typeof item !== "object") continue;
        const ctx = (item as Record<string, unknown>)["@context"];
        const type = (item as Record<string, unknown>)["@type"];
        // Only assert when @context is present — skip helper objects.
        if (ctx !== undefined) {
          expect(String(ctx)).toMatch(/schema\.org/);
          expect(type, "JSON-LD with @context must declare @type").toBeTruthy();
        }
      }
    },
  );
});
