
INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson-sources', 'lesson-sources', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can read lesson sources" ON storage.objects;
CREATE POLICY "Public can read lesson sources"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-sources');

DROP POLICY IF EXISTS "Admins upload lesson sources" ON storage.objects;
CREATE POLICY "Admins upload lesson sources"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'lesson-sources' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update lesson sources" ON storage.objects;
CREATE POLICY "Admins update lesson sources"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'lesson-sources' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete lesson sources" ON storage.objects;
CREATE POLICY "Admins delete lesson sources"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'lesson-sources' AND public.has_role(auth.uid(), 'admin'));
