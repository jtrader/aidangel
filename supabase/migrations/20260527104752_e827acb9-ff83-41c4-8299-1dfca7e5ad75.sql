-- 1. Hide billing_email from non-admin org members via column-level privileges.
REVOKE SELECT (billing_email) ON public.organisations FROM anon, authenticated;

-- Provide a secure way for org admins/owners to read the billing email.
CREATE OR REPLACE FUNCTION public.get_org_billing_email(_org uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT billing_email
  FROM public.organisations
  WHERE id = _org
    AND (
      public.has_org_role(auth.uid(), _org, 'admin'::org_role)
      OR public.has_role(auth.uid(), 'admin'::app_role)
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_org_billing_email(uuid) TO authenticated;

-- 2. Audit log: force actor_id = auth.uid() so managers can't fabricate authorship.
DROP POLICY IF EXISTS "Managers append audit" ON public.org_audit_log;
CREATE POLICY "Managers append audit"
  ON public.org_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    actor_id = auth.uid()
    AND (
      public.has_org_role(auth.uid(), org_id, 'manager'::org_role)
      OR public.has_role(auth.uid(), 'admin'::app_role)
    )
  );

-- 3. Course assignments: learners only see their own; managers/admins still see all.
DROP POLICY IF EXISTS "Members read assignments in their org" ON public.org_course_assignments;
CREATE POLICY "Members read own or managers read all course assignments"
  ON public.org_course_assignments
  FOR SELECT
  TO authenticated
  USING (
    public.has_org_role(auth.uid(), org_id, 'manager'::org_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.org_members m
      WHERE m.id = org_course_assignments.member_id
        AND m.user_id = auth.uid()
    )
  );

-- Program assignments: same fix.
DROP POLICY IF EXISTS "Members read program assignments in their org" ON public.org_program_assignments;
CREATE POLICY "Members read own or managers read all program assignments"
  ON public.org_program_assignments
  FOR SELECT
  TO authenticated
  USING (
    public.has_org_role(auth.uid(), org_id, 'manager'::org_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.org_members m
      WHERE m.id = org_program_assignments.member_id
        AND m.user_id = auth.uid()
    )
  );