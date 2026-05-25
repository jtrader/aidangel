UPDATE public.lessons
SET body = REPLACE(body, 
  ':::\n\n## Back Blows', 
  ':::\n\n:::illustration[infant-back-blows]\n\n## Back Blows')
WHERE slug = 'infant';