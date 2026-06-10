import { Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCountry } from "@/hooks/useCountry";
import { emergencyNumberForCountry } from "@/lib/donations";
import CallConfirmDialog from "@/components/shared/CallConfirmDialog";

const EmergencyBanner = () => {
  const { t } = useLanguage();
  const { code } = useCountry();
  const number = emergencyNumberForCountry(code);
  // Swap any "000" baked into translated strings for the country's number.
  // For non-Australian visitors, strip the Australia-specific "Triple Zero" wording.
  let label = t("emergencyBanner");
  if (code !== "AU") {
    // Remove "Triple Zero" with optional surrounding spaces/parens around 000.
    label = label
      .replace(/Triple Zero\s*\(?\s*000\s*\)?/gi, "000")
      .replace(/„000"/g, "000");
  }
  label = label.replace(/\b000\b/g, number);

  return (
    <CallConfirmDialog number={number}>
      <button
        type="button"
        className="w-full bg-primary px-4 py-3 flex items-center justify-center gap-3 text-primary-foreground hover:opacity-90 transition-opacity"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Phone className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold leading-snug">{label}</span>
      </button>
    </CallConfirmDialog>
  );
};

export default EmergencyBanner;
