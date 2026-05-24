UPDATE public.courses
SET cover_url = regexp_replace(cover_url, '\?.*$', '') || '?v=2'
WHERE slug IN (
  'cpr-essentials','stroke-heart-attack','bites-and-stings','anaphylaxis-allergies',
  'aed-use','cold-emergencies','heat-emergencies','head-injuries-seizures',
  'severe-bleeding','recovery-drsabcd'
);