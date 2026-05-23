// Admin-only: embeds knowledge base chunks and upserts into public.kb_chunks.
// Caller posts { chunks: [{ slug, lang, title, section, content, chunk_index }] }.
// Auth: requires a valid Supabase JWT belonging to a user with the 'admin' role.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type InChunk = {
  slug: string;
  lang?: string;
  title?: string;
  section?: string;
  content: string;
  chunk_index?: number;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Auth: verify caller is an admin
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid auth" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Admin role required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const chunks: InChunk[] = Array.isArray(body?.chunks) ? body.chunks : [];
    if (chunks.length === 0) {
      return new Response(JSON.stringify({ error: "chunks[] required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (chunks.length > 100) {
      return new Response(JSON.stringify({ error: "Max 100 chunks per call" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Embed in one batched call
    const inputs = chunks.map((c) => `${c.title ?? ""}\n${c.section ?? ""}\n\n${c.content}`.slice(0, 30000));
    const embedRes = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-embedding-001",
        input: inputs,
        dimensions: 1536,
      }),
    });
    if (!embedRes.ok) {
      const t = await embedRes.text();
      console.error("embed gateway error", embedRes.status, t);
      return new Response(JSON.stringify({ error: `Embeddings ${embedRes.status}` }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const embedJson = await embedRes.json();
    const vectors: number[][] = (embedJson?.data ?? []).map((d: { embedding: number[] }) => d.embedding);

    const rows = chunks.map((c, i) => ({
      slug: c.slug,
      lang: c.lang ?? "en",
      title: c.title ?? null,
      section: c.section ?? null,
      content: c.content,
      chunk_index: c.chunk_index ?? i,
      embedding: vectors[i] as unknown as string,
    }));

    const { error: upErr } = await admin
      .from("kb_chunks")
      .upsert(rows, { onConflict: "slug,lang,chunk_index" });
    if (upErr) {
      console.error("upsert error", upErr);
      return new Response(JSON.stringify({ error: upErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ inserted: rows.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("embed-kb error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
