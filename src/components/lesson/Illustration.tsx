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

function IllustrationFallback({ key: label }: { key: string }) {
  return (
    <figure
      role="img"
      aria-label={`Illustration placeholder: ${label}`}
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
            {humanizeKey(label)}
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
    return <IllustrationFallback key={key} />;
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
