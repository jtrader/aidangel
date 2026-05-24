-- Move Recovery Position & DRSABCD (sort_order 8) to position 1
-- Shift topics 1-7 down by one position
UPDATE program_topics 
SET sort_order = CASE 
  WHEN sort_order = 8 THEN 1
  WHEN sort_order >= 1 AND sort_order <= 7 THEN sort_order + 1
  ELSE sort_order
END
WHERE program_id = (SELECT id FROM programs WHERE slug = 'emergency-response-program');