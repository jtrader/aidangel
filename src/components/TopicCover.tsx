// Hero cover image for KB topics. Pulls the cover from the corresponding LMS
// course (set in admin → Courses → Cover image URL) so KB and LMS stay in sync.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickTranslated } from "@/lib/lmsI18n";

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

function ensureAbsolute(url?: string | null) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const origin = (import.meta.env.VITE_SITE_URL ?? "https://firstaidangel.org").replace(/\/$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function TopicCover({ slug, title, className }: Props) {
  const courseSlug = KB_TO_COURSE[slug];
  const { language } = useLanguage();
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
        .select("id, cover_url")
        .eq("slug", courseSlug)
        .maybeSingle();
      const url = data?.cover_url ?? null;
      coverCache.set(courseSlug, url);
      if (!cancelled) setCoverUrl(url);
    })();
    return () => {
      cancelled = true;
    };
  }, [courseSlug, language]);

  if (!coverUrl) return null;

  const abs = ensureAbsolute(coverUrl);

  return (
    <figure
      className={
        className ??
        "mb-6 overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-sm"
      }
    >
      <picture>
        <source
          type="image/webp"
          srcSet={`${abs}?fm=webp&w=640 640w, ${abs}?fm=webp&w=1024 1024w, ${abs}?fm=webp&w=1280 1280w`}
          sizes="(max-width: 640px) 100vw, 1200px"
        />
        <img
          src={abs}
          alt={`${title} — illustration`}
          width={1280}
          height={720}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-auto block"
          srcSet={`${abs}?w=640 640w, ${abs}?w=1024 1024w, ${abs}?w=1280 1280w`}
          sizes="(max-width: 640px) 100vw, 1200px"
        />
      </picture>
    </figure>
  );
}
