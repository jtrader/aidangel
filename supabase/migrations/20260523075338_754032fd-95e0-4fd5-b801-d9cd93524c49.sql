
-- COURSES
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  description text,
  cover_url text,
  level text not null default 'beginner',
  duration_minutes integer not null default 30,
  pass_mark integer not null default 80,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.courses enable row level security;

create policy "Public can view published courses"
  on public.courses for select using (is_published = true or has_role(auth.uid(), 'admin'));
create policy "Admins manage courses"
  on public.courses for all using (has_role(auth.uid(), 'admin')) with check (has_role(auth.uid(), 'admin'));

create trigger courses_touch before update on public.courses
  for each row execute function public.touch_updated_at();

-- LESSONS
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  body text,
  video_url text,
  duration_minutes integer not null default 5,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(course_id, slug)
);
create index lessons_course_idx on public.lessons(course_id, sort_order);
alter table public.lessons enable row level security;

create policy "Public can view lessons of published courses"
  on public.lessons for select using (
    exists (select 1 from public.courses c where c.id = course_id and (c.is_published or has_role(auth.uid(), 'admin')))
  );
create policy "Admins manage lessons"
  on public.lessons for all using (has_role(auth.uid(), 'admin')) with check (has_role(auth.uid(), 'admin'));

create trigger lessons_touch before update on public.lessons
  for each row execute function public.touch_updated_at();

-- QUIZ QUESTIONS
create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  question text not null,
  choices jsonb not null,
  correct_index integer not null,
  explanation text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index quiz_questions_course_idx on public.quiz_questions(course_id, sort_order);
alter table public.quiz_questions enable row level security;

create policy "Public can view quiz of published courses"
  on public.quiz_questions for select using (
    exists (select 1 from public.courses c where c.id = course_id and (c.is_published or has_role(auth.uid(), 'admin')))
  );
create policy "Admins manage quiz"
  on public.quiz_questions for all using (has_role(auth.uid(), 'admin')) with check (has_role(auth.uid(), 'admin'));

create trigger quiz_questions_touch before update on public.quiz_questions
  for each row execute function public.touch_updated_at();

-- ENROLLMENTS
create table public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  course_id uuid not null references public.courses(id) on delete cascade,
  started_at timestamptz not null default now(),
  unique(user_id, course_id)
);
alter table public.course_enrollments enable row level security;

create policy "Users view own enrollments"
  on public.course_enrollments for select using (auth.uid() = user_id or has_role(auth.uid(), 'admin'));
create policy "Users create own enrollments"
  on public.course_enrollments for insert with check (auth.uid() = user_id);
create policy "Users delete own enrollments"
  on public.course_enrollments for delete using (auth.uid() = user_id);

-- LESSON PROGRESS
create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);
create index lesson_progress_user_course on public.lesson_progress(user_id, course_id);
alter table public.lesson_progress enable row level security;

create policy "Users view own progress"
  on public.lesson_progress for select using (auth.uid() = user_id or has_role(auth.uid(), 'admin'));
create policy "Users insert own progress"
  on public.lesson_progress for insert with check (auth.uid() = user_id);
create policy "Users delete own progress"
  on public.lesson_progress for delete using (auth.uid() = user_id);

-- QUIZ ATTEMPTS
create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  course_id uuid not null references public.courses(id) on delete cascade,
  score integer not null,
  total integer not null,
  passed boolean not null,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index quiz_attempts_user_course on public.quiz_attempts(user_id, course_id);
alter table public.quiz_attempts enable row level security;

create policy "Users view own attempts"
  on public.quiz_attempts for select using (auth.uid() = user_id or has_role(auth.uid(), 'admin'));
create policy "Users insert own attempts"
  on public.quiz_attempts for insert with check (auth.uid() = user_id);

-- CERTIFICATES
create sequence if not exists public.certificate_number_seq start 1001;

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  course_id uuid not null references public.courses(id) on delete cascade,
  learner_name text not null,
  certificate_number text not null unique default ('FAA-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.certificate_number_seq')::text, 6, '0')),
  issued_at timestamptz not null default now(),
  unique(user_id, course_id)
);
alter table public.certificates enable row level security;

create policy "Users view own certificates"
  on public.certificates for select using (auth.uid() = user_id or has_role(auth.uid(), 'admin'));
create policy "Public can verify a certificate by number"
  on public.certificates for select using (true);
create policy "Users create own certificates"
  on public.certificates for insert with check (auth.uid() = user_id);
