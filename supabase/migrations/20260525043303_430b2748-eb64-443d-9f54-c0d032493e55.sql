-- Embed aed-device-anatomy illustration into the what-is-an-aed lesson
UPDATE public.lessons
SET body = regexp_replace(
  body,
  '(\n\n## What an AED Does)',
  E'\n\n:::illustration[aed-device-anatomy]\n\n\1',
  'i'
)
WHERE slug = 'what-is-an-aed'
  AND course_id = (SELECT id FROM public.courses WHERE slug = 'aed-use');
