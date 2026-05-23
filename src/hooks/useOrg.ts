import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type OrgRole = "owner" | "admin" | "manager" | "learner";

export interface OrgSummary {
  id: string;
  name: string;
  slug: string;
  role: OrgRole;
  seat_limit: number;
  status: "active" | "suspended" | "trial";
  logo_url: string | null;
  primary_color: string | null;
  country_code: string | null;
  industry: string | null;
  billing_email: string | null;
  join_code: string | null;
}

const ACTIVE_KEY = "faa.activeOrg";

const RANK: Record<OrgRole, number> = { owner: 4, admin: 3, manager: 2, learner: 1 };

export function useOrg() {
  const { user, loading: authLoading } = useAuth();
  const [orgs, setOrgs] = useState<OrgSummary[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setOrgs([]);
      setActiveOrgId(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    // 1. memberships for this user
    const { data: members, error: memErr } = await supabase
      .from("org_members")
      .select("org_id, role")
      .eq("user_id", user.id)
      .eq("status", "active");
    if (memErr || !members?.length) {
      setOrgs([]);
      setActiveOrgId(null);
      setLoading(false);
      return;
    }
    const orgIds = members.map((m) => m.org_id);
    const { data: orgRows } = await supabase
      .from("organisations")
      .select("*")
      .in("id", orgIds);
    const byId = new Map(orgRows?.map((o) => [o.id, o]) ?? []);
    const summaries: OrgSummary[] = members
      .map((m) => {
        const o = byId.get(m.org_id);
        if (!o) return null;
        return {
          id: o.id,
          name: o.name,
          slug: o.slug,
          role: m.role as OrgRole,
          seat_limit: o.seat_limit,
          status: o.status,
          logo_url: o.logo_url,
          primary_color: o.primary_color,
          country_code: o.country_code,
          industry: o.industry,
          billing_email: o.billing_email,
          join_code: o.join_code,
        };
      })
      .filter((x): x is OrgSummary => !!x);
    setOrgs(summaries);

    const stored = typeof window !== "undefined" ? localStorage.getItem(ACTIVE_KEY) : null;
    const chosen = summaries.find((o) => o.id === stored)?.id ?? summaries[0]?.id ?? null;
    setActiveOrgId(chosen);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading) load();
  }, [authLoading, load]);

  const setActive = useCallback((id: string) => {
    setActiveOrgId(id);
    try {
      localStorage.setItem(ACTIVE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const activeOrg = orgs.find((o) => o.id === activeOrgId) ?? null;
  const can = useCallback(
    (min: OrgRole) => !!activeOrg && RANK[activeOrg.role] >= RANK[min],
    [activeOrg],
  );

  return { orgs, activeOrg, activeOrgId, setActive, loading, refresh: load, can };
}
