
-- =========================================================
-- Employer Admin / Organisations — Phase 1 (Foundations)
-- =========================================================

-- Enums --------------------------------------------------------------
do $$ begin
  create type public.org_role as enum ('owner','admin','manager','learner');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.org_status as enum ('active','suspended','trial');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.org_member_status as enum ('invited','active','removed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.org_assignment_status as enum ('assigned','in_progress','completed','overdue');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.org_import_status as enum ('queued','processing','completed','failed');
exception when duplicate_object then null; end $$;

-- Organisations ------------------------------------------------------
create table if not exists public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  country_code text,
  industry text,
  billing_email text,
  seat_limit integer not null default 5,
  status public.org_status not null default 'trial',
  logo_url text,
  primary_color text,
  join_code text unique,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Org members --------------------------------------------------------
create table if not exists public.org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(id) on delete cascade,
  user_id uuid,
  email text not null,
  full_name text,
  role public.org_role not null default 'learner',
  employee_ref text,
  department text,
  status public.org_member_status not null default 'invited',
  invited_at timestamptz not null default now(),
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, email)
);
create index if not exists idx_org_members_org on public.org_members(org_id);
create index if not exists idx_org_members_user on public.org_members(user_id);

-- Invitations --------------------------------------------------------
create table if not exists public.org_invitations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(id) on delete cascade,
  email text not null,
  token text not null unique,
  role public.org_role not null default 'learner',
  expires_at timestamptz not null default (now() + interval '30 days'),
  accepted_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now()
);
create index if not exists idx_org_invitations_org on public.org_invitations(org_id);

-- Course assignments -------------------------------------------------
create table if not exists public.org_course_assignments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(id) on delete cascade,
  member_id uuid not null references public.org_members(id) on delete cascade,
  course_id uuid not null,
  due_at timestamptz,
  assigned_by uuid,
  status public.org_assignment_status not null default 'assigned',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (member_id, course_id)
);
create index if not exists idx_org_assignments_org on public.org_course_assignments(org_id);
create index if not exists idx_org_assignments_course on public.org_course_assignments(course_id);

-- Import jobs --------------------------------------------------------
create table if not exists public.org_import_jobs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(id) on delete cascade,
  uploaded_by uuid,
  file_path text not null,
  total_rows integer not null default 0,
  success_rows integer not null default 0,
  error_rows integer not null default 0,
  error_report jsonb not null default '[]'::jsonb,
  status public.org_import_status not null default 'queued',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_org_import_jobs_org on public.org_import_jobs(org_id);

-- Audit log ----------------------------------------------------------
create table if not exists public.org_audit_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(id) on delete cascade,
  actor_id uuid,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_org_audit_org on public.org_audit_log(org_id);

-- updated_at triggers ------------------------------------------------
drop trigger if exists trg_org_touch on public.organisations;
create trigger trg_org_touch before update on public.organisations
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_org_members_touch on public.org_members;
create trigger trg_org_members_touch before update on public.org_members
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_org_assignments_touch on public.org_course_assignments;
create trigger trg_org_assignments_touch before update on public.org_course_assignments
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_org_jobs_touch on public.org_import_jobs;
create trigger trg_org_jobs_touch before update on public.org_import_jobs
  for each row execute function public.touch_updated_at();

-- Security definer helpers (avoid recursive RLS) ---------------------
create or replace function public.is_org_member(_user uuid, _org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.org_members
    where org_id = _org
      and user_id = _user
      and status = 'active'
  );
$$;

