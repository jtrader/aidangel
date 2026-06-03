
ALTER VIEW public.public_route_catalogue SET (security_invoker = true);

DROP POLICY IF EXISTS route_catalogue_no_client ON public.route_catalogue;
CREATE POLICY route_catalogue_public_safe_read ON public.route_catalogue FOR SELECT TO anon, authenticated USING (TRUE);

GRANT SELECT (
  id, route_slug, title, description, vendor, image_url, route_type,
  cta_label, confidence, country, partner_entity, availability_status,
  related_program, last_checked_at, synced_at
) ON public.route_catalogue TO anon, authenticated;
