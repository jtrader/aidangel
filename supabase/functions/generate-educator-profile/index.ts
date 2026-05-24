import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FIRECRAWL = "https://api.firecrawl.dev/v2";

interface QA { question: string; answer: string }
interface ProfileJson {
  who_text: string;
  how_text: string;
  what_text: string;
  why_text: string;
  qas: QA[];
}

async function scrape(url: string, apiKey: string): Promise<string> {
  const res = await fetch(`${FIRECRAWL}/scrape`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Firecrawl scrape failed [${res.status}]: ${JSON.stringify(data).slice(0, 300)}`);
  return data.data?.markdown ?? data.markdown ?? "";
}

async function generateProfile(name: string, website: string, content: string, lovableKey: string): Promise<ProfileJson> {
  const system = `You write concise, factual profiles for first-aid training providers from their own website content. Output JSON only. Never invent facts. If a section can't be supported by the content, write a short generic but accurate sentence based on the provider name and that they offer first-aid training.`;
  const user = `Provider: ${name}\nWebsite: ${website}\n\nWebsite content (markdown, truncated):\n${content.slice(0, 18000)}\n\nWrite a profile with these fields:\n- who_text: 2-3 sentences. Who they are: organisation type, history, accreditation, footprint.\n- what_text: 2-4 sentences. What courses/services they offer (e.g. HLTAID first aid, CPR, mental health, workplace, schools).\n- how_text: 2-3 sentences. How they deliver training (face-to-face, online, blended, in-house, public classes, locations).\n- why_text: 2-3 sentences. Why choose them: mission, community impact, instructors, outcomes.\n- qas: 5 frequently-asked questions with short helpful answers (question max 80 chars, answer 1-3 sentences). Cover: course duration, certificate validity, accreditation, group/onsite bookings, refunds/reschedule, pricing if visible.\nReturn strict JSON: {"who_text","what_text","how_text","why_text","qas":[{"question","answer"}]}`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      response_format: { type: "json_object" },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`AI gateway failed [${res.status}]: ${JSON.stringify(data).slice(0, 300)}`);
  const text = data.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(text);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { educator_id, force } = await req.json();
    if (!educator_id) throw new Error("educator_id required");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!FIRECRAWL_API_KEY) throw new Error("FIRECRAWL_API_KEY not configured");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // The `force` flag bypasses cache and triggers fresh crawls + AI calls.
    // Gate it behind an admin JWT to prevent credit-exhaustion abuse.
    if (force) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized: 'force' requires admin auth" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData } = await userClient.auth.getClaims(token);
      const userId = claimsData?.claims?.sub;
      if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const adminCheck = createClient(SUPABASE_URL, SERVICE_ROLE);
      const { data: roleRow } = await adminCheck
        .from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
      if (!roleRow) {
        return new Response(JSON.stringify({ error: "Forbidden: admin role required for force refresh" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    if (!force) {
      const { data: existing } = await supabase
        .from("educator_profiles").select("*").eq("educator_id", educator_id).maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ cached: true, profile: existing }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { data: ed, error: edErr } = await supabase
      .from("educators").select("id,name,website,booking_url").eq("id", educator_id).single();
    if (edErr || !ed) throw new Error("Educator not found");

    const sourceUrl = ed.website ?? ed.booking_url;
    if (!sourceUrl) throw new Error("Educator has no website to crawl");

    const markdown = await scrape(sourceUrl, FIRECRAWL_API_KEY);
    const profile = await generateProfile(ed.name, sourceUrl, markdown, LOVABLE_API_KEY);

    const row = {
      educator_id,
      who_text: profile.who_text ?? null,
      what_text: profile.what_text ?? null,
      how_text: profile.how_text ?? null,
      why_text: profile.why_text ?? null,
      qas: profile.qas ?? [],
      source_url: sourceUrl,
      model: "google/gemini-2.5-flash",
      generated_at: new Date().toISOString(),
    };

    const { data: upserted, error: upErr } = await supabase
      .from("educator_profiles").upsert(row, { onConflict: "educator_id" }).select().single();
    if (upErr) throw upErr;

    return new Response(JSON.stringify({ cached: false, profile: upserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-educator-profile error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
