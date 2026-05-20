import { Heart, HandHeart, ShoppingBag } from "lucide-react";

type NetworkLink = {
  href: string;
  label: string;
  description: string;
};

const NETWORK_LINKS: NetworkLink[] = [
  {
    href: "https://firstaidangel.lovekeyring.org",
    label: "First Aid Angel",
    description: "quick first aid guidance",
  },
  {
    href: "https://aidangel.lovekeyring.org",
    label: "Aid Angel",
    description: "financial support navigator",
  },
  {
    href: "https://guardianguide.lovekeyring.org",
    label: "Guardian Guide",
    description: "mental health support finder",
  },
  {
    href: "https://crisiscompass.lovekeyring.org",
    label: "Crisis Compass",
    description: "navigate emergencies",
  },
  {
    href: "https://lovekeyring.org",
    label: "Love Key Hub",
    description: "all our companion apps",
  },
];

interface NetworkFooterProps {
  /** Label of the current app — rendered as bold, non-linked text. Defaults to "Aid Angel". */
  currentApp?: string;
}

export default function NetworkFooter({ currentApp = "Aid Angel" }: NetworkFooterProps) {
  return (
    <footer className="border-t border-border bg-card px-4 py-6">
      <div className="max-w-lg mx-auto flex flex-col items-center gap-2 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-center gap-2 pb-4">
          <a
            href="https://www.stjohnvic.com.au/support-us/donations-2016-12/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            aria-label="Donate to St John Ambulance"
          >
            <HandHeart className="h-4 w-4" />
            Donate
          </a>
          <a
            href="https://shop.stjohn.org.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            aria-label="St John First Aid Shop"
          >
            <ShoppingBag className="h-4 w-4" />
            St John First Aid Shop
          </a>
        </div>
        <div className="pb-2">
          <a
            href="/kb"
            className="text-xs font-semibold text-primary hover:underline"
          >
            📖 Browse the First Aid Knowledge Base
          </a>
        </div>
        <div className="w-full pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground mb-2 text-center">
            Emergency and Recovery Network
          </h2>
          <ul className="flex flex-col items-center gap-1 text-xs">
            {NETWORK_LINKS.map((link) =>
              link.label === currentApp ? (
                <li key={link.href}>
                  <strong className="font-bold text-foreground">
                    {link.label} — {link.description}
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
                    {link.label} — {link.description}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
        <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 mt-2">
          © 2026 Love Key Web Application <Heart className="h-3 w-3 inline" />
        </p>
      </div>
    </footer>
  );
}
