// Shared MyLocationPanel — portable wrapper around the AidAngel MyLocation panel.
// Documented API:
//   <MyLocationPanel locale?="au" | ... />
// Strict privacy gate: GPS / W3W / address lookups only run after the user
// explicitly taps "Get My Location".
import LegacyMyLocation from "@/components/MyLocation";

export interface MyLocationPanelProps {
  locale?: string;
  /** When true, hides the panel's own page header and hardcoded "Call 000"
   *  CTA — used when the panel is shown inside CallConfirmDialog, which
   *  supplies its own locale-aware call button. */
  embedded?: boolean;
}

export function MyLocationPanel({ embedded }: MyLocationPanelProps = {}) {
  return <LegacyMyLocation embedded={embedded} />;
}

export default MyLocationPanel;
