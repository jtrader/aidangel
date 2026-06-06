import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const FUNCTIONS_BASE = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1`;

export default function GoRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const [params] = useSearchParams();

  useEffect(() => {
    if (!slug) return;

    const src = params.get("src") ?? (typeof document !== "undefined" ? document.referrer : "");
    const zone = params.get("zone") ?? "";
    const handle = params.get("handle") ?? "";
    let sid = "";
    try {
      sid = sessionStorage.getItem("faa_sid") || "";
      if (!sid) {
        sid = crypto.randomUUID();
        sessionStorage.setItem("faa_sid", sid);
      }
    } catch { /* ignore */ }

    const url = new URL(`${FUNCTIONS_BASE}/go-redirect/${encodeURIComponent(slug)}`);
    if (src) url.searchParams.set("src", src);
    if (sid) url.searchParams.set("sid", sid);
    if (zone) url.searchParams.set("zone", zone);
    if (handle) url.searchParams.set("handle", handle);

    // Let the browser perform the 302 as a real top-level navigation.
    // Using fetch() with redirect:"follow" would resolve cross-origin in the
    // background without navigating the page, and any SPA fallback to /go/<slug>
    // would just re-mount this component in a loop.
    window.location.replace(url.toString());
  }, [slug, params]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">
      <div className="inline-flex items-center gap-3">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Redirecting…</span>
      </div>
    </div>
  );
}
