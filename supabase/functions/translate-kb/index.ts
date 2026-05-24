import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_ITEMS = 50;
const MAX_TOTAL_CHARS = 40 * 1024;

const LANG_NAMES: Record<string, string> = {
  zh: "Mandarin Chinese (普通话)",
  yue: "Cantonese Chinese (廣東話)",
  ar: "Arabic (العربية)",
  vi: "Vietnamese (Tiếng Việt)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
  el: "Greek (Ελληνικά)",
  it: "Italian (Italiano)",
  kriol: "Australian Kriol",
  yolngu: "Yolŋu Matha",
  pitjantjatjara: "Pitjantjatjara",
  arrernte: "Arrernte",
  tsi: "Yumplatok / Torres Strait Creole",
};

const PRESERVE_TERMS =
  "CPR, AED, DRSABCD, EpiPen, RICE, FAST, AFA5, 000, 13 11 26, 13 11 14, 1800 022 222";

async function callAi(system: string, user: string, apiKey: string) {
  const resp = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    }
  );
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`AI gateway ${resp.status}: ${t}`);
  }
  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(content);
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : {};
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    // Require a valid Supabase JWT (anon JWT is fine).
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await authClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();
    const { language } = payload;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    if (Array.isArray(payload.items)) {
      if (payload.items.length > MAX_ITEMS) {
        return new Response(JSON.stringify({ error: `Too many items (max ${MAX_ITEMS})` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const chars = JSON.stringify(payload.items).length;
      if (chars > MAX_TOTAL_CHARS) {
        return new Response(JSON.stringify({ error: "Payload too large" }), {
          status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      const chars = (payload.title?.length || 0) + (payload.summary?.length || 0) + (payload.body?.length || 0);
      if (chars > MAX_TOTAL_CHARS) {
        return new Response(JSON.stringify({ error: "Payload too large" }), {
          status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ---------- Batch mode: translate many (slug,title,summary) pairs in one call ----------
    if (Array.isArray(payload.items)) {
      const items: Array<{ slug: string; title: string; summary: string }> = payload.items;
      if (!language || language === "en" || !LANG_NAMES[language]) {
        return new Response(JSON.stringify({ items }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const langName = LANG_NAMES[language];
      const system = `You are a professional medical translator. Translate the supplied JSON array of first aid topic summaries from English to ${langName}.

Rules:
- Translate ONLY the "title" and "summary" fields. Leave "slug" unchanged.
- Keep these terms in English: ${PRESERVE_TERMS}.
- Output ONLY a JSON object: {"items":[{"slug":"...","title":"...","summary":"..."}, ...]} — no prose, no code fences. Preserve item order.`;
      const user = JSON.stringify({ items });
      const parsed = await callAi(system, user, LOVABLE_API_KEY);
      const out = Array.isArray(parsed.items) ? parsed.items : items;
      return new Response(JSON.stringify({ items: out }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---------- Single topic mode (title + summary + body) ----------
    const { title, summary, body } = payload;
    if (!language || language === "en" || !LANG_NAMES[language]) {
      return new Response(JSON.stringify({ title, summary, body }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const langName = LANG_NAMES[language];
    const system = `You are a professional medical translator. Translate first aid content from English to ${langName}.

Rules:
- Preserve all Markdown formatting EXACTLY (headings, lists, bold, links like [text](/kb/slug), tel: links).
- Keep these terms in English: ${PRESERVE_TERMS}.
- Translate everything else naturally and accurately for an everyday reader.
- Output ONLY a JSON object: {"title":"...","summary":"...","body":"..."} — no prose, no code fences.`;
    const parsed = await callAi(system, JSON.stringify({ title, summary, body }), LOVABLE_API_KEY);
    return new Response(
      JSON.stringify({
        title: parsed.title ?? title,
        summary: parsed.summary ?? summary,
        body: parsed.body ?? body,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("translate-kb error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
