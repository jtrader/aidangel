import { AlertTriangle, Info, Lightbulb, ShieldAlert, Sparkles, CheckCircle2, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type CalloutType = "danger" | "warning" | "tip" | "remember" | "did-you-know" | "info" | "success";

const CONFIG: Record<CalloutType, {
  label: string;
  Icon: typeof Info;
  wrap: string;
  iconWrap: string;
  title: string;
}> = {
  danger: {
    label: "Danger",
    Icon: ShieldAlert,
    wrap: "border-l-4 border-primary bg-primary/5",
    iconWrap: "bg-primary text-primary-foreground",
    title: "text-primary",
  },
  warning: {
    label: "Caution",
    Icon: AlertTriangle,
    wrap: "border-l-4 border-warning bg-warning/10",
    iconWrap: "bg-warning text-warning-foreground",
    title: "text-warning",
  },
  tip: {
    label: "Tip",
    Icon: Lightbulb,
    wrap: "border-l-4 border-safe bg-safe/10",
    iconWrap: "bg-safe text-safe-foreground",
    title: "text-safe",
  },
  remember: {
    label: "Remember",
    Icon: BookmarkCheck,
    wrap: "border-l-4 border-foreground/40 bg-muted",
    iconWrap: "bg-foreground text-background",
    title: "text-foreground",
  },
  "did-you-know": {
    label: "Did you know?",
    Icon: Sparkles,
    wrap: "border-l-4 border-accent-foreground/40 bg-accent",
    iconWrap: "bg-accent-foreground/80 text-accent",
    title: "text-accent-foreground",
  },
  info: {
    label: "Note",
    Icon: Info,
    wrap: "border-l-4 border-border bg-secondary",
    iconWrap: "bg-secondary-foreground/80 text-secondary",
    title: "text-foreground",
  },
  success: {
    label: "Good to go",
    Icon: CheckCircle2,
    wrap: "border-l-4 border-safe bg-safe/10",
    iconWrap: "bg-safe text-safe-foreground",
    title: "text-safe",
  },
};

interface Props {
  type?: string;
  title?: string;
  children?: ReactNode;
}

export default function Callout({ type = "info", title, children }: Props) {
  const cfg = CONFIG[(type as CalloutType)] ?? CONFIG.info;
  const { Icon } = cfg;
  return (
    <div className={cn("not-prose my-5 flex gap-3 rounded-xl p-4 md:p-5", cfg.wrap)}>
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", cfg.iconWrap)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("font-display text-sm font-semibold uppercase tracking-wide", cfg.title)}>
          {title || cfg.label}
        </p>
        <div className="prose prose-sm md:prose-base mt-1 max-w-none text-foreground/90">
          {children}
        </div>
      </div>
    </div>
  );
}
