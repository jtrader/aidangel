UPDATE public.lessons
SET body = regexp_replace(
  body,
  'When someone is unconscious but breathing, the recovery position can save their life\. It helps them breathe easily and stops them from choking on their own fluids\.\n\n## When to Use It',
  'When someone is unconscious but breathing, the recovery position can save their life. It helps them breathe easily and stops them from choking on their own fluids.

:::illustration[recovery-position]

## When to Use It',
  'g'
)
WHERE id = '450ab9c6-a1ea-459e-ac11-939ac85fdac5';