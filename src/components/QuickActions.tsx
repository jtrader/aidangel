import {
  Heart,
  Wind,
  Flame,
  Bug,
  Brain,
  Bone,
  Droplets,
  AlertTriangle,
  Thermometer,
  Eye,
  Zap,
  Pill,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuickAction {
  labelKey: "cpr" | "choking" | "burns" | "snakeBite" | "bleeding" | "fracture" | "seizure" | "anaphylaxis" | "heartAttack" | "hypothermia" | "eyeInjury" | "electricShock" | "overdose";
  icon: React.ReactNode;
  prompt: string;
}

const quickActions: QuickAction[] = [
  { labelKey: "cpr", icon: <Heart className="h-4 w-4" />, prompt: "How do I perform CPR on an adult?" },
  { labelKey: "choking", icon: <Wind className="h-4 w-4" />, prompt: "Someone is choking. What should I do?" },
  { labelKey: "burns", icon: <Flame className="h-4 w-4" />, prompt: "How do I treat a burn?" },
  { labelKey: "snakeBite", icon: <Bug className="h-4 w-4" />, prompt: "How do I treat a snake bite?" },
  { labelKey: "bleeding", icon: <Droplets className="h-4 w-4" />, prompt: "How do I stop severe bleeding?" },
  { labelKey: "fracture", icon: <Bone className="h-4 w-4" />, prompt: "How do I treat a broken bone?" },
  { labelKey: "seizure", icon: <Brain className="h-4 w-4" />, prompt: "Someone is having a seizure. What do I do?" },
  { labelKey: "anaphylaxis", icon: <AlertTriangle className="h-4 w-4" />, prompt: "How do I help someone having an anaphylactic reaction?" },
  { labelKey: "heartAttack", icon: <Heart className="h-4 w-4" />, prompt: "I think someone is having a heart attack. What should I do?" },
  { labelKey: "hypothermia", icon: <Thermometer className="h-4 w-4" />, prompt: "How do I treat hypothermia?" },
  { labelKey: "eyeInjury", icon: <Eye className="h-4 w-4" />, prompt: "How do I treat an eye injury?" },
  { labelKey: "electricShock", icon: <Zap className="h-4 w-4" />, prompt: "Someone got an electric shock. What do I do?" },
  { labelKey: "overdose", icon: <Pill className="h-4 w-4" />, prompt: "How do I help someone who has overdosed?" },
];

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
}

const QuickActions = ({ onSelect }: QuickActionsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
      {quickActions.map((action) => (
        <button
          key={action.labelKey}
          onClick={() => onSelect(action.prompt)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-card-foreground text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-150 cursor-pointer"
        >
          {action.icon}
          {t(action.labelKey)}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
