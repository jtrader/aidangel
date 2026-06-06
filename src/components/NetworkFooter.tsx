interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

import { useEffect, useState, useCallback } from "react";
import { Download, X } from "lucide-react";
import rspLogo from "@/assets/rsp_logo.png.asset.json";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateStrings } from "@/lib/uiTranslate";
import { localizedPath } from "@/lib/i18n";
import DonateMenu from "@/components/DonateMenu";
import ShopMenu from "@/components/ShopMenu";
import LearnMenu from "@/components/LearnMenu";
import CountrySelector from "@/components/CountrySelector";
import LanguageSelector from "@/components/LanguageSelector";
import { HelpNetworkHandoff } from "@/components/shared/HelpNetworkHandoff";


const STATIC_STRINGS = [
  "Give",
  "St John First Aid Shop",
  "📖 Browse the First Aid Knowledge Base",
  "Emergency and Recovery Network",
  "© 2026 Love Key Web Application",
];

export default function NetworkFooter() {
  const { language } = useLanguage();
  const [tr, setTr] = useState({
    donate: "Give",
    shop: "St John First Aid Shop",
    browseKb: "📖 Browse the First Aid Knowledge Base",
    network: "Emergency and Recovery Network",
    copyright: "© 2026 Love Key Web Application",
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
      });
      return;
    }
    let cancelled = false;
    translateStrings(language, STATIC_STRINGS).then((s) => {
      if (cancelled) return;
      setTr({
        donate: s[0],
        shop: s[1],
        browseKb: s[2],
        network: s[3],
        copyright: s[4],
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
          <LanguageSelector />
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
        <div className="w-full pt-3">
          <HelpNetworkHandoff />
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pt-3 text-[11px] text-muted-foreground">
          <a href="/availability" className="hover:text-foreground hover:underline transition-colors">Availability</a>
          <span aria-hidden>·</span>
          <a href="/privacy" className="hover:text-foreground hover:underline transition-colors">Privacy Policy</a>
          <span aria-hidden>·</span>
          <a href="/terms" className="hover:text-foreground hover:underline transition-colors">Terms and Conditions</a>
          <span aria-hidden>·</span>
          <a href="/refund" className="hover:text-foreground hover:underline transition-colors">Refund Policy</a>
          <span aria-hidden>·</span>
          <a href="/medical-disclaimer" className="hover:text-foreground hover:underline transition-colors">Medical Disclaimer</a>
        </nav>
        <div className="flex flex-col items-center gap-3 mt-2">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label="View Respectful Synchronised Protocol logo"
                className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 hover:opacity-90 transition-opacity"
              >
                <img
                  src={rspLogo.url}
                  alt="Respectful Synchronised Protocol"
                  className="h-16 w-auto object-contain"
                  loading="lazy"
                />
              </button>
            </DialogTrigger>
            <DialogContent
              className="w-[calc(100vw-2rem)] max-w-md sm:max-w-lg flex flex-col items-center overflow-hidden rounded-2xl bg-card border border-border shadow-xl ring-1 ring-border/50 p-5 sm:p-6 motion-reduce:animate-none [&>button.right-4.top-4]:hidden"
            >
              <img
                src={rspLogo.url}
                alt="Respectful Synchronised Protocol"
                className="w-full h-auto max-h-[70vh] rounded-2xl object-contain ring-1 ring-primary/40"
              />
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="absolute top-3 right-3 inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <X className="h-7 w-7" aria-hidden="true" />
                </button>
              </DialogClose>
            </DialogContent>
          </Dialog>
          <p className="text-[11px] text-center">
            <a
              href="https://lovekeylink.com/rsp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:opacity-90 transition-opacity"
            >
              LoveKey RSP-aligned
            </a>
            <span className="text-muted-foreground"> — Ethical, privacy-conscious help routing under the Respectful Synchronised Protocol.</span>
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground text-center">
          © 2026 LoveKey. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
