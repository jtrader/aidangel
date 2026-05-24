import { Children, isValidElement, type ReactNode } from "react";

interface Props {
  title?: string;
  children?: ReactNode;
}

/** Renders any ordered/unordered list children as numbered step cards. */
export default function Steps({ title, children }: Props) {
  const items: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const type = (child.type as any);
    if (type === "ol" || type === "ul") {
      Children.forEach((child.props as any).children, (li) => {
        if (isValidElement(li) && (li.type as any) === "li") {
          items.push((li.props as any).children);
        }
      });
    }
  });

  return (
    <div className="not-prose my-6">
      {title && <p className="font-display text-base font-semibold mb-3">{title}</p>}
      <ol className="space-y-3">
        {items.map((content, i) => (
          <li key={i} className="flex gap-4 rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-display font-bold text-primary-foreground">
              {i + 1}
            </div>
            <div className="prose prose-sm md:prose-base max-w-none flex-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
              {content}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
