import {
  Heart,
  Wind,
  Flame,
  Bug,
  Brain,
  Bone,
  Droplets,
  AlertTriangle,
  Baby,
  Thermometer,
  Eye,
  Zap,
} from "lucide-react";

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  prompt: string;
}

const quickActions: QuickAction[] = [
  { label: "CPR", icon: <Heart className="h-4 w-4" />, prompt: "How do I perform CPR on an adult?" },
  { label: "Choking", icon: <Wind className="h-4 w-4" />, prompt: "Someone is choking. What should I do?" },
  { label: "Burns", icon: <Flame className="h-4 w-4" />, prompt: "How do I treat a burn?" },
  { label: "Snake Bite", icon: <Bug className="h-4 w-4" />, prompt: "How do I treat a snake bite?" },
  { label: "Bleeding", icon: <Droplets className="h-4 w-4" />, prompt: "How do I stop severe bleeding?" },
  { label: "Fracture", icon: <Bone className="h-4 w-4" />, prompt: "How do I treat a broken bone?" },
  { label: "Seizure", icon: <Brain className="h-4 w-4" />, prompt: "Someone is having a seizure. What do I do?" },
  { label: "Anaphylaxis", icon: <AlertTriangle className="h-4 w-4" />, prompt: "How do I help someone having an anaphylactic reaction?" },
  { label: "Heart Attack", icon: <Heart className="h-4 w-4" />, prompt: "I think someone is having a heart attack. What should I do?" },
  { label: "Hypothermia", icon: <Thermometer className="h-4 w-4" />, prompt: "How do I treat hypothermia?" },
  { label: "Eye Injury", icon: <Eye className="h-4 w-4" />, prompt: "How do I treat an eye injury?" },
  { label: "Electric Shock", icon: <Zap className="h-4 w-4" />, prompt: "Someone got an electric shock. What do I do?" },
];

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
}

const QuickActions = ({ onSelect }: QuickActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
      {quickActions.map((action) => (
        <button
          key={action.label}
          onClick={() => onSelect(action.prompt)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-card-foreground text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-150 cursor-pointer"
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
