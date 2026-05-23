create extension if not exists vector;

create table if not exists public.kb_chunks (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  lang text not null default 'en',
  title text,
  section text,
  content text not null,
  chunk_index integer not null default 0,
  embedding vector(1536) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, lang, chunk_index)
);

create index if not exists kb_chunks_embedding_idx
  on public.kb_chunks using hnsw (embedding vector_cosine_ops);

create index if not exists kb_chunks_lang_idx on public.kb_chunks (lang);

alter table public.kb_chunks enable row level security;

create policy "Public can read kb chunks"
  on public.kb_chunks for select
  using (true);

create policy "Admins manage kb chunks"
  on public.kb_chunks for all
  to authenticated
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

create trigger kb_chunks_touch_updated_at
  before update on public.kb_chunks
  for each row execute function public.touch_updated_at();

create or replace function public.match_kb_chunks(
  query_embedding vector(1536),
  match_lang text default 'en',
  match_count int default 5
)
returns table (
  id uuid,
  slug text,
  lang text,
  title text,
  section text,
  content text,
  similarity float
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id, c.slug, c.lang, c.title, c.section, c.content,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.kb_chunks c
  where c.lang = match_lang
  order by c.embedding <=> query_embedding
  limit match_count
$$;