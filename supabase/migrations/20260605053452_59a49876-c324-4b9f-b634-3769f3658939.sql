CREATE TABLE IF NOT EXISTS public.rsp_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site text NOT NULL,
  help_stage text NOT NULL,
  source_event_type text NOT NULL,
  theme text,
  location_language text,
  location_country text,
  sensitivity_tier smallint NOT NULL CHECK (sensitivity_tier BETWEEN 1 AND 4),
  urgency text NOT NULL DEFAULT 'unknown',
  suppression_active boolean NOT NULL DEFAULT false,
  session_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  raw_event_decoupled_at timestamptz
);

GRANT INSERT ON public.rsp_signals TO anon, authenticated;
GRANT ALL ON public.rsp_signals TO service_role;

ALTER TABLE public.rsp_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_only" ON public.rsp_signals
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS rsp_signals_site_idx ON public.rsp_signals (site);
CREATE INDEX IF NOT EXISTS rsp_signals_session_idx ON public.rsp_signals (session_id);
CREATE INDEX IF NOT EXISTS rsp_signals_created_idx ON public.rsp_signals (created_at DESC);
CREATE INDEX IF NOT EXISTS rsp_signals_tier_idx ON public.rsp_signals (sensitivity_tier);