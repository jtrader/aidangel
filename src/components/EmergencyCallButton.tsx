import { Phone } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useCountry } from "@/hooks/useCountry";
import { emergencyNumberForCountry } from "@/lib/donations";

interface EmergencyCallButtonProps {
  variant?: "floating" | "inline";
}

const EmergencyCallButton = ({ variant = "floating" }: EmergencyCallButtonProps) => {
  const { code } = useCountry();
  const number = emergencyNumberForCountry(code);
  const { pathname } = useLocation();
  const isAedFinder = pathname === "/aed-finder";

  if (variant === "inline") {
    return (
      <a
        href={`tel:${number}`}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-destructive px-4 py-3 text-destructive-foreground font-bold text-base shadow-md hover:bg-destructive/90 transition"
      >
        <Phone className="h-5 w-5" />
        Emergency — call {number}
      </a>
    );
  }

  return (
    <a
      href={`tel:${number}`}
      className={`fixed z-50 inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-3 text-destructive-foreground font-bold text-sm shadow-lg hover:bg-destructive/90 transition-all hover:scale-105 animate-pulse-slow ${
        isAedFinder
          ? "bottom-6 left-1/2 -translate-x-1/2"
          : "bottom-6 right-6"
      }`}
      aria-label={`Call emergency number ${number}`}
      title={`Call emergency number ${number}`}
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
      </span>
      <Phone className="h-4 w-4" />
      <span className="hidden sm:inline">Call {number}</span>
    </a>
  );
};

export default EmergencyCallButton;
