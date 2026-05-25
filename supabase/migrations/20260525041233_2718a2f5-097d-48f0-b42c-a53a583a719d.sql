UPDATE lessons
SET body = replace(
  body,
  ':::

:::did-you-know',
  ':::

:::illustration[heart-attack-pain-map]

:::did-you-know'
)
WHERE slug = 'heart-attack-signs';