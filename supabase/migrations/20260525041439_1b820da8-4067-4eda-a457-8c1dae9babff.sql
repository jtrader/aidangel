UPDATE lessons
SET body = REPLACE(
  body,
  ':::\n\n:::warning[Important]\nDo NOT let someone with anaphylaxis stand up or walk around suddenly.',
  ':::\n\n:::illustration[anaphylaxis-positioning]\n\n:::warning[Important]\nDo NOT let someone with anaphylaxis stand up or walk around suddenly.'
)
WHERE slug = 'positioning'
  AND course_id = (
    SELECT id FROM courses WHERE slug = 'anaphylaxis-allergies'
  );