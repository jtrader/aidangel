import { Phone } from "lucide-react";

const EmergencyBanner = () => {
  return (
    <div className="bg-primary px-4 py-2 flex items-center justify-center gap-2 text-primary-foreground text-sm font-medium">
      <Phone className="h-3.5 w-3.5" />
      <span>In a life-threatening emergency, call <strong>Triple Zero (000)</strong> immediately</span>
    </div>
  );
};

export default EmergencyBanner;
