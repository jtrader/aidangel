import { Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const EmergencyBanner = () => {
  const { t } = useLanguage();

  return (
    <a
      href="tel:000"
      className="bg-primary px-4 py-3 flex items-center justify-center gap-3 text-primary-foreground hover:opacity-90 transition-opacity"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        <Phone className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-sm font-semibold leading-snug">{t("emergencyBanner")}</span>
    </a>
  );
};

export default EmergencyBanner;
