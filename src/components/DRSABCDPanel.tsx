import { useEffect, useState } from "react";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { translateStrings } from "@/lib/uiTranslate";

const steps = [
  {
    letter: "D",
    stepKey: "D",
    label: "Danger",
    shortLabel: "Danger",
    blurb: "Check the scene is safe",
    icon: ShieldAlert,
    prompt: "Explain the Danger step in DRSABCD",
  },
  {
    letter: "R",
    stepKey: "R",
    label: "Response",
    shortLabel: "Response",
    blurb: "Talk & touch — any reply?",
    icon: MessageCircle,
    prompt: "Explain the Response step in DRSABCD",
  },
  {
    letter: "S",
    stepKey: "S",
    label: "Send for help",
    shortLabel: "Send",
    blurb: "Call 000 right away",
    icon: Phone,
    prompt: "Explain the Send for help step in DRSABCD",
  },
  {
    letter: "A",
    stepKey: "A",
    label: "Airway",
    shortLabel: "Airway",
    blurb: "Open & clear the airway",
    icon: Wind,
    prompt: "Explain the Airway step in DRSABCD",
  },
  {
    letter: "B",
    stepKey: "B",
    label: "Breathing",
    shortLabel: "Breathing",
    blurb: "Look, listen, feel",
    icon: Activity,
    prompt: "Explain the Breathing step in DRSABCD",
  },
  {
    letter: "C",
    stepKey: "C",
    label: "CPR",
    shortLabel: "CPR",
    blurb: "30 compressions : 2 breaths",
    icon: HeartPulse,
    prompt: "Explain the CPR step in DRSABCD",
  },
  {
    letter: "D",
    stepKey: "AED",
    label: "Defibrillator",
    shortLabel: "Defib",
    blurb: "Attach AED & follow prompts",
    icon: Zap,
    prompt: "Explain the Defibrillator step in DRSABCD",
  },
];

const HEADER_TITLE = "DRSABCD Action Plan";
const HEADER_SUB = "Tap any letter for a guided walk-through";
const CTA_LABEL = "Start full walk-through";
const CTA_PROMPT = "Start the DRSABCD walk-through now — one step at a time.";

interface DRSABCDPanelProps {
  onSelect: (prompt: string) => void;
}

const DRSABCDPanel = ({ onSelect }: DRSABCDPanelProps) => {
  const [expanded, setExpanded] = useState(true);
  const { language } = useLanguage();

  const [tr, setTr] = useState({
    title: HEADER_TITLE,
    sub: HEADER_SUB,
    cta: CTA_LABEL,
    labels: steps.map((s) => s.label),
    shortLabels: steps.map((s) => s.shortLabel),
    blurbs: steps.map((s) => s.blurb),
  });

  useEffect(() => {
    if (language === "en") {
      setTr({
        title: HEADER_TITLE,
        sub: HEADER_SUB,
        cta: CTA_LABEL,
        labels: steps.map((s) => s.label),
        shortLabels: steps.map((s) => s.shortLabel),
        blurbs: steps.map((s) => s.blurb),
      });
      return;
    }
    let cancelled = false;
    const labels = steps.map((s) => s.label);
    const shortLabels = steps.map((s) => s.shortLabel);
    const blurbs = steps.map((s) => s.blurb);
    const chrome = [HEADER_TITLE, HEADER_SUB, CTA_LABEL];
    Promise.all([
      translateStrings(language, labels),
      translateStrings(language, shortLabels),
      translateStrings(language, blurbs),
      translateStrings(language, chrome),
    ]).then(([tLabels, tShort, tBlurbs, tChrome]) => {
      if (cancelled) return;
      setTr({
        title: tChrome[0] ?? HEADER_TITLE,
        sub: tChrome[1] ?? HEADER_SUB,
        cta: tChrome[2] ?? CTA_LABEL,
        labels: tLabels,
        shortLabels: tShort,
        blurbs: tBlurbs,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [language]);

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
                {tr.title}
              </span>
              <span
                className="block text-[11px] text-muted-foreground"
                lang={language}
              >
                {tr.sub}
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
                return (
                  <Link
                    key={i}
                    to={`/cpr?step=${step.stepKey}`}
                    aria-label={`${step.letter} – ${tr.labels[i]} — open Live CPR Guide`}
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
                      {tr.shortLabels[i]}
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
                        {tr.labels[i]}
                      </span>
                      <span
                        className="block text-xs text-muted-foreground leading-tight"
                        lang={language}
                      >
                        {tr.blurbs[i]}
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
              {tr.cta}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DRSABCDPanel;
