// Shared Google Maps JS loader. Single-flight; resolves once API is ready.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

declare global {
  interface Window {
    google: any;
    __initFaaMap?: () => void;
  }
}

let loadPromise: Promise<void> | null = null;

async function fetchMapsKey(): Promise<{ key: string; trackingId: string }> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/get-maps-key`);
  if (!res.ok) throw new Error("Failed to fetch Maps key");
  return res.json();
}

export function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.google?.maps) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const { key, trackingId } = await fetchMapsKey();
    if (!key) throw new Error("Missing Google Maps key");
    await new Promise<void>((resolve, reject) => {
      const existing = document.getElementById("faa-gmaps-script") as HTMLScriptElement | null;
      window.__initFaaMap = () => resolve();
      if (existing) {
        if (window.google?.maps) resolve();
        return;
      }
      const s = document.createElement("script");
      s.id = "faa-gmaps-script";
      const channel = trackingId ? `&channel=${trackingId}` : "";
      s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__initFaaMap${channel}`;
      s.async = true;
      s.defer = true;
      s.onerror = () => reject(new Error("Failed to load Google Maps"));
      document.head.appendChild(s);
    });
  })();
  return loadPromise;
}
