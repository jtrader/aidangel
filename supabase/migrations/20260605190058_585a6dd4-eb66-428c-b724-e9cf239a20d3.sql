ALTER TABLE public.route_clicks
  ADD COLUMN IF NOT EXISTS zone text,
  ADD COLUMN IF NOT EXISTS shopify_handle text;

CREATE INDEX IF NOT EXISTS idx_route_clicks_zone ON public.route_clicks(zone);
CREATE INDEX IF NOT EXISTS idx_route_clicks_shopify_handle ON public.route_clicks(shopify_handle);