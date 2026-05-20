// Curated first aid help queries — Australian First Aid 5th Edition aligned.
// Used by ChatInput for as-you-type predictive suggestions.

export type Suggestion = {
  text: string;
  category:
    | "Emergency"
    | "CPR & Resus"
    | "Bleeding & Wounds"
    | "Burns"
    | "Bones & Joints"
    | "Breathing"
    | "Cardiac"
    | "Allergy & Anaphylaxis"
    | "Choking"
    | "Stroke"
    | "Seizure"
    | "Diabetes"
    | "Poisoning"
    | "Bites & Stings"
    | "Marine"
    | "Heat & Cold"
    | "Drowning"
    | "Head & Spine"
    | "Eye, Ear, Nose"
    | "Dental"
    | "Childbirth & Infant"
    | "Mental Health"
    | "Learning";
  keywords?: string[];
};

export const firstAidSuggestions: Suggestion[] = [
  // Emergency & general
  { text: "Someone is unconscious — what do I do?", category: "Emergency", keywords: ["unresponsive", "collapsed", "passed out", "fainted"] },
  { text: "When should I call 000?", category: "Emergency", keywords: ["ambulance", "triple zero", "emergency number"] },
  { text: "Walk me through DRSABCD step by step", category: "CPR & Resus", keywords: ["drsabcd", "primary survey", "assessment"] },
  { text: "How do I check if someone is breathing?", category: "Breathing", keywords: ["look listen feel", "breath check"] },
  { text: "How do I put someone in the recovery position?", category: "Emergency", keywords: ["recovery", "side", "lateral"] },

  // CPR
  { text: "How do I do CPR on an adult?", category: "CPR & Resus", keywords: ["compressions", "rescue breaths", "30:2"] },
  { text: "How do I do CPR on a child?", category: "CPR & Resus", keywords: ["paediatric", "kid"] },
  { text: "How do I do CPR on a baby or infant?", category: "CPR & Resus", keywords: ["newborn", "infant", "baby cpr"] },
  { text: "What's the correct CPR compression rate?", category: "CPR & Resus", keywords: ["100-120", "rate"] },
  { text: "How deep should chest compressions be?", category: "CPR & Resus", keywords: ["depth", "5cm", "1/3 chest"] },
  { text: "When should I stop CPR?", category: "CPR & Resus", keywords: ["stop", "exhausted", "ros"] },
  { text: "Can I do CPR without rescue breaths?", category: "CPR & Resus", keywords: ["compression only", "hands only"] },

  // AED
  { text: "How do I use an AED / defibrillator?", category: "CPR & Resus", keywords: ["aed", "defib", "pads", "shock"] },
  { text: "Where can I find the nearest AED?", category: "CPR & Resus", keywords: ["good sam", "defibrillator location"] },
  { text: "Can I use an AED on a child?", category: "CPR & Resus", keywords: ["paediatric pads", "child aed"] },
  { text: "Can I use an AED on someone wet or on metal?", category: "CPR & Resus", keywords: ["water", "metal surface", "rain"] },

  // Bleeding
  { text: "How do I stop severe bleeding?", category: "Bleeding & Wounds", keywords: ["haemorrhage", "pressure", "bleed out"] },
  { text: "Someone has a deep cut — what do I do?", category: "Bleeding & Wounds", keywords: ["laceration", "wound", "knife"] },
  { text: "When should I use a tourniquet?", category: "Bleeding & Wounds", keywords: ["limb", "amputation", "cat tourniquet"] },
  { text: "How do I treat a nosebleed?", category: "Eye, Ear, Nose", keywords: ["epistaxis", "pinch nose"] },
  { text: "How do I treat a bleeding amputation?", category: "Bleeding & Wounds", keywords: ["finger off", "limb amputated"] },
  { text: "How do I treat an embedded object in a wound?", category: "Bleeding & Wounds", keywords: ["impaled", "stuck object", "knife in wound"] },
  { text: "How do I treat a puncture wound?", category: "Bleeding & Wounds", keywords: ["nail", "needle", "stab"] },
  { text: "How do I dress a wound properly?", category: "Bleeding & Wounds", keywords: ["bandage", "dressing", "gauze"] },
  { text: "What is shock and how do I treat it?", category: "Emergency", keywords: ["hypovolaemic", "pale clammy", "shocky"] },
  { text: "How do I treat internal bleeding?", category: "Bleeding & Wounds", keywords: ["abdominal", "internal", "blunt"] },

  // Burns
  { text: "How do I treat a burn?", category: "Burns", keywords: ["scald", "burnt", "heat burn"] },
  { text: "How long should I run cool water on a burn?", category: "Burns", keywords: ["20 minutes", "cold water"] },
  { text: "How do I treat a chemical burn?", category: "Burns", keywords: ["acid", "alkali", "bleach"] },
  { text: "How do I treat an electrical burn?", category: "Burns", keywords: ["electrocution", "powerline", "shock"] },
  { text: "How do I treat sunburn?", category: "Burns", keywords: ["uv", "sun", "blisters"] },
  { text: "What burns need hospital treatment?", category: "Burns", keywords: ["serious burn", "3rd degree", "full thickness"] },
  { text: "Should I pop a burn blister?", category: "Burns", keywords: ["blister", "pop", "burst"] },

  // Bones, joints, sprains
  { text: "How do I treat a suspected broken bone?", category: "Bones & Joints", keywords: ["fracture", "broken arm", "broken leg"] },
  { text: "How do I splint a fracture?", category: "Bones & Joints", keywords: ["splint", "immobilise"] },
  { text: "How do I treat a sprained ankle?", category: "Bones & Joints", keywords: ["rice", "sprain", "twisted ankle"] },
  { text: "What is the RICE method?", category: "Bones & Joints", keywords: ["rest ice compression elevation", "ricer"] },
  { text: "How do I treat a dislocated shoulder?", category: "Bones & Joints", keywords: ["dislocation", "popped out"] },
  { text: "How do I make an arm sling?", category: "Bones & Joints", keywords: ["sling", "triangular bandage"] },
  { text: "How do I treat a suspected spinal injury?", category: "Head & Spine", keywords: ["neck", "back", "spine", "log roll"] },

  // Breathing
  { text: "How do I help someone having an asthma attack?", category: "Breathing", keywords: ["puffer", "ventolin", "wheeze", "4x4x4"] },
  { text: "What is the asthma first aid 4x4x4 plan?", category: "Breathing", keywords: ["asthma plan", "blue puffer"] },
  { text: "How do I help someone hyperventilating?", category: "Breathing", keywords: ["panic", "breathing fast"] },
  { text: "How do I treat a collapsed lung / chest injury?", category: "Breathing", keywords: ["pneumothorax", "sucking chest wound"] },

  // Cardiac
  { text: "What are the signs of a heart attack?", category: "Cardiac", keywords: ["chest pain", "mi", "cardiac"] },
  { text: "Someone is having chest pain — what do I do?", category: "Cardiac", keywords: ["angina", "tight chest"] },
  { text: "Should I give aspirin during a heart attack?", category: "Cardiac", keywords: ["aspirin 300mg"] },
  { text: "What's the difference between cardiac arrest and heart attack?", category: "Cardiac", keywords: ["arrest vs attack"] },

  // Choking
  { text: "Someone is choking — what do I do?", category: "Choking", keywords: ["airway blocked", "can't breathe"] },
  { text: "How do I help a choking baby?", category: "Choking", keywords: ["infant choking", "back blows baby"] },
  { text: "How do I help a choking child?", category: "Choking", keywords: ["kid choking"] },
  { text: "How do I do back blows and chest thrusts?", category: "Choking", keywords: ["heimlich", "back blow", "chest thrust"] },

  // Allergy
  { text: "How do I use an EpiPen?", category: "Allergy & Anaphylaxis", keywords: ["epipen", "adrenaline", "auto injector"] },
  { text: "What are the signs of anaphylaxis?", category: "Allergy & Anaphylaxis", keywords: ["anaphylactic", "swelling", "throat closing"] },
  { text: "What's the difference between allergy and anaphylaxis?", category: "Allergy & Anaphylaxis", keywords: ["mild vs severe allergic"] },
  { text: "How do I treat a mild allergic reaction?", category: "Allergy & Anaphylaxis", keywords: ["hives", "rash", "antihistamine"] },

  // Stroke
  { text: "What are the signs of a stroke?", category: "Stroke", keywords: ["face arms speech time", "fast"] },
  { text: "How do I do the FAST stroke check?", category: "Stroke", keywords: ["fast test", "face droop"] },
  { text: "Someone might be having a stroke — what do I do?", category: "Stroke" },

  // Seizure
  { text: "Someone is having a seizure — what do I do?", category: "Seizure", keywords: ["fit", "convulsion", "epilepsy"] },
  { text: "Should I put something in their mouth during a seizure?", category: "Seizure", keywords: ["bite tongue", "mouthguard"] },
  { text: "When is a seizure an emergency?", category: "Seizure", keywords: ["status epilepticus", "5 minutes"] },
  { text: "How do I help a child having a febrile convulsion?", category: "Seizure", keywords: ["fever fit", "febrile"] },

  // Diabetes
  { text: "How do I treat low blood sugar / hypoglycaemia?", category: "Diabetes", keywords: ["hypo", "low blood glucose", "diabetic"] },
  { text: "How do I treat high blood sugar / hyperglycaemia?", category: "Diabetes", keywords: ["hyper", "dka"] },
  { text: "How do I tell hypo from hyper?", category: "Diabetes", keywords: ["diabetes signs"] },

  // Poisoning
  { text: "Someone has been poisoned — what do I do?", category: "Poisoning", keywords: ["poison", "swallowed"] },
  { text: "What's the Poisons Information number?", category: "Poisoning", keywords: ["13 11 26", "poisons hotline"] },
  { text: "Child swallowed a button battery — what do I do?", category: "Poisoning", keywords: ["button battery", "coin cell"] },
  { text: "Someone has overdosed — what do I do?", category: "Poisoning", keywords: ["overdose", "drugs", "od"] },
  { text: "How do I use naloxone / Nyxoid?", category: "Poisoning", keywords: ["narcan", "opioid overdose"] },
  { text: "Someone inhaled smoke or fumes — what do I do?", category: "Poisoning", keywords: ["carbon monoxide", "smoke inhalation"] },
  { text: "Someone is drunk and unresponsive — what do I do?", category: "Poisoning", keywords: ["alcohol poisoning", "drunk passed out"] },

  // Bites & stings
  { text: "How do I treat a snake bite?", category: "Bites & Stings", keywords: ["snake", "pressure immobilisation", "pib"] },
  { text: "How do I apply a pressure immobilisation bandage?", category: "Bites & Stings", keywords: ["pib", "compression bandage", "snake bite bandage"] },
  { text: "How do I treat a spider bite?", category: "Bites & Stings", keywords: ["redback", "funnel web", "white tail"] },
  { text: "Funnel web spider bite — what do I do?", category: "Bites & Stings", keywords: ["funnel web", "sydney spider"] },
  { text: "Redback spider bite — what do I do?", category: "Bites & Stings", keywords: ["redback"] },
  { text: "How do I treat a bee or wasp sting?", category: "Bites & Stings", keywords: ["bee", "wasp", "stinger"] },
  { text: "How do I treat a tick bite?", category: "Bites & Stings", keywords: ["paralysis tick", "remove tick"] },
  { text: "How do I treat an animal or dog bite?", category: "Bites & Stings", keywords: ["dog bite", "cat bite"] },

  // Marine
  { text: "How do I treat a jellyfish sting?", category: "Marine", keywords: ["bluebottle", "box jellyfish", "irukandji"] },
  { text: "How do I treat a box jellyfish sting?", category: "Marine", keywords: ["box jelly", "vinegar"] },
  { text: "How do I treat a bluebottle sting?", category: "Marine", keywords: ["bluebottle", "hot water"] },
  { text: "How do I treat a stonefish or stingray injury?", category: "Marine", keywords: ["stonefish", "stingray", "hot water"] },
  { text: "How do I treat a blue-ringed octopus bite?", category: "Marine", keywords: ["blue ringed", "octopus"] },

  // Heat & cold
  { text: "How do I treat heat stroke?", category: "Heat & Cold", keywords: ["heatstroke", "overheating"] },
  { text: "How do I treat heat exhaustion?", category: "Heat & Cold", keywords: ["heat exhaustion", "dehydration"] },
  { text: "How do I treat hypothermia?", category: "Heat & Cold", keywords: ["cold", "frozen", "freezing"] },
  { text: "How do I treat frostbite?", category: "Heat & Cold", keywords: ["frostbite", "frozen fingers"] },
  { text: "How do I treat dehydration?", category: "Heat & Cold", keywords: ["dehydrated", "hydralyte"] },

  // Drowning
  { text: "Someone has been pulled from the water — what do I do?", category: "Drowning", keywords: ["drowning", "near drowning", "pool"] },
  { text: "Do I do CPR differently for drowning?", category: "Drowning", keywords: ["drowning cpr", "5 breaths"] },

  // Head & spine
  { text: "How do I treat a head injury?", category: "Head & Spine", keywords: ["concussion", "head knock", "bump"] },
  { text: "What are concussion warning signs?", category: "Head & Spine", keywords: ["concussion symptoms"] },
  { text: "Someone fell from height — what do I do?", category: "Head & Spine", keywords: ["fall", "ladder fall"] },

  // Eye / ear / nose
  { text: "I have something in my eye — what do I do?", category: "Eye, Ear, Nose", keywords: ["foreign body eye", "grit"] },
  { text: "How do I treat a chemical splash to the eye?", category: "Eye, Ear, Nose", keywords: ["eye wash", "irrigation"] },
  { text: "I have something stuck in my ear — what do I do?", category: "Eye, Ear, Nose", keywords: ["foreign body ear", "insect ear"] },

  // Dental
  { text: "I knocked a tooth out — what do I do?", category: "Dental", keywords: ["avulsed tooth", "tooth out", "milk tooth"] },
  { text: "How do I treat a broken tooth?", category: "Dental", keywords: ["chipped tooth", "fractured tooth"] },
  { text: "How do I stop dental bleeding?", category: "Dental", keywords: ["mouth bleed", "gum bleed"] },

  // Childbirth & infant
  { text: "Someone is going into labour — what do I do?", category: "Childbirth & Infant", keywords: ["birth", "delivery", "contractions"] },
  { text: "How do I do infant CPR step by step?", category: "Childbirth & Infant", keywords: ["baby cpr"] },
  { text: "How do I check a baby is breathing?", category: "Childbirth & Infant", keywords: ["baby breathing", "newborn"] },

  // Mental health
  { text: "Someone is having a panic attack — what do I do?", category: "Mental Health", keywords: ["panic", "anxiety attack"] },
  { text: "Someone is threatening self-harm — what do I do?", category: "Mental Health", keywords: ["suicidal", "self harm", "lifeline"] },
  { text: "What is the Lifeline number?", category: "Mental Health", keywords: ["13 11 14", "lifeline"] },

  // Learning / general
  { text: "What should be in a home first aid kit?", category: "Learning", keywords: ["kit contents", "supplies"] },
  { text: "What should be in a car first aid kit?", category: "Learning", keywords: ["car kit"] },
  { text: "Teach me DRSABCD — I'm just learning", category: "Learning", keywords: ["practice", "study"] },
  { text: "Quiz me on first aid basics", category: "Learning", keywords: ["test me", "quiz"] },
  { text: "What does ARC stand for?", category: "Learning", keywords: ["australian resuscitation council"] },
];

/**
 * Score a suggestion against a query. Returns 0 if no match.
 * Higher score = better match. Prioritises prefix, then word-start, then substring, then keyword hit.
 */
export function scoreSuggestion(s: Suggestion, qRaw: string): number {
  const q = qRaw.trim().toLowerCase();
  if (!q) return 0;
  const text = s.text.toLowerCase();
  const cat = s.category.toLowerCase();
  const kws = (s.keywords ?? []).map((k) => k.toLowerCase());

  if (text.startsWith(q)) return 100;
  // word-start
  const words = text.split(/[\s—\-,?:]+/);
  if (words.some((w) => w.startsWith(q))) return 80;
  if (text.includes(q)) return 60;
  if (kws.some((k) => k.startsWith(q))) return 55;
  if (kws.some((k) => k.includes(q))) return 45;
  if (cat.includes(q)) return 30;

  // multi-token: every token must appear somewhere
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    const hay = `${text} ${cat} ${kws.join(" ")}`;
    if (tokens.every((t) => hay.includes(t))) return 25;
  }
  return 0;
}

export function searchSuggestions(query: string, limit = 6): Suggestion[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const scored = firstAidSuggestions
    .map((s) => ({ s, score: scoreSuggestion(s, q) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.s);
  return scored;
}
