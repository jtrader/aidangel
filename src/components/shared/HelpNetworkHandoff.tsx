// Shared HelpNetworkHandoff — links out to the four LoveKey HELP Network
// sister sites, preserving the user's active language via buildHandoffUrl.
// Hidden during immediate-danger contexts so it doesn't distract active crises.
import { useLanguage } from "@/contexts/LanguageContext";
import { TARGETS, buildHandoffUrl, type SisterSite } from "@/lib/localeCodes";

export interface HelpNetworkHandoffProps {
  /** When true, the handoff is hidden (e.g. user is in immediate danger). */
  immediateDanger?: boolean;
}

type NetworkSite = {
  key: SisterSite;
  label: string;
  description: string;
  stage: string;
};

const NETWORK_SITES: NetworkSite[] = [
  {
    key: "crisiscompass",
    label: "Crisis Compass",
    description: "Emergency guidance for active crises",
    stage: "Respond",
  },
  {
    key: "aidangel",
    label: "Aid Angel",
    description: "Recovery support after disaster",
    stage: "Recover",
  },
  {
    key: "guardianguide",
    label: "Guardian Guide",
    description: "Mental health and emotional support",
    stage: "Heal",
  },
  {
    key: "loveKeyLink",
    label: "LoveKey",
    description: "Connect with the full HELP Network",
    stage: "Coordinate",
  },
];

export function HelpNetworkHandoff({ immediateDanger = false }: HelpNetworkHandoffProps) {
  const { language } = useLanguage();
  if (immediateDanger) return null;

  return (
    <nav aria-label="HELP Network" className="w-full">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground mb-2 text-center">
        HELP Network
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {NETWORK_SITES.map((site) => {
          const href = buildHandoffUrl(TARGETS[site.key], null, language, "");
          return (
            <li key={site.key}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md border border-border bg-background px-3 py-2 hover:bg-accent hover:border-primary/40 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">{site.label}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {site.stage}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{site.description}</p>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default HelpNetworkHandoff;
