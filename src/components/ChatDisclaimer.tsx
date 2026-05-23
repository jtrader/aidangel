import { AlertTriangle, Stethoscope } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCountry } from "@/hooks/useCountry";
import { emergencyNumberForCountry } from "@/lib/donations";

/**
 * Persistent AI medical disclaimer shown below the chat input on every chat screen.
 * Visible on both the welcome screen and during active chat sessions.
 */
const ChatDisclaimer = () => {
  const { t, language } = useLanguage();
  const { code: countryCode } = useCountry();
  const emergencyNumber = emergencyNumberForCountry(countryCode);

  const baseDisclaimer = t("disclaimer");
  const aiNotice = language === "en"
    ? "This AI assistant provides general first-aid information only. It is not a substitute for professional medical diagnosis, treatment, or advice."
    : undefined;

  const renderDisclaimer = (text: string) => {
    const parts = text.split(/\b000\b/g);
    return parts.map((part, i, arr) => (
      <span key={i}>
        {part}
        {i < arr.length - 1 && (
          <a
            href={`tel:${emergencyNumber}`}
            className="underline font-semibold hover:text-foreground transition-colors"
          >
            {emergencyNumber}
          </a>
        )}
      </span>
    ));
  };

  return (
    <div className="mt-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
      <div className="flex items-start gap-2.5">
        <div className="flex-shrink-0 mt-0.5">
          <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="min-w-1 flex-1">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {aiNotice && (
              <span className="block mb-1">
                <Stethoscope className="h-3 w-3 inline-block -mt-0.5 mr-0.5 text-muted-foreground" aria-hidden="true" />
                {aiNotice}
              </span>
            )}
            {renderDisclaimer(baseDisclaimer)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatDisclaimer;
