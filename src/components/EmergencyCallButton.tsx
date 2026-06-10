import { Phone } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useCountry } from "@/hooks/useCountry";
import { emergencyNumberForCountry } from "@/lib/donations";
import CallConfirmDialog from "@/components/shared/CallConfirmDialog";

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
      <CallConfirmDialog number={number}>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-destructive px-4 py-3 text-destructive-foreground font-bold text-base shadow-md hover:bg-destructive/90 transition"
        >
          <Phone className="h-5 w-5" />
          Emergency — call {number}
        </button>
      </CallConfirmDialog>
    );
  }

  return (
    <CallConfirmDialog number={number}>
      <button
        type="button"
        className={`fixed z-50 inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-3 text-destructive-foreground font-bold text-sm shadow-lg hover:bg-destructive/90 transition-all hover:scale-105 animate-pulse-slow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
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
      </button>
    </CallConfirmDialog>
  );
};

export default EmergencyCallButton;
