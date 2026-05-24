import { useState, Children, isValidElement, type ReactNode } from "react";
import { Eye, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  children?: ReactNode;
}

/**
 * A scenario block. Convention:
 *   First paragraph/blockquote = the situation.
 *   A <hr/> separates situation from "what would you do?" reveal.
 */
export default function Scenario({ title, children }: Props) {
  const arr = Children.toArray(children);
  const hrIdx = arr.findIndex((c) => isValidElement(c) && (c.type as any) === "hr");
  const situation = hrIdx === -1 ? arr : arr.slice(0, hrIdx);
  const reveal = hrIdx === -1 ? [] : arr.slice(hrIdx + 1);
  const [open, setOpen] = useState(false);

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border bg-gradient-to-br from-accent to-card shadow-sm">
      <div className="border-b border-border/60 bg-background/60 px-4 py-2.5 md:px-5">
        <div className="flex items-center gap-2">
          <MessageSquareText className="h-4 w-4 text-primary" />
          <p className="font-display text-xs font-semibold uppercase tracking-wide text-primary">
            Scenario{title ? ` — ${title}` : ""}
          </p>
        </div>
      </div>
      <div className="px-4 py-4 md:px-5 md:py-5">
        <div className="prose prose-sm md:prose-base max-w-none italic text-foreground/90 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
          {situation}
        </div>
        {reveal.length > 0 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground",
                open && "bg-primary text-primary-foreground",
              )}
            >
              <Eye className="h-4 w-4" />
              {open ? "Hide answer" : "What would you do?"}
            </button>
            {open && (
              <div className="prose prose-sm md:prose-base mt-3 max-w-none rounded-lg bg-background/70 p-3 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
                {reveal}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
