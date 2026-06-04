// FAA-LOCALE-002b — KB → sister site handoff mappings.
//
// Maps KB topic slugs to the most contextually relevant HELP Network sister
// site. Slugs MUST match the kebab-case form used by the KB router
// (`/{lang}/kb/{slug}`). Topics not in this map render no handoff card.
//
// The map will be extended in future prompts as content is reviewed —
// do not add topics here without an accompanying ticket.
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

export const KB_HANDOFF_COPY: Record<
  SisterSite,
  { heading: string; body: string; cta: string }
> = {
  guardianguide: {
    heading: "Supporting mental health after a crisis",
    body: "Guardian Guide connects you with trusted mental health and emotional support services.",
    cta: "Find support",
  },
  crisiscompass: {
    heading: "Prepare for emergencies",
    body: "Crisis Compass helps you navigate active emergencies with official guidance.",
    cta: "Get guidance",
  },
  aidangel: {
    heading: "Recovering after a disaster",
    body: "Aid Angel helps you find financial, housing, and recovery support after a crisis.",
    cta: "Find recovery support",
  },
  loveKeyLink: {
    heading: "Explore the HELP Network",
    body: "Connect with the full LoveKey HELP Network.",
    cta: "Learn more",
  },
};
