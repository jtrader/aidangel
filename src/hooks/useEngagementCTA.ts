import { useEffect, useState } from "react";

const DISMISS_KEY = "faa.supportCta.dismissed";
const SHOWN_KEY = "faa.supportCta.shown";

type Options = {
  /** ms before the CTA appears purely from dwell time. Default 25s. */
  dwellMs?: number;
  /** Number of clicks/touches that counts as "engaged". Default 3. */
  interactionThreshold?: number;
  /** Scroll % (0-100) that counts as "engaged". Default 40. */
  scrollPctThreshold?: number;
};

/**
 * Returns `true` once the user has either:
 *  - dwelled on the page long enough, OR
 *  - interacted enough (clicks / touches / scroll), OR
 *  - shown exit intent (mouse leaves viewport top, or tab hides on mobile).
 *
 * Dismissal persists for the rest of the browser session.
 */
export function useEngagementCTA(opts: Options = {}): {
  visible: boolean;
  dismiss: () => void;
} {
  const dwellMs = opts.dwellMs ?? 25_000;
  const interactionThreshold = opts.interactionThreshold ?? 3;
  const scrollPctThreshold = opts.scrollPctThreshold ?? 40;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
      if (sessionStorage.getItem(SHOWN_KEY) === "1") {
        setVisible(true);
        return;
      }
    } catch { /* ignore */ }

    let interactions = 0;
    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      try { sessionStorage.setItem(SHOWN_KEY, "1"); } catch { /* ignore */ }
      setVisible(true);
      cleanup();
    };

    const onPointer = () => {
      interactions += 1;
      if (interactions >= interactionThreshold) show();
    };
    const onScroll = () => {
      const h = document.documentElement;
      const max = Math.max(1, h.scrollHeight - h.clientHeight);
      const pct = (h.scrollTop / max) * 100;
      if (pct >= scrollPctThreshold) show();
    };
    const onMouseOut = (e: MouseEvent) => {
      // Exit intent: cursor leaves the viewport via the top edge.
      if (!e.relatedTarget && e.clientY <= 0) show();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") show();
    };

    const timer = window.setTimeout(show, dwellMs);
    window.addEventListener("click", onPointer, { passive: true });
    window.addEventListener("touchstart", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("visibilitychange", onVisibility);

    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("click", onPointer);
      window.removeEventListener("touchstart", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("visibilitychange", onVisibility);
    }
    return cleanup;
  }, [dwellMs, interactionThreshold, scrollPctThreshold]);

  const dismiss = () => {
    try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
    setVisible(false);
  };

  return { visible, dismiss };
}
