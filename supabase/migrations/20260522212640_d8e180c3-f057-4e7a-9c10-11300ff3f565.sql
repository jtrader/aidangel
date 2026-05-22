-- Storage bucket for explainer videos (public read)
INSERT INTO storage.buckets (id, name, public) VALUES ('explainer-videos', 'explainer-videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Explainer videos are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'explainer-videos');

-- Catalog table
CREATE TABLE public.explainer_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  topic text NOT NULL,
  country_code text NOT NULL,
  country_name text NOT NULL,
  flag text NOT NULL,
  language_code text NOT NULL,
  language_name text NOT NULL,
  emergency_number text NOT NULL,
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  duration_seconds numeric,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.explainer_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Explainer videos are publicly readable"
ON public.explainer_videos FOR SELECT
USING (true);

CREATE INDEX idx_explainer_videos_topic ON public.explainer_videos(topic);
CREATE INDEX idx_explainer_videos_country ON public.explainer_videos(country_code);

CREATE TRIGGER touch_explainer_videos_updated_at
BEFORE UPDATE ON public.explainer_videos
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();