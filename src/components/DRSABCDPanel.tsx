import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  MessageCircle,
  Phone,
  Wind,
  Activity,
  HeartPulse,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useLanguage, type TranslationKey } from "@/contexts/LanguageContext";

type Step = {
  letter: string;
  stepKey: string;
  labelKey: TranslationKey;
  shortLabelKey: TranslationKey;
  blurbKey: TranslationKey;
  icon: typeof ShieldAlert;
  prompt: string;
};

const steps: Step[] = [
  {
    letter: "D",
    stepKey: "D",
    labelKey: "drsLabelDanger",
    shortLabelKey: "drsLabelDanger",
    blurbKey: "drsBlurbDanger",
    icon: ShieldAlert,
    prompt: "Explain the Danger step in DRSABCD",
  },
  {
    letter: "R",
    stepKey: "R",
    labelKey: "drsLabelResponse",
    shortLabelKey: "drsLabelResponse",
    blurbKey: "drsBlurbResponse",
    icon: MessageCircle,
    prompt: "Explain the Response step in DRSABCD",
  },
  {
    letter: "S",
    stepKey: "S",
    labelKey: "drsLabelSend",
    shortLabelKey: "drsShortSend",
    blurbKey: "drsBlurbSend",
    icon: Phone,
    prompt: "Explain the Send for help step in DRSABCD",
  },
  {
    letter: "A",
    stepKey: "A",
    labelKey: "drsLabelAirway",
    shortLabelKey: "drsLabelAirway",
    blurbKey: "drsBlurbAirway",
    icon: Wind,
    prompt: "Explain the Airway step in DRSABCD",
  },
  {
    letter: "B",
    stepKey: "B",
    labelKey: "drsLabelBreathing",
    shortLabelKey: "drsLabelBreathing",
    blurbKey: "drsBlurbBreathing",
    icon: Activity,
    prompt: "Explain the Breathing step in DRSABCD",
  },
  {
    letter: "C",
    stepKey: "C",
    labelKey: "drsLabelCpr",
    shortLabelKey: "drsLabelCpr",
    blurbKey: "drsBlurbCpr",
    icon: HeartPulse,
    prompt: "Explain the CPR step in DRSABCD",
  },
  {
    letter: "D",
    stepKey: "AED",
    labelKey: "drsLabelDefib",
    shortLabelKey: "drsShortDefib",
    blurbKey: "drsBlurbDefib",
    icon: Zap,
    prompt: "Explain the Defibrillator step in DRSABCD",
  },
];

interface DRSABCDPanelProps {
  onSelect: (prompt: string) => void;
}

const DRSABCDPanel = ({ onSelect }: DRSABCDPanelProps) => {
  const [expanded, setExpanded] = useState(true);
  const { language, t } = useLanguage();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        {/* Header */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-destructive/10 via-primary/5 to-transparent hover:from-destructive/15 transition-colors"
          aria-expanded={expanded}
        >
          <span className="flex items-center gap-2.5">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
              <HeartPulse className="h-4 w-4" />
            </span>
            <span className="text-left">
              <span
                className="block font-display font-bold text-sm text-foreground leading-tight"
                lang={language}
              >
                {t("drsTitle")}
              </span>
              <span
                className="block text-[11px] text-muted-foreground"
                lang={language}
              >
                {t("drsSubtitle")}
              </span>
            </span>
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </button>

        {expanded && (
          <div className="p-3 sm:p-4 space-y-3">
            {/* Visual letter row */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const label = t(step.labelKey);
                return (
                  <Link
                    key={i}
                    to={`/cpr?step=${step.stepKey}`}
                    aria-label={`${step.letter} – ${label}`}
                    className="group flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-xl hover:bg-accent transition-colors"
                  >
                    <span className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground flex items-center justify-center font-display font-bold text-base sm:text-lg shadow-sm group-hover:scale-105 group-active:scale-95 transition-transform">
                      {step.letter}
                      <Icon className="absolute -bottom-1 -right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 bg-card text-destructive rounded-full p-0.5 border border-border" />
                    </span>
                    <span
                      className="text-[10px] sm:text-[11px] font-semibold text-foreground leading-tight text-center"
                      lang={language}
                    >
                      {t(step.shortLabelKey)}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Detail list */}
            <div className="space-y-1 pt-1 border-t border-border/60">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Link
                    key={i}
                    to={`/cpr?step=${step.stepKey}`}
                    className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-accent text-left transition-colors"
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center font-display font-bold text-sm">
                      {step.letter}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span
                        className="block text-sm font-semibold text-foreground leading-tight"
                        lang={language}
                      >
                        {t(step.labelKey)}
                      </span>
                      <span
                        className="block text-xs text-muted-foreground leading-tight"
                        lang={language}
                      >
                        {t(step.blurbKey)}
                      </span>
                    </span>
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </Link>
                );
              })}
            </div>

            {/* CTA */}
            <Link
              to="/cpr"
              className="w-full mt-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              lang={language}
            >
              <HeartPulse className="h-4 w-4" />
              {t("drsCta")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DRSABCDPanel;
