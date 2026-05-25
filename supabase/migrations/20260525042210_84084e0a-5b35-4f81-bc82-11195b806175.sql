UPDATE public.lessons
SET body = regexp_replace(
    regexp_replace(
        body,
        '(4\. After each blow, check their mouth\. If you see the object, carefully remove it\.)(\n:::)(\n)(\n## Give 5 Chest Thrusts)',
        E'\\1\n:::\n\n:::illustration[choking-back-blows]\n:::\n\\4',
        'g'
    ),
    '(3\. After each thrust, check their mouth for the object\.)(\n:::)(\n)(\nKeep alternating)',
    E'\\1\n:::\n\n:::illustration[choking-abdominal-thrusts]\n:::\n\\4',
    'g'
)
WHERE slug = 'adult-child';