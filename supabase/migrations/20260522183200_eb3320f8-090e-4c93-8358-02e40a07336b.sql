
CREATE TYPE public.claim_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.educator_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  educator_id uuid NOT NULL,
  claimant_name text NOT NULL,
  claimant_email text NOT NULL,
  claimant_role text,
  claimant_phone text,
  message text,
  evidence_url text,
  status public.claim_status NOT NULL DEFAULT 'pending',
  review_notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  claimed_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX educator_claims_educator_idx ON public.educator_claims(educator_id);
CREATE INDEX educator_claims_status_idx ON public.educator_claims(status);

ALTER TABLE public.educator_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a claim"
  ON public.educator_claims FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins manage educator claims"
  ON public.educator_claims FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER touch_educator_claims_updated_at
  BEFORE UPDATE ON public.educator_claims
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.educators
  ADD COLUMN IF NOT EXISTS is_claimed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS claimed_at timestamptz;
