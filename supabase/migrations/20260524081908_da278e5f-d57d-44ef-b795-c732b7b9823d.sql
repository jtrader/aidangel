ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS video_source_name text,
  ADD COLUMN IF NOT EXISTS video_source_website text,
  ADD COLUMN IF NOT EXISTS video_source_youtube text;