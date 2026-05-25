UPDATE lessons
SET body = REPLACE(
  body,
  E'5. Be ready to do CPR. Someone can stop breathing very quickly after these stings.\n:::\n\n:::warning[Important: Do NOT]',
  E'5. Be ready to do CPR. Someone can stop breathing very quickly after these stings.\n:::\n\n:::illustration[marine-sting-vinegar]\n\n:::warning[Important: Do NOT]'
)
WHERE id = '0d5bf46f-ab58-4ce3-8b66-2059c7dc6626';