
CREATE TYPE public.pending_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.pending_educators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text,
  type public.educator_type NOT NULL DEFAULT 'commercial',
  blurb text,
  website text,
  booking_url text,
  logo_url text,
  hq_country_code text,
  is_online boolean NOT NULL DEFAULT false,
  country_code text,
  region text,
  city text,
  address text,
  postcode text,
  lat double precision,
  lng double precision,
  phone text,
  languages text[] NOT NULL DEFAULT '{}',
  service_area_notes text,
  source text NOT NULL DEFAULT 'manual', -- 'manual' | 'crawler' | 'submission'
  source_url text,
  submitter_name text,
  submitter_email text,
  status public.pending_status NOT NULL DEFAULT 'pending',
  review_notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pending_educators_status ON public.pending_educators(status);
CREATE INDEX idx_pending_educators_country ON public.pending_educators(country_code);

CREATE TRIGGER trg_pending_educators_updated
BEFORE UPDATE ON public.pending_educators
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.pending_educators ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can submit
CREATE POLICY "Anyone can submit a pending educator"
ON public.pending_educators
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admins can do anything
CREATE POLICY "Admins manage pending educators"
ON public.pending_educators
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
