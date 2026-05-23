import { HeartHandshake, ArrowUpRight } from "lucide-react";

interface Props {
  /** Optional industry context, e.g. "construction workers" */
  context?: string;
  variant?: "default" | "compact";
}

/**
 * Mental Health First Aid callout — emphasises MHFA's importance and
 * cross-promotes the LoveKey sister site guardianguide.org for matching
 * people with the right mental health support.
 *
 * Intentionally does NOT list crisis phone numbers — those live on
 * guardianguide.org where they can be curated and kept current.
 */
export default function MentalHealthCallout({ context, variant = "default" }: Props) {
  const heading = context
    ? `Mental health is first aid too — for ${context}`
    : "Mental health is first aid too";

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
          <p className="text-sm text-muted-foreground mt-2">
            Psychological injury is now one of the largest categories of workplace harm in
            Australia. Panic attacks, burnout, suicidal thoughts, grief after a critical
            incident — these need a first aider as much as a sprain or a burn. Use the{" "}
            <strong className="text-foreground">ALGEE</strong> action plan: Approach, Listen,
            Give support, Encourage professional help, Encourage other supports.
          </p>
          {variant === "default" && (
            <p className="text-sm text-muted-foreground mt-3">
              Finding the <em>right</em> support — the right therapist, helpline, peer group
              or workplace EAP — is half the battle. We don't keep a list of crisis numbers
              here because they change and they're different for every person.
            </p>
          )}
          <a
            href="https://guardianguide.org"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Find the right mental health support at GuardianGuide.org
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <p className="text-xs text-muted-foreground mt-2">
            GuardianGuide is our sister site for curating mental health resources matched to
            your situation. If life is in immediate danger, call{" "}
            <a href="tel:000" className="text-primary font-semibold hover:underline">
              000
            </a>
            .
          </p>
        </div>
      </div>
    </aside>
  );
}
