
-- CMS pages and blocks for managing marketing content site-wide
CREATE TABLE public.cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT ON public.cms_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_pages TO authenticated;
GRANT ALL ON public.cms_pages TO service_role;

ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published cms pages"
  ON public.cms_pages FOR SELECT
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage cms pages"
  ON public.cms_pages FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER cms_pages_updated_at
  BEFORE UPDATE ON public.cms_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


CREATE TABLE public.cms_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  block_key text NOT NULL,
  block_type text NOT NULL DEFAULT 'richtext',
  sort_order integer NOT NULL DEFAULT 0,
  title text,
  body_md text,
  image_url text,
  cta_label text,
  cta_url text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_id, block_key)
);

GRANT SELECT ON public.cms_blocks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_blocks TO authenticated;
GRANT ALL ON public.cms_blocks TO service_role;

ALTER TABLE public.cms_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cms blocks of published pages"
  ON public.cms_blocks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.cms_pages p
    WHERE p.id = cms_blocks.page_id
      AND (p.is_published = true OR public.has_role(auth.uid(), 'admin'))
  ));

CREATE POLICY "Admins manage cms blocks"
  ON public.cms_blocks FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER cms_blocks_updated_at
  BEFORE UPDATE ON public.cms_blocks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX cms_blocks_page_sort_idx ON public.cms_blocks (page_id, sort_order);


-- Media bucket for CMS uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-media', 'cms-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read cms-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cms-media');

CREATE POLICY "Admins upload cms-media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update cms-media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete cms-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));


-- Seed marketing pages that should be editable
INSERT INTO public.cms_pages (slug, title, description) VALUES
  ('home',      'Home',                'First Aid Angel home page'),
  ('about',     'About',               'About First Aid Angel'),
  ('workplace', 'Workplace First Aid', 'Workplace landing page'),
  ('personal',  'Personal Plans',      'Personal marketing page'),
  ('employer',  'Employer Plans',      'Employer marketing page'),
  ('partners',  'Give Partners',       'Charity partners hub'),
  ('shop',      'Shop Partners',       'Shop partners hub')
ON CONFLICT (slug) DO NOTHING;
