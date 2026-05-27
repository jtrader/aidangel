import { Image } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Registry of available illustrations. Each entry maps a key (used in
 * markdown via `:::illustration[key]`) to its file basename under
 * `/public/illustrations/{mobile,tablet,desktop}/<basename>-<device>.webp`.
 */
const REGISTRY: Record<string, { basename: string; label: string }> = {
  "snake-bite-bandage": { basename: "snake-bite-bandage", label: "Snake bite bandage" },
  "danger-check": { basename: "danger-check", label: "Check for danger" },
  "response-check": { basename: "response-check", label: "Check for response" },
  "send-for-help": { basename: "send-for-help", label: "Send for help" },
  "airway-open": { basename: "airway-open", label: "Open the airway" },
  "breathing-check": { basename: "breathing-check", label: "Check breathing" },
  "cpr-essentials": { basename: "cpr-essentials", label: "CPR essentials" },
  "defib-pads": { basename: "defib-pads", label: "Defibrillator pad placement" },
  "choking-airway": { basename: "choking-airway", label: "Choking airway" },
  "severe-bleeding-pressure": { basename: "severe-bleeding-pressure", label: "Severe bleeding — apply pressure" },
  "burns-cooling": { basename: "burns-cooling", label: "Cool the burn" },
  "burn-depth-layers": { basename: "burn-depth-layers", label: "Burn depth layers" },
  "heart-attack-pain-map": { basename: "heart-attack-pain-map", label: "Heart attack pain map" },
  "anaphylaxis-injector": { basename: "anaphylaxis-injector", label: "Anaphylaxis auto-injector" },
  "stroke-face-check": { basename: "stroke-face-check", label: "Stroke face check" },
  "head-injury-cradle": { basename: "head-injury-cradle", label: "Head injury cradle" },
  "heat-cooling-active": { basename: "heat-cooling-active", label: "Active cooling for heat illness" },
  "hypothermia-insulation": { basename: "hypothermia-insulation", label: "Hypothermia insulation" },
  "asthma-inhaler-spacer": { basename: "asthma-inhaler-spacer", label: "Asthma inhaler with spacer" },
  "dehydration-rehydration": { basename: "dehydration-rehydration", label: "Rehydration" },
  "dental-stabilization": { basename: "dental-stabilization", label: "Dental stabilization" },
  "diabetic-hypo-sugar": { basename: "diabetic-hypo-sugar", label: "Diabetic hypoglycaemia — give sugar" },
  "drowning-airway-check": { basename: "drowning-airway-check", label: "Drowning airway check" },
  "electric-shock-scene-warning": { basename: "electric-shock-scene-warning", label: "Electric shock — scene warning" },
  "eye-injury-flushing": { basename: "eye-injury-flushing", label: "Eye injury flushing" },
  "fainting-leg-elevation": { basename: "fainting-leg-elevation", label: "Fainting — elevate legs" },
  "mental-health-listening": { basename: "mental-health-listening", label: "Mental health — active listening" },
  "nosebleed-management": { basename: "nosebleed-management", label: "Nosebleed management" },
  "poisoning-container-check": { basename: "poisoning-container-check", label: "Poisoning — check the container" },
  "shock-management-blanket": { basename: "shock-management-blanket", label: "Shock management — blanket" },
  "spinal-inline-stabilization": { basename: "spinal-inline-stabilization", label: "Spinal in-line stabilization" },
  "sprain-compression-wrap": { basename: "sprain-compression-wrap", label: "Sprain compression wrap" },
  "sunburn-soothe-cool": { basename: "sunburn-soothe-cool", label: "Sunburn — soothe and cool" },
  "infant-cpr-essentials": { basename: "infant-cpr-essentials", label: "Infant CPR essentials" },
  "defib-pads-pediatric": { basename: "defib-pads-pediatric", label: "Paediatric defib pad placement" },
  "spider-bite-check": { basename: "spider-bite-check", label: "Spider bite check" },
  "anaphylaxis-positioning": { basename: "anaphylaxis-positioning", label: "Anaphylaxis positioning" },
  "tourniquet-application": { basename: "tourniquet-application", label: "Tourniquet application" },
  "infant-back-blows": { basename: "infant-back-blows", label: "Infant back blows" },
  "choking-back-blows": { basename: "choking-back-blows", label: "Choking — back blows" },
  "choking-abdominal-thrusts": { basename: "choking-abdominal-thrusts", label: "Choking — abdominal thrusts" },
  "aed-device-anatomy": { basename: "aed-device-anatomy", label: "AED device anatomy" },
  "recovery-position": { basename: "recovery-position", label: "Recovery position" },
  "frostbite-rewarming": { basename: "frostbite-rewarming", label: "Frostbite rewarming" },
  "button-battery-warning": { basename: "button-battery-warning", label: "Button battery warning" },
  "marine-sting-vinegar": { basename: "marine-sting-vinegar", label: "Marine sting — vinegar" },
  "seizure-protect-head": { basename: "seizure-protect-head", label: "Seizure — protect the head" },
  "fracture-splint-immobilise": { basename: "fracture-splint-immobilise", label: "Fracture — splint and immobilise" },
};

interface IllustrationProps {
  /** Registry key, e.g. "snake-bite-bandage" */
  name?: string;
  /** remark-directive passes the [label] as `title` via hProperties */
  title?: string;
  className?: string;
}

function humanizeKey(key: string) {
  return key
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function IllustrationFallback({ name }: { name: string }) {
  return (
    <figure
      role="img"
      aria-label={`Illustration placeholder: ${name}`}
      className={cn(
        "my-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        "border-l-4 border-l-primary"
      )}
    >
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Image className="h-7 w-7 text-primary/60" />
        </div>
        <div className="space-y-1">
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
            Graphic coming soon
          </p>
          <p className="font-display text-lg font-bold text-foreground">
            {humanizeKey(name)}
          </p>
        </div>
        <p className="max-w-xs text-xs text-muted-foreground">
          This illustration is being prepared. Check back shortly for the updated visual guide.
        </p>
      </div>
    </figure>
  );
}

export default function Illustration({ name, title, className }: IllustrationProps) {
  // The remark directive passes `:::illustration[key]` as the `title` prop.
  // Also accept an explicit `name` attribute for `{name="..."}` usage.
  const key = (name ?? title ?? "").trim();
  const entry = key ? REGISTRY[key] : undefined;

  if (!entry) {
    return <IllustrationFallback name={key || "unknown"} />;
  }

  const { basename, label } = entry;
  const mobile = `/illustrations/mobile/${basename}-mobile.webp`;
  const tablet = `/illustrations/tablet/${basename}-tablet.webp`;
  const desktop = `/illustrations/desktop/${basename}-desktop.webp`;

  return (
    <figure className={cn("my-6 flex justify-center", className)}>
      <picture>
        <source media="(min-width: 1024px)" srcSet={desktop} type="image/webp" />
        <source media="(min-width: 640px)" srcSet={tablet} type="image/webp" />
        <img
          src={mobile}
          alt={label}
          loading="lazy"
          decoding="async"
          className="w-full max-w-md mx-auto h-auto rounded-2xl"
        />
      </picture>
    </figure>
  );
}
