BEGIN;
INSERT INTO public.courses (slug, title, summary, description, duration_minutes, level, pass_mark, sort_order, is_published)
VALUES ('asthma', 'Asthma Attack', 'Recognise and respond to an asthma attack with the 4x4x4 plan.', 'Spotting asthma vs anaphylaxis, blue reliever technique, the 4x4x4 plan, and when to call [000](tel:000).', 20, 'beginner', 80, 13, true)
ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order, is_published=true;

DELETE FROM public.lessons WHERE course_id = (SELECT id FROM public.courses WHERE slug='asthma');
DELETE FROM public.quiz_questions WHERE course_id = (SELECT id FROM public.courses WHERE slug='asthma');
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='asthma'), 'overview', 'Overview', 'Sit the person upright, give 4 puffs of a blue reliever puffer through a spacer (1 puff at a time, 4 breaths each), wait 4 minutes, repeat if no improvement. Call 000 if symptoms do not improve.', 0, 5);
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='asthma'), 'recognise-an-asthma-attack', 'Recognise an asthma attack', '- Wheezing, persistent cough, tight chest
- Difficulty speaking in full sentences
- Anxiety, pale, sweaty skin
- Blue lips, exhaustion — call **000 immediately**', 1, 5);
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='asthma'), 'asthma-first-aid-plan-4-x-4-x-4', 'Asthma First Aid Plan (4 x 4 x 4)', ':::steps
1. **Sit the person upright.** Stay calm and reassuring.
2. Give **4 separate puffs** of a blue/grey reliever (e.g. Ventolin, Asmol) — one puff at a time, taking **4 breaths** from a spacer after each puff. Use a spacer if available.
3. **Wait 4 minutes.**
4. If there is no improvement, give another **4 puffs**.
5. If there is still no improvement, **call 000** and keep giving 4 puffs every 4 minutes until the ambulance arrives.
:::
', 2, 5);
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='asthma'), 'severe-attack-call-000-first', 'Severe attack — call 000 first', 'Call 000 immediately if:
- The person is struggling to breathe.
- Their lips look blue.
- They have collapsed.
- There is no reliever available.

While waiting for the ambulance, keep giving 4 puffs every 4 minutes.', 3, 5);
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='asthma'), 'adrenaline-anaphylaxis-with-asthma', 'Adrenaline (anaphylaxis with asthma)', 'If the person also has an EpiPen and a known severe allergy, give the **adrenaline first**, then the asthma reliever. See [anaphylaxis](/kb/anaphylaxis).', 4, 5);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='asthma'), 'What is the very first step when helping someone having an asthma attack?', '["Help the person to lay down comfortably.", "Give 4 puffs of a blue reliever puffer.", "Sit the person upright.", "Call 000 immediately."]'::jsonb, 2, 'According to the ''Asthma First Aid Plan (4 x 4 x 4)'', the first step is to ''Sit the person upright. Stay calm and reassuring.''', 0);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='asthma'), 'After giving the initial 4 puffs of a blue reliever and waiting 4 minutes, what is the next step if there is no improvement?', '["Immediately call 000.", "Give another 4 puffs of the reliever.", "Help the person to walk around to improve breathing.", "Give the person water to drink."]'::jsonb, 1, 'The ''Asthma First Aid Plan (4 x 4 x 4)'' states that if there is no improvement after waiting 4 minutes, you should ''give another 4 puffs''.', 1);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='asthma'), 'When should you call 000 immediately for someone experiencing an asthma attack?', '["If the person is wheezing slightly.", "If the person has a persistent cough.", "If their lips look blue or they have collapsed.", "If they are having difficulty speaking in full sentences."]'::jsonb, 2, 'The ''Severe attack — call 000 first'' section states to ''Call 000 immediately if: The person is struggling to breathe. Their lips look blue. They have collapsed. There is no reliever available.''', 2);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='asthma'), 'A person having an asthma attack also has an EpiPen for a known severe allergy. What is the correct order of action?', '["Give the asthma reliever first, then the adrenaline.", "Give the adrenaline first, then the asthma reliever.", "Call 000 before giving any medication.", "Only give the adrenaline if breathing stops."]'::jsonb, 1, 'The ''Adrenaline (anaphylaxis with asthma)'' section states, ''If the person also has an EpiPen and a known severe allergy, give the adrenaline first, then the asthma reliever.''', 3);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='asthma'), 'You have called 000 because someone''s asthma attack is not improving after repeated doses of reliever. What should you do while waiting for the ambulance?', '["Stop giving the reliever and wait for paramedics.", "Continue giving 4 puffs every 4 minutes.", "Try to get the person to lie down and rest.", "Offer them a warm drink to ease their throat."]'::jsonb, 1, 'The ''Asthma First Aid Plan (4 x 4 x 4)'' and ''Severe attack — call 000 first'' sections indicate that if 000 has been called, you should ''keep giving 4 puffs every 4 minutes until the ambulance arrives.''', 4);

