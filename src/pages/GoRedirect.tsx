import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const FUNCTIONS_BASE = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1`;

export default function GoRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);

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

    let didNavigate = false;

    const timer = setTimeout(() => {
      if (didNavigate) return;
      // fallback: directly navigate to the public partner path if edge fn is cold
      window.location.replace(`/go/${encodeURIComponent(slug)}?src=${encodeURIComponent(src)}&sid=${encodeURIComponent(sid)}${zone ? `&zone=${encodeURIComponent(zone)}` : ""}${handle ? `&handle=${encodeURIComponent(handle)}` : ""}`);
    }, 3000);

    // try to fetch the edge function and follow redirect if available
    fetch(url.toString(), { method: "GET", redirect: "follow" })
      .then((res) => {
        // If the function returns a 3xx redirect, the browser should follow it; if it returns a 200 with a JSON url, handle it.
        if (res.redirected) {
          didNavigate = true;
          // navigation already occurred
        } else if (res.status === 200) {
          return res.text();
        }
        return null;
      })
      .then((txt) => {
        if (!txt) return;
        try {
          const payload = JSON.parse(txt);
          if (payload?.url) {
            didNavigate = true;
            window.location.replace(payload.url);
          }
        } catch {
          // ignore
        }
      })
      .catch(() => {
        // ignore network errors — timer will fallback
      })
      .finally(() => {
        clearTimeout(timer);
        setLoading(false);
      });
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
