-- Shareable preview tokens for CMS pages
ALTER TABLE public.cms_pages
  ADD COLUMN IF NOT EXISTS preview_token uuid NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS cms_pages_preview_token_idx
  ON public.cms_pages(preview_token);

-- Security-definer RPC: returns the page + blocks (+ optional translations) when the token matches.
-- Bypasses RLS / is_published so reviewers can see drafts on any device via the tokenized link.
CREATE OR REPLACE FUNCTION public.get_cms_preview(
  p_slug text,
  p_token uuid,
  p_lang text DEFAULT 'en'
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_page public.cms_pages%ROWTYPE;
  v_blocks jsonb;
  v_page_tr jsonb;
  v_block_trs jsonb;
BEGIN
  SELECT * INTO v_page FROM public.cms_pages WHERE slug = p_slug;
  IF NOT FOUND OR v_page.preview_token <> p_token THEN
    RETURN NULL;
  END IF;

  SELECT COALESCE(jsonb_agg(to_jsonb(b) ORDER BY b.sort_order), '[]'::jsonb)
    INTO v_blocks
  FROM public.cms_blocks b
  WHERE b.page_id = v_page.id;

  IF p_lang IS NOT NULL AND p_lang <> 'en' THEN
    SELECT to_jsonb(pt) INTO v_page_tr
      FROM public.cms_page_translations pt
      WHERE pt.page_id = v_page.id AND pt.lang = p_lang;

    SELECT COALESCE(jsonb_agg(to_jsonb(bt)), '[]'::jsonb) INTO v_block_trs
      FROM public.cms_block_translations bt
      WHERE bt.lang = p_lang
        AND bt.block_id IN (SELECT id FROM public.cms_blocks WHERE page_id = v_page.id);
  END IF;

  RETURN jsonb_build_object(
    'page', to_jsonb(v_page) - 'preview_token',
    'blocks', v_blocks,
    'page_translation', v_page_tr,
    'block_translations', v_block_trs
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_cms_preview(text, uuid, text) TO anon, authenticated;