import { useState } from "react";
import {
  Check,
  X,
  Power,
  Shirt,
  Droplets,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionItem {
  icon: React.ReactNode;
  title: string;
  image?: string;
}

const actions: ActionItem[] = [
  { icon: <Power className="h-5 w-5" />, title: "Turn the AED on" },
  {
    icon: <Shirt className="h-5 w-5" />,
    title: "Expose the person's chest",
    image: "/assets/expose-dry-chest.svg",
  },
  { icon: <Droplets className="h-5 w-5" />, title: "Dry the chest if it's wet" },
];

const choices = [
  { key: "A", text: "It is a legal requirement before using an AED." },
  { key: "B", text: "It tells bystanders the person has woken up." },
  {
    key: "C",
    text: "Anyone touching the person could be shocked or interfere with the heart-rhythm analysis.",
  },
];
const CORRECT = "C";

export default function LessonRenderer() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [picked, setPicked] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const toggleStep = (i: number) =>
    setDone((p) => ({ ...p, [i]: !p[i] }));

  const isCorrect = picked === CORRECT;
  const isWrong = picked !== null && !isCorrect;

  return (
    <div className="min-h-screen bg-muted/40 py-8 px-4">
      <article className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <header className="space-y-2">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Lesson 4 of 4
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight text-foreground">
            Using an AED
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Follow these steps to safely deliver a shock with an Automated External Defibrillator.
          </p>
        </header>

        {/* Interactive Steps */}
        <section className="rounded-2xl border bg-card p-4 md:p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold mb-4 text-foreground">
            Quick action steps
          </h2>
          <ol className="space-y-3">
            {actions.map((a, i) => {
              const checked = !!done[i];
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => toggleStep(i)}
                    aria-pressed={checked}
                    className={cn(
                      "group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all",
                      checked
                        ? "border-foreground/20 bg-foreground/[0.04]"
                        : "border-border bg-background hover:border-primary hover:shadow-md",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold transition-colors",
                        checked
                          ? "bg-foreground text-background"
                          : "bg-primary/10 text-primary",
                      )}
                    >
                      {checked ? <Check className="h-5 w-5" /> : i + 1}
                    </span>
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-2 text-foreground">
                        <span
                          className={cn(
                            "transition-colors",
                            checked ? "text-foreground/70" : "text-primary",
                          )}
                        >
                          {a.icon}
                        </span>
                        <p
                          className={cn(
                            "font-medium text-base md:text-lg",
                            checked && "line-through text-foreground/70",
                          )}
                        >
                          {a.title}
                        </p>
                      </div>
                      {a.image && (
                        <div className="overflow-hidden rounded-lg border bg-muted">
                          <img
                            src={a.image}
                            alt={a.title}
                            className="w-full h-auto object-contain"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Warning Rail */}
        <aside
          role="alert"
          className="relative overflow-hidden rounded-2xl bg-card shadow-sm border border-primary/20"
        >
          <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-primary" />
          <div className="flex gap-4 p-5 pl-7">
            <img
              src="/assets/warning-badge.png"
              alt=""
              aria-hidden
              width={40}
              height={40}
              loading="lazy"
              className="h-10 w-10 shrink-0"
              onError={(e) => {
                // Graceful fallback if the badge asset is missing
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="space-y-1">
              <p className="font-display text-xs font-bold uppercase tracking-wider text-primary inline-flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Look for the pictures
              </p>
              <p className="text-sm md:text-base text-foreground leading-relaxed">
                The AED pads will have clear pictures showing where to stick them.
              </p>
            </div>
          </div>
        </aside>

        {/* Quiz Card */}
        <section
          className={cn(
            "rounded-2xl border-2 bg-card p-5 md:p-6 shadow-sm transition-colors",
            isCorrect ? "border-safe/40" : "border-primary/20",
          )}
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HelpCircle className="h-4 w-4" />
            </div>
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-primary">
              Knowledge check
            </p>
          </div>
          <p className="font-display text-base md:text-lg font-semibold text-foreground mb-4">
            Why should you call out "STAND CLEAR" before letting the AED analyse or deliver a shock?
          </p>
          <div className="space-y-2">
            {choices.map((c) => {
              const isThisCorrect = c.key === CORRECT;
              const isPicked = picked === c.key;
              const showCorrect = picked !== null && isThisCorrect;
              const showWrong = isPicked && !isThisCorrect;
              return (
                <button
                  key={c.key}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => setPicked(c.key)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border p-3 md:p-4 text-left transition-all",
                    picked === null && "hover:border-primary hover:bg-primary/5",
                    showCorrect && "border-safe bg-safe/10 animate-in fade-in",
                    showWrong && "border-primary bg-primary/10",
                    picked !== null && !isThisCorrect && !isPicked && "opacity-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                      showCorrect && "border-safe bg-safe text-safe-foreground",
                      showWrong && "border-primary bg-primary text-primary-foreground",
                      picked === null && "border-border text-foreground",
                      picked !== null && !isThisCorrect && !isPicked && "border-border text-muted-foreground",
                    )}
                  >
                    {showCorrect ? (
                      <Check className="h-4 w-4" />
                    ) : showWrong ? (
                      <X className="h-4 w-4" />
                    ) : (
                      c.key
                    )}
                  </span>
                  <span className="text-sm md:text-base text-foreground leading-relaxed">
                    {c.text}
                  </span>
                </button>
              );
            })}
          </div>

          {isCorrect && (
            <div className="mt-4 rounded-lg border border-safe/40 bg-safe/10 p-4 text-sm text-foreground">
              <p>
                <span className="font-semibold text-safe">Correct.</span> Touching the person during
                analysis or a shock can interfere with the rhythm reading and put rescuers at risk.
              </p>
            </div>
          )}

          {isWrong && (
            <div className="mt-4 rounded-lg border border-primary/40 bg-primary/10 p-4 text-sm text-foreground">
              <p>
                <span className="font-semibold text-primary">Not quite.</span> Re-read the options
                and think about rescuer safety during shock delivery.
              </p>
              <button
                type="button"
                onClick={() => setPicked(null)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          )}

          <div className="mt-5 flex items-center justify-end">
            <button
              type="button"
              disabled={!isCorrect}
              onClick={() => setCompleted(true)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-display text-sm font-semibold transition-all",
                isCorrect
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed",
              )}
            >
              {completed ? "Lesson complete" : "Mark complete & next"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </article>
    </div>
  );
}
