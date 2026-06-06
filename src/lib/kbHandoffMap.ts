// FAA-LOCALE-002b — KB → sister site handoff mappings.
//
// Maps KB topic slugs to the most contextually relevant HELP Network sister
// site. Slugs MUST match the kebab-case form used by the KB router
// (`/{lang}/kb/{slug}`). Topics not in this map render no handoff card.
//
// Copy is sourced from the i18n catalog via translation keys so all visible
// strings flow through the t() system. Brand names ("Guardian Guide",
// "Crisis Compass", etc.) remain in the English source values.
import type { SisterSite } from "./localeCodes";

export const KB_HANDOFF_MAP: Record<string, SisterSite> = {
  // Mental health first aid → Guardian Guide (Heal)
  "mental-health-first-aid": "guardianguide",
  "grief-support": "guardianguide",

  // Disaster and emergency preparedness → Crisis Compass (Respond)
  preparedness: "crisiscompass",
  "home-safety": "crisiscompass",
  "outdoor-safety": "crisiscompass",
  "remote-first-aid": "crisiscompass",

  // Post-event recovery → Aid Angel (Recover)
  // (none currently — leave empty, add when recovery topics are added)
};

/** i18n key triplet per sister site. Consumed by KBHandoffCard via t(). */
export const KB_HANDOFF_COPY_KEYS: Record<
  SisterSite,
  { heading: string; body: string; cta: string }
> = {
  guardianguide: {
    heading: "kbHandoffGuardianGuideHeading",
    body: "kbHandoffGuardianGuideBody",
    cta: "kbHandoffGuardianGuideCta",
  },
  crisiscompass: {
    heading: "kbHandoffCrisisCompassHeading",
    body: "kbHandoffCrisisCompassBody",
    cta: "kbHandoffCrisisCompassCta",
  },
  aidangel: {
    heading: "kbHandoffAidAngelHeading",
    body: "kbHandoffAidAngelBody",
    cta: "kbHandoffAidAngelCta",
  },
  firstaidangel: {
    heading: "kbHandoffFirstAidAngelHeading",
    body: "kbHandoffFirstAidAngelBody",
    cta: "kbHandoffFirstAidAngelCta",
  },
  lovekey: {
    heading: "kbHandoffLoveKeyHeading",
    body: "kbHandoffLoveKeyBody",
    cta: "kbHandoffLoveKeyCta",
  },
  lovekeynfcqr: {
    heading: "kbHandoffLoveKeyNfcQrHeading",
    body: "kbHandoffLoveKeyNfcQrBody",
    cta: "kbHandoffLoveKeyNfcQrCta",
  },
};
