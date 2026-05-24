UPDATE public.courses SET sort_order = sort_order + 1 WHERE sort_order BETWEEN 1 AND 7;
UPDATE public.courses SET sort_order = 1 WHERE slug = 'recovery-drsabcd';