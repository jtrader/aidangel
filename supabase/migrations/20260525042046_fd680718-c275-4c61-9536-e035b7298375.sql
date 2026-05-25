UPDATE public.lessons
SET body = REPLACE(
    REPLACE(body,
        '4. After each blow, check their mouth. If you see the object, carefully remove it.\n:::',
        '4. After each blow, check their mouth. If you see the object, carefully remove it.\n:::\n\n:::illustration[choking-back-blows]\n:::'
    ),
    '3. After each thrust, check their mouth for the object.\n:::',
    '3. After each thrust, check their mouth for the object.\n:::\n\n:::illustration[choking-abdominal-thrusts]\n:::'
)
WHERE slug = 'adult-child';