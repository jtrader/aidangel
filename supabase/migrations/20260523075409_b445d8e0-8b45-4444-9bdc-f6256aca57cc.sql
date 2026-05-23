
drop policy if exists "Public can verify a certificate by number" on public.certificates;

create or replace function public.verify_certificate(_cert_number text)
returns table(certificate_number text, course_title text, issued_at timestamptz, learner_initial text)
language sql
stable
security definer
set search_path = public
as $$
  select c.certificate_number,
         co.title as course_title,
         c.issued_at,
         left(c.learner_name, 1) as learner_initial
  from public.certificates c
  join public.courses co on co.id = c.course_id
  where c.certificate_number = _cert_number
$$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;
