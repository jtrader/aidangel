import { useState } from "react";
import { Check, X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  q?: string;
  a?: string; // index of correct choice
  choices?: string; // pipe-separated
  explain?: string;
}

export default function KnowledgeCheck({ q, a, choices, explain }: Props) {
  const list = (choices || "").split("|").map((s) => s.trim()).filter(Boolean);
  const correct = Number(a ?? 0);
  const [picked, setPicked] = useState<number | null>(null);
  const revealed = picked !== null;

  if (!q || list.length < 2) return null;

  return (
    <div className="not-prose my-6 rounded-xl border-2 border-primary/20 bg-card p-4 md:p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
          <HelpCircle className="h-4 w-4" />
        </div>
        <p className="font-display text-xs font-semibold uppercase tracking-wide text-primary">
          Quick check
        </p>
      </div>
      <p className="font-display text-base md:text-lg font-semibold mb-4">{q}</p>
      <div className="space-y-2">
        {list.map((choice, i) => {
          const isCorrect = i === correct;
          const isPicked = picked === i;
          return (
            <button
              key={i}
              type="button"
              disabled={revealed}
              onClick={() => setPicked(i)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
                !revealed && "hover:border-primary hover:bg-primary/5",
                revealed && isCorrect && "border-safe bg-safe/10",
                revealed && isPicked && !isCorrect && "border-primary bg-primary/10",
                revealed && !isCorrect && !isPicked && "opacity-60",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  revealed && isCorrect && "border-safe bg-safe text-safe-foreground",
                  revealed && isPicked && !isCorrect && "border-primary bg-primary text-primary-foreground",
                  !revealed && "border-border",
                )}
              >
                {revealed && isCorrect ? (
                  <Check className="h-3.5 w-3.5" />
                ) : revealed && isPicked && !isCorrect ? (
                  <X className="h-3.5 w-3.5" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="text-sm md:text-base">{choice}</span>
            </button>
          );
        })}
      </div>
      {revealed && explain && (
        <p className="mt-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Why: </span>
          {explain}
        </p>
      )}
    </div>
  );
}