create or replace function public.has_org_role(_user uuid, _org uuid, _min public.org_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  -- ranks: owner=4, admin=3, manager=2, learner=1
  select exists (
    select 1 from public.org_members m
    where m.org_id = _org
      and m.user_id = _user
      and m.status = 'active'
      and (
        case m.role
          when 'owner' then 4
          when 'admin' then 3
          when 'manager' then 2
          when 'learner' then 1
        end
      ) >=
      (
        case _min
          when 'owner' then 4
          when 'admin' then 3
          when 'manager' then 2
          when 'learner' then 1
        end
      )
  );
$$;

create or replace function public.user_org_ids(_user uuid)
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select org_id from public.org_members
  where user_id = _user and status = 'active';
$$;

-- Trigger: when a new auth user signs up, link any matching invited
-- org_members rows so their org context activates automatically.
create or replace function public.link_org_members_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.org_members
  set user_id = new.id,
      status = 'active',
      joined_at = coalesce(joined_at, now())
  where lower(email) = lower(new.email)
    and user_id is null;
  return new;
end;
$$;

drop trigger if exists trg_link_org_members_on_signup on auth.users;
create trigger trg_link_org_members_on_signup
  after insert on auth.users
  for each row execute function public.link_org_members_on_signup();

-- Trigger: when a quiz attempt passes, flip matching assignments to completed.
create or replace function public.mark_assignment_completed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.passed is true then
    update public.org_course_assignments a
    set status = 'completed', completed_at = now()
    from public.org_members m
    where a.member_id = m.id
      and a.course_id = new.course_id
      and m.user_id = new.user_id
      and a.status <> 'completed';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_mark_assignment_completed on public.quiz_attempts;
create trigger trg_mark_assignment_completed
  after insert on public.quiz_attempts
  for each row execute function public.mark_assignment_completed();

-- =========================================================
-- RLS
-- =========================================================
alter table public.organisations           enable row level security;
alter table public.org_members             enable row level security;
alter table public.org_invitations         enable row level security;
alter table public.org_course_assignments  enable row level security;
alter table public.org_import_jobs         enable row level security;
alter table public.org_audit_log           enable row level security;

-- organisations
create policy "Members view their organisation"
  on public.organisations for select to authenticated
  using (id in (select public.user_org_ids(auth.uid())) or public.has_role(auth.uid(), 'admin'));

create policy "Authenticated can create organisation"
  on public.organisations for insert to authenticated
  with check (auth.uid() = created_by);

create policy "Owners/admins update organisation"
  on public.organisations for update to authenticated
  using (public.has_org_role(auth.uid(), id, 'admin') or public.has_role(auth.uid(), 'admin'))
  with check (public.has_org_role(auth.uid(), id, 'admin') or public.has_role(auth.uid(), 'admin'));

create policy "Owners delete organisation"
  on public.organisations for delete to authenticated
  using (public.has_org_role(auth.uid(), id, 'owner') or public.has_role(auth.uid(), 'admin'));

-- org_members
create policy "Members read own org members"
  on public.org_members for select to authenticated
  using (public.is_org_member(auth.uid(), org_id) or user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Managers manage org members"
  on public.org_members for all to authenticated
  using (public.has_org_role(auth.uid(), org_id, 'manager') or public.has_role(auth.uid(), 'admin'))
  with check (public.has_org_role(auth.uid(), org_id, 'manager') or public.has_role(auth.uid(), 'admin'));

-- org_invitations
create policy "Managers manage invitations"
  on public.org_invitations for all to authenticated
  using (public.has_org_role(auth.uid(), org_id, 'manager') or public.has_role(auth.uid(), 'admin'))
  with check (public.has_org_role(auth.uid(), org_id, 'manager') or public.has_role(auth.uid(), 'admin'));

create policy "Anon can read invitation by token"
  on public.org_invitations for select to anon
  using (true);

-- org_course_assignments
create policy "Members read assignments in their org"
  on public.org_course_assignments for select to authenticated
  using (public.is_org_member(auth.uid(), org_id) or public.has_role(auth.uid(), 'admin'));

create policy "Managers manage assignments"
  on public.org_course_assignments for all to authenticated
  using (public.has_org_role(auth.uid(), org_id, 'manager') or public.has_role(auth.uid(), 'admin'))
  with check (public.has_org_role(auth.uid(), org_id, 'manager') or public.has_role(auth.uid(), 'admin'));

-- org_import_jobs
create policy "Managers manage import jobs"
  on public.org_import_jobs for all to authenticated
  using (public.has_org_role(auth.uid(), org_id, 'manager') or public.has_role(auth.uid(), 'admin'))
  with check (public.has_org_role(auth.uid(), org_id, 'manager') or public.has_role(auth.uid(), 'admin'));

-- org_audit_log
create policy "Admins read audit"
  on public.org_audit_log for select to authenticated
  using (public.has_org_role(auth.uid(), org_id, 'admin') or public.has_role(auth.uid(), 'admin'));

create policy "Managers append audit"
  on public.org_audit_log for insert to authenticated
  with check (public.has_org_role(auth.uid(), org_id, 'manager') or public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Private storage bucket for CSV/XLSX imports
-- =========================================================
insert into storage.buckets (id, name, public)
values ('org-imports', 'org-imports', false)
on conflict (id) do nothing;

-- Folder convention: <org_id>/<job_id>.csv
create policy "Managers read own org imports"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'org-imports'
    and public.has_org_role(auth.uid(), ((storage.foldername(name))[1])::uuid, 'manager')
  );

create policy "Managers upload imports"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'org-imports'
    and public.has_org_role(auth.uid(), ((storage.foldername(name))[1])::uuid, 'manager')
  );

create policy "Managers delete own org imports"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'org-imports'
    and public.has_org_role(auth.uid(), ((storage.foldername(name))[1])::uuid, 'manager')
  );
