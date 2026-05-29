
CREATE TABLE public.cms_page_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,
  title TEXT,
  description TEXT,
  is_machine BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (page_id, lang)
);
GRANT SELECT ON public.cms_page_translations TO anon, authenticated;
GRANT ALL ON public.cms_page_translations TO service_role;
ALTER TABLE public.cms_page_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms page translations"
  ON public.cms_page_translations FOR SELECT USING (true);
CREATE POLICY "Admins manage cms page translations"
  ON public.cms_page_translations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.cms_block_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  block_id UUID NOT NULL REFERENCES public.cms_blocks(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,
  title TEXT,
  body_md TEXT,
  cta_label TEXT,
  is_machine BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (block_id, lang)
);
GRANT SELECT ON public.cms_block_translations TO anon, authenticated;
GRANT ALL ON public.cms_block_translations TO service_role;
ALTER TABLE public.cms_block_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms block translations"
  ON public.cms_block_translations FOR SELECT USING (true);
CREATE POLICY "Admins manage cms block translations"
  ON public.cms_block_translations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE INDEX idx_cms_block_translations_block_lang ON public.cms_block_translations(block_id, lang);
CREATE INDEX idx_cms_page_translations_page_lang ON public.cms_page_translations(page_id, lang);
