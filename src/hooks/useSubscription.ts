import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Subscription = {
  id: string;
  status: string;
  product_id: string;
  price_id: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

const ACTIVE_STATUSES = new Set(["active", "trialing", "past_due"]);

function isAccessActive(sub: Subscription | null): boolean {
  if (!sub) return false;
  const end = sub.current_period_end ? new Date(sub.current_period_end).getTime() : null;
  const inWindow = end === null || end > Date.now();
  if (ACTIVE_STATUSES.has(sub.status) && inWindow) return true;
  if (sub.status === "canceled" && end !== null && end > Date.now()) return true;
  return false;
}

/**
 * Program access = active personal subscription OR active membership of an
 * organisation that has an active employer subscription. Employer plans
 * cover their members; we treat any active org membership as covered
 * because employers only pay for active member counts.
 */
export function useSubscription() {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [viaEmployer, setViaEmployer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setSubscription(null);
      setViaEmployer(false);
      setLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      setLoading(true);

      const { data: subRow } = await supabase
        .from("subscriptions")
        .select("id,status,product_id,price_id,current_period_end,cancel_at_period_end")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      let employer = false;
      if (!isAccessActive(subRow as Subscription | null)) {
        const { data: mem } = await supabase
          .from("org_members")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "active")
          .limit(1)
          .maybeSingle();
        employer = !!mem;
      }

      if (!cancelled) {
        setSubscription((subRow as Subscription | null) ?? null);
        setViaEmployer(employer);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user, authLoading]);

  const hasProgramAccess = viaEmployer || isAccessActive(subscription);

  return { subscription, hasProgramAccess, viaEmployer, loading };
}
