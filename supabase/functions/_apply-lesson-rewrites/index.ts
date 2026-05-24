// One-shot admin utility — applies lesson body rewrites from a storage JSON payload.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

Deno.serve(async (_req) => {
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supa = createClient(url, key);

  const res = await fetch(`${url}/storage/v1/object/public/lesson-sources/_tmp/lesson_updates.json`);
  if (!res.ok) return new Response(`fetch failed ${res.status}`, { status: 500 });
  const items: { id: string; body: string }[] = await res.json();

  const results: any[] = [];
  for (const it of items) {
    const { error } = await supa.from("lessons").update({ body: it.body }).eq("id", it.id);
    results.push({ id: it.id, ok: !error, error: error?.message });
  }
  const ok = results.filter(r => r.ok).length;
  return new Response(JSON.stringify({ total: items.length, ok, failed: results.filter(r => !r.ok) }, null, 2), {
    headers: { "content-type": "application/json" },
  });
});
