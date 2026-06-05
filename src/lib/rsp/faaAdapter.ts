// FirstAidAngel RSP Signal Adapter
// URL-driven classifier — see FAA-ADAPTER-001 spec.

import { normaliseLanguageCode } from "@/lib/localeCodes";
import { writeSignal } from "./signalStore";
import { getSessionId } from "./session";
import type { FAASignal } from "./types";

// KB topic sensitivity tier map
const KB_TOPIC_TIERS: Record<string, 1 | 2 | 3> = {
  "mental-health-first-aid": 3,
  // tier 2
  drsabcd: 2, cpr: 2, aed: 2, "recovery-position": 2,
  choking: 2, bleeding: 2, burns: 2, shock: 2,
  asthma: 2, anaphylaxis: 2, "allergic-reactions": 2,
  "heart-attack": 2, stroke: 2, seizures: 2, diabetes: 2,
  "head-injury": 2, "spinal-injury": 2, fractures: 2,
  "snake-bite": 2, "spider-bite": 2, "heat-illness": 2,
  hypothermia: 2, poisoning: 2, drowning: 2,
  "electric-shock": 2, "remote-first-aid": 2,
  // tier 1
  "sprains-strains": 1, "jellyfish-stings": 1, nosebleed: 1,
  fainting: 1, dehydration: 1, sunburn: 1,
  "dental-injury": 1, "eye-injuries": 1,
  "workplace-first-aid": 1, "elderly-care": 1,
};

// FAA language path prefix → raw locale code (before normalisation)
const LANG_PREFIX_MAP: Record<string, string> = {
  ar: "ar", zh: "zh", yue: "yue", vi: "vi", pa: "pa",
  el: "el", it: "it", kriol: "rop", tsi: "tcs",
  arrernte: "aer", pitjantjatjara: "pjt", yolngu: "x-yolngu",
};

function normaliseCountrySlug(slug: string): string {
  const compact = slug.replace(/-/g, "").toLowerCase();
  if (compact === "unitedkingdom") return "gb";
  if (compact === "unitedstates") return "us";
  if (compact === "newzealand") return "nz";
  if (compact === "australia") return "au";
  return compact;
}

export function classifyPath(pathname: string): FAASignal | null {
  const segments = pathname.replace(/^\//, "").replace(/\/$/, "").split("/").filter(Boolean);

  // Detect FAA language prefix
  let langPrefix: string | null = null;
  let rest = segments;
  if (segments[0] && LANG_PREFIX_MAP[segments[0]]) {
    langPrefix = segments[0];
    rest = segments.slice(1);
  }

  const rawLang = langPrefix ? LANG_PREFIX_MAP[langPrefix] : "en";
  const lang = normaliseLanguageCode(rawLang) ?? "en";

  const base = {
    site: "firstaidangel" as const,
    help_stage: "prepare" as const,
    location_language: lang,
    location_country: null as string | null,
    urgency: "unknown" as const,
    session_id: getSessionId(),
    created_at: new Date().toISOString(),
  };

  // /{lang}/kb/{topic}
  if (rest[0] === "kb" && rest[1]) {
    const topic = rest[1];
    const tier = KB_TOPIC_TIERS[topic] ?? 2;
    return {
      ...base,
      source_event_type: "kb_article_viewed",
      theme: topic,
      sensitivity_tier: tier,
      suppression_active: tier === 3,
    };
  }

  // /{lang}/angel-action or /angel-action
  if (rest[0] === "angel-action") {
    return {
      ...base,
      source_event_type: "angel_action_viewed",
      theme: "angel_action",
      sensitivity_tier: 1,
      suppression_active: false,
    };
  }

  // /symptoms/{slug} — English only, no lang prefix
  if (segments[0] === "symptoms" && segments[1]) {
    return {
      ...base,
      location_language: "en",
      source_event_type: "symptom_lookup",
      theme: segments[1],
      sensitivity_tier: 2,
      suppression_active: false,
    };
  }

  // /aed/{country}/{city?}
  if (segments[0] === "aed" && segments[1] && segments[1] !== "finder") {
    return {
      ...base,
      location_language: "en",
      location_country: normaliseCountrySlug(segments[1]),
      source_event_type: "aed_location_search",
      theme: "aed",
      sensitivity_tier: 2,
      suppression_active: false,
    };
  }

  // /workplace/{sector}
  if (segments[0] === "workplace" && segments[1]) {
    return {
      ...base,
      location_language: "en",
      source_event_type: "workplace_vertical_viewed",
      theme: segments[1],
      sensitivity_tier: 1,
      suppression_active: false,
    };
  }

  // /courses/{slug}
  if (segments[0] === "courses" && segments[1]) {
    return {
      ...base,
      location_language: "en",
      source_event_type: "course_viewed",
      theme: segments[1],
      sensitivity_tier: 1,
      suppression_active: false,
    };
  }

  return null;
}

export async function fireSignal(pathname: string): Promise<void> {
  const signal = classifyPath(pathname);
  if (!signal) return;
  await writeSignal(signal);
}
