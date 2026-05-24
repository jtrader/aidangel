import { createClient } from "npm:@supabase/supabase-js@2";
import * as XLSX from "npm:xlsx@0.18.5";
import { z } from "npm:zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BodySchema = z.object({
  job_id: z.string().uuid(),
  site_url: z.string().url().optional(),
});

const RowSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  full_name: z.string().trim().min(1).max(120),
  role: z.enum(["owner", "admin", "manager", "learner"]).default("learner"),
  department: z.string().trim().max(80).optional().nullable(),
  employee_ref: z.string().trim().max(80).optional().nullable(),
  assign_course_slugs: z.string().trim().max(500).optional().nullable(),
});

function parseFile(buf: ArrayBuffer): Record<string, unknown>[] {
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws, { defval: "", raw: false });
}

function normaliseHeader(k: string): string {
  return k.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function makeToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
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
    const siteUrl = parsed.data.site_url ?? "https://firstaidangel.org";

    const admin = createClient(url, serviceKey);

    const { data: job, error: jobErr } = await admin
      .from("org_import_jobs")
      .select("id, org_id, file_path, status")
      .eq("id", parsed.data.job_id)
      .single();
    if (jobErr || !job) {
      return new Response(JSON.stringify({ error: "Job not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: roleCheck } = await admin.rpc("has_org_role", { _user: userId, _org: job.org_id, _min: "manager" });
    if (!roleCheck) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: org } = await admin.from("organisations").select("name").eq("id", job.org_id).single();
    const orgName = org?.name ?? "Your organisation";

    await admin.from("org_import_jobs").update({ status: "processing" }).eq("id", job.id);

    const { data: file, error: dlErr } = await admin.storage.from("org-imports").download(job.file_path);
    if (dlErr || !file) {
      await admin.from("org_import_jobs").update({ status: "failed", error_report: [{ row: 0, error: dlErr?.message ?? "Download failed" }] }).eq("id", job.id);
      return new Response(JSON.stringify({ error: "Download failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const buf = await file.arrayBuffer();
    const rawRows = parseFile(buf);

    const { data: existing } = await admin.from("org_members").select("email").eq("org_id", job.org_id);
    const existingEmails = new Set((existing ?? []).map((r) => r.email.toLowerCase()));

    // Pre-load published courses keyed by slug for assignment resolution
    const { data: allCourses } = await admin.from("courses").select("id, slug").eq("is_published", true);
    const coursesBySlug = new Map((allCourses ?? []).map((c) => [c.slug.toLowerCase(), c.id]));

    interface PendingRow {
      member: Record<string, unknown>;
      courseIds: string[];
      role: string;
    }

    const errors: { row: number; email?: string; error: string }[] = [];
    const pending: PendingRow[] = [];
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
        assign_course_slugs: normalised.assign_course_slugs || normalised.courses || null,
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

      // Resolve course slugs (skip silently if unknown, but report)
      const courseIds: string[] = [];
      if (result.data.assign_course_slugs) {
        const slugs = result.data.assign_course_slugs.split(/[,;|]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
        for (const slug of slugs) {
          const id = coursesBySlug.get(slug);
          if (id) courseIds.push(id);
          else errors.push({ row: i + 2, email, error: `Unknown course slug "${slug}" (skipped)` });
        }
      }

      pending.push({
        role: result.data.role,
        courseIds,
        member: {
          org_id: job.org_id,
          email,
          full_name: result.data.full_name,
          role: result.data.role,
          department: result.data.department ?? null,
          employee_ref: result.data.employee_ref ?? null,
          status: "invited",
        },
      });
    });

    let inserted = 0;
    let invitesSent = 0;
    let assignmentsCreated = 0;

    if (pending.length > 0) {
      const { data: insertedRows, error: insErr } = await admin
        .from("org_members")
        .insert(pending.map((p) => p.member))
        .select("id, email, full_name, role");
      if (insErr) {
        await admin.from("org_import_jobs").update({
          status: "failed",
          total_rows: rawRows.length,
          error_rows: rawRows.length,
          error_report: [{ row: 0, error: insErr.message }],
        }).eq("id", job.id);
        return new Response(JSON.stringify({ error: insErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      inserted = insertedRows?.length ?? 0;

      // Build per-email lookup back to pending row
      const pendingByEmail = new Map(pending.map((p) => [String(p.member.email).toLowerCase(), p]));

      // Create invitations + course assignments + send emails
      const assignmentsToInsert: Record<string, unknown>[] = [];
      const invitationsToInsert: Record<string, unknown>[] = [];

      for (const m of insertedRows ?? []) {
        const p = pendingByEmail.get(m.email.toLowerCase());
        if (!p) continue;

        const token = makeToken();
        invitationsToInsert.push({
          org_id: job.org_id,
          email: m.email,
          role: m.role,
          token,
          created_by: userId,
        });

        for (const courseId of p.courseIds) {
          assignmentsToInsert.push({
            org_id: job.org_id,
            member_id: m.id,
            course_id: courseId,
            assigned_by: userId,
            status: "assigned",
          });
        }
      }

      if (invitationsToInsert.length > 0) {
        const { data: invs } = await admin.from("org_invitations").insert(invitationsToInsert).select("email, token");
        // Send invites (best-effort; failures don't fail the job)
        for (const inv of invs ?? []) {
          try {
            const joinUrl = `${siteUrl.replace(/\/$/, "")}/join/${inv.token}`;
            const recipient = insertedRows?.find((r) => r.email.toLowerCase() === inv.email.toLowerCase());
            const resp = await fetch(`${url}/functions/v1/send-transactional-email`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${serviceKey}`,
                apikey: serviceKey,
              },
              body: JSON.stringify({
                templateName: "org-invite",
                recipientEmail: inv.email,
                templateData: {
                  fullName: recipient?.full_name ?? "",
                  orgName,
                  role: recipient?.role ?? "learner",
                  joinUrl,
                },
              }),
            });
            if (resp.ok) invitesSent++;
            else console.error("invite send failed", inv.email, await resp.text());
          } catch (e) {
            console.error("invite send error", inv.email, e);
          }
        }
      }

      if (assignmentsToInsert.length > 0) {
        const { error: aErr, count } = await admin
          .from("org_course_assignments")
          .insert(assignmentsToInsert, { count: "exact" });
        if (aErr) console.error("assignment insert failed", aErr);
        else assignmentsCreated = count ?? assignmentsToInsert.length;
      }
    }

    await admin.from("org_import_jobs").update({
      status: pending.length === 0 && rawRows.length > 0 ? "failed" : "completed",
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
      metadata: { inserted, errors: errors.length, total: rawRows.length, invitesSent, assignmentsCreated },
    });

    return new Response(JSON.stringify({
      ok: true,
      inserted,
      errors: errors.length,
      total: rawRows.length,
      invitesSent,
      assignmentsCreated,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("org-import-process error", e);
    return new Response(JSON.stringify({ error: String(e instanceof Error ? e.message : e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
