GRANT INSERT ON public.give_clicks TO anon, authenticated;
GRANT SELECT ON public.give_clicks TO authenticated;
GRANT ALL ON public.give_clicks TO service_role;