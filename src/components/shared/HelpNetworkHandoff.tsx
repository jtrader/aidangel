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
  /** Brand name — proper noun, not translated. */
  label: string;
  /** i18n key for description. */
  descKey: string;
  /** i18n key for stage label. */
  stageKey: string;
};

const NETWORK_SITES: NetworkSite[] = [
  {
    key: "firstaidangel",
    label: "First Aid Angel",
    descKey: "helpNetworkFirstAidAngelDesc",
    stageKey: "helpNetworkFirstAidAngelStage",
  },
  {
    key: "crisiscompass",
    label: "Crisis Compass",
    descKey: "helpNetworkCrisisCompassDesc",
    stageKey: "helpNetworkCrisisCompassStage",
  },
  {
    key: "aidangel",
    label: "Aid Angel",
    descKey: "helpNetworkAidAngelDesc",
    stageKey: "helpNetworkAidAngelStage",
  },
  {
    key: "guardianguide",
    label: "Guardian Guide",
    descKey: "helpNetworkGuardianGuideDesc",
    stageKey: "helpNetworkGuardianGuideStage",
  },
  {
    key: "lovekey",
    label: "Love Key",
    descKey: "helpNetworkLoveKeyDesc",
    stageKey: "helpNetworkLoveKeyStage",
  },
];

export function HelpNetworkHandoff({ immediateDanger = false }: HelpNetworkHandoffProps) {
  const { language, t } = useLanguage();
  if (immediateDanger) return null;

  return (
    <nav aria-label="HELP Network" className="w-full">
      <h2 className="text-xs font-semibold tracking-wide text-foreground mb-2 text-center">
        Love Key HELP Network
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {NETWORK_SITES.map((site) => {
          const isFirstAidAngel = site.key === "firstaidangel";
          const isAidAngel = site.key === "aidangel";
          const rawHref = isFirstAidAngel
            ? "https://firstaidangel.org"
            : isAidAngel
            ? "https://aidangel.app"
            : buildHandoffUrl(TARGETS[site.key], null, language, "");
          const targetBlank = isFirstAidAngel ? undefined : "_blank";
          const relNoopener = isFirstAidAngel ? undefined : "noopener noreferrer";
          const href = rawHref.replace(/\/en\/$/, "/");
          return (
            <li key={site.key}>
              <a
                href={href}
                target={targetBlank}
                rel={relNoopener}
                className={[
                  "block rounded-md border px-3 py-2 transition-colors",
                  isFirstAidAngel
                    ? "bg-background border-primary/50 shadow-[0_0_12px_rgba(220,38,38,0.35)] hover:bg-red-50 dark:hover:bg-red-950/20"
                    : "bg-background border-border hover:bg-accent hover:border-primary/40",
                ].join(" ")}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">{site.label}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {t(site.stageKey as any)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{t(site.descKey as any)}</p>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default HelpNetworkHandoff;
