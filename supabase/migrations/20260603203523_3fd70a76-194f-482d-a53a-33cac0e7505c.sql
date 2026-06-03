
ALTER TABLE public.programs
  ADD COLUMN IF NOT EXISTS shopify_certificate_variant_id TEXT,
  ADD COLUMN IF NOT EXISTS shopify_certificate_price NUMERIC(10,2);

UPDATE public.programs SET shopify_certificate_variant_id = 'gid://shopify/ProductVariant/48627215401215', shopify_certificate_price = 29.00 WHERE slug = 'emergency-response-essentials';
UPDATE public.programs SET shopify_certificate_variant_id = 'gid://shopify/ProductVariant/48627216515327', shopify_certificate_price = 29.00 WHERE slug = 'parents-childcare-essentials';
UPDATE public.programs SET shopify_certificate_variant_id = 'gid://shopify/ProductVariant/48627217236223', shopify_certificate_price = 29.00 WHERE slug = 'workplace-trades-essentials';
UPDATE public.programs SET shopify_certificate_variant_id = 'gid://shopify/ProductVariant/48627219071231', shopify_certificate_price = 29.00 WHERE slug = 'outdoor-remote-essentials';
UPDATE public.programs SET shopify_certificate_variant_id = 'gid://shopify/ProductVariant/48627240927487', shopify_certificate_price = 29.00 WHERE slug = 'aged-care-essentials';