INSERT INTO public.courses (slug, title, summary, description, duration_minutes, level, pass_mark, sort_order, is_published)
VALUES ('dehydration', 'Dehydration', 'Spot early signs and rehydrate safely.', 'Mild vs severe dehydration in adults, children and the elderly. Oral rehydration and red flags.', 20, 'beginner', 80, 14, true)
ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order, is_published=true;

DELETE FROM public.lessons WHERE course_id = (SELECT id FROM public.courses WHERE slug='dehydration');
DELETE FROM public.quiz_questions WHERE course_id = (SELECT id FROM public.courses WHERE slug='dehydration');
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='dehydration'), 'overview', 'Overview', 'Move the person to a cool place and let them sip water or an oral rehydration solution slowly. Severe dehydration — confusion, no urine output, rapid pulse — needs an ambulance.', 0, 5);
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='dehydration'), 'signs', 'Signs', '- Thirst, dry mouth
- Dark yellow urine or no urine
- Headache, dizziness, fatigue
- Sunken eyes, dry skin
- Rapid pulse and breathing (severe)', 1, 5);
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='dehydration'), 'what-to-do', 'What to do', ':::steps
1. Move to a cool place and rest.
2. Sip water or an oral rehydration solution slowly — small frequent sips are better than gulping.
3. Avoid caffeine, alcohol and sugary drinks.
4. For mild dehydration in children, give an oral rehydration solution (e.g. Hydralyte).
5. **Call 000** if the person is confused, has stopped passing urine, has a rapid pulse, or is unconscious.
:::
', 2, 5);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='dehydration'), 'What is the immediate action for someone experiencing dehydration?', '["Give them a sugary drink.", "Move them to a cool place and let them slowly sip water or an oral rehydration solution.", "Have them lie down and elevate their feet.", "Encourage them to gulp a large amount of water quickly."]'::jsonb, 1, 'The immediate action for dehydration is to move the person to a cool place and let them sip water or an oral rehydration solution slowly.', 0);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='dehydration'), 'Which of the following is a sign of severe dehydration requiring immediate medical attention (calling 000)?', '["Thirst and dry mouth.", "Headache and dizziness.", "Confusion, no urine output, and a rapid pulse.", "Sunken eyes and dry skin."]'::jsonb, 2, 'Severe dehydration, indicated by confusion, no urine output, or a rapid pulse, requires immediate medical attention by calling 000.', 1);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='dehydration'), 'What kind of drinks should be avoided when someone is dehydrated?', '["Water and oral rehydration solutions.", "Small, frequent sips of water.", "Caffeine, alcohol, and sugary drinks.", "Plain water."]'::jsonb, 2, 'When dehydrated, it''s important to avoid caffeine, alcohol, and sugary drinks.', 2);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='dehydration'), 'You are assisting a child with mild dehydration. What is the recommended course of action?', '["Give them a large glass of fruit juice.", "Administer an oral rehydration solution like Hydralyte.", "Encourage them to drink as much water as possible as quickly as they can.", "Give them a caffeinated beverage to boost their energy."]'::jsonb, 1, 'For mild dehydration in children, the recommendation is to give an oral rehydration solution (e.g., Hydralyte).', 3);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='dehydration'), 'When should you call 000 for a person experiencing dehydration?', '["When they express thirst.", "When they have dark yellow urine.", "If the person is confused, has stopped passing urine, has a rapid pulse, or is unconscious.", "If they have a headache and feel dizzy."]'::jsonb, 2, 'Call 000 if the person is confused, has stopped passing urine, has a rapid pulse, or is unconscious, as these are signs of severe dehydration.', 4);

INSERT INTO public.courses (slug, title, summary, description, duration_minutes, level, pass_mark, sort_order, is_published)
VALUES ('dental-injury', 'Dental Injuries', 'Save a knocked-out tooth and control bleeding.', 'Avulsed teeth, broken teeth and bleeding sockets. Milk vs saline storage and the 30-minute window.', 20, 'beginner', 80, 15, true)
ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order, is_published=true;

DELETE FROM public.lessons WHERE course_id = (SELECT id FROM public.courses WHERE slug='dental-injury');
DELETE FROM public.quiz_questions WHERE course_id = (SELECT id FROM public.courses WHERE slug='dental-injury');
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='dental-injury'), 'overview', 'Overview', 'Hold a knocked-out adult tooth by the crown, rinse gently with milk or saline if dirty, and reinsert into the socket if possible — otherwise store in milk or saliva and get to a dentist within 30 minutes.', 0, 5);
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='dental-injury'), 'knocked-out-adult-tooth', 'Knocked-out adult tooth', ':::steps
1. **Hold the tooth by the crown (white part)** — never touch the root.
2. If dirty, rinse very gently with milk or saline (not water if you can avoid it). Do NOT scrub.
3. Try to **reinsert it into the socket** the right way around and have the person bite gently on a clean cloth.
4. If you cannot reinsert it, store the tooth in **milk** or in the person''s **own saliva** (between cheek and gum, if old enough not to swallow it).
5. See a **dentist within 30 minutes** — the sooner the better.
:::
', 1, 5);
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='dental-injury'), 'baby-teeth', 'Baby teeth', 'Do **not** reinsert a knocked-out baby tooth — it can damage the developing adult tooth. Still see a dentist.', 2, 5);
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='dental-injury'), 'broken-or-chipped-tooth', 'Broken or chipped tooth', '- Save any tooth fragments in milk or saliva.
- Rinse the mouth gently with warm water.
- Apply a cold pack to the cheek to reduce swelling.
- See a dentist as soon as possible.', 3, 5);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='dental-injury'), 'A person has knocked out an adult tooth. You have rinsed it gently with milk. What is the immediate next step?', '["Store the tooth in water.", "Attempt to reinsert the tooth into the socket.", "Scrub the tooth clean before reinsertion.", "Transport the person to the nearest emergency room immediately without attempting reinsertion."]'::jsonb, 1, 'After gently rinsing a knocked-out adult tooth, the immediate next step is to attempt reinsertion into the socket if possible, as stated in the source material.', 0);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='dental-injury'), 'Which of the following is the most appropriate storage medium for a knocked-out adult tooth if reinsertion is not possible?', '["Tap water", "Antiseptic mouthwash", "Milk or the person''s own saliva", "A dry tissue"]'::jsonb, 2, 'If a knocked-out adult tooth cannot be reinserted, it should be stored in milk or the person''s own saliva, according to the provided guidelines, to preserve its viability.', 1);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='dental-injury'), 'How quickly should a person with a knocked-out adult tooth see a dentist after the injury?', '["Within 24 hours", "Within 1-2 hours", "Within 30 minutes", "As soon as convenient"]'::jsonb, 2, 'For a knocked-out adult tooth, it is crucial to see a dentist within 30 minutes to maximize the chances of successful reattachment.', 2);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='dental-injury'), 'What is the correct action for a knocked-out baby tooth?', '["Reinsert it immediately to prevent damage to the gum.", "Store it in milk and see a dentist within 30 minutes.", "Do not reinsert it, but still see a dentist.", "Rinse it with water and wait for the adult tooth to emerge."]'::jsonb, 2, 'Knocked-out baby teeth should never be reinserted as it can damage the developing adult tooth. However, a dentist should still be consulted.', 3);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='dental-injury'), 'A person has a broken tooth and some fragments. What should be done with the tooth fragments?', '["Discard them as they cannot be reattached.", "Store them in water until seeing a dentist.", "Save them in milk or saliva and see a dentist as soon as possible.", "Rinse them under cold water and then discard."]'::jsonb, 2, 'For a broken or chipped tooth, any fragments should be saved in milk or saliva, and a dentist should be seen as soon as possible.', 4);

INSERT INTO public.courses (slug, title, summary, description, duration_minutes, level, pass_mark, sort_order, is_published)
VALUES ('diabetes', 'Diabetic Emergencies', 'Recognise hypo vs hyper and treat fast.', 'Hypoglycaemia (low blood sugar) is the immediate threat — give sugar. Hyperglycaemia, DKA red flags.', 20, 'beginner', 80, 16, true)
ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order, is_published=true;

