import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

/**
 * Static "no missing fallback" guard.
 *
 * Walks all source files under `src/` and collects every literal key passed to
 * `t("...")` (the translator function from `LanguageContext`). For each locale,
 * asserts that the key exists and resolves to a non-empty string. If a key is
 * missing, the live app would fall back to the raw key — this test catches it
 * before the page ever renders.
 */

const SRC_DIR = resolve(__dirname, "..");
const LOCALES_DIR = resolve(SRC_DIR, "locales");

const T_CALL_RE = /\bt\(\s*["'`]([a-zA-Z0-9_.-]+)["'`]\s*[),]/g;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === "test" || entry === "locales" || entry === "node_modules") continue;
      walk(full, out);
    } else if (/\.(tsx?|jsx?)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

function collectKeys(): Set<string> {
  const keys = new Set<string>();
  for (const file of walk(SRC_DIR)) {
    const src = readFileSync(file, "utf8");
    let m: RegExpExecArray | null;
    T_CALL_RE.lastIndex = 0;
    while ((m = T_CALL_RE.exec(src)) !== null) {
      keys.add(m[1]);
    }
  }
  return keys;
}

const referencedKeys = Array.from(collectKeys()).sort();

const localeFiles = readdirSync(LOCALES_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

describe("i18n no-fallback guard — every t() key resolves in every locale", () => {
  it("found at least one t() reference in the codebase", () => {
    expect(referencedKeys.length).toBeGreaterThan(0);
  });

  it.each(localeFiles)("%s covers every t() key with a non-empty value", (file) => {
    const cat = JSON.parse(readFileSync(join(LOCALES_DIR, file), "utf8")) as Record<string, unknown>;
    const broken: string[] = [];
    for (const key of referencedKeys) {
      const v = cat[key];
      if (typeof v !== "string" || v.trim().length === 0) broken.push(key);
    }
    if (broken.length) {
      throw new Error(
        `${file} would render the raw key for ${broken.length} t() call(s):\n  ${broken
          .slice(0, 25)
          .join("\n  ")}${broken.length > 25 ? "\n  …" : ""}`
      );
    }
  });
});
