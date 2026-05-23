
UPDATE public.educators
SET name = 'First Aid Angel: Emergency Response CPD Refresher',
    blurb = 'Online CPD refresher and first aid awareness course (60–90 minutes). Reinforces emergency response skills including CPR, AED use, choking, bleeding, burns and medical emergencies. Certificate of Completion with CPD hours recorded. Not a replacement for nationally recognised first aid certification.',
    updated_at = now()
WHERE id = '4b4379c8-fa6f-4e5f-9632-669fc84d83dc';

INSERT INTO public.educator_profiles (educator_id, who_text, what_text, why_text, how_text, qas, model, generated_at)
VALUES (
  '4b4379c8-fa6f-4e5f-9632-669fc84d83dc',
  E'First Aid Angel: Emergency Response CPD Refresher is designed for individuals who already hold, or have previously held, a first aid qualification and want to keep their knowledge current. It suits healthcare workers, aged care and disability support staff, teachers and education professionals, childcare and early learning educators, community and youth workers, corporate first aid officers, volunteers, and anyone responsible for the safety of others who needs ongoing professional development hours.\n\nImportant: This is a CPD refresher and awareness course. It is not a replacement for hands-on first aid certification or nationally recognised first aid training.',
  E'A 60–90 minute online CPD refresher and first aid awareness course based on the Australian First Aid 5th Edition. Participants review the core principles of emergency response — DRSABCD, calling 000, CPR, AED use, choking, bleeding, burns, asthma, anaphylaxis, stroke, heart attack, seizures and other common emergencies — through practical, easy-to-follow guidance for recognising and responding to urgent situations. On completion, learners receive a Certificate of Completion with CPD hours recorded.',
  E'Skills and confidence fade between formal first aid certifications. This refresher keeps emergency response knowledge sharp, supports continuing professional development requirements, and helps workers, volunteers and carers feel prepared to act in the critical first minutes of an emergency. It is for professional development and first aid awareness only — it does not replace hands-on practical assessment or nationally recognised first aid certification.',
  E'Delivered fully online so learners can complete it anywhere, in their own time, on any device. The course takes 60–90 minutes and combines structured lessons with short quizzes. A Certificate of Completion with CPD hours recorded is issued at the end. Pass mark is 80%. This course does not include a practical assessment component.',
  '[]'::jsonb,
  'manual',
  now()
)
ON CONFLICT (educator_id) DO UPDATE
SET who_text = EXCLUDED.who_text,
    what_text = EXCLUDED.what_text,
    why_text = EXCLUDED.why_text,
    how_text = EXCLUDED.how_text,
    updated_at = now(),
    generated_at = now(),
    model = 'manual';
