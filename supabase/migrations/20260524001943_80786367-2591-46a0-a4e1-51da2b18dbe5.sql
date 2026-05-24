CREATE POLICY "Managers upload org imports"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'org-imports'
  AND public.has_org_role(auth.uid(), ((storage.foldername(name))[1])::uuid, 'manager'::public.org_role)
);