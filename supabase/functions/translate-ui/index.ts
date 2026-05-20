import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRESERVE = [
  "000", "CPR", "AED", "DRSABCD", "FAST", "RICE", "EpiPen",
  "AFA5", "13 11 26", "13 11 14", "1800 022 222",
];

const LANG_NAMES: Record<string, string> = {
  zh: "Mandarin Chinese (普通话)",
  yue: "Cantonese Chinese (廣東話)",
  ar: "Arabic (العربية)",
  vi: "Vietnamese (Tiếng Việt)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
  el: "Greek (Ελληνικά)",
  it: "Italian (Italiano)",
  kriol: "Australian Kriol (a creole language spoken across Northern Australia)",
  yolngu: "Yolŋu Matha (spoken in Arnhem Land, Northern Territory)",
  pitjantjatjara: "Pitjantjatjara (spoken in Central Australia)",
  arrernte: "Arrernte (spoken in the Alice Springs region, Northern Territory)",
  tsi: "Yumplatok / Torres Strait Creole (spoken in the Torres Strait Islands, Queensland)",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { language, texts } = await req.json();
    if (!language || !Array.isArray(texts) || texts.length === 0) {
      return new Response(
        JSON.stringify({ error: "language and non-empty texts[] required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (language === "en") {
      return new Response(JSON.stringify({ translations: texts }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langName = LANG_NAMES[language] || language;

    const system = `You translate short UI strings (chip labels, suggested prompts, category names) for an Australian first aid app into ${langName}.

Rules:
- Translate each string naturally, concisely, and in a calm friendly tone suitable for a first aid helper.
- Keep these terms in English exactly: ${PRESERVE.join(", ")}.
- Preserve punctuation, em-dashes, question marks, and emoji.
- Do NOT add explanations or notes.
- Return JSON only in this exact shape: {"translations": ["...", "..."]}.
- The translations array MUST be the same length and order as the input texts array.`;

    const user = JSON.stringify({ texts });

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(
        JSON.stringify({ error: `AI gateway error: ${errText}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await resp.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: { translations?: unknown } = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {};
    }
    const arr = Array.isArray(parsed.translations) ? parsed.translations : [];
    const translations: string[] =
      arr.length === texts.length
        ? arr.map((x) => (typeof x === "string" && x.trim() ? x : ""))
        : texts;
    // Fill any blanks with original
    const final = translations.map((t, i) => (t && t.trim() ? t : texts[i]));

    return new Response(JSON.stringify({ translations: final }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String((e as Error).message ?? e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
