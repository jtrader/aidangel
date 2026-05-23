
revoke execute on function public.is_org_member(uuid, uuid) from anon, public;
revoke execute on function public.has_org_role(uuid, uuid, public.org_role) from anon, public;
revoke execute on function public.user_org_ids(uuid) from anon, public;

grant execute on function public.is_org_member(uuid, uuid) to authenticated;
grant execute on function public.has_org_role(uuid, uuid, public.org_role) to authenticated;
grant execute on function public.user_org_ids(uuid) to authenticated;
