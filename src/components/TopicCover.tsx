// Hero cover image for KB topics. Pulls the cover from the corresponding LMS
// course (set in admin → Courses → Cover image URL) so KB and LMS stay in sync.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// KB topic slug → LMS course slug
const KB_TO_COURSE: Record<string, string> = {
  aed: "aed-use",
  "allergic-reactions": "anaphylaxis-allergies",
  anaphylaxis: "anaphylaxis-allergies",
  asthma: "asthma",
  bleeding: "severe-bleeding",
  burns: "burns-scalds",
  choking: "choking",
  cpr: "cpr-essentials",
  dehydration: "dehydration",
  "dental-injury": "dental-injury",
  diabetes: "diabetes",
  drowning: "drowning",
  drsabcd: "recovery-drsabcd",
  "electric-shock": "electric-shock",
  "eye-injuries": "eye-injuries",
  fainting: "fainting",
  fractures: "fractures",
  "head-injury": "head-injuries-seizures",
  "heart-attack": "stroke-heart-attack",
  "heat-illness": "heat-emergencies",
  hypothermia: "cold-emergencies",
  "jellyfish-stings": "bites-and-stings",
  "mental-health-first-aid": "mental-health-first-aid",
  nosebleed: "nosebleed",
  poisoning: "poisoning",
  "recovery-position": "recovery-drsabcd",
  seizures: "head-injuries-seizures",
  shock: "shock",
  "snake-bite": "bites-and-stings",
  "spider-bite": "bites-and-stings",
  "spinal-injury": "spinal-injury",
  "sprains-strains": "sprains-strains",
  stroke: "stroke-heart-attack",
  sunburn: "sunburn",
};

const coverCache = new Map<string, string | null>();

type Props = { slug: string; title: string; className?: string };

export default function TopicCover({ slug, title, className }: Props) {
  const courseSlug = KB_TO_COURSE[slug];
  const [coverUrl, setCoverUrl] = useState<string | null>(
    courseSlug ? coverCache.get(courseSlug) ?? null : null,
  );

  useEffect(() => {
    if (!courseSlug) {
      setCoverUrl(null);
      return;
    }
    if (coverCache.has(courseSlug)) {
      setCoverUrl(coverCache.get(courseSlug) ?? null);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("courses")
        .select("cover_url")
        .eq("slug", courseSlug)
        .maybeSingle();
      const url = data?.cover_url ?? null;
      coverCache.set(courseSlug, url);
      if (!cancelled) setCoverUrl(url);
    })();
    return () => {
      cancelled = true;
    };
  }, [courseSlug]);

  if (!coverUrl) return null;

  return (
    <figure
      className={
        className ??
        "mb-6 overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-sm"
      }
    >
      <img
        src={coverUrl}
        alt={`${title} — illustration`}
        width={1280}
        height={720}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="w-full h-auto block"
      />
    </figure>
  );
}
