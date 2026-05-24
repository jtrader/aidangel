import { useState, Children, isValidElement, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  children?: ReactNode;
}

/** Tickable do/don't list. List items prefixed with "DON'T:" render as red. */
export default function Checklist({ title, children }: Props) {
  const items: { content: ReactNode; negative: boolean }[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const type = child.type as any;
    if (type === "ol" || type === "ul") {
      Children.forEach((child.props as any).children, (li) => {
        if (isValidElement(li) && (li.type as any) === "li") {
          const liChildren = (li.props as any).children;
          // Detect a leading "DON'T:" / "DO NOT:" marker on the first text child
          let negative = false;
          const text = extractText(liChildren).trim().toUpperCase();
          if (text.startsWith("DON'T:") || text.startsWith("DO NOT:") || text.startsWith("NEVER:")) {
            negative = true;
          }
          items.push({ content: liChildren, negative });
        }
      });
    }
  });

  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setChecked((p) => ({ ...p, [i]: !p[i] }));

  return (
    <div className="not-prose my-6 rounded-xl border bg-card p-4 md:p-5 shadow-sm">
      {title && <p className="font-display text-base font-semibold mb-3">{title}</p>}
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              className={cn(
                "group flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted",
                checked[i] && "opacity-60",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                  checked[i]
                    ? it.negative
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-safe bg-safe text-safe-foreground"
                    : it.negative
                      ? "border-primary/40"
                      : "border-border",
                )}
              >
                {checked[i] && <Check className="h-4 w-4" />}
              </span>
              <span
                className={cn(
                  "prose prose-sm md:prose-base max-w-none flex-1 [&>p]:my-0",
                  checked[i] && "line-through",
                  it.negative && "text-primary",
                )}
              >
                {it.content}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function extractText(node: any): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) return extractText((node.props as any).children);
  return "";
}
