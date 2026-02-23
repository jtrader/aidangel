import { useState } from "react";
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

const steps = [
  { letter: "D", label: "Danger", icon: <ShieldAlert className="h-4 w-4" />, prompt: "Explain the Danger step in DRSABCD" },
  { letter: "R", label: "Response", icon: <MessageCircle className="h-4 w-4" />, prompt: "Explain the Response step in DRSABCD" },
  { letter: "S", label: "Send for help", icon: <Phone className="h-4 w-4" />, prompt: "Explain the Send for help step in DRSABCD" },
  { letter: "A", label: "Airway", icon: <Wind className="h-4 w-4" />, prompt: "Explain the Airway step in DRSABCD" },
  { letter: "B", label: "Breathing", icon: <Activity className="h-4 w-4" />, prompt: "Explain the Breathing step in DRSABCD" },
  { letter: "C", label: "CPR", icon: <HeartPulse className="h-4 w-4" />, prompt: "Explain the CPR step in DRSABCD" },
  { letter: "D", label: "Defibrillator", icon: <Zap className="h-4 w-4" />, prompt: "Explain the Defibrillator step in DRSABCD" },
];

interface DRSABCDPanelProps {
  onSelect: (prompt: string) => void;
}

const DRSABCDPanel = ({ onSelect }: DRSABCDPanelProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-card-foreground hover:bg-accent transition-colors"
      >
        <span className="flex items-center gap-2 font-display font-bold text-sm tracking-wide">
          <HeartPulse className="h-4 w-4 text-destructive" />
          DRSABCD Quick Guide
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="mt-2 grid grid-cols-1 gap-1.5">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => onSelect(step.prompt)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-left"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-display font-bold text-xs">
                {step.letter}
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                {step.icon}
                {step.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DRSABCDPanel;
