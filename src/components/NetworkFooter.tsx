import { useEffect, useState } from "react";
import { Heart, HandHeart, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateStrings } from "@/lib/uiTranslate";
import { localizedPath } from "@/lib/i18n";

type NetworkLink = {
  href: string;
  label: string;
  description: string;
};

const NETWORK_LINKS: NetworkLink[] = [
  { href: "https://firstaidangel.lovekeyring.org", label: "First Aid Angel", description: "quick first aid guidance" },
  { href: "https://aidangel.lovekeyring.org", label: "Aid Angel", description: "financial support navigator" },
  { href: "https://guardianguide.lovekeyring.org", label: "Guardian Guide", description: "mental health support finder" },
  { href: "https://crisiscompass.lovekeyring.org", label: "Crisis Compass", description: "navigate emergencies" },
  { href: "https://lovekeyring.org", label: "Love Key Hub", description: "all our companion apps" },
];

const STATIC_STRINGS = [
  "Donate",
  "St John First Aid Shop",
  "📖 Browse the First Aid Knowledge Base",
  "Emergency and Recovery Network",
  "© 2026 Love Key Web Application",
];

interface NetworkFooterProps {
  currentApp?: string;
}

export default function NetworkFooter({ currentApp = "Aid Angel" }: NetworkFooterProps) {
  const { language } = useLanguage();
  const [tr, setTr] = useState({
    donate: "Donate",
    shop: "St John First Aid Shop",
    browseKb: "📖 Browse the First Aid Knowledge Base",
    network: "Emergency and Recovery Network",
    copyright: "© 2026 Love Key Web Application",
    descriptions: NETWORK_LINKS.map((l) => l.description),
  });

  useEffect(() => {
    if (language === "en") {
      setTr({
        donate: "Donate",
        shop: "St John First Aid Shop",
        browseKb: "📖 Browse the First Aid Knowledge Base",
        network: "Emergency and Recovery Network",
        copyright: "© 2026 Love Key Web Application",
        descriptions: NETWORK_LINKS.map((l) => l.description),
      });
      return;
    }
    let cancelled = false;
    const descs = NETWORK_LINKS.map((l) => l.description);
    Promise.all([
      translateStrings(language, STATIC_STRINGS),
      translateStrings(language, descs),
    ]).then(([s, d]) => {
      if (cancelled) return;
      setTr({
        donate: s[0],
        shop: s[1],
        browseKb: s[2],
        network: s[3],
        copyright: s[4],
        descriptions: d,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [language]);

  const kbHref = localizedPath(language, "/kb");

  return (
    <footer className="border-t border-border bg-card px-4 py-6">
      <div className="max-w-lg mx-auto flex flex-col items-center gap-2 text-sm text-muted-foreground" lang={language}>
        <div className="flex flex-wrap items-center justify-center gap-2 pb-4">
          <a
            href="https://www.stjohnvic.com.au/support-us/donations-2016-12/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            aria-label="Donate to St John Ambulance"
          >
            <HandHeart className="h-4 w-4" />
            {tr.donate}
          </a>
          <a
            href="https://shop.stjohn.org.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            aria-label="St John First Aid Shop"
          >
            <ShoppingBag className="h-4 w-4" />
            {tr.shop}
          </a>
        </div>
        <div className="pb-2">
          <a href={kbHref} className="text-xs font-semibold text-primary hover:underline">
            {tr.browseKb}
          </a>
        </div>
        <div className="w-full pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground mb-2 text-center">
            {tr.network}
          </h2>
          <ul className="flex flex-col items-center gap-1 text-xs">
            {NETWORK_LINKS.map((link, i) =>
              link.label === currentApp ? (
                <li key={link.href}>
                  <strong className="font-bold text-foreground">
                    {link.label} — {tr.descriptions[i]}
                  </strong>
                </li>
              ) : (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label} — {tr.descriptions[i]}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
        <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 mt-2">
          {tr.copyright} <Heart className="h-3 w-3 inline" />
        </p>
      </div>
    </footer>
  );
}
