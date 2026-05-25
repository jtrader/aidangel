import { lazy, Suspense, type ComponentType } from "react";
import { Image } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Registry of available inline SVG illustration components.
 * Add new illustrations here so they can be referenced from markdown via:
 *   :::illustration[key]
 */
const REGISTRY: Record<string, ComponentType<{ className?: string; title?: string }>> = {
  "snake-bite-bandage": lazy(() => import("./illustrations/SnakeBiteBandage")),
  "danger-check": lazy(() => import("./illustrations/DangerCheck")),
  "response-check": lazy(() => import("./illustrations/ResponseCheck")),
  "send-for-help": lazy(() => import("./illustrations/SendForHelp")),
  "airway-open": lazy(() => import("./illustrations/AirwayOpen")),
  "breathing-check": lazy(() => import("./illustrations/BreathingCheck")),
  "cpr-essentials": lazy(() => import("./illustrations/CPREssentials")),
  "defib-pads": lazy(() => import("./illustrations/DefibPads")),
  "choking-airway": lazy(() => import("./illustrations/ChokingAirway")),
  "severe-bleeding-pressure": lazy(() => import("./illustrations/SevereBleedingPressure")),
  "burns-cooling": lazy(() => import("./illustrations/BurnsCooling")),
  "burn-depth-layers": lazy(() => import("./illustrations/BurnDepthLayers")),
  "heart-attack-pain-map": lazy(() => import("./illustrations/HeartAttackPainMap")),
  "anaphylaxis-injector": lazy(() => import("./illustrations/AnaphylaxisAutoInjector")),
  "stroke-face-check": lazy(() => import("./illustrations/StrokeFaceCheck")),
  "head-injury-cradle": lazy(() => import("./illustrations/HeadInjuryCradle")),
  "heat-cooling-active": lazy(() => import("./illustrations/HeatCoolingActive")),
  "hypothermia-insulation": lazy(() => import("./illustrations/HypothermiaInsulation")),
  "asthma-inhaler-spacer": lazy(() => import("./illustrations/AsthmaInhalerSpacer")),
  "dehydration-rehydration": lazy(() => import("./illustrations/DehydrationRehydration")),
  "dental-stabilization": lazy(() => import("./illustrations/DentalStabilization")),
  "diabetic-hypo-sugar": lazy(() => import("./illustrations/DiabeticHypoSugar")),
  "drowning-airway-check": lazy(() => import("./illustrations/DrowningAirwayCheck")),
  "electric-shock-scene-warning": lazy(() => import("./illustrations/ElectricShockSceneWarning")),
  "eye-injury-flushing": lazy(() => import("./illustrations/EyeInjuryFlushing")),
  "fainting-leg-elevation": lazy(() => import("./illustrations/FaintingLegElevation")),
  "mental-health-listening": lazy(() => import("./illustrations/MentalHealthListening")),
  "nosebleed-management": lazy(() => import("./illustrations/NosebleedManagement")),
  "poisoning-container-check": lazy(() => import("./illustrations/PoisoningContainerCheck")),
  "shock-management-blanket": lazy(() => import("./illustrations/ShockManagementBlanket")),
  "spinal-inline-stabilization": lazy(() => import("./illustrations/SpinalInlineStabilization")),
  "sprain-compression-wrap": lazy(() => import("./illustrations/SprainCompressionWrap")),
  "sunburn-soothe-cool": lazy(() => import("./illustrations/SunburnSootheCool")),
  "infant-cpr-essentials": lazy(() => import("./illustrations/InfantCPREssentials")),
  "defib-pads-pediatric": lazy(() => import("./illustrations/DefibPadsPediatric")),
  "spider-bite-check": lazy(() => import("./illustrations/SpiderBiteCheck")),
  "anaphylaxis-positioning": lazy(() => import("./illustrations/AnaphylaxisPositioning")),
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
  const Component = key ? REGISTRY[key] : undefined;

  if (!Component) {
    return <IllustrationFallback name={key || "unknown"} />;
  }

  return (
    <figure className={cn("my-6 flex justify-center", className)}>
      <Suspense
        fallback={
          <div className="h-40 w-full max-w-md animate-pulse rounded-2xl bg-muted" />
        }
      >
        <Component className="w-full max-w-md mx-auto" />
      </Suspense>
    </figure>
  );
}
