insert into storage.buckets (id, name, public)
values ('org-logos', 'org-logos', true)
on conflict (id) do nothing;

create policy "Org logos are publicly readable"
on storage.objects for select
using (bucket_id = 'org-logos');

create policy "Org admins upload logos"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'org-logos'
  and public.has_org_role(auth.uid(), ((storage.foldername(name))[1])::uuid, 'admin'::public.org_role)
);

create policy "Org admins update logos"
on storage.objects for update to authenticated
using (
  bucket_id = 'org-logos'
  and public.has_org_role(auth.uid(), ((storage.foldername(name))[1])::uuid, 'admin'::public.org_role)
);

create policy "Org admins delete logos"
on storage.objects for delete to authenticated
using (
  bucket_id = 'org-logos'
  and public.has_org_role(auth.uid(), ((storage.foldername(name))[1])::uuid, 'admin'::public.org_role)
);