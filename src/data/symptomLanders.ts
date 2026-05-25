// Long-tail symptom landing pages.
// Each lander targets a real Australian search query and routes to the
// authoritative KB topic for the full step-by-step procedure.
// Source for all clinical content: St John Australian First Aid 5th Edition
// (St John Ambulance Australia) and Australian Resuscitation Council (ARC).

export type SymptomLander = {
  /** URL slug at /symptoms/:slug */
  slug: string;
  /** H1 on the page */
  h1: string;
  /** <title> tag (≤60 chars target) */
  title: string;
  /** meta description (≤160 chars target) */
  description: string;
  /** Short intro paragraph (plain English, addresses the searcher's panic). */
  intro: string;
  /** Bullet list shown under "Call 000 right now if…" */
  callTriple: string[];
  /** 3–6 quick steps, plain English, action-led. */
  quickSteps: string[];
  /** "Do NOT" warnings */
  doNot?: string[];
  /** KB slug that owns the full procedure. */
  kbSlug: string;
  /** Related lander slugs */
  related: string[];
  /** Whether to flag as urgent (red banner). */
  urgent?: boolean;
  /** FAQ for FAQPage JSON-LD and on-page Q&A. */
  faqs: Array<{ q: string; a: string }>;
};

export const SYMPTOM_LANDERS: SymptomLander[] = [
  {
    slug: "chest-pain",
    h1: "Chest pain first aid — what to do right now",
    title: "Chest pain first aid Australia — call 000 fast",
    description:
      "Sudden chest pain or pressure? Step-by-step first aid for a suspected heart attack in Australia. Call 000, sit them down, give aspirin if safe.",
    intro:
      "Sudden chest pain, tightness or pressure that lasts more than a few minutes — especially with sweating, nausea, jaw or arm pain, or shortness of breath — should be treated as a heart attack until proven otherwise.",
    callTriple: [
      "Chest pain lasting more than 10 minutes, or coming and going",
      "Pain spreading to the jaw, neck, shoulder or arm",
      "Sweating, nausea, dizziness or shortness of breath with the pain",
    ],
    quickSteps: [
      "Call 000 immediately and ask for an ambulance.",
      "Sit the person down, rest and reassure them — do not let them walk.",
      "Loosen tight clothing.",
      "If they are not allergic to aspirin and not bleeding, give one 300 mg aspirin tablet (or 4 × 100 mg) to chew slowly.",
      "If they have angina medication (GTN spray or tablets), help them take it as prescribed.",
      "If they become unresponsive and are not breathing normally, start CPR and send for an AED.",
    ],
    doNot: [
      "Do not drive them to hospital — wait for the ambulance.",
      "Do not give aspirin if they are allergic, under 18, or actively bleeding.",
    ],
    kbSlug: "heart-attack",
    related: ["stroke-signs", "cpr-adult", "anaphylaxis-epipen"],
    urgent: true,
    faqs: [
      {
        q: "What are the warning signs of a heart attack?",
        a: "Central chest pain or pressure lasting more than 10 minutes, often with sweating, nausea, breathlessness, or pain spreading to the jaw, neck or arm. Women and people with diabetes can have less typical symptoms like fatigue or upper-back pain.",
      },
      {
        q: "Should I give aspirin for chest pain?",
        a: "Yes — one 300 mg aspirin chewed slowly, but only if the person is not allergic, not bleeding, and over 18. Do not delay calling 000 to find aspirin.",
      },
      {
        q: "Can I drive them to hospital instead of calling 000?",
        a: "No. Paramedics can start treatment in the ambulance and warn the hospital you're coming. Driving wastes that time and risks cardiac arrest on the road.",
      },
    ],
  },

  {
    slug: "severe-bleeding",
    h1: "Severe bleeding — how to stop it fast",
    title: "How to stop severe bleeding · First Aid Angel",
    description:
      "Heavy bleeding from a cut, wound or accident? Apply firm direct pressure, call 000, keep pressing. St John Australian First Aid 5th Edition steps.",
    intro:
      "Severe bleeding can kill in minutes. The single most important thing you can do is press hard on the wound and keep pressing — do not stop to look.",
    callTriple: [
      "Blood is spurting, pooling, or soaking through pads",
      "The wound is on the neck, chest, abdomen or groin",
      "The person is pale, sweaty, confused or losing consciousness",
    ],
    quickSteps: [
      "Call 000.",
      "Press firmly on the wound with a clean pad, cloth or your gloved hand. Don't stop to look.",
      "If blood soaks through, add more padding on top — never remove the first pad.",
      "Lay the person down and raise the bleeding part above the level of the heart if you can.",
      "If bleeding from a limb won't stop with pressure, apply a tourniquet (or improvised wide band) 5–7 cm above the wound and note the time.",
      "Keep them warm and reassured until the ambulance arrives.",
    ],
    doNot: [
      "Do not remove an embedded object — press around it.",
      "Do not give food or drink.",
    ],
    kbSlug: "bleeding",
    related: ["shock-signs", "snake-bite-australia", "cpr-adult"],
    urgent: true,
    faqs: [
      {
        q: "When should I use a tourniquet?",
        a: "Only when severe limb bleeding will not stop with firm direct pressure. Apply it 5–7 cm above the wound (not over a joint), tighten until bleeding stops, and write the time on the casualty's forehead or skin.",
      },
      {
        q: "Should I clean the wound first?",
        a: "No. Stop the bleeding first. Cleaning can wait for the hospital or for a small wound that has already stopped.",
      },
      {
        q: "The dressing is soaked — should I change it?",
        a: "Never remove the first dressing — you'll pull off the clot. Add more padding on top and keep pressing.",
      },
    ],
  },

  {
    slug: "choking-adult",
    h1: "Choking adult — back blows and chest thrusts",
    title: "Choking first aid for adults · Australian guide",
    description:
      "Adult choking? Five back blows, then five chest thrusts, repeat. Step-by-step Australian first aid following ARC and St John guidelines.",
    intro:
      "If an adult can't speak, cough or breathe, treat it as severe airway obstruction. Australian guidelines use back blows and chest thrusts — not abdominal thrusts (Heimlich) as the first option.",
    callTriple: [
      "They can't speak, cough or breathe",
      "Their lips or face turn blue or grey",
      "They become unresponsive",
    ],
    quickSteps: [
      "Encourage them to cough.",
      "If coughing fails, call 000.",
      "Lean them forward and give up to 5 sharp back blows between the shoulder blades with the heel of your hand. Check after each.",
      "If still choking, give up to 5 chest thrusts — same position as CPR compressions but sharper and slower.",
      "Alternate 5 back blows and 5 chest thrusts until the blockage clears or they become unresponsive.",
      "If they collapse, start CPR. Each time you open the airway for breaths, look in the mouth and remove anything visible.",
    ],
    kbSlug: "choking",
    related: ["choking-child", "choking-baby", "cpr-adult"],
    urgent: true,
    faqs: [
      {
        q: "Should I do the Heimlich manoeuvre?",
        a: "Australian first aid (ARC) uses back blows and chest thrusts instead of abdominal thrusts. Chest thrusts are safer and effective for adults and children.",
      },
      {
        q: "What if they're still choking after I've tried everything?",
        a: "Keep alternating 5 back blows and 5 chest thrusts until paramedics arrive or they become unresponsive. If unresponsive, start CPR — compressions may dislodge the object.",
      },
      {
        q: "They coughed it up — do they still need a doctor?",
        a: "Yes if you did chest thrusts, if they were unresponsive at any point, or if they have ongoing cough, pain or breathing difficulty.",
      },
    ],
  },

  {
    slug: "choking-child",
    h1: "Choking child (1–8 years) — first aid steps",
    title: "Choking child first aid · 1–8 years (Australia)",
    description:
      "Child choking? Five back blows then five chest thrusts. Australian first aid for children aged 1 to 8 — what to do and what to avoid.",
    intro:
      "For a child aged 1 to 8 who can't cough, cry or breathe, use the same back-blow / chest-thrust technique as an adult, but with less force and supported across your lap if needed.",
    callTriple: [
      "Silent or weak cough, can't cry or speak",
      "Lips, face or fingertips turning blue",
      "Collapse or unconsciousness",
    ],
    quickSteps: [
      "Encourage the child to cough.",
      "Call 000 if the cough is silent or weak.",
      "Place the child face-down across your knee, head lower than chest, and give up to 5 firm back blows between the shoulder blades.",
      "Check the mouth — remove any visible object with your fingertip. Do not blind-sweep.",
      "If still choking, give up to 5 chest thrusts (same spot as CPR compressions, sharper and slower).",
      "Alternate 5 back blows and 5 chest thrusts. If they collapse, start child CPR (30 compressions : 2 breaths).",
    ],
    kbSlug: "choking",
    related: ["choking-baby", "choking-adult", "cpr-adult"],
    urgent: true,
    faqs: [
      {
        q: "Can I use abdominal thrusts on a child?",
        a: "Australian guidelines use chest thrusts, not abdominal thrusts, because they're safer for children's smaller abdomens.",
      },
      {
        q: "Should I put my fingers in the child's mouth?",
        a: "Only to remove an object you can clearly see. Blind finger-sweeps can push the object deeper.",
      },
    ],
  },

  {
    slug: "choking-baby",
    h1: "Choking baby (under 1 year) — first aid",
    title: "Choking baby first aid · under 1 (Australia)",
    description:
      "Baby choking? Five back blows then five chest thrusts with two fingers. Australian first aid for infants under 1 year — exact technique.",
    intro:
      "For a baby under 1 who can't cry, cough or breathe, lay them face-down along your forearm with their head lower than their body. Never use abdominal thrusts on a baby.",
    callTriple: [
      "Silent or weak cough, can't cry",
      "Lips or face turning blue",
      "Going limp or unresponsive",
    ],
    quickSteps: [
      "Call 000.",
      "Support the baby face-down along your forearm with their head lower than their body, jaw supported.",
      "Give up to 5 firm back blows between the shoulder blades with the heel of your hand.",
      "Check the mouth after each blow — only remove an object you can see.",
      "If still choking, turn the baby face-up and give up to 5 chest thrusts with two fingers on the lower half of the breastbone.",
      "Alternate 5 back blows and 5 chest thrusts. If unresponsive, start infant CPR (30:2, two fingers).",
    ],
    doNot: [
      "Do not use abdominal thrusts on a baby — they can damage internal organs.",
      "Do not blind-sweep the mouth.",
    ],
    kbSlug: "choking",
    related: ["choking-child", "cpr-adult", "drowning-rescue"],
    urgent: true,
    faqs: [
      {
        q: "How hard should I hit a baby's back?",
        a: "Firmly enough to dislodge the object, but with the heel of your hand and the baby supported. The force is much less than for an adult.",
      },
      {
        q: "Should I do CPR if the baby is choking but breathing?",
        a: "No. CPR is only for a baby who is unresponsive and not breathing normally.",
      },
    ],
  },

  {
    slug: "anaphylaxis-epipen",
    h1: "Anaphylaxis — when and how to use an EpiPen",
    title: "Anaphylaxis & EpiPen first aid · Australia",
    description:
      "Severe allergic reaction? Lay them flat, give the EpiPen into the outer thigh, call 000. Australian anaphylaxis first aid step by step.",
    intro:
      "Anaphylaxis is a severe, life-threatening allergic reaction. Any difficulty breathing, swelling of the tongue or throat, persistent dizziness, or collapse after an allergen means: give adrenaline (EpiPen) now and call 000.",
    callTriple: [
      "Difficulty or noisy breathing, wheeze or persistent cough",
      "Swelling of the tongue or tightness in the throat",
      "Persistent dizziness, collapse, pale and floppy (young child)",
    ],
    quickSteps: [
      "Lay the person flat. If breathing is hard, allow them to sit — never stand or walk.",
      "Give the adrenaline auto-injector (EpiPen) into the outer mid-thigh, through clothing if needed. Hold for 3 seconds.",
      "Call 000 — say \"anaphylaxis\".",
      "If no improvement after 5 minutes, give a second EpiPen if available.",
      "If they become unresponsive and stop breathing normally, start CPR.",
      "Stay with them until paramedics arrive — symptoms can return.",
    ],
    doNot: [
      "Do not stand them up or let them walk to the bathroom.",
      "Do not give antihistamines or asthma puffer instead of adrenaline.",
    ],
    kbSlug: "anaphylaxis",
    related: ["asthma-attack", "chest-pain", "cpr-adult"],
    urgent: true,
    faqs: [
      {
        q: "Can I give an EpiPen if I'm not sure it's anaphylaxis?",
        a: "Yes. Adrenaline is safe to give if you suspect anaphylaxis — delay is far more dangerous than giving it unnecessarily.",
      },
      {
        q: "Why must they lie flat?",
        a: "Sitting or standing during anaphylaxis can cause the heart to empty and lead to cardiac arrest. Lay them flat, or sitting only if breathing is hard.",
      },
      {
        q: "Do they still need hospital if the EpiPen worked?",
        a: "Yes. Symptoms can return up to several hours later (biphasic reaction). They must be observed in hospital.",
      },
    ],
  },

  {
    slug: "stroke-signs",
    h1: "Stroke signs — F.A.S.T. test and what to do",
    title: "Stroke signs FAST · Australian first aid",
    description:
      "Face drooping, arm weakness, slurred speech? Use the FAST test and call 000 immediately. Stroke first aid for Australia.",
    intro:
      "A stroke is a brain attack. Every minute without treatment, brain cells die. Use the F.A.S.T. test and call 000 the moment you suspect one — even if the signs go away.",
    callTriple: [
      "Face: drooping on one side",
      "Arms: one arm drifts down when both are raised",
      "Speech: slurred, garbled, or trouble understanding",
    ],
    quickSteps: [
      "Call 000 immediately. Note the exact time symptoms started — clot-busting treatment depends on it.",
      "Keep the person calm and still. Loosen tight clothing.",
      "If they are conscious, sit them up slightly.",
      "If unconscious but breathing, put them in the recovery position on their affected side.",
      "Do not give food, drink or medication — they may not be able to swallow safely.",
      "Stay with them and reassure. If they stop breathing normally, start CPR.",
    ],
    kbSlug: "stroke",
    related: ["chest-pain", "seizure-first-aid", "cpr-adult"],
    urgent: true,
    faqs: [
      {
        q: "What does FAST stand for?",
        a: "Face drooping, Arm weakness, Speech difficulty, Time to call 000. If any one of F, A or S is present, suspect stroke.",
      },
      {
        q: "Symptoms went away — do they still need help?",
        a: "Yes. A transient ischaemic attack (TIA, or 'mini-stroke') is a warning that a full stroke may follow within hours. Still call 000.",
      },
    ],
  },

  {
    slug: "snake-bite-australia",
    h1: "Snake bite first aid in Australia — pressure immobilisation",
    title: "Snake bite first aid Australia · pressure bandage",
    description:
      "Bitten by a snake in Australia? Don't wash the bite. Apply a firm pressure-immobilisation bandage from fingers/toes upward, splint the limb, call 000.",
    intro:
      "Australia has the world's most venomous snakes — but with correct first aid almost all bites are survivable. Keep the person still and bandage the entire limb firmly. Never cut, suck or wash the bite.",
    callTriple: [
      "Any suspected snake bite — even if you didn't see the snake",
      "Drowsiness, blurred vision, headache, nausea or paralysis",
      "Collapse or difficulty breathing",
    ],
    quickSteps: [
      "Call 000. Keep the person absolutely still — don't walk them anywhere.",
      "Do NOT wash the bite — venom on the skin helps identify the snake.",
      "Apply a broad heavy-crepe bandage firmly over the bite, then bandage the entire limb from fingers/toes upward as tightly as you would for a sprained ankle.",
      "Mark the bite site on the bandage with a pen.",
      "Splint the limb so it cannot move (use a stick, board or rolled magazine).",
      "Keep the person still and reassured until the ambulance arrives.",
    ],
    doNot: [
      "Do not cut, suck or apply a tourniquet.",
      "Do not try to catch or kill the snake.",
      "Do not let the person walk.",
    ],
    kbSlug: "snake-bite",
    related: ["spider-bite-australia", "severe-bleeding", "shock-signs"],
    urgent: true,
    faqs: [
      {
        q: "Should I try to identify the snake?",
        a: "No. Hospitals use a venom detection kit on the bite site. Trying to catch the snake risks a second bite.",
      },
      {
        q: "How tight should the bandage be?",
        a: "As tight as a firm sprain bandage — you should be able to slide a finger underneath with difficulty. Bandage the whole limb, not just the bite.",
      },
      {
        q: "What if the bite is on the torso, head or neck?",
        a: "Pressure-immobilisation can't be applied — use firm direct pressure with a pad over the bite and keep the person still while you wait for paramedics.",
      },
    ],
  },

  {
    slug: "burn-first-aid",
    h1: "Burn first aid — 20 minutes of cool running water",
    title: "Burn first aid · cool running water 20 minutes",
    description:
      "Burnt skin? Hold under cool running water for 20 minutes — even hours after the burn. Cover loosely with cling film. Never use ice or butter.",
    intro:
      "The single best treatment for any thermal burn is 20 minutes of cool (not cold) running water — and it still works up to 3 hours after the burn happened.",
    callTriple: [
      "Burn larger than a 20-cent coin on a child, or larger than the person's palm",
      "Burns to the face, hands, feet, genitals or over a joint",
      "Burns from electricity, chemicals or inhaled smoke",
    ],
    quickSteps: [
      "Move the person away from the source. Stop the burning (drop and roll, smother flames).",
      "Hold the burn under cool running tap water for 20 minutes. Don't use ice.",
      "Remove jewellery and loose clothing around the burn before it swells. Don't peel off stuck fabric.",
      "After cooling, cover loosely with cling film (lengthways, not wrapped tight) or a clean non-stick dressing.",
      "Give paracetamol or ibuprofen for pain if appropriate.",
      "Seek medical help for any burn larger than a 20-cent coin, on the face/hands/feet/genitals, or that blisters.",
    ],
    doNot: [
      "Do not apply butter, oil, toothpaste, egg or ice.",
      "Do not break blisters.",
    ],
    kbSlug: "burns",
    related: ["sunburn-treatment", "electric-shock-first-aid", "shock-signs"],
    urgent: false,
    faqs: [
      {
        q: "How long do I need to cool a burn?",
        a: "20 minutes of cool running water. Research shows it reduces depth of injury and scarring even when started hours later.",
      },
      {
        q: "Can I use ice on a burn?",
        a: "No. Ice causes further tissue damage. Use cool running tap water only.",
      },
      {
        q: "Should I pop the blisters?",
        a: "No. Intact blisters protect the skin underneath. A doctor will decide if they need draining.",
      },
    ],
  },

  {
    slug: "asthma-attack",
    h1: "Asthma attack — the 4 × 4 × 4 plan",
    title: "Asthma attack first aid · 4x4x4 plan",
    description:
      "Severe asthma attack? Sit upright, 4 puffs of blue reliever via spacer, wait 4 minutes, repeat. Call 000 if no improvement.",
    intro:
      "An asthma attack means the airways have narrowed. The Australian asthma first aid plan is simple: 4 puffs, wait 4 minutes, repeat — call 000 at any point if breathing is severe or not improving.",
    callTriple: [
      "Can't speak in full sentences, very distressed",
      "Lips turning blue or face turning grey",
      "No improvement after the first 4 puffs",
    ],
    quickSteps: [
      "Sit the person upright — never lay them down.",
      "Shake the blue reliever puffer (Ventolin or Asmol) and give 4 separate puffs through a spacer. Take 4 breaths from the spacer after each puff.",
      "Wait 4 minutes.",
      "If no improvement, give another 4 puffs the same way.",
      "Call 000 if no improvement, or sooner if symptoms are severe.",
      "Keep giving 4 puffs every 4 minutes until the ambulance arrives.",
    ],
    kbSlug: "asthma",
    related: ["anaphylaxis-epipen", "chest-pain", "cpr-adult"],
    urgent: true,
    faqs: [
      {
        q: "What if there's no spacer?",
        a: "Give 4 puffs directly from the puffer, one puff at a time, with 4 slow breaths between each — but a spacer is much more effective.",
      },
      {
        q: "Can I give too much Ventolin?",
        a: "In an emergency, the 4×4×4 plan is safe to keep giving every 4 minutes until paramedics arrive. Side effects like shakiness will pass.",
      },
    ],
  },

  {
    slug: "seizure-first-aid",
    h1: "Seizure first aid — what to do (and what not to do)",
    title: "Seizure first aid Australia · stay, protect, time it",
    description:
      "Someone having a seizure? Stay with them, protect their head, time the seizure, recovery position once it ends. Never put anything in their mouth.",
    intro:
      "Most seizures end on their own within a few minutes. Your job is to keep them safe, time the seizure, and put them in the recovery position once it ends.",
    callTriple: [
      "Seizure lasts longer than 5 minutes",
      "A second seizure follows quickly",
      "Injury, breathing difficulty, or it's their first known seizure",
    ],
    quickSteps: [
      "Stay calm and time the seizure from when it starts.",
      "Move hard or sharp objects out of the way. Cushion the head with something soft.",
      "Do not restrain them and do not put anything in their mouth.",
      "Once movements stop, gently roll them into the recovery position on their side.",
      "Stay with them as they wake. They will be drowsy and confused.",
      "Call 000 if it lasts over 5 minutes, repeats, they are injured, or it's their first seizure.",
    ],
    doNot: [
      "Never put fingers, a spoon, or anything else in their mouth.",
      "Do not restrain their movements.",
    ],
    kbSlug: "seizures",
    related: ["stroke-signs", "diabetic-emergency", "fainting-collapse"],
    urgent: false,
    faqs: [
      {
        q: "Can they swallow their tongue?",
        a: "No. That's a myth. Putting anything in their mouth risks broken teeth and a bitten finger. Just protect the head.",
      },
      {
        q: "When do I have to call 000?",
        a: "If the seizure lasts more than 5 minutes, a second one follows quickly, they're injured, in water, pregnant, diabetic, or it's their first known seizure.",
      },
    ],
  },

  {
    slug: "drowning-rescue",
    h1: "Drowning rescue — first aid after the water",
    title: "Drowning first aid Australia · 5 rescue breaths first",
    description:
      "Pulled someone from the water? Start with 5 rescue breaths, then CPR 30:2 if not breathing normally. Call 000. Australian drowning first aid.",
    intro:
      "Drowning casualties are hypoxic — the priority is oxygen. Unlike standard adult CPR, drowning resuscitation starts with 5 rescue breaths before chest compressions.",
    callTriple: [
      "Anyone pulled unconscious from the water",
      "Not breathing normally",
      "Persistent cough, breathlessness or vomiting after a near-drowning",
    ],
    quickSteps: [
      "Get them out of the water safely — don't become a second casualty.",
      "Call 000 and send for an AED.",
      "Check for response and normal breathing.",
      "If not breathing normally, give 5 initial rescue breaths.",
      "Then start CPR — 30 compressions, 2 breaths — and continue until paramedics arrive or they recover.",
      "If they vomit, roll them on their side, clear the mouth, and continue CPR.",
    ],
    kbSlug: "drowning",
    related: ["cpr-adult", "choking-baby", "hypothermia-rewarming"],
    urgent: true,
    faqs: [
      {
        q: "Why 5 rescue breaths first for drowning?",
        a: "Cardiac arrest from drowning is caused by lack of oxygen, so the priority is to get air into the lungs before circulating blood.",
      },
      {
        q: "Should I try to drain water from their lungs?",
        a: "No. There's very little water in the lungs and trying to drain it delays CPR. Start breaths and compressions immediately.",
      },
      {
        q: "They seem fine — do they need hospital?",
        a: "Yes. Anyone pulled unconscious from water, or who had a coughing/breathless episode, needs medical review — delayed lung problems can develop hours later.",
      },
    ],
  },
];

export const getLanderBySlug = (slug: string) =>
  SYMPTOM_LANDERS.find((l) => l.slug === slug);
