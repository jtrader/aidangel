import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";

/**
 * Phase 2 i18n coverage guard.
 *
 * For every key in `src/locales/en.json` (the canonical Phase 2 catalog), assert
 * that all 47 other locale catalogs contain the same key with a non-empty
 * string value. Fails the suite with a per-locale diff so missing translations
 * are easy to spot in CI.
 */

const LOCALES_DIR = resolve(__dirname, "..", "locales");

function loadCatalog(file: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(LOCALES_DIR, file), "utf8")) as Record<string, unknown>;
}

const en = loadCatalog("en.json");
const enKeys = Object.keys(en).filter((k) => !k.startsWith("_"));

const localeFiles = readdirSync(LOCALES_DIR)
  .filter((f) => f.endsWith(".json") && f !== "en.json")
  .sort();

describe("i18n coverage — en.json keys exist in every locale", () => {
  it("ships exactly 47 non-English locales", () => {
    expect(localeFiles).toHaveLength(47);
  });

  it.each(localeFiles)("%s contains every Phase 2 key with a non-empty value", (file) => {
    const cat = loadCatalog(file);
    const missing: string[] = [];
    const empty: string[] = [];
    for (const key of enKeys) {
      if (!(key in cat)) {
        missing.push(key);
        continue;
      }
      const v = cat[key];
      if (typeof v !== "string" || v.trim().length === 0) empty.push(key);
    }
    if (missing.length || empty.length) {
      throw new Error(
        `${file} is missing ${missing.length} key(s) and has ${empty.length} empty value(s).\n` +
          (missing.length ? `Missing: ${missing.slice(0, 20).join(", ")}${missing.length > 20 ? "…" : ""}\n` : "") +
          (empty.length ? `Empty:   ${empty.slice(0, 20).join(", ")}${empty.length > 20 ? "…" : ""}` : "")
      );
    }
  });
});
