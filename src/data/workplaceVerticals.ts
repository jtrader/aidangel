// Workplace first-aid vertical content. Used by /workplace hub and /workplace/:slug pages.
// Data adapted from the "Workplace-Specific First Aid Verticals" content guide.

import constructionImg from "@/assets/workplace/construction.jpg";
import miningImg from "@/assets/workplace/mining.jpg";
import manufacturingImg from "@/assets/workplace/manufacturing.jpg";
import agricultureImg from "@/assets/workplace/agriculture.jpg";
import healthcareImg from "@/assets/workplace/healthcare.jpg";
import educationImg from "@/assets/workplace/education.jpg";
import hospitalityImg from "@/assets/workplace/hospitality.jpg";
import retailImg from "@/assets/workplace/retail.jpg";
import transportImg from "@/assets/workplace/transport.jpg";
import officeImg from "@/assets/workplace/office.jpg";
import emergencyServicesImg from "@/assets/workplace/emergency-services.jpg";
import aviationImg from "@/assets/workplace/aviation.jpg";
import aquaticLeisureImg from "@/assets/workplace/aquatic-leisure.jpg";
import entertainmentImg from "@/assets/workplace/entertainment.jpg";
import laboratoryImg from "@/assets/workplace/laboratory-research.jpg";
import utilitiesImg from "@/assets/workplace/utilities-telco.jpg";
import maritimeImg from "@/assets/workplace/maritime-offshore.jpg";
import wasteImg from "@/assets/workplace/waste-recycling.jpg";
import securityImg from "@/assets/workplace/security-corrections.jpg";
import beautyWellnessImg from "@/assets/workplace/beauty-wellness.jpg";

export type RiskLevel = string;
export type Tier = 1 | 2 | 3;

export interface SubTopic {
  title: string;
  /** Optional KB slug to deep-link to existing guidance. */
  kb?: string;
}

export interface Vertical {
  slug: string;
  title: string;
  shortTitle: string;
  tier: Tier;
  category: string;
  /** 1-line summary used on cards and meta description. */
  summary: string;
  /** Hero image import (optional — falls back to gradient + icon). */
  image?: string;
  /** Tailwind gradient classes for cards/heros without imagery. */
  gradient: string;
  /** Lucide icon name (string keys resolved in the page). */
  icon: string;
  stats: {
    workforce: string;
    risk: RiskLevel;
    ratio: string;
    cert: string;
  };
  scenarios: string[];
  subTopics: SubTopic[];
  keywords: string[];
  unique?: string[];
  sectors?: { name: string; note: string }[];
}

