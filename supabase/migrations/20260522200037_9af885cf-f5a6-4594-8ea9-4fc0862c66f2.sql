-- Add evidence file paths column to educator_claims
ALTER TABLE public.educator_claims
  ADD COLUMN IF NOT EXISTS evidence_file_paths text[] NOT NULL DEFAULT '{}';

-- Create private storage bucket for claim evidence uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('claim-evidence', 'claim-evidence', false)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone (anon + authenticated) to upload into the claim-evidence bucket.
-- Files are namespaced by a random claim folder created client-side.
CREATE POLICY "Anyone can upload claim evidence"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'claim-evidence');

-- Only admins can read uploaded evidence files.
CREATE POLICY "Admins can read claim evidence"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'claim-evidence' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete evidence files if needed.
CREATE POLICY "Admins can delete claim evidence"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'claim-evidence' AND public.has_role(auth.uid(), 'admin'));