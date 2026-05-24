import { createClient } from "npm:@supabase/supabase-js@2";
import * as XLSX from "npm:xlsx@0.18.5";
import { z } from "npm:zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BodySchema = z.object({ job_id: z.string().uuid() });

const RowSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  full_name: z.string().trim().min(1).max(120),
  role: z.enum(["owner", "admin", "manager", "learner"]).default("learner"),
  department: z.string().trim().max(80).optional().nullable(),
  employee_ref: z.string().trim().max(80).optional().nullable(),
});

function parseFile(buf: ArrayBuffer, filename: string): Record<string, unknown>[] {
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws, { defval: "", raw: false });
}

function normaliseHeader(k: string): string {
  return k.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid auth" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userId = userData.user.id;

    const body = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const admin = createClient(url, serviceKey);

    const { data: job, error: jobErr } = await admin
      .from("org_import_jobs")
      .select("id, org_id, file_path, status")
      .eq("id", parsed.data.job_id)
      .single();
    if (jobErr || !job) {
      return new Response(JSON.stringify({ error: "Job not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Authz: caller must be manager+ in this org
    const { data: roleCheck } = await admin.rpc("has_org_role", { _user: userId, _org: job.org_id, _min: "manager" });
    if (!roleCheck) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    await admin.from("org_import_jobs").update({ status: "processing" }).eq("id", job.id);

    // Download file
    const { data: file, error: dlErr } = await admin.storage.from("org-imports").download(job.file_path);
    if (dlErr || !file) {
      await admin.from("org_import_jobs").update({ status: "failed", error_report: [{ row: 0, error: dlErr?.message ?? "Download failed" }] }).eq("id", job.id);
      return new Response(JSON.stringify({ error: "Download failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const buf = await file.arrayBuffer();
    const rawRows = parseFile(buf, job.file_path);

    // Existing emails in this org (to dedupe)
    const { data: existing } = await admin
      .from("org_members")
      .select("email")
      .eq("org_id", job.org_id);
    const existingEmails = new Set((existing ?? []).map((r) => r.email.toLowerCase()));

    const errors: { row: number; email?: string; error: string }[] = [];
    const toInsert: Record<string, unknown>[] = [];
    const seenInBatch = new Set<string>();

    rawRows.forEach((raw, i) => {
      const normalised: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(raw)) {
        normalised[normaliseHeader(k)] = typeof v === "string" ? v.trim() : v;
      }
      const result = RowSchema.safeParse({
        email: normalised.email,
        full_name: normalised.full_name ?? normalised.name,
        role: normalised.role || "learner",
        department: normalised.department || null,
        employee_ref: normalised.employee_ref || normalised.employee_id || null,
      });
      if (!result.success) {
        errors.push({ row: i + 2, email: String(normalised.email ?? ""), error: result.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ") });
        return;
      }
      const email = result.data.email;
      if (existingEmails.has(email) || seenInBatch.has(email)) {
        errors.push({ row: i + 2, email, error: "Duplicate email (already in org or in file)" });
        return;
      }
      seenInBatch.add(email);
      toInsert.push({
        org_id: job.org_id,
        email,
        full_name: result.data.full_name,
        role: result.data.role,
        department: result.data.department ?? null,
        employee_ref: result.data.employee_ref ?? null,
        status: "invited",
      });
    });

    let inserted = 0;
    if (toInsert.length > 0) {
      const { error: insErr, count } = await admin.from("org_members").insert(toInsert, { count: "exact" });
      if (insErr) {
        await admin.from("org_import_jobs").update({
          status: "failed",
          total_rows: rawRows.length,
          error_rows: rawRows.length,
          error_report: [{ row: 0, error: insErr.message }],
        }).eq("id", job.id);
        return new Response(JSON.stringify({ error: insErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      inserted = count ?? toInsert.length;
    }

    await admin.from("org_import_jobs").update({
      status: errors.length === rawRows.length && rawRows.length > 0 ? "failed" : "completed",
      total_rows: rawRows.length,
      success_rows: inserted,
      error_rows: errors.length,
      error_report: errors,
    }).eq("id", job.id);

    await admin.from("org_audit_log").insert({
      org_id: job.org_id,
      actor_id: userId,
      action: "import.completed",
      target_type: "org_import_job",
      target_id: job.id,
      metadata: { inserted, errors: errors.length, total: rawRows.length },
    });

    return new Response(JSON.stringify({ ok: true, inserted, errors: errors.length, total: rawRows.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("org-import-process error", e);
    return new Response(JSON.stringify({ error: String(e instanceof Error ? e.message : e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
