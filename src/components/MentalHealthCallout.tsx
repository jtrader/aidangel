import { HeartHandshake, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCountry } from "@/hooks/useCountry";
import { emergencyNumberForCountry } from "@/lib/donations";

interface Props {
  /** Optional industry context, e.g. "construction workers" */
  context?: string;
  variant?: "default" | "compact";
}

const interpolate = (s: string, vars: Record<string, string>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);

/**
 * Mental Health First Aid callout — emphasises MHFA's importance and
 * cross-promotes the LoveKey sister site guardianguide.org for matching
 * people with the right mental health support.
 *
 * Intentionally does NOT list crisis phone numbers — those live on
 * guardianguide.org where they can be curated and kept current.
 */
export default function MentalHealthCallout({ context, variant = "default" }: Props) {
  const { t } = useLanguage();
  const { code } = useCountry();
  const number = emergencyNumberForCountry(code);

  const heading = context
    ? interpolate(t("mhfaHeadingWith"), { context })
    : t("mhfaHeading");

  // {number} → tel link
  const lifeDangerTemplate = t("mhfaLifeDanger");
  const ldParts = lifeDangerTemplate.split("{number}");

  return (
    <aside
      aria-labelledby="mhfa-callout-heading"
      className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-5 md:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary">
          <HeartHandshake className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3
            id="mhfa-callout-heading"
            className="font-display text-lg md:text-xl font-bold text-foreground leading-tight"
          >
            {heading}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">{t("mhfaBody")}</p>
          {variant === "default" && (
            <p className="text-sm text-muted-foreground mt-3">{t("mhfaBodyExtra")}</p>
          )}
          <a
            href="https://guardianguide.org"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            {t("mhfaCta")}
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <p className="text-xs text-muted-foreground mt-2">
            {ldParts[0]}
            <a href={`tel:${number}`} className="text-primary font-semibold hover:underline">
              {number}
            </a>
            {ldParts[1] ?? ""}
          </p>
        </div>
      </div>
    </aside>
  );
}
