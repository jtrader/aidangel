// Donate pill — opens a comprehensive donate dialog (mobile: bottom sheet,
// desktop: centered dialog) mirroring the Shop dialogue. Picks amount,
// frequency, NGO, country and deep-links to the NGO donate page with
// amount/frequency hints. See src/components/donate/DonateDialogContent.tsx.

import { useEffect, useState } from "react";
import { HandHeart, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { useCountry } from "@/hooks/useCountry";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { CountryCode, NgoId } from "@/lib/donations";
import { translateStrings } from "@/lib/uiTranslate";
import { DonateDialogContent } from "@/components/donate/DonateDialogContent";

interface DonateMenuProps {
  variant?: "header" | "footer";
  /** Restrict to a single NGO (e.g. on a CPR topic). Defaults to all. */
  ngos?: NgoId[];
}

const STATIC = [
  "Give",
  "Donate",
  "Make a donation",
  "100% of your gift goes to St John Ambulance.",
  "Choose an amount",
  "Other amount",
  "One-time",
  "Monthly",
  "Choose a charity",
  "Donate",
  "national site",
  "International site",
  "Change country",
  "Showing donation options for",
  "Close",
];

export default function DonateMenu({ variant = "header", ngos }: DonateMenuProps) {
  const { country, setCountry } = useCountry();
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const [tr, setTr] = useState({
    give: STATIC[0],
    donate: STATIC[1],
    heading: STATIC[2],
    subhead: STATIC[3],
    amountLabel: STATIC[4],
    custom: STATIC[5],
    once: STATIC[6],
    monthly: STATIC[7],
    chooseNgo: STATIC[8],
    donateCta: STATIC[9],
    nationalSite: STATIC[10],
    internationalSite: STATIC[11],
    changeCountry: STATIC[12],
    showing: STATIC[13],
    close: STATIC[14],
  });

  useEffect(() => {
    if (language === "en") return;
    let cancelled = false;
    translateStrings(language, STATIC).then((s) => {
      if (cancelled) return;
      setTr({
        give: s[0], donate: s[1], heading: s[2], subhead: s[3],
        amountLabel: s[4], custom: s[5], once: s[6], monthly: s[7],
        chooseNgo: s[8], donateCta: s[9], nationalSite: s[10],
        internationalSite: s[11], changeCountry: s[12], showing: s[13],
        close: s[14],
      });
    });
    return () => { cancelled = true; };
  }, [language]);

  const triggerClasses =
    "inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors";

  const Trigger = (
    <button
      type="button"
      className={triggerClasses}
      aria-label={`${tr.give} — ${country.name}`}
      data-analytics-event="donate_pill_click"
    >
      <HandHeart className="h-4 w-4" aria-hidden="true" />
      <span className="sm:hidden" aria-hidden="true">{tr.give}</span>
      <span className="hidden sm:inline" aria-hidden="true">{tr.donate}</span>
    </button>
  );

  const Body = (
    <>
      <DonateDialogContent
        country={country}
        onCountryChange={(code) => setCountry(code as CountryCode)}
        language={language}
        variant={variant}
        labels={tr}
      />
      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex items-center justify-center h-11 px-8 rounded-full bg-muted text-foreground text-sm font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
        >
          {tr.close}
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{Trigger}</DrawerTrigger>
        <DrawerContent
          className="max-h-[92vh] bg-card border-border focus:outline-none overflow-hidden"
          lang={language}
        >
          <div className="px-4 pt-4 pb-[max(env(safe-area-inset-bottom),1.25rem)] overflow-y-auto overflow-x-hidden">
            {Body}
          </div>
          <DrawerClose asChild>
            <button
              type="button"
              aria-label={tr.close}
              className="absolute top-3 right-3 inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <X className="h-7 w-7" aria-hidden="true" />
            </button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent
        className="w-[calc(100vw-2rem)] max-w-md sm:max-w-lg max-h-[88vh] flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-xl ring-1 ring-border/50 p-5 sm:p-6 motion-reduce:animate-none [&>button.right-4.top-4]:hidden"
        lang={language}
      >
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          {Body}
        </div>
        <DialogClose asChild>
          <button
            type="button"
            aria-label={tr.close}
            className="absolute top-3 right-3 inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <X className="h-7 w-7" aria-hidden="true" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
