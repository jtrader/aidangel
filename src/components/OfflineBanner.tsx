import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCountry } from "@/hooks/useCountry";
import { emergencyNumberForCountry } from "@/lib/donations";

export default function OfflineBanner() {
  const online = useOnlineStatus();
  const { t } = useLanguage();
  const { code } = useCountry();
  const number = emergencyNumberForCountry(code);

  if (online) return null;

  // Substitute {number} with a clickable tel: link
  const template = t("offlineBanner");
  const parts = template.split("{number}");

  return (
    <div
      role="status"
      className="fixed top-0 inset-x-0 z-[60] bg-amber-500 text-amber-950 text-xs sm:text-sm px-3 py-1.5 flex items-center justify-center gap-2 shadow-sm"
    >
      <WifiOff className="h-3.5 w-3.5" />
      <span>
        {parts[0]}
        <a href={`tel:${number}`} className="underline font-bold">{number}</a>
        {parts[1] ?? ""}
      </span>
    </div>
  );
}
