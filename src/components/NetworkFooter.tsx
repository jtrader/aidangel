interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

import { useEffect, useState, useCallback } from "react";
import { Heart, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateStrings } from "@/lib/uiTranslate";
import { localizedPath } from "@/lib/i18n";
import DonateMenu from "@/components/DonateMenu";
import ShopMenu from "@/components/ShopMenu";
import LearnMenu from "@/components/LearnMenu";
import CountrySelector from "@/components/CountrySelector";

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
  "Give",
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
    donate: "Give",
    shop: "St John First Aid Shop",
    browseKb: "📖 Browse the First Aid Knowledge Base",
    network: "Emergency and Recovery Network",
    copyright: "© 2026 Love Key Web Application",
    descriptions: NETWORK_LINKS.map((l) => l.description),
  });
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installVisible, setInstallVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setInstallVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
    setInstallVisible(false);
  }, [installPrompt]);

  useEffect(() => {
    if (language === "en") {
      setTr({
        donate: "Give",
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
          <DonateMenu variant="footer" />
          <ShopMenu variant="footer" />
          <LearnMenu variant="footer" />
        </div>
        <div className="flex items-center justify-center gap-2 pb-2">
          <CountrySelector />
          {installVisible && (
            <button
              onClick={handleInstall}
              className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
              type="button"
            >
              <Download className="h-3.5 w-3.5" />
              Install app
            </button>
          )}
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
