// Contextual KB → sister-site handoff card. Renders below the article body
// when the topic slug has a mapping in KB_HANDOFF_MAP. Returns null otherwise
// so unmapped topics produce zero layout impact.
import { ArrowRight } from "lucide-react";
import { buildHandoffUrl, TARGETS } from "@/lib/localeCodes";
import { KB_HANDOFF_MAP, KB_HANDOFF_COPY_KEYS } from "@/lib/kbHandoffMap";
import { useLanguage } from "@/contexts/LanguageContext";

export interface KBHandoffCardProps {
  /** KB topic slug, kebab-case (e.g. "mental-health-first-aid"). */
  topic: string;
  /** Active UI language code. */
  lang: string;
  /** Suppress card during active crisis flows. */
  immediateDanger?: boolean;
}

export function KBHandoffCard({ topic, lang, immediateDanger = false }: KBHandoffCardProps) {
  const { t } = useLanguage();
  if (immediateDanger) return null;
  const target = KB_HANDOFF_MAP[topic];
  if (!target) return null;
  const keys = KB_HANDOFF_COPY_KEYS[target];
  const href = buildHandoffUrl(TARGETS[target], null, lang, "");

  return (
    <aside className="mt-8 p-5 rounded-2xl border border-primary/30 bg-primary/5">
      <h2 className="text-base font-bold text-foreground mb-1">{t(keys.heading as any)}</h2>
      <p className="text-sm text-muted-foreground mb-4">{t(keys.body as any)}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {t(keys.cta as any)}
        <ArrowRight className="h-4 w-4" />
      </a>
    </aside>
  );
}

export default KBHandoffCard;
