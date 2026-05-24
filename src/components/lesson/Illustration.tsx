import { lazy, Suspense, type ComponentType } from "react";
import { cn } from "@/lib/utils";

/**
 * Registry of available inline SVG illustration components.
 * Add new illustrations here so they can be referenced from markdown via:
 *   :::illustration[key]
 */
const REGISTRY: Record<string, ComponentType<{ className?: string; title?: string }>> = {
  "snake-bite-bandage": lazy(() => import("./illustrations/SnakeBiteBandage")),
};

interface IllustrationProps {
  /** Registry key, e.g. "snake-bite-bandage" */
  name?: string;
  /** remark-directive passes the [label] as `title` via hProperties */
  title?: string;
  className?: string;
}

export default function Illustration({ name, title, className }: IllustrationProps) {
  // The remark directive passes `:::illustration[key]` as the `title` prop.
  // Also accept an explicit `name` attribute for `{name="..."}` usage.
  const key = (name ?? title ?? "").trim();
  const Component = key ? REGISTRY[key] : undefined;

  if (!Component) {
    return (
      <div
        role="img"
        aria-label={`Missing illustration: ${key || "(unspecified)"}`}
        className="my-4 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground"
      >
        Illustration not found: <code className="font-mono">{key || "(none)"}</code>
      </div>
    );
  }

  return (
    <figure className={cn("my-6 flex justify-center", className)}>
      <Suspense
        fallback={<div className="h-40 w-full max-w-md animate-pulse rounded-lg bg-muted" />}
      >
        <Component className="w-full max-w-md mx-auto" />
      </Suspense>
    </figure>
  );
}
