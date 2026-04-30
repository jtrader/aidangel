import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { description, programs } = await req.json();

    if (typeof description !== "string" || description.trim().length < 5) {
      return new Response(
        JSON.stringify({ error: "Please describe your situation in a few sentences." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!Array.isArray(programs) || programs.length === 0) {
      return new Response(
        JSON.stringify({ error: "No programs provided to match against." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const truncated = description.slice(0, 2000);

    const catalog = programs
      .map(
        (p: { id: string; provider: string; name: string; amount: string; description: string; pillar: string }) =>
          `- id:${p.id} | ${p.provider} — ${p.name} (${p.amount}) [${p.pillar}]: ${p.description}`,
      )
      .join("\n");

    const systemPrompt = `You are Aid Angel, a calm, plain-language assistant that helps Victorians (Australia) find disaster recovery support after bushfires, floods, storms, cyclones or landslides.

You will receive (1) a free-text description of someone's situation and (2) a catalogue of recovery programs with stable string ids.

Your job:
1. Identify which programs in the catalogue the person MAY be eligible for. Only include items that are likely relevant. Order them with most-relevant first. Never invent ids.
2. Write a short, warm, plain-language summary (2-4 sentences) explaining what to do next. Avoid jargon. Don't pretend to be the government. If the situation is life-threatening, gently remind them to call 000.

Respond by calling the provided tool exactly once. Do not respond with prose.`;

    const userPrompt = `Catalogue:\n${catalog}\n\nSituation:\n${truncated}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_matches",
              description: "Return matched program ids and a short summary.",
              parameters: {
                type: "object",
                properties: {
                  matchedIds: {
                    type: "array",
                    items: { type: "string" },
                    description: "Program ids from the catalogue, most relevant first.",
                  },
                  summary: {
                    type: "string",
                    description: "A short, warm, plain-language summary (2-4 sentences).",
                  },
                },
                required: ["matchedIds", "summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_matches" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResponse.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    const argsStr: string | undefined = toolCall?.function?.arguments;
    if (!argsStr) {
      console.error("No tool call returned:", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "Couldn't parse AI response." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed: { matchedIds: string[]; summary: string };
    try {
      parsed = JSON.parse(argsStr);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid AI response format." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Filter ids to known catalogue ids only.
    const validIds = new Set(programs.map((p: { id: string }) => p.id));
    const matchedIds = (parsed.matchedIds || []).filter((id) => validIds.has(id));

    return new Response(
      JSON.stringify({ matchedIds, summary: parsed.summary || "" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("aid-match error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
