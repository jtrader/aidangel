UPDATE public.lessons
SET body = REPLACE(
  body,
  'Never let someone having anaphylaxis stand or walk. This can make the situation much worse.' || E'\n' || ':::',
  'Never let someone having anaphylaxis stand or walk. This can make the situation much worse.' || E'\n' || ':::' || E'\n' || E'\n' || ':::illustration[anaphylaxis-positioning]' || E'\n'
)
WHERE slug = 'venom-anaphylaxis';