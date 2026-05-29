import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRESERVE_TERMS =
  "CPR, AED, DRSABCD, EpiPen, RICE, FAST, AFA5, 000, Triple Zero, 13 11 26, 13 11 14, 1800 022 222";

// 47 non-English locales. Indigenous langs get English fallback (no MT).
const LANGS: Record<string, string | null> = {
  zh: "Mandarin Chinese (简体中文)", yue: "Cantonese Chinese (廣東話)",
  ar: "Arabic (العربية)", vi: "Vietnamese (Tiếng Việt)", pa: "Punjabi (ਪੰਜਾਬੀ)",
  el: "Greek (Ελληνικά)", it: "Italian (Italiano)", es: "Spanish (Español)",
  pt: "Portuguese (Português)", de: "German (Deutsch)", fr: "French (Français)",
  nl: "Dutch (Nederlands)", sv: "Swedish (Svenska)", no: "Norwegian (Norsk)",
  da: "Danish (Dansk)", fi: "Finnish (Suomi)", is: "Icelandic (Íslenska)",
  pl: "Polish (Polski)", cs: "Czech (Čeština)", sk: "Slovak (Slovenčina)",
  hu: "Hungarian (Magyar)", ro: "Romanian (Română)", bg: "Bulgarian (Български)",
  hr: "Croatian (Hrvatski)", sl: "Slovenian (Slovenščina)", sr: "Serbian (Српски)",
  uk: "Ukrainian (Українська)", et: "Estonian (Eesti)", lv: "Latvian (Latviešu)",
  lt: "Lithuanian (Lietuvių)", tr: "Turkish (Türkçe)", ja: "Japanese (日本語)",
  ko: "Korean (한국어)", th: "Thai (ไทย)", id: "Indonesian (Bahasa Indonesia)",
  ms: "Malay (Bahasa Melayu)", ur: "Urdu (اردو)", bn: "Bengali (বাংলা)",
  si: "Sinhala (සිංහල)", ne: "Nepali (नेपाली)", tl: "Tagalog (Filipino)",
  he: "Hebrew (עברית)",
  kriol: null, yolngu: null, pitjantjatjara: null, arrernte: null, tsi: null,
};

async function translate(langName: string, payload: unknown, apiKey: string) {
  const system = `You are a professional translator for first aid / health content. Translate the JSON values from English to ${langName}.

Rules:
- Preserve all Markdown EXACTLY (headings, lists, bold, links, tel: links).
- Keep these terms in English: ${PRESERVE_TERMS}.
- Translate naturally; do NOT translate URLs, slugs, or JSON keys.
- Output ONLY a valid JSON object with the same shape — no prose, no code fences.`;
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: JSON.stringify(payload) },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!resp.ok) throw new Error(`AI ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content ?? "{}";
  try { return JSON.parse(content); } catch {
    const m = content.match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]) : {};
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const authClient = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: userData } = await authClient.auth.getUser();
    const uid = userData?.user?.id;
    if (!uid) return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

    const admin = createClient(url, service);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: uid, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

    const { slug, languages } = await req.json();
    if (!slug) throw new Error("slug required");

    const { data: page, error: pErr } = await admin
      .from("cms_pages").select("*").eq("slug", slug).maybeSingle();
    if (pErr || !page) throw new Error("Page not found");
    const { data: blocks } = await admin
      .from("cms_blocks").select("*").eq("page_id", page.id).order("sort_order");

    const targetLangs: string[] = Array.isArray(languages) && languages.length
      ? languages
      : Object.keys(LANGS);

    const results: Record<string, { ok: boolean; error?: string }> = {};

    for (const lang of targetLangs) {
      try {
        const langName = LANGS[lang];
        if (!langName) {
          // Indigenous: copy English with is_machine=false (todo human review)
          await admin.from("cms_page_translations").upsert({
            page_id: page.id, lang, title: page.title, description: page.description, is_machine: false,
          }, { onConflict: "page_id,lang" });
          for (const b of blocks ?? []) {
            await admin.from("cms_block_translations").upsert({
              block_id: b.id, lang, title: b.title, body_md: b.body_md, cta_label: b.cta_label, is_machine: false,
            }, { onConflict: "block_id,lang" });
          }
          results[lang] = { ok: true };
          continue;
        }

        // Page meta
        const pageTr = await translate(langName, {
          title: page.title ?? "", description: page.description ?? "",
        }, apiKey);
        await admin.from("cms_page_translations").upsert({
          page_id: page.id, lang,
          title: pageTr.title ?? page.title,
          description: pageTr.description ?? page.description,
          is_machine: true,
        }, { onConflict: "page_id,lang" });

        // Blocks (one call each to keep prompts small + reliable JSON)
        for (const b of blocks ?? []) {
          const tr = await translate(langName, {
            title: b.title ?? "", body_md: b.body_md ?? "", cta_label: b.cta_label ?? "",
          }, apiKey);
          await admin.from("cms_block_translations").upsert({
            block_id: b.id, lang,
            title: tr.title ?? b.title,
            body_md: tr.body_md ?? b.body_md,
            cta_label: tr.cta_label ?? b.cta_label,
            is_machine: true,
          }, { onConflict: "block_id,lang" });
        }
        results[lang] = { ok: true };
      } catch (e) {
        console.error(`translate-cms ${lang}:`, e);
        results[lang] = { ok: false, error: e instanceof Error ? e.message : "unknown" };
      }
    }

    return new Response(JSON.stringify({ slug, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate-cms error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
