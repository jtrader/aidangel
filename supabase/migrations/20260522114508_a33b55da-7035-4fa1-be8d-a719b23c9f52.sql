-- Educator types
create type public.educator_type as enum ('st_john', 'red_cross', 'other_ngo', 'commercial', 'online', 'community');

-- Main educator/provider table
create table public.educators (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  type public.educator_type not null default 'commercial',
  blurb text,
  website text,
  booking_url text,
  logo_url text,
  hq_country_code text,
  is_online boolean not null default false,
  is_verified boolean not null default false,
  priority int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_educators_country on public.educators(hq_country_code);
create index idx_educators_type on public.educators(type);
create index idx_educators_online on public.educators(is_online);

-- Physical locations
create table public.educator_locations (
  id uuid primary key default gen_random_uuid(),
  educator_id uuid not null references public.educators(id) on delete cascade,
  country_code text not null,
  region text,
  city text,
  address text,
  postcode text,
  lat double precision,
  lng double precision,
  booking_url text,
  phone text,
  created_at timestamptz not null default now()
);
create index idx_locations_educator on public.educator_locations(educator_id);
create index idx_locations_country_city on public.educator_locations(country_code, city);

-- Service areas for mobile / onsite training
create table public.educator_service_areas (
  id uuid primary key default gen_random_uuid(),
  educator_id uuid not null references public.educators(id) on delete cascade,
  country_code text not null,
  region text,
  city text,
  radius_km int,
  notes text,
  created_at timestamptz not null default now()
);
create index idx_service_areas_educator on public.educator_service_areas(educator_id);
create index idx_service_areas_country on public.educator_service_areas(country_code);

-- Languages an educator teaches in
create table public.educator_languages (
  id uuid primary key default gen_random_uuid(),
  educator_id uuid not null references public.educators(id) on delete cascade,
  language_code text not null,
  unique(educator_id, language_code)
);
create index idx_languages_educator on public.educator_languages(educator_id);
create index idx_languages_code on public.educator_languages(language_code);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger educators_touch before update on public.educators
  for each row execute function public.touch_updated_at();

-- Enable RLS
alter table public.educators enable row level security;
alter table public.educator_locations enable row level security;
alter table public.educator_service_areas enable row level security;
alter table public.educator_languages enable row level security;

-- Public read
create policy "Public can view educators" on public.educators for select using (true);
create policy "Public can view educator locations" on public.educator_locations for select using (true);
create policy "Public can view educator service areas" on public.educator_service_areas for select using (true);
create policy "Public can view educator languages" on public.educator_languages for select using (true);

-- Admin write
create policy "Admins manage educators" on public.educators for all
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage educator locations" on public.educator_locations for all
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage educator service areas" on public.educator_service_areas for all
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage educator languages" on public.educator_languages for all
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));