
CREATE POLICY "Admins read all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins read all shopify certificates" ON public.shopify_certificates
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
