import { useEffect, useState } from "react";
import { Heart, X } from "lucide-react";
import DonateMenu from "@/components/DonateMenu";
import ShopMenu from "@/components/ShopMenu";
import { useEngagementCTA } from "@/hooks/useEngagementCTA";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateStrings } from "@/lib/uiTranslate";

const STATIC = ["Support us", "Dismiss"];

/**
 * Engagement-triggered support strip: appears below the page title once the
 * user has interacted, dwelled, scrolled, or shown exit intent. Includes the
 * country-aware DonateMenu + ShopMenu and a dismiss control.
 */
export default function SupportUsBar() {
  const { visible, dismiss } = useEngagementCTA();
  const { language } = useLanguage();
  const [tr, setTr] = useState({ support: "Support us", dismiss: "Dismiss" });

  useEffect(() => {
    if (language === "en") {
      setTr({ support: STATIC[0], dismiss: STATIC[1] });
      return;
    }
    let cancelled = false;
    translateStrings(language, STATIC).then((s) => {
      if (cancelled) return;
      setTr({ support: s[0], dismiss: s[1] });
    });
    return () => { cancelled = true; };
  }, [language]);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={tr.support}
      className="border-b border-border bg-accent/30 px-4 py-2 animate-fade-in"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 flex-wrap">
        <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Heart className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>{tr.support}</span>
        </div>
        <div className="flex items-center gap-2">
          <DonateMenu variant="header" />
          <ShopMenu variant="header" />
          <button
            type="button"
            onClick={dismiss}
            aria-label={tr.dismiss}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
