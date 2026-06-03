CREATE TABLE public.route_catalogue_sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  synced_count int NOT NULL DEFAULT 0,
  error text,
  triggered_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT ON public.route_catalogue_sync_runs TO authenticated;
GRANT ALL ON public.route_catalogue_sync_runs TO service_role;
ALTER TABLE public.route_catalogue_sync_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sync_runs_admin_read" ON public.route_catalogue_sync_runs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE INDEX idx_route_sync_runs_started ON public.route_catalogue_sync_runs (started_at DESC);