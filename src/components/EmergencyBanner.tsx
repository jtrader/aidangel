import { Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const EmergencyBanner = () => {
  const { t } = useLanguage();

  return (
    <a
      href="tel:000"
      className="bg-primary px-4 py-2 flex items-center justify-center gap-2 text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
    >
      <Phone className="h-3.5 w-3.5" />
      <span>{t("emergencyBanner")}</span>
    </a>
  );
};

export default EmergencyBanner;
