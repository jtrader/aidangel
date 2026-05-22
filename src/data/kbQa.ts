// Curated questions & answers for each KB topic.
// Surfaced on the topic page above the "Related topics" section
// and included in the FAQPage JSON-LD for SEO.
//
// Answers should be short, practical, and consistent with the matching kb/*.md.

export type QA = { q: string; a: string };

export const KB_QA: Record<string, QA[]> = {
  drsabcd: [
    {
      q: "What does DRSABCD stand for?",
      a: "Danger, Response, Send for help, Airway, Breathing, CPR, Defibrillation. It is the standard primary assessment for any collapsed or unresponsive person in Australia.",
    },
    {
      q: "Do I check for breathing before or after calling 000?",
      a: "Send for help first (call 000 or get a bystander to call) so an ambulance is already on its way while you open the airway and check breathing.",
    },
    {
      q: "How do I check if someone is breathing normally?",
      a: "Tilt the head back, lift the chin, then look at the chest, listen at the mouth, and feel for breath on your cheek for up to 10 seconds. Agonal gasping is NOT normal breathing — start CPR.",
    },
  ],
  cpr: [
    {
      q: "How fast and how deep should chest compressions be?",
      a: "Push at 100–120 compressions per minute, about one-third the depth of the chest — roughly 5 cm in an adult. Let the chest fully recoil between compressions.",
    },
    {
      q: "What is the compression-to-breath ratio?",
      a: "30 compressions to 2 rescue breaths for all ages. If you are untrained or unwilling to give breaths, compression-only CPR is still effective for adults.",
    },
    {
      q: "When can I stop CPR?",
      a: "Continue until the person starts breathing normally, paramedics take over, an AED tells you to stop, or you are physically unable to continue.",
    },
  ],
  aed: [
    {
      q: "Can an AED shock someone who doesn't need it?",
      a: "No. An AED analyses the heart rhythm and will only deliver a shock if a shockable rhythm is detected. It is safe to use on anyone unresponsive and not breathing normally.",
    },
    {
      q: "Can I use an AED in the rain or on a wet person?",
      a: "Yes — move the person to a dry surface if you can and quickly dry the chest before applying the pads. Do not delay defibrillation.",
    },
    {
      q: "Where do the pads go on a child?",
      a: "Use paediatric pads if available. Place one pad on the front of the chest and one on the back so they don't touch. Adult pads can be used if paediatric pads are not available.",
    },
  ],
  "recovery-position": [
    {
      q: "When should I put someone in the recovery position?",
      a: "Any unconscious person who is breathing normally and has no suspected spinal injury. It keeps the airway open and lets vomit drain away.",
    },
    {
      q: "How often should I recheck breathing?",
      a: "Every 1–2 minutes until paramedics arrive. If breathing stops or becomes abnormal, roll the person onto their back and start CPR.",
    },
    {
      q: "What if I suspect a spinal injury?",
      a: "Keep the head and neck in line with the body. Only roll them if necessary to keep the airway clear, and use a log-roll with helpers if possible.",
    },
  ],
  choking: [
    {
      q: "What's the difference between mild and severe choking?",
      a: "Mild choking — the person can still cough, breathe or speak; encourage coughing. Severe choking — they cannot breathe, cough or make sound; act immediately with back blows and chest thrusts.",
    },
    {
      q: "Should I do the Heimlich manoeuvre?",
      a: "Australian guidelines use back blows and chest thrusts, not abdominal thrusts (Heimlich). Give up to 5 sharp back blows between the shoulder blades, then up to 5 chest thrusts, alternating until the object clears.",
    },
    {
      q: "How do I help a choking baby?",
      a: "Lay the baby face-down along your forearm with the head lower than the body. Give up to 5 back blows, then turn over and give up to 5 chest thrusts with two fingers on the breastbone. Call 000 if it doesn't clear quickly.",
    },
  ],
  bleeding: [
    {
      q: "How long should I keep pressure on a bleeding wound?",
      a: "At least 10 minutes of firm, continuous pressure. Do not lift the dressing to check — add another pad on top if blood soaks through.",
    },
    {
      q: "When should I use a tourniquet?",
      a: "Only for life-threatening limb bleeding that direct pressure cannot stop. Apply 5–7 cm above the wound (never over a joint), tighten until bleeding stops, and note the time.",
    },
    {
      q: "What about an embedded object in the wound?",
      a: "Do not remove it — it may be plugging the bleed. Apply pressure around the object and pad either side to support it, then call 000.",
    },
  ],
  burns: [
    {
      q: "How long should I cool a burn?",
      a: "Cool running water for 20 minutes — effective for up to 3 hours after the burn. Do not use ice, butter, toothpaste or creams.",
    },
    {
      q: "Should I pop blisters?",
      a: "No. Blisters protect the wound underneath. Cover loosely with a clean non-stick dressing or cling film and seek medical advice.",
    },
    {
      q: "When does a burn need hospital treatment?",
      a: "Any burn larger than a 20-cent coin, burns to the face, hands, feet, genitals or major joints, full-thickness burns, electrical or chemical burns, and any burn on a child.",
    },
  ],
  shock: [
    {
      q: "What are the early signs of shock?",
      a: "Pale, cool, clammy skin; rapid weak pulse; rapid shallow breathing; thirst, nausea and dizziness; restlessness or anxiety.",
    },
    {
      q: "Should I raise the person's legs?",
      a: "Current Australian First Aid guidance is to lie the person flat — do not routinely raise the legs. Treat the underlying cause (bleeding, burns, anaphylaxis) and keep them warm.",
    },
    {
      q: "Can I give them something to drink?",
      a: "Only small sips of cool water if they are fully conscious, can swallow, and have no abdominal injury. Never give alcohol.",
    },
  ],
  asthma: [
    {
      q: "What is the 4x4x4 asthma first aid plan?",
      a: "Give 4 separate puffs of a blue reliever through a spacer (one puff, 4 breaths each), wait 4 minutes, then repeat 4 more puffs if there's no improvement. Call 000 if no improvement after the second round.",
    },
    {
      q: "Can I use someone else's blue puffer in an emergency?",
      a: "Yes. In a severe asthma attack giving a reliever is always better than waiting — short-term use is safe even for someone without diagnosed asthma.",
    },
    {
      q: "When is asthma a 000 emergency?",
      a: "If the person is having difficulty speaking, lips are turning blue, the reliever isn't helping, symptoms get worse quickly, or they become drowsy or unconscious.",
    },
  ],
  anaphylaxis: [
    {
      q: "How do I use an EpiPen?",
      a: "Pull off the blue safety cap, push the orange tip firmly into the outer thigh (through clothing if needed) and hold for 3 seconds. Lay the person flat and call 000.",
    },
    {
      q: "What if symptoms come back after the EpiPen?",
      a: "Give a second adrenaline dose after 5 minutes if symptoms persist or return. Up to 20% of cases need a second dose before paramedics arrive.",
    },
    {
      q: "Should the person stand up after adrenaline?",
      a: "No — keep them lying flat (or sitting up if they cannot breathe well lying down). Standing can cause a fatal drop in blood pressure.",
    },
  ],
  "allergic-reactions": [
    {
      q: "When does a mild allergy become anaphylaxis?",
      a: "Any breathing difficulty, swelling of the tongue or throat, persistent dizziness, collapse, or wheeze — treat as anaphylaxis, give adrenaline if available, and call 000.",
    },
    {
      q: "Do antihistamines help anaphylaxis?",
      a: "No. Antihistamines only help mild skin symptoms — they do not treat the life-threatening airway and circulation effects. Adrenaline is the only first-line treatment.",
    },
    {
      q: "How long should I monitor someone after a reaction?",
      a: "At least 4 hours in hospital after anaphylaxis. Biphasic reactions can occur up to 72 hours later, so seek medical follow-up.",
    },
  ],
  "heart-attack": [
    {
      q: "What does a heart attack feel like?",
      a: "Central chest pain, pressure or heaviness lasting more than 10 minutes, often spreading to the arm, jaw, neck or back, with sweating, nausea or shortness of breath. Symptoms can be subtle, especially in women.",
    },
    {
      q: "Should I give aspirin?",
      a: "If the person is alert, not allergic and not bleeding, give 300 mg of aspirin (one adult tablet) to chew and swallow while waiting for the ambulance.",
    },
    {
      q: "Should I drive them to hospital myself?",
      a: "No. Always call 000 — paramedics can start treatment in the ambulance and divert directly to a cardiac centre.",
    },
  ],
  stroke: [
    {
      q: "How do I use the FAST test?",
      a: "Face — has their face drooped? Arms — can they lift both arms? Speech — is it slurred? Time — call 000 immediately if any sign is present.",
    },
    {
      q: "Why does time matter so much in stroke?",
      a: "Clot-busting and clot-retrieval treatments only work within a few hours of symptom onset. Every minute counts to save brain tissue.",
    },
    {
      q: "Should I give them aspirin?",
      a: "No — strokes can be caused by bleeding in the brain, and aspirin makes that worse. Give nothing by mouth.",
    },
  ],
  seizures: [
    {
      q: "Should I put something in their mouth?",
      a: "Never. People do not swallow their tongue — putting objects in the mouth causes broken teeth and choking.",
    },
    {
      q: "When is a seizure a 000 emergency?",
      a: "First-ever seizure, lasts longer than 5 minutes, repeats without recovery, occurs in water, or the person is pregnant, injured or diabetic.",
    },
    {
      q: "What should I do after the seizure stops?",
      a: "Place them in the recovery position, reassure them as they regain awareness, and stay with them — confusion can last 30 minutes or more.",
    },
  ],
  diabetes: [
    {
      q: "How can I tell if blood sugar is too high or too low?",
      a: "When in doubt, treat as low (hypo) — give sugar. Low blood sugar comes on quickly with sweating, shakes and confusion; high blood sugar develops over hours with thirst, frequent urination and fruity breath.",
    },
    {
      q: "What sugar should I give a conscious person?",
      a: "150 mL of regular soft drink, half a glass of fruit juice, 3 teaspoons of sugar or honey, or 6–7 jellybeans. Follow up with a longer-acting carb like a sandwich.",
    },
    {
      q: "What if they are unconscious?",
      a: "Do not give anything by mouth. Place in the recovery position and call 000.",
    },
  ],
  "head-injury": [
    {
      q: "When does a head injury need an ambulance?",
      a: "Any loss of consciousness, repeated vomiting, worsening headache, confusion, seizures, unequal pupils, weakness, or clear fluid from the nose or ears.",
    },
    {
      q: "Can someone with concussion go to sleep?",
      a: "They can sleep, but a responsible adult should check them every couple of hours for the first 24 hours and seek help if they cannot be roused or behave abnormally.",
    },
    {
      q: "When can they return to sport or driving?",
      a: "Not until cleared by a doctor. A second head knock before the first has healed can cause serious lasting damage.",
    },
  ],
  "spinal-injury": [
    {
      q: "When should I suspect a spinal injury?",
      a: "Any fall from height, diving accident, road crash, significant blunt trauma, or any unconscious trauma patient.",
    },
    {
      q: "What if they need to be moved or rolled?",
      a: "Use a log-roll with multiple helpers, keeping the head, neck and back aligned. Only move them if there is immediate danger, they're vomiting, or to perform CPR.",
    },
    {
      q: "Airway versus spine — which wins?",
      a: "Airway always comes first. A blocked airway will kill faster than careful movement of the spine.",
    },
  ],
  fractures: [
    {
      q: "How can I tell a fracture from a sprain?",
      a: "You often can't. Look for deformity, bone poking through skin, grating, severe pain on movement and inability to use the limb. When in doubt, treat as a fracture.",
    },
    {
      q: "Should I try to straighten a deformed limb?",
      a: "No. Support the limb in the position found and immobilise with a splint or sling. Realignment is a job for paramedics.",
    },
    {
      q: "What about an open fracture (bone showing)?",
      a: "Control bleeding with pressure around — not over — the bone, cover with a clean dressing, immobilise, and call 000.",
    },
  ],
  "sprains-strains": [
    {
      q: "What does RICE stand for?",
      a: "Rest, Ice (20 minutes every 2 hours), Compression with a firm bandage, and Elevation above heart level.",
    },
    {
      q: "What is HARM and why avoid it?",
      a: "Heat, Alcohol, Running and Massage — all of these worsen swelling and bleeding in the first 48 hours.",
    },
    {
      q: "When should I see a doctor?",
      a: "If you cannot bear weight, the joint looks deformed, swelling is severe, or symptoms haven't improved after 48 hours of RICE.",
    },
  ],
  "snake-bite": [
    {
      q: "Should I wash the bite or try to identify the snake?",
      a: "No — do not wash the bite. Venom on the skin helps the hospital identify the snake with a venom detection kit. Never try to catch or kill the snake.",
    },
    {
      q: "How tight should the pressure immobilisation bandage be?",
      a: "As tight as a firm sprain bandage — you should still be able to slide a finger underneath. Cover the whole limb and splint it to stop all movement.",
    },
    {
      q: "When can the bandage come off?",
      a: "Only by paramedics or hospital staff with antivenom ready. Removing it early releases venom into the circulation.",
    },
  ],
  "spider-bite": [
    {
      q: "Which spiders need pressure immobilisation?",
      a: "Funnel-web and mouse spiders only. Treat exactly like a snake bite and call 000.",
    },
    {
      q: "Why not bandage a redback bite?",
      a: "Redback venom acts slowly and the pressure bandage makes the pain much worse. Use a cold pack for pain relief and seek medical aid.",
    },
    {
      q: "Is the white-tail spider really flesh-eating?",
      a: "No — research has not found a link between white-tail bites and skin ulcers. Wash the bite, apply ice, and see a doctor if it becomes infected.",
    },
  ],
  "jellyfish-stings": [
    {
      q: "Should I use vinegar or hot water?",
      a: "Tropical Australia (box jellyfish, irukandji) — flood with vinegar for 30 seconds. Temperate Australia (bluebottle) — rinse with seawater, remove tentacles, then immerse in hot water (45 °C) for 20 minutes.",
    },
    {
      q: "Does urine work on a sting?",
      a: "No — urine can make stinging cells fire and worsen the pain. Use vinegar or hot water as above.",
    },
    {
      q: "When is a jellyfish sting an emergency?",
      a: "Any sting in tropical waters (box jellyfish, irukandji), difficulty breathing, chest or back pain, severe sweating, or collapse — call 000.",
    },
  ],
  "heat-illness": [
    {
      q: "What is the difference between heat exhaustion and heat stroke?",
      a: "Heat exhaustion — heavy sweating, pale clammy skin, headache, nausea. Heat stroke — hot dry skin (sweating may stop), confusion, collapse, seizures. Heat stroke is life-threatening.",
    },
    {
      q: "How do I cool someone with heat stroke?",
      a: "Cold water immersion is best. Otherwise spray with water and fan, and apply ice packs to the neck, armpits and groin while waiting for the ambulance.",
    },
    {
      q: "Should I give them water to drink?",
      a: "Only if they are fully alert and not vomiting. Do not give anything by mouth to a drowsy or confused person.",
    },
  ],
  hypothermia: [
    {
      q: "What body temperature counts as hypothermia?",
      a: "A core body temperature below 35 °C. Signs include shivering, cold pale skin, numbness, slurred speech and drowsiness.",
    },
    {
      q: "Can I use a hot water bottle or heater?",
      a: "No — rapid rewarming can cause heart rhythm problems. Rewarm gradually with dry layers, blankets and body warmth in a sheltered place.",
    },
    {
      q: "How long should I do CPR in hypothermia?",
      a: "Longer than usual. People have been successfully resuscitated after extended periods in cold water — \"not dead until warm and dead\".",
    },
  ],
  poisoning: [
    {
      q: "What number do I call for poisoning?",
      a: "The Australia-wide Poisons Information Centre on 13 11 26 (24/7). Call 000 if the person is unconscious, having trouble breathing or seriously unwell.",
    },
    {
      q: "Should I make them vomit?",
      a: "No — never induce vomiting unless specifically told to by the Poisons Information Centre. Some substances cause more damage on the way back up.",
    },
    {
      q: "What if a child swallows a button battery?",
      a: "Call 000 immediately. Button batteries can burn through the oesophagus within hours and are a true emergency.",
    },
  ],
  drowning: [
    {
      q: "Should I try to empty water from the lungs first?",
      a: "No. Do not press the abdomen or invert the person. Start rescue breathing and CPR straight away — water in the lungs is absorbed by the body.",
    },
    {
      q: "How is drowning CPR different?",
      a: "Begin with 5 initial rescue breaths before chest compressions, because hypoxia (not heart failure) is the underlying problem.",
    },
    {
      q: "Why does every drowning casualty need to go to hospital?",
      a: "Secondary drowning can develop hours later, even in someone who seems fine. Always call 000 and have them assessed.",
    },
  ],
  nosebleed: [
    {
      q: "Should I tip my head back?",
      a: "No — tip the head slightly forward so blood doesn't run down the throat and cause vomiting.",
    },
    {
      q: "How long should I pinch my nose?",
      a: "Pinch the soft part of the nose firmly for a full 10 minutes without releasing. Repeat once if needed.",
    },
    {
      q: "When should a nosebleed be seen by a doctor?",
      a: "If it doesn't stop after 20 minutes, follows a head injury, you're on blood-thinning medication, or the bleeding is heavy enough to make you feel faint.",
    },
  ],
  fainting: [
    {
      q: "What should I do as someone faints?",
      a: "Lay them flat and raise their legs about 30 cm to restore blood flow to the brain. Loosen tight clothing and ensure fresh air.",
    },
    {
      q: "How long should recovery take?",
      a: "Most people recover within 1–2 minutes. If they don't, treat as unconscious — place in the recovery position and call 000.",
    },
    {
      q: "When is fainting a warning sign?",
      a: "Fainting during exercise, with chest pain or palpitations, repeated fainting, or fainting in someone over 50 — see a doctor to rule out heart problems.",
    },
  ],
  dehydration: [
    {
      q: "What's the best drink for dehydration?",
      a: "Plain water or an oral rehydration solution (e.g. Hydralyte). Avoid caffeine, alcohol and sugary drinks — they make dehydration worse.",
    },
    {
      q: "How can I tell if dehydration is severe?",
      a: "Confusion, no urine output, sunken eyes, very rapid pulse and breathing, or loss of consciousness — call 000.",
    },
    {
      q: "How do I rehydrate a young child?",
      a: "Frequent small sips of an oral rehydration solution. Avoid juice and soft drink, which can worsen diarrhoea.",
    },
  ],
  sunburn: [
    {
      q: "How long should I cool sunburn?",
      a: "20 minutes under cool running water. Then apply aloe vera or after-sun gel and drink plenty of water.",
    },
    {
      q: "Can I pop sunburn blisters?",
      a: "Never. Blisters protect the skin underneath — popping them risks infection and scarring.",
    },
    {
      q: "When does sunburn need medical care?",
      a: "Large blistered areas, sunburn on a baby or young child, or any signs of heat illness — fever, vomiting, dizziness or confusion.",
    },
  ],
  "dental-injury": [
    {
      q: "How do I save a knocked-out tooth?",
      a: "Hold by the crown (white part), never the root. If dirty, rinse gently with milk or saline. Reinsert into the socket if possible, or store in milk or the person's own saliva.",
    },
    {
      q: "How fast do I need to get to a dentist?",
      a: "Within 30 minutes for the best chance of saving the tooth. Every minute reduces survival of the root cells.",
    },
    {
      q: "What about baby teeth?",
      a: "Do not reinsert a knocked-out baby tooth — it can damage the developing adult tooth underneath. Still see a dentist.",
    },
  ],
  "eye-injuries": [
    {
      q: "How long do I flush a chemical splash?",
      a: "At least 20 minutes of cool running water, holding the eyelids open and tilting the head so the chemical runs away from the unaffected eye. Then call 000.",
    },
    {
      q: "What if something is embedded in the eye?",
      a: "Don't try to remove it. Cover the eye loosely with a paper cup or pad (no pressure) and cover the other eye too to stop both eyes moving. Call 000.",
    },
    {
      q: "When does a blow to the eye need urgent review?",
      a: "Any vision change, severe pain, blood inside the eye, or an abnormal-looking eye — see a doctor straight away.",
    },
  ],
  "electric-shock": [
    {
      q: "Can I touch someone still in contact with electricity?",
      a: "No. Turn off the power at the mains or unplug the appliance first. For fallen high-voltage lines, stay at least 8 metres away and call 000.",
    },
    {
      q: "Do I need to go to hospital if I feel fine afterwards?",
      a: "Yes — always. Internal burns and heart rhythm problems can develop hours after the shock, even if you feel well.",
    },
    {
      q: "Where do electrical burns usually appear?",
      a: "There are often two burns — an entry point and an exit point. Cool both under cool running water for 20 minutes.",
    },
  ],
};

export function qaFor(slug: string): QA[] {
  return KB_QA[slug] ?? [];
}
