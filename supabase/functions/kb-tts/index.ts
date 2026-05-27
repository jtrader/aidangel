// Knowledge Base voice-over via ElevenLabs multilingual TTS.
// Accepts up to ~2500 chars per request; client chunks long articles.
// Returns MP3 audio bytes. On rate-limit / upstream failure, returns
// JSON { fallback: true } with 200 so the client falls back to
// the browser SpeechSynthesis API.
// Public endpoint: no auth required (KB articles are public).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// One curated multilingual voice per supported top-10 language.
// All voices work with eleven_multilingual_v2 (29-language coverage).
const VOICE_BY_LANG: Record<string, string> = {
  en: "EXAVITQu4vr4xnSDxMaL", // Sarah
  es: "EXAVITQu4vr4xnSDxMaL",
  pt: "EXAVITQu4vr4xnSDxMaL",
  fr: "EXAVITQu4vr4xnSDxMaL",
  ar: "EXAVITQu4vr4xnSDxMaL",
  zh: "EXAVITQu4vr4xnSDxMaL",
  ja: "EXAVITQu4vr4xnSDxMaL",
  bn: "EXAVITQu4vr4xnSDxMaL",
  ur: "EXAVITQu4vr4xnSDxMaL",
  id: "EXAVITQu4vr4xnSDxMaL",
};
const DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

function fallbackResponse(reason: string) {
  return new Response(
    JSON.stringify({ fallback: true, reason }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Public endpoint — KB articles are accessible without an account.
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) return fallbackResponse("missing_api_key");

    const { text, lang } = await req.json();
    if (!text || typeof text !== "string" || text.length > 2500) {
      return new Response(JSON.stringify({ error: "Invalid text" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const vId = VOICE_BY_LANG[(lang ?? "en") as string] ?? DEFAULT_VOICE_ID;

    const resp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${vId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
            speed: 1.0,
          },
        }),
      },
    );

    if (!resp.ok) {
      const errTxt = await resp.text();
      console.error("kb-tts ElevenLabs error", resp.status, errTxt);
      const isQuota = resp.status === 401 && /quota_exceeded/i.test(errTxt);
      if (resp.status === 429 || resp.status >= 500 || isQuota) {
        return fallbackResponse(isQuota ? "quota_exceeded" : `upstream_${resp.status}`);
      }
      return new Response(JSON.stringify({ error: `TTS failed: ${resp.status}` }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const audio = await resp.arrayBuffer();
    return new Response(audio, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    console.error("kb-tts error", e);
    return fallbackResponse("exception");
  }
});
