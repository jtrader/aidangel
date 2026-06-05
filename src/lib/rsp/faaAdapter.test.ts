import { describe, it, expect, beforeEach, vi } from "vitest";
import { classifyPath } from "./faaAdapter";

beforeEach(() => {
  // Stub crypto.randomUUID + sessionStorage for jsdom
  if (typeof sessionStorage !== "undefined") sessionStorage.clear();
  if (!("randomUUID" in (globalThis.crypto ?? {}))) {
    // @ts-expect-error patch
    globalThis.crypto = { ...(globalThis.crypto ?? {}), randomUUID: () => "test-uuid" };
  }
});

describe("classifyPath", () => {
  it("/ar/kb/cpr → kb_article_viewed tier 2, lang ar", () => {
    const s = classifyPath("/ar/kb/cpr")!;
    expect(s.source_event_type).toBe("kb_article_viewed");
    expect(s.theme).toBe("cpr");
    expect(s.sensitivity_tier).toBe(2);
    expect(s.location_language).toBe("ar");
  });

  it("/mental-health-first-aid → null (wrong structure)", () => {
    expect(classifyPath("/mental-health-first-aid")).toBeNull();
  });

  it("/en/kb/mental-health-first-aid → null (no /en/ prefix)", () => {
    expect(classifyPath("/en/kb/mental-health-first-aid")).toBeNull();
  });

  it("/kb/mental-health-first-aid → tier 3, suppression_active true, lang en", () => {
    const s = classifyPath("/kb/mental-health-first-aid")!;
    expect(s.sensitivity_tier).toBe(3);
    expect(s.suppression_active).toBe(true);
    expect(s.location_language).toBe("en");
  });

  it("/kriol/kb/cpr → lang rop", () => {
    const s = classifyPath("/kriol/kb/cpr")!;
    expect(s.location_language).toBe("rop");
  });

  it("/yolngu/kb/drsabcd → lang x-yolngu", () => {
    const s = classifyPath("/yolngu/kb/drsabcd")!;
    expect(s.location_language).toBe("x-yolngu");
  });

  it("/symptoms/snake-bite-australia → symptom_lookup tier 2", () => {
    const s = classifyPath("/symptoms/snake-bite-australia")!;
    expect(s.source_event_type).toBe("symptom_lookup");
    expect(s.sensitivity_tier).toBe(2);
  });

  it("/aed/australia/sydney → aed_location_search, country au", () => {
    const s = classifyPath("/aed/australia/sydney")!;
    expect(s.source_event_type).toBe("aed_location_search");
    expect(s.location_country).toBe("au");
  });

  it("/aed/united-kingdom/london → country gb", () => {
    const s = classifyPath("/aed/united-kingdom/london")!;
    expect(s.location_country).toBe("gb");
  });

  it("/workplace/construction → workplace_vertical_viewed tier 1", () => {
    const s = classifyPath("/workplace/construction")!;
    expect(s.source_event_type).toBe("workplace_vertical_viewed");
    expect(s.sensitivity_tier).toBe(1);
  });

  it("/about → null", () => {
    expect(classifyPath("/about")).toBeNull();
  });

  it("/ → null", () => {
    expect(classifyPath("/")).toBeNull();
  });

  it("/kb/unknown-topic → tier 2 fallback", () => {
    const s = classifyPath("/kb/unknown-topic")!;
    expect(s.sensitivity_tier).toBe(2);
  });
});
