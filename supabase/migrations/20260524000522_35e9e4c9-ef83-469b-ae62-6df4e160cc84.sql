-- Auto-add creator as owner of newly created organisations
create or replace function public.add_creator_as_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.created_by is not null then
    insert into public.org_members (org_id, user_id, email, full_name, role, status, joined_at)
    select new.id,
           new.created_by,
           u.email,
           coalesce((u.raw_user_meta_data->>'full_name'), u.email),
           'owner'::org_role,
           'active'::org_member_status,
           now()
    from auth.users u
    where u.id = new.created_by
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_add_creator_as_owner on public.organisations;
create trigger trg_add_creator_as_owner
after insert on public.organisations
for each row execute function public.add_creator_as_owner();

-- Belt & suspenders: let creator read the organisation even before membership lookup
drop policy if exists "Creator can view their organisation" on public.organisations;
create policy "Creator can view their organisation"
on public.organisations
for select
to authenticated
using (created_by = auth.uid());