DELETE FROM public.lessons WHERE course_id = (SELECT id FROM public.courses WHERE slug='diabetes');
DELETE FROM public.quiz_questions WHERE course_id = (SELECT id FROM public.courses WHERE slug='diabetes');
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='diabetes'), 'overview', 'Overview', 'If a person with diabetes is confused, sweaty or unwell, assume low blood sugar (hypo) and give sugary food or drink if they can swallow. Call 000 if they do not improve, lose consciousness, or seem severely dehydrated.', 0, 5);
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='diabetes'), 'hypoglycaemia-low-blood-sugar', 'Hypoglycaemia (low blood sugar)', '**Signs:** weakness, sweating, trembling, hunger, confusion, headache, slurred speech, irritable behaviour.

**If conscious and able to swallow:**
:::steps
1. Give **sugar** — soft drink (not diet), juice, jelly beans, glucose tablets.
2. Repeat every **15 minutes** until they recover.
3. Follow with a longer-acting carbohydrate (sandwich, biscuit).
4. If no improvement, **call 000**.
:::

**If unconscious:** call 000, follow [DRSABCD](/kb/drsabcd), place in [recovery position](/kb/recovery-position). Do NOT give anything by mouth.', 1, 5);
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='diabetes'), 'hyperglycaemia-high-blood-sugar', 'Hyperglycaemia (high blood sugar)', '**Signs:** excessive thirst, frequent urination, nausea, fruity breath, drowsiness — develops over hours or days.

- Follow [DRSABCD](/kb/drsabcd).
- Help them with their own insulin if they ask.
- **Call 000** if their condition is worsening or they become drowsy.', 2, 5);
INSERT INTO public.lessons (course_id, slug, title, body, sort_order, duration_minutes)
VALUES ((SELECT id FROM public.courses WHERE slug='diabetes'), 'when-in-doubt-give-sugar', 'When in doubt, give sugar', 'If you are unsure whether it''s a hypo or a hyper, give sugar. It will help a hypo and will not significantly worsen a hyper in the short term.', 3, 5);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='diabetes'), 'A person with diabetes is confused, sweaty, and unwell. They are conscious and can swallow. What is the most appropriate first aid action?', '["Call 000 immediately.", "Give them a diet soft drink.", "Give them sugary food or drink.", "Place them in the recovery position."]'::jsonb, 2, 'The source material states, ''If a person with diabetes is confused, sweaty or unwell, assume low blood sugar (hypo) and give sugary food or drink if they can swallow.''', 0);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='diabetes'), 'Which of the following is a sign of hypoglycemia (low blood sugar)?', '["Excessive thirst.", "Fruity breath.", "Weakness and trembling.", "Frequent urination."]'::jsonb, 2, 'The source material lists ''weakness, sweating, trembling, hunger, confusion, headache, slurred speech, irritable behaviour'' as signs of hypoglycemia.', 1);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='diabetes'), 'A diabetic person who was conscious and received sugar for suspected hypoglycemia does not improve after 15 minutes. What is the next step?', '["Give them a longer-acting carbohydrate like a sandwich.", "Repeat the sugary food or drink.", "Call 000.", "Monitor them for another 15 minutes."]'::jsonb, 2, 'The source material states, ''If no improvement, call 000'' after repeating sugar every 15 minutes.', 2);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='diabetes'), 'You encounter an unconscious person with known diabetes. What is your immediate action?', '["Give them sugary food or drink by mouth.", "Call 000 and follow DRSABCD.", "Administer their insulin if available.", "Wait for them to regain consciousness."]'::jsonb, 1, 'For an unconscious person with hypoglycemia, the source material advises to ''call 000, follow DRSABCD, place in recovery position. Do NOT give anything by mouth.''', 3);
INSERT INTO public.quiz_questions (course_id, question, choices, correct_index, explanation, sort_order)
VALUES ((SELECT id FROM public.courses WHERE slug='diabetes'), 'If you are unsure whether a person is experiencing hypoglycemia or hyperglycemia, what is the recommended action?', '["Call 000 immediately.", "Do nothing and wait for clearer symptoms.", "Give them sugar.", "Attempt to find out their blood sugar history."]'::jsonb, 2, 'The source material advises, ''When in doubt, give sugar. It will help a hypo and will not significantly worsen a hyper in the short term.''', 4);
COMMIT;