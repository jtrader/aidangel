// Allow an approved claimant to update editable fields of their educator listing.
// Auth model: the claim ID (UUID) acts as a bearer token. The claim must be
// status='approved' and reference the targeted educator. If status changes
// (rejected, removed, reverted to pending), edits are blocked.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EDITABLE_FIELDS = ["blurb", "website", "booking_url", "logo_url"] as const;
type EditableField = typeof EDITABLE_FIELDS[number];

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Require a signed-in user — the claim UUID is no longer sufficient on its own.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json(401, { error: "Sign in required to edit listing" });
    }
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims?.sub) {
      return json(401, { error: "Invalid session" });
    }
    const callerId = claimsData.claims.sub as string;
    const callerEmail = (claimsData.claims.email as string | undefined)?.toLowerCase();

    const { claimId, educatorId, updates } = await req.json();
    if (!claimId || !educatorId || !updates || typeof updates !== "object") {
      return json(400, { error: "claimId, educatorId and updates are required" });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: claim, error: claimErr } = await admin
      .from("educator_claims")
      .select("id, status, educator_id, claimed_user_id, submitter_user_id, claimant_email")
      .eq("id", claimId)
      .maybeSingle();

    if (claimErr) throw claimErr;
    if (!claim) return json(404, { error: "Claim not found" });
    if (claim.educator_id !== educatorId) return json(403, { error: "Claim does not match listing" });
    if (claim.status !== "approved") {
      return json(403, { error: `Editing is disabled (claim status: ${claim.status})` });
    }

    // Site admins are always allowed to edit any approved listing.
    const { data: adminRow } = await admin
      .from("user_roles").select("role").eq("user_id", callerId).eq("role", "admin").maybeSingle();
    const isAdmin = !!adminRow;

    // Otherwise bind the claim to the caller: match by user id or email.
    const ownsClaim =
      isAdmin ||
      claim.claimed_user_id === callerId ||
      claim.submitter_user_id === callerId ||
      (!!callerEmail && claim.claimant_email?.toLowerCase() === callerEmail);

    if (!ownsClaim) {
      return json(403, { error: "You don't have permission to edit this listing" });
    }

    const sanitized: Partial<Record<EditableField, string | null>> = {};
    for (const key of EDITABLE_FIELDS) {
      if (key in updates) {
        const v = updates[key];
        if (v === null || v === "") sanitized[key] = null;
        else if (typeof v === "string") sanitized[key] = v.trim().slice(0, 2000);
      }
    }

    if (Object.keys(sanitized).length === 0) {
      return json(400, { error: "No editable fields supplied" });
    }

    const { data: updated, error: upErr } = await admin
      .from("educators")
      .update({ ...sanitized, updated_at: new Date().toISOString() })
      .eq("id", educatorId)
      .select()
      .maybeSingle();

    if (upErr) throw upErr;
    return json(200, { educator: updated });
  } catch (e) {
    console.error("update-educator-listing error", e);
    return json(500, { error: e instanceof Error ? e.message : "Unknown error" });
  }
});
