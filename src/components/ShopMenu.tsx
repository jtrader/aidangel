// Header/footer "Shop" pill. Navigates directly to the in-house shop page
// (/shop) where the visitor sees a regional kit carousel and our store grid.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateStrings } from "@/lib/uiTranslate";

interface ShopMenuProps {
  variant?: "header" | "footer";
}

export default function ShopMenu({ variant = "footer" }: ShopMenuProps) {
  const { language } = useLanguage();
  const [label, setLabel] = useState("Shop");

  useEffect(() => {
    if (language === "en") {
      setLabel("Shop");
      return;
    }
    let cancelled = false;
    translateStrings(language, ["Shop"]).then((s) => {
      if (!cancelled) setLabel(s[0] ?? "Shop");
    });
    return () => { cancelled = true; };
  }, [language]);

  const classes = variant === "header"
    ? "inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
    : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors";

  return (
    <Link to="/shop" className={classes} aria-label={label} data-analytics-event="shop_pill_click">
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