export const VERTICALS: Vertical[] = [
  {
    slug: "construction",
    title: "Construction & Building Site First Aid",
    shortTitle: "Construction",
    tier: 1,
    category: "High-risk industrial",
    summary:
      "Falls, crush injuries, power-tool lacerations, eye injuries and chemical burns on Australian building sites — what to do in the first 10 minutes.",
    image: constructionImg,
    gradient: "from-orange-500 to-red-600",
    icon: "HardHat",
    stats: {
      workforce: "1.4M+ workers",
      risk: "High",
      ratio: "1 first aider : 25 workers",
      cert: "HLTAID011",
    },
    scenarios: [
      "Falls from heights (scaffolding, ladders, roofs)",
      "Crush injuries from machinery & equipment",
      "Penetrating wounds (nails, rebar, power tools)",
      "Eye injuries (dust, debris, grinding sparks)",
      "Heat stroke & dehydration on outdoor work",
      "Electric shock from power tools or wiring",
      "Cuts & lacerations from saws and sharp materials",
      "Spinal injuries from falling materials or vehicles",
      "Traumatic amputations from heavy machinery",
      "Chemical burns from concrete, solvents, adhesives",
    ],
    subTopics: [
      { title: "Spinal management after a fall from height", kb: "spinal-injury" },
      { title: "Power-tool laceration & amputation response", kb: "bleeding" },
      { title: "Heat stress recognition & treatment", kb: "heat-illness" },
      { title: "Eye injuries from grinding or debris", kb: "eye-injuries" },
      { title: "Concrete & chemical burns first aid", kb: "burns" },
      { title: "Electric shock on site", kb: "electric-shock" },
      { title: "Site emergency action plan template" },
      { title: "Mobile first aid kit for construction crews" },
    ],
    keywords: [
      "construction first aid Australia",
      "building site first aid WHS",
      "scaffolding fall first aid",
      "power tool laceration treatment",
      "concrete burn first aid",
    ],
    unique: [
      "Voice-activated for dirty or injured hands",
      "Offline-first for sites with poor reception",
      "Quick spinal injury decision tree",
    ],
  },
  {
    slug: "mining",
    title: "Mining & Remote Resources First Aid",
    shortTitle: "Mining",
    tier: 1,
    category: "Remote / extreme risk",
    summary:
      "Extended-care first aid for FIFO crews, underground operations and remote surface sites where evacuation can take hours.",
    image: miningImg,
    gradient: "from-amber-600 to-stone-700",
    icon: "Pickaxe",
    stats: {
      workforce: "250,000+ workers",
      risk: "Extreme",
      ratio: "1 : 10 (remote)",
      cert: "HLTAID011 + HLTAID013",
    },
    scenarios: [
      "Crushing injuries from heavy equipment",
      "Heat exhaustion in underground mines (35–40°C)",
      "Hypothermia in southern mines & night shifts",
      "Chemical exposure (acids, cyanide, explosives)",
      "Respiratory emergencies (dust, gases, low oxygen)",
      "Traumatic amputations from machinery",
      "Snake bites on remote surface operations",
      "Confined-space and trapped-person injuries",
      "Vehicle accidents on haul roads",
      "Blast injuries and hearing trauma",
    ],
    subTopics: [
      { title: "Remote mining extended-care protocols" },
      { title: "Underground mine emergency response" },
      { title: "Heat stress management in mining ops", kb: "heat-illness" },
      { title: "Chemical exposure in the resources sector" },
      { title: "Confined-space first aid & rescue" },
      { title: "FIFO worker medical emergencies", kb: "remote-first-aid" },
      { title: "Crush injury response", kb: "bleeding" },
      { title: "Snake bite first aid for mine sites", kb: "snake-bite" },
    ],
    keywords: [
      "remote mining first aid Australia",
      "FIFO medical emergency",
      "underground mine first aid",
      "mining crush injury treatment",
    ],
    unique: [
      "Offline-first design — no reception underground",
      "Integrates with evacuation protocols",
      "Satellite-friendly compressed guides",
    ],
  },
  {
    slug: "manufacturing",
    title: "Manufacturing & Industrial First Aid",
    shortTitle: "Manufacturing",
    tier: 1,
    category: "High-risk industrial",
    summary:
      "Machinery entrapment, chemical burns, welding injuries and inhalation emergencies across food, metal, automotive, textile and plastics plants.",
    image: manufacturingImg,
    gradient: "from-slate-600 to-zinc-800",
    icon: "Factory",
    stats: {
      workforce: "850,000+ workers",
      risk: "High",
      ratio: "1 : 25",
      cert: "HLTAID011",
    },
    scenarios: [
      "Machinery entrapment & crush injuries",
      "Chemical burns (acids, alkalis, solvents)",
      "Inhalation injuries from fumes or vapours",
      "Eye injuries from metal particles or chemicals",
      "Burns from welding, furnaces or hot materials",
      "Cuts & lacerations from production equipment",
      "Hearing damage from sudden loud noise",
      "Electric shock from machinery",
      "Forklift accidents",
      "Pressure injuries from compressed air or hydraulics",
    ],
    sectors: [
      { name: "Food & beverage processing", note: "Burns, cuts, sanitiser exposure, wet-floor slips" },
      { name: "Metal fabrication", note: "Grinding injuries, welding burns, heavy lifting" },
      { name: "Automotive", note: "Robotic equipment injuries, chemical exposure" },
      { name: "Textiles", note: "Machine entrapment, repetitive strain" },
      { name: "Plastics & chemicals", note: "Chemical burns, inhalation, explosions" },
    ],
    subTopics: [
      { title: "Machinery entrapment emergency extrication" },
      { title: "Industrial chemical burn response", kb: "burns" },
      { title: "Welding & hot-work burn treatment", kb: "burns" },
      { title: "Industrial eye injury management", kb: "eye-injuries" },
      { title: "Forklift accident first response" },
      { title: "Food processing workplace injuries" },
    ],
    keywords: [
      "manufacturing first aid Australia",
      "factory workplace injuries",
      "industrial chemical burns",
      "machinery injury first response",
    ],
  },
  {
    slug: "agriculture",
    title: "Agriculture, Forestry & Fishing First Aid",
    shortTitle: "Agriculture",
    tier: 1,
    category: "Remote / extreme risk",
    summary:
      "Australia's highest injury rate per capita — farm machinery, livestock, snake bites, chainsaws and marine hazards, often hours from a hospital.",
    image: agricultureImg,
    gradient: "from-yellow-500 to-emerald-700",
    icon: "Tractor",
    stats: {
      workforce: "320,000+ workers",
      risk: "Extreme",
      ratio: "Enhanced remote",
      cert: "HLTAID011 + HLTAID013",
    },
    scenarios: [
      "Tractor & farm machinery rollovers",
      "Crush, goring & trampling from livestock",
      "Pesticide & herbicide exposure",
      "Heat stroke during harvest",
      "Snake bites on rural properties",
      "Allergic reactions (bees, hay, dust)",
      "Chainsaw lacerations",
      "Grain silo entrapment & suffocation",
      "Electrocution from power lines or equipment",
      "Drowning in dams or irrigation",
    ],
    sectors: [
      { name: "Agriculture", note: "Tractor rollovers, livestock crush, chemical exposure" },
      { name: "Forestry", note: "Chainsaw injuries, falling branches, remote location" },
      { name: "Commercial fishing", note: "Hooks, hypothermia, marine animal injuries, drowning" },
    ],
    subTopics: [
      { title: "Farm machinery accident response" },
      { title: "Livestock attack first aid" },
      { title: "Remote rural extended-care", kb: "remote-first-aid" },
      { title: "Pesticide exposure emergency treatment", kb: "poisoning" },
      { title: "Chainsaw injury management", kb: "bleeding" },
      { title: "Snake bite first aid for farm workers", kb: "snake-bite" },
      { title: "Grain silo entrapment rescue" },
      { title: "Marine animal injury treatment", kb: "jellyfish-stings" },
    ],
    keywords: [
      "farm first aid Australia",
      "agricultural workplace injuries",
      "remote rural first aid",
      "livestock injury treatment",
      "commercial fishing safety",
    ],
  },
  {
    slug: "healthcare-aged-care",
    title: "Healthcare & Aged Care Worker First Aid",
    shortTitle: "Healthcare & Aged Care",
    tier: 1,
    category: "Care & education",
    summary:
      "Needlestick injuries, workplace violence, manual-handling injuries and infectious-disease exposure — protecting the workers who care for everyone else.",
    image: healthcareImg,
    gradient: "from-sky-500 to-indigo-700",
    icon: "Stethoscope",
    stats: {
      workforce: "1.8M+ workers",
      risk: "Medium–High",
      ratio: "1 : 50 (+ clinicians)",
      cert: "HLTAID011 + clinical",
    },
    scenarios: [
      "Needlestick injuries & blood-borne pathogen exposure",
      "Patient assault & workplace violence",
      "Manual handling injuries from patient transfers",
      "Slips & falls on wet floors",
      "Chemical exposure (disinfectants, medications)",
      "Stress-related cardiac events",
      "Infectious disease exposure",
      "Lifting injuries with bariatric residents",
      "Emotional & psychological trauma",
    ],
    subTopics: [
      { title: "Needlestick injury protocol" },
      { title: "Workplace violence response in healthcare" },
      { title: "Manual handling injury immediate care" },
      { title: "Blood-borne pathogen exposure management" },
      { title: "Aged care worker safety", kb: "elderly-care" },
      { title: "Chemical exposure in clinical settings", kb: "poisoning" },
      { title: "Mental health first aid for clinicians", kb: "mental-health-first-aid" },
    ],
    keywords: [
      "healthcare worker injuries Australia",
      "needlestick injury protocol",
      "aged care workplace safety",
      "patient violence response",
    ],
  },
  {
    slug: "education-childcare",
    title: "Education & Childcare First Aid",
    shortTitle: "Education & Childcare",
    tier: 1,
    category: "Care & education",
    summary:
      "Choking infants, anaphylaxis, asthma attacks, febrile convulsions and playground injuries — mandatory HLTAID012 territory.",
    image: educationImg,
    gradient: "from-pink-400 to-rose-600",
    icon: "School",
    stats: {
      workforce: "380,000+ workers",
      risk: "Medium (child = High)",
      ratio: "Setting-specific",
      cert: "HLTAID012 (mandatory)",
    },
    scenarios: [
      "Infant & child choking (top risk)",
      "Anaphylaxis from food allergens",
      "Asthma attacks",
      "Febrile convulsions",
      "Head injuries from playground falls",
      "Drowning in water play & pools",
      "Poisoning from cleaning products or plants",
      "Bites — other children, pets",
      "Sports injuries (fractures, sprains, concussions)",
      "Diabetic & seizure emergencies in students",
      "Mental health emergencies in older students",
    ],
    sectors: [
      { name: "Childcare 0–5", note: "Choking, anaphylaxis, febrile convulsions, drowning" },
      { name: "Schools K–12", note: "Sports injuries, asthma, anaphylaxis, mental health" },
      { name: "Universities", note: "Mental health, lab chemical exposure, alcohol poisoning" },
    ],
    subTopics: [
      { title: "Infant choking emergency response", kb: "choking" },
      { title: "Anaphylaxis management in schools", kb: "anaphylaxis" },
      { title: "Asthma emergency in care settings", kb: "asthma" },
      { title: "Febrile convulsion management", kb: "seizures" },
      { title: "Playground injury first aid", kb: "head-injury" },
      { title: "Child drowning prevention & response", kb: "drowning" },
      { title: "Student mental health first aid", kb: "mental-health-first-aid" },
      { title: "HLTAID012 compliance overview" },
    ],
    keywords: [
      "childcare first aid Australia",
      "HLTAID012 education care",
      "school first aid compliance",
      "anaphylaxis management childcare",
    ],
  },
  // ---- Tier 2 ----
  {
    slug: "retail",
    title: "Retail & Customer Service First Aid",
    shortTitle: "Retail",
    tier: 2,
    category: "Customer-facing",
    summary:
      "Customer medical emergencies, manual-handling injuries, slips, robbery trauma and burns across supermarkets, pharmacy, petrol and shopping centres.",
    image: retailImg,
    gradient: "from-emerald-500 to-teal-700",
    icon: "ShoppingBag",
    stats: {
      workforce: "1.3M+ workers",
      risk: "Low–Medium",
      ratio: "1 : 50",
      cert: "HLTAID011",
    },
    scenarios: [
      "Customer medical emergencies (elderly collapse)",
      "Manual handling injuries from stock & shelves",
      "Slips, trips & falls on wet floors",
      "Cuts from box cutters & shelf edges",
      "Robbery-related trauma & injuries",
      "Heat exhaustion in outdoor retail & car parks",
      "Burns in food service & hot equipment",
      "Customer violence & assault",
    ],
    sectors: [
      { name: "Supermarkets", note: "Wet-floor slips, elderly falls, child trolley injuries" },
      { name: "Shopping centres", note: "Crowd emergencies, escalator accidents" },
      { name: "Petrol stations", note: "Burns, chemical exposure, vehicle accidents" },
      { name: "Pharmacy", note: "Customer medical emergencies, robbery injuries" },
    ],
    subTopics: [
      { title: "Customer medical emergency response", kb: "heart-attack" },
      { title: "Workplace violence in retail" },
      { title: "Manual handling injuries — retail" },
      { title: "Slip & fall response", kb: "head-injury" },
      { title: "Shopping centre emergency protocols" },
    ],
    keywords: ["retail first aid Australia", "shopping centre emergency", "customer collapse response"],
  },
  {
    slug: "hospitality",
    title: "Hospitality First Aid (Kitchens, Cafes, Bars)",
    shortTitle: "Hospitality",
    tier: 2,
    category: "Customer-facing",
    summary:
      "Kitchen burns, knife cuts, choking diners, anaphylaxis from allergens and alcohol-related incidents — the most predictable injuries in food service.",
    image: hospitalityImg,
    gradient: "from-red-500 to-orange-600",
    icon: "ChefHat",
    stats: {
      workforce: "900,000+ workers",
      risk: "Medium",
      ratio: "1 : 50",
      cert: "HLTAID011",
    },
    scenarios: [
      "Burns from kitchens, hot liquids, equipment",
      "Cuts from knives, slicers, broken glass",
      "Slips on wet or greasy floors",
      "Customer choking in restaurants",
      "Allergic reactions to food allergens",
      "Alcohol-related incidents (falls, violence)",
      "Heat exhaustion in commercial kitchens",
      "Repetitive strain injuries",
      "Glass injuries from broken bottles or dishes",
    ],
    subTopics: [
      { title: "Kitchen burn first aid (20 minutes cool running water)", kb: "burns" },
      { title: "Commercial kitchen knife wound response", kb: "bleeding" },
      { title: "Customer choking in restaurants", kb: "choking" },
      { title: "Food allergy & anaphylaxis emergency", kb: "anaphylaxis" },
      { title: "Alcohol-related incident response", kb: "recovery-position" },
      { title: "Hotel guest medical emergencies" },
    ],
    keywords: [
      "kitchen burn first aid",
      "restaurant choking response",
      "hospitality first aid Australia",
      "food allergy emergency",
    ],
  },
  {
    slug: "transport-logistics",
    title: "Transport & Logistics First Aid",
    shortTitle: "Transport & Logistics",
    tier: 2,
    category: "Mobile workforce",
    summary:
      "Truck drivers, warehouse crews, aviation and maritime workers — vehicle trauma, forklift incidents, loading injuries and remote-route emergencies.",
    image: transportImg,
    gradient: "from-blue-600 to-slate-800",
    icon: "Truck",
    stats: {
      workforce: "650,000+ workers",
      risk: "Medium–High",
      ratio: "Vehicle-based kits",
      cert: "HLTAID011",
    },
    scenarios: [
      "Vehicle accidents (major trauma)",
      "Loading & unloading injuries",
      "Heat stress on long hours",
      "Fatigue-related medical events",
      "Forklift accidents",
      "Falling stock & pallets",
      "Passenger medical emergencies (aviation)",
      "Drowning & hypothermia (maritime)",
    ],
    sectors: [
      { name: "Truck drivers", note: "Remote location trauma, fatigue, loading injuries" },
      { name: "Warehouse & distribution", note: "Forklift, lifting, falling stock" },
      { name: "Aviation", note: "Cabin emergencies, turbulence, ground crew" },
      { name: "Maritime", note: "Drowning, hypothermia, container crush" },
    ],
    subTopics: [
      { title: "Truck driver remote first aid", kb: "remote-first-aid" },
      { title: "Warehouse forklift accident response" },
      { title: "Aviation medical emergency protocols" },
      { title: "Loading dock injury management", kb: "bleeding" },
      { title: "Maritime hypothermia treatment", kb: "hypothermia" },
    ],
    keywords: [
      "truck driver first aid",
      "warehouse forklift injury",
      "aviation medical emergency",
      "maritime first aid Australia",
    ],
  },
  {
    slug: "office",
    title: "Office & Professional Services First Aid",
    shortTitle: "Office",
    tier: 2,
    category: "Office / professional",
    summary:
      "Cardiac events, choking, mental-health crises and slips — Australia's largest workforce, lowest risk but highest need for AED awareness.",
    image: officeImg,
    gradient: "from-cyan-500 to-blue-700",
    icon: "Briefcase",
    stats: {
      workforce: "2.1M+ workers",
      risk: "Low",
      ratio: "1 : 50",
      cert: "HLTAID011",
    },
    scenarios: [
      "Cardiac events (sedentary, stress, older workers)",
      "Choking while eating at desks",
      "Slips & trips (cables, stairs, wet floors)",
      "Mental health crises — anxiety, panic attacks",
      "Elevator entrapment medical events",
      "Allergic reactions to shared food",
      "Pregnancy-related emergencies",
      "Diabetic emergencies",
    ],
    subTopics: [
      { title: "Office heart attack — recognition & AED", kb: "heart-attack" },
      { title: "Choking at the desk", kb: "choking" },
      { title: "Mental health first aid for office workers", kb: "mental-health-first-aid" },
      { title: "Elevator emergency response" },
      { title: "Pregnancy emergencies in the workplace" },
      { title: "Office allergic reaction management", kb: "allergic-reactions" },
    ],
    keywords: ["office first aid", "office AED requirements", "workplace mental health first aid"],
  },
  // ---- Tier 3: Specialised ----
  {
    slug: "emergency-services",
    title: "Emergency Services First Aid (Police, Fire, SES)",
    shortTitle: "Emergency Services",
    tier: 3,
    category: "Specialised / tactical",
    summary:
      "When first responders need first aid — firefighter burns, police assault injuries, smoke inhalation and operational PTSD.",
    gradient: "from-red-600 to-rose-800",
    icon: "Siren",
    stats: {
      workforce: "85,000+ workers",
      risk: "Extreme",
      ratio: "Tactical",
      cert: "Advanced trauma",
    },
    scenarios: [
      "Firefighter burn injuries",
      "Police assault injuries (weapons, fists)",
      "SES volunteer rescue accidents",
      "Ambulance officer needlestick injuries",
      "Smoke inhalation",
      "Heat stress while firefighting",
      "PTSD & operational mental health",
    ],
    subTopics: [
      { title: "First aid for first responders" },
      { title: "Firefighter burn & smoke inhalation", kb: "burns" },
      { title: "Police officer assault response", kb: "bleeding" },
      { title: "SES volunteer safety protocols" },
      { title: "Mental health for emergency workers", kb: "mental-health-first-aid" },
    ],
    keywords: ["first responder first aid", "firefighter injury", "police assault first aid"],
  },
  {
    slug: "aviation",
    title: "Aviation & Aerospace First Aid",
    shortTitle: "Aviation",
    tier: 3,
    category: "Specialised / tactical",
    summary:
      "Cabin crew, ground staff and aerospace workers — turbulence, in-flight emergencies, decompression and aircraft-maintenance injuries.",
    gradient: "from-indigo-500 to-sky-700",
    icon: "Plane",
    stats: {
      workforce: "60,000+ workers",
      risk: "High (regulated)",
      ratio: "Crew-based",
      cert: "Aviation-specific",
    },
    scenarios: [
      "Cabin crew injuries (turbulence, service)",
      "Passenger medical emergencies at altitude",
      "Ground crew baggage & servicing accidents",
      "Aviation fuel exposure",
      "Decompression incidents",
      "Aircraft maintenance injuries",
    ],
    subTopics: [
      { title: "In-flight medical emergency protocols" },
      { title: "Aviation ground crew safety" },
      { title: "Passenger cardiac event response", kb: "heart-attack" },
      { title: "Aircraft maintenance first aid" },
    ],
    keywords: ["aviation first aid", "cabin crew medical emergency", "ground crew safety"],
  },
  {
    slug: "aquatic-leisure",
    title: "Aquatic & Leisure First Aid (Pools, Beaches, Gyms)",
    shortTitle: "Aquatic & Leisure",
    tier: 3,
    category: "Specialised / tactical",
    summary:
      "Lifeguards, gym staff and sports facility workers — drowning, spinal injuries from diving, sudden cardiac events and marine stings.",
    gradient: "from-cyan-500 to-blue-800",
    icon: "Waves",
    stats: {
      workforce: "180,000+ workers",
      risk: "Medium–High",
      ratio: "Setting-specific",
      cert: "HLTAID011 + aquatic",
    },
    scenarios: [
      "Drowning & near-drowning",
      "Spinal injuries from diving accidents",
      "Heat stroke at outdoor facilities",
      "Sports injuries in gyms & playing fields",
      "Cardiac events from sudden exertion",
      "Jellyfish stings for beach lifeguards",
      "Pool chemical exposure for maintenance",
    ],
    subTopics: [
      { title: "Lifeguard drowning response protocols", kb: "drowning" },
      { title: "Pool spinal injury management", kb: "spinal-injury" },
      { title: "Gym cardiac emergency response", kb: "heart-attack" },
      { title: "Sports facility first aid requirements" },
      { title: "Marine sting treatment", kb: "jellyfish-stings" },
    ],
    keywords: ["lifeguard first aid", "pool spinal injury", "gym cardiac arrest AED"],
  },
  {
    slug: "entertainment",
    title: "Film, TV & Live Entertainment First Aid",
    shortTitle: "Entertainment",
    tier: 3,
    category: "Specialised / tactical",
    summary:
      "Crew, performers and event staff — rigging falls, pyrotechnic burns, stunt injuries and crowd medical events.",
    gradient: "from-purple-600 to-fuchsia-700",
    icon: "Film",
    stats: {
      workforce: "65,000+ workers",
      risk: "Medium–High",
      ratio: "Production-based",
      cert: "HLTAID011 + industry",
    },
    scenarios: [
      "Falls from rigging or scaffolding",
      "Electric shock from lighting & sound",
      "Burns from pyrotechnics & SFX",
      "Heat stroke under stage lights",
      "Crush injuries on set construction",
      "Stunt & performer injuries",
      "Crowd control incidents at concerts",
    ],
    subTopics: [
      { title: "Film set safety & first aid", kb: "spinal-injury" },
      { title: "Concert & event medical response" },
      { title: "Stage production injury management" },
      { title: "Stunt safety & emergency protocols" },
    ],
    keywords: ["film set first aid", "concert medical response", "stage production safety"],
  },
  {
    slug: "laboratory-research",
    title: "Laboratory & Research Facility First Aid",
    shortTitle: "Laboratory & Research",
    tier: 3,
    category: "Specialised / tactical",
    summary:
      "Chemical exposure, biohazard contamination, cryogenic burns and lab eye injuries — university, hospital and industrial research settings.",
    gradient: "from-emerald-600 to-teal-800",
    icon: "FlaskConical",
    stats: {
      workforce: "40,000+ workers",
      risk: "High",
      ratio: "Lab-based",
      cert: "HLTAID011 + chem/bio",
    },
    scenarios: [
      "Chemical burns (acids, bases)",
      "Chemical inhalation",
      "Eye exposure to hazardous materials",
      "Biological contamination",
      "Radiation exposure (limited facilities)",
      "Cryogenic burns (liquid nitrogen)",
      "Glass injuries",
      "Electric shock from equipment",
    ],
    subTopics: [
      { title: "Laboratory chemical exposure response", kb: "poisoning" },
      { title: "Acid / alkali burn emergency", kb: "burns" },
      { title: "Biological hazard exposure protocols" },
      { title: "Laboratory eye injury management", kb: "eye-injuries" },
    ],
    keywords: ["lab first aid", "chemical exposure response", "biohazard first aid"],
  },
  {
    slug: "utilities-telco",
    title: "Telecommunications & Utilities First Aid",
    shortTitle: "Utilities & Telco",
    tier: 3,
    category: "Specialised / tactical",
    summary:
      "Electrical, water, gas and telecommunications workers — high-voltage shock, arc flash, falls from towers and confined-space rescue.",
    gradient: "from-yellow-500 to-orange-700",
    icon: "Zap",
    stats: {
      workforce: "120,000+ workers",
      risk: "Extreme",
      ratio: "Crew-based",
      cert: "HLTAID011 + electrical",
    },
    scenarios: [
      "High-voltage electric shock",
      "Arc flash burns",
      "Falls from power poles & towers",
      "Confined-space incidents (manholes, pits)",
      "Gas exposure & asphyxiation",
      "Remote-location injuries on transmission towers",
      "Heat stress in underground work",
    ],
    subTopics: [
      { title: "Electrical shock emergency response", kb: "electric-shock" },
      { title: "High-voltage rescue protocols" },
      { title: "Confined space first aid" },
      { title: "Tower fall spinal management", kb: "spinal-injury" },
    ],
    keywords: ["electrical shock first aid", "arc flash burn", "confined space rescue"],
  },
  {
    slug: "maritime-offshore",
    title: "Maritime & Offshore First Aid",
    shortTitle: "Maritime & Offshore",
    tier: 3,
    category: "Specialised / tactical",
    summary:
      "Oil & gas, shipping and port workers — man-overboard, hypothermia, helicopter evac and multi-day extended-care offshore.",
    gradient: "from-blue-700 to-cyan-900",
    icon: "Ship",
    stats: {
      workforce: "45,000+ workers",
      risk: "Extreme",
      ratio: "Vessel-based",
      cert: "Maritime FA",
    },
    scenarios: [
      "Drowning & man overboard",
      "Hypothermia",
      "Crush injuries from containers & machinery",
      "Burns from offshore drilling equipment",
      "Helicopter evacuation injuries",
      "Decompression sickness from diving operations",
      "Marine animal injuries",
      "Remote-location extended care (days to evac)",
    ],
    subTopics: [
      { title: "Offshore emergency medical response", kb: "remote-first-aid" },
      { title: "Man overboard recovery & first aid", kb: "drowning" },
      { title: "Maritime hypothermia treatment", kb: "hypothermia" },
      { title: "Shipping container accident response", kb: "bleeding" },
    ],
    keywords: ["offshore first aid", "maritime hypothermia", "man overboard rescue"],
  },
  {
    slug: "waste-recycling",
    title: "Waste & Recycling First Aid",
    shortTitle: "Waste & Recycling",
    tier: 3,
    category: "Specialised / tactical",
    summary:
      "Garbage truck crews, transfer station and recycling facility staff — needlesticks, chemical exposure and compactor crush injuries.",
    gradient: "from-lime-600 to-green-800",
    icon: "Recycle",
    stats: {
      workforce: "55,000+ workers",
      risk: "High",
      ratio: "1 : 25",
      cert: "HLTAID011",
    },
    scenarios: [
      "Needlestick injuries from sharps in waste",
      "Chemical exposure from mixed waste",
      "Crushing injuries from compactor trucks",
      "Heat stress in enclosed truck cabins",
      "Infectious material exposure",
      "Vehicle accidents in waste trucks",
      "Cuts from broken glass or metal",
    ],
    subTopics: [
      { title: "Waste worker needlestick protocol" },
      { title: "Garbage truck accident response" },
      { title: "Chemical exposure in recycling", kb: "poisoning" },
      { title: "Infectious waste injury management" },
    ],
    keywords: ["waste worker first aid", "needlestick recycling", "garbage truck accident"],
  },
  {
    slug: "security-corrections",
    title: "Security & Corrections First Aid",
    shortTitle: "Security & Corrections",
    tier: 3,
    category: "Specialised / tactical",
    summary:
      "Security officers, armed guards and corrections staff — assault wounds, stab and gunshot trauma, restraint injuries and overdose response.",
    gradient: "from-zinc-700 to-stone-900",
    icon: "Shield",
    stats: {
      workforce: "85,000+ workers",
      risk: "High",
      ratio: "Post-based",
      cert: "HLTAID011 + tactical",
    },
    scenarios: [
      "Assault injuries (weapons, fists)",
      "Stab wounds",
      "Gunshot wounds (armed security)",
      "Riot injuries",
      "Restraint-related injuries",
      "Mental health incidents",
      "Drug overdose in corrections",
      "Infectious disease exposure",
    ],
    subTopics: [
      { title: "Security officer assault response", kb: "bleeding" },
      { title: "Corrections facility medical emergencies" },
      { title: "Gunshot wound protocol", kb: "shock" },
      { title: "Prisoner overdose response", kb: "poisoning" },
    ],
    keywords: ["security officer first aid", "corrections medical emergency", "gunshot wound first aid"],
  },
  {
    slug: "beauty-wellness",
    title: "Beauty, Personal Care & Wellness First Aid",
    shortTitle: "Beauty & Wellness",
    tier: 3,
    category: "Specialised / tactical",
    summary:
      "Salons, spas and personal-care studios — chemical burns from treatments, allergic reactions, hot-tool burns and client medical emergencies.",
    gradient: "from-rose-400 to-pink-600",
    icon: "Sparkles",
    stats: {
      workforce: "95,000+ workers",
      risk: "Low–Medium",
      ratio: "1 : 50",
      cert: "HLTAID011",
    },
    scenarios: [
      "Chemical burns from hair dyes & treatments",
      "Allergic reactions to cosmetics or wax",
      "Heat burns from curling irons & wax",
      "Eye injuries from cosmetics & lash extensions",
      "Cuts from razors & scissors",
      "Repetitive strain injuries",
      "Client medical emergencies (fainting, seizures)",
      "Infection from non-sterile equipment",
    ],
    subTopics: [
      { title: "Salon chemical burn response", kb: "burns" },
      { title: "Beauty treatment allergic reactions", kb: "allergic-reactions" },
      { title: "Spa & massage therapy first aid" },
      { title: "Client fainting in a salon", kb: "fainting" },
    ],
    keywords: ["salon first aid", "beauty treatment allergy", "spa client emergency"],
  },
];

export function getVertical(slug: string): Vertical | undefined {
  return VERTICALS.find((v) => v.slug === slug);
}

export const VERTICALS_BY_TIER: Record<Tier, Vertical[]> = {
  1: VERTICALS.filter((v) => v.tier === 1),
  2: VERTICALS.filter((v) => v.tier === 2),
  3: VERTICALS.filter((v) => v.tier === 3),
};
