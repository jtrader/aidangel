import { createContext, useContext, useState, ReactNode } from "react";

export type LanguageCode =
  | "en" | "kriol" | "yolngu" | "pitjantjatjara" | "arrernte" | "tsi"
  | "zh" | "ar" | "vi" | "yue" | "pa" | "el" | "it"
  | "es" | "pt" | "de" | "fr" | "nl" | "sv" | "no" | "da" | "fi" | "is"
  | "pl" | "cs" | "sk" | "hu" | "ro" | "bg" | "hr" | "sl" | "sr" | "uk"
  | "et" | "lv" | "lt" | "tr" | "ja" | "ko" | "th" | "id" | "ms"
  | "ur" | "bn" | "si" | "ne" | "tl" | "he";


interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  region: string;
}

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", region: "Australia-wide" },
  { code: "zh", name: "Mandarin", nativeName: "普通话", region: "Chinese community" },
  { code: "yue", name: "Cantonese", nativeName: "廣東話", region: "Chinese community" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", region: "Vietnamese community" },
  { code: "ar", name: "Arabic", nativeName: "العربية", region: "Arabic community" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", region: "Punjabi community" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", region: "Greek community" },
  { code: "it", name: "Italian", nativeName: "Italiano", region: "Italian community" },
  { code: "kriol", name: "Kriol", nativeName: "Kriol", region: "Northern Australia" },
  { code: "yolngu", name: "Yolŋu Matha", nativeName: "Yolŋu Matha", region: "Arnhem Land, NT" },
  { code: "pitjantjatjara", name: "Pitjantjatjara", nativeName: "Pitjantjatjara", region: "Central Australia" },
  { code: "arrernte", name: "Arrernte", nativeName: "Arrernte", region: "Alice Springs, NT" },
  { code: "tsi", name: "Torres Strait Creole", nativeName: "Yumplatok", region: "Torres Strait, QLD" },
];

type TranslationKey =
  | "emergencyBanner"
  | "appTitle"
  | "appSubtitle"
  | "welcomeHeading"
  | "welcomeDescription"
  | "inputPlaceholder"
  | "disclaimer"
  | "cpr" | "choking" | "burns" | "snakeBite" | "bleeding" | "fracture"
  | "seizure" | "anaphylaxis" | "heartAttack" | "hypothermia" | "eyeInjury" | "electricShock" | "overdose";

const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  en: {
    emergencyBanner: "In a life-threatening emergency, call Triple Zero (000) immediately",
    appTitle: "First Aid Angel",
    appSubtitle: "Your First Aid Assistant • Powered by The St John of God First Aid Manual 5th Edition",
    welcomeHeading: "How can I help?",
    welcomeDescription: "Ask me about any first aid situation. I'll provide step-by-step guidance based on The St John of God First Aid Manual.",
    inputPlaceholder: "Describe your first aid situation...",
    disclaimer: "Not a substitute for professional medical advice. Always call 000 in emergencies.",
    cpr: "CPR", choking: "Choking", burns: "Burns", snakeBite: "Snake Bite",
    bleeding: "Bleeding", fracture: "Fracture", seizure: "Seizure",
    anaphylaxis: "Anaphylaxis", heartAttack: "Heart Attack", hypothermia: "Hypothermia",
    eyeInjury: "Eye Injury", electricShock: "Electric Shock", overdose: "Overdose",
  },
  zh: {
    emergencyBanner: "遇到危及生命的紧急情况，请立即拨打 Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "您的急救助手 • 基于《澳大利亚急救手册》第五版",
    welcomeHeading: "我能帮您什么？",
    welcomeDescription: "向我询问任何急救情况，我将根据澳大利亚急救手册提供逐步指导。",
    inputPlaceholder: "描述您的急救情况...",
    disclaimer: "不能替代专业医疗建议。紧急情况请拨打 000。",
    cpr: "心肺复苏", choking: "窒息", burns: "烧伤", snakeBite: "蛇咬伤",
    bleeding: "出血", fracture: "骨折", seizure: "癫痫发作",
    anaphylaxis: "过敏性休克", heartAttack: "心脏病发作", hypothermia: "体温过低",
    eyeInjury: "眼部损伤", electricShock: "触电", overdose: "药物过量",
  },
  yue: {
    emergencyBanner: "遇到危及生命嘅緊急情況，請即刻打 Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "你嘅急救助手 • 基於《澳洲急救手冊》第五版",
    welcomeHeading: "我可以點幫你？",
    welcomeDescription: "問我任何急救情況，我會根據澳洲急救手冊提供逐步指導。",
    inputPlaceholder: "描述你嘅急救情況...",
    disclaimer: "唔可以取代專業醫療意見。緊急情況請打 000。",
    cpr: "心肺復甦", choking: "哽塞", burns: "燒傷", snakeBite: "蛇咬傷",
    bleeding: "流血", fracture: "骨折", seizure: "癲癇發作",
    anaphylaxis: "過敏性休克", heartAttack: "心臟病發", hypothermia: "體溫過低",
    eyeInjury: "眼部損傷", electricShock: "觸電", overdose: "藥物過量",
  },
  ar: {
    emergencyBanner: "في حالة الطوارئ المهددة للحياة، اتصل بـ Triple Zero (000) فوراً",
    appTitle: "First Aid Angel",
    appSubtitle: "مساعدك للإسعافات الأولية • مبني على دليل الإسعافات الأولية الأسترالي الطبعة الخامسة",
    welcomeHeading: "كيف يمكنني مساعدتك؟",
    welcomeDescription: "اسألني عن أي حالة إسعافات أولية. سأقدم لك إرشادات خطوة بخطوة بناءً على دليل الإسعافات الأولية الأسترالي.",
    inputPlaceholder: "صف حالة الإسعافات الأولية...",
    disclaimer: "ليس بديلاً عن المشورة الطبية المتخصصة. اتصل بـ 000 في حالات الطوارئ.",
    cpr: "الإنعاش القلبي", choking: "الاختناق", burns: "الحروق", snakeBite: "لدغة أفعى",
    bleeding: "النزيف", fracture: "الكسر", seizure: "النوبة",
    anaphylaxis: "صدمة تحسسية", heartAttack: "نوبة قلبية", hypothermia: "انخفاض الحرارة",
    eyeInjury: "إصابة العين", electricShock: "صعقة كهربائية", overdose: "جرعة زائدة",
  },
  vi: {
    emergencyBanner: "Trong trường hợp khẩn cấp đe dọa tính mạng, gọi Triple Zero (000) ngay",
    appTitle: "First Aid Angel",
    appSubtitle: "Trợ lý Sơ cứu của bạn • Dựa trên Sổ tay Sơ cứu Úc Phiên bản 5",
    welcomeHeading: "Tôi có thể giúp gì?",
    welcomeDescription: "Hỏi tôi về bất kỳ tình huống sơ cứu nào. Tôi sẽ hướng dẫn từng bước dựa trên sổ tay sơ cứu Úc.",
    inputPlaceholder: "Mô tả tình huống sơ cứu của bạn...",
    disclaimer: "Không thay thế tư vấn y tế chuyên nghiệp. Gọi 000 trong trường hợp khẩn cấp.",
    cpr: "Hồi sức tim phổi", choking: "Nghẹn", burns: "Bỏng", snakeBite: "Rắn cắn",
    bleeding: "Chảy máu", fracture: "Gãy xương", seizure: "Co giật",
    anaphylaxis: "Sốc phản vệ", heartAttack: "Đau tim", hypothermia: "Hạ thân nhiệt",
    eyeInjury: "Chấn thương mắt", electricShock: "Điện giật", overdose: "Quá liều",
  },
  pa: {
    emergencyBanner: "ਜਾਨਲੇਵਾ ਐਮਰਜੈਂਸੀ ਵਿੱਚ, ਤੁਰੰਤ Triple Zero (000) ਤੇ ਕਾਲ ਕਰੋ",
    appTitle: "First Aid Angel",
    appSubtitle: "ਤੁਹਾਡਾ ਫਸਟ ਏਡ ਸਹਾਇਕ • ਆਸਟ੍ਰੇਲੀਅਨ ਫਸਟ ਏਡ 5ਵੀਂ ਐਡੀਸ਼ਨ ਤੇ ਅਧਾਰਿਤ",
    welcomeHeading: "ਮੈਂ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    welcomeDescription: "ਮੈਨੂੰ ਕਿਸੇ ਵੀ ਫਸਟ ਏਡ ਸਥਿਤੀ ਬਾਰੇ ਪੁੱਛੋ। ਮੈਂ ਕਦਮ-ਦਰ-ਕਦਮ ਮਾਰਗਦਰਸ਼ਨ ਦੇਵਾਂਗਾ।",
    inputPlaceholder: "ਆਪਣੀ ਫਸਟ ਏਡ ਸਥਿਤੀ ਦੱਸੋ...",
    disclaimer: "ਪੇਸ਼ੇਵਰ ਡਾਕਟਰੀ ਸਲਾਹ ਦਾ ਬਦਲ ਨਹੀਂ। ਐਮਰਜੈਂਸੀ ਵਿੱਚ 000 ਤੇ ਕਾਲ ਕਰੋ।",
    cpr: "CPR", choking: "ਸਾਹ ਘੁੱਟਣਾ", burns: "ਜਲਣ", snakeBite: "ਸੱਪ ਦਾ ਡੰਗ",
    bleeding: "ਖੂਨ ਵਗਣਾ", fracture: "ਹੱਡੀ ਟੁੱਟਣਾ", seizure: "ਦੌਰਾ",
    anaphylaxis: "ਗੰਭੀਰ ਐਲਰਜੀ", heartAttack: "ਦਿਲ ਦਾ ਦੌਰਾ", hypothermia: "ਸਰੀਰ ਠੰਡਾ",
    eyeInjury: "ਅੱਖ ਦੀ ਸੱਟ", electricShock: "ਬਿਜਲੀ ਦਾ ਝਟਕਾ", overdose: "ਵੱਧ ਖੁਰਾਕ",
  },
  el: {
    emergencyBanner: "Σε απειλητική για τη ζωή κατάσταση, καλέστε αμέσως Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Ο Βοηθός Πρώτων Βοηθειών σας • Βασισμένο στο Αυστραλιανό Εγχειρίδιο 5η Έκδοση",
    welcomeHeading: "Πώς μπορώ να βοηθήσω;",
    welcomeDescription: "Ρωτήστε με για οποιαδήποτε κατάσταση πρώτων βοηθειών. Θα σας καθοδηγήσω βήμα προς βήμα.",
    inputPlaceholder: "Περιγράψτε την κατάσταση πρώτων βοηθειών...",
    disclaimer: "Δεν αντικαθιστά την επαγγελματική ιατρική συμβουλή. Καλέστε 000 σε επείγοντα.",
    cpr: "ΚΑΡΠΑ", choking: "Πνιγμός", burns: "Εγκαύματα", snakeBite: "Δάγκωμα φιδιού",
    bleeding: "Αιμορραγία", fracture: "Κάταγμα", seizure: "Επιληπτική κρίση",
    anaphylaxis: "Αναφυλαξία", heartAttack: "Καρδιακή προσβολή", hypothermia: "Υποθερμία",
    eyeInjury: "Τραύμα ματιού", electricShock: "Ηλεκτροπληξία", overdose: "Υπερδοσολογία",
  },
  it: {
    emergencyBanner: "In un'emergenza che mette in pericolo la vita, chiama subito Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Il tuo Assistente di Primo Soccorso • Basato sul Manuale Australiano 5ª Edizione",
    welcomeHeading: "Come posso aiutarti?",
    welcomeDescription: "Chiedimi di qualsiasi situazione di primo soccorso. Ti guiderò passo dopo passo secondo il manuale australiano.",
    inputPlaceholder: "Descrivi la tua situazione di primo soccorso...",
    disclaimer: "Non sostituisce il parere medico professionale. Chiama il 000 in caso di emergenza.",
    cpr: "RCP", choking: "Soffocamento", burns: "Ustioni", snakeBite: "Morso di serpente",
    bleeding: "Emorragia", fracture: "Frattura", seizure: "Convulsioni",
    anaphylaxis: "Anafilassi", heartAttack: "Infarto", hypothermia: "Ipotermia",
    eyeInjury: "Lesione oculare", electricShock: "Scossa elettrica", overdose: "Overdose",
  },
  kriol: {
    emergencyBanner: "Wen samwan rili sik o hert, ringap Triple Zero (000) stret",
    appTitle: "First Aid Angel",
    appSubtitle: "Yu Ferst Aid Helpa",
    welcomeHeading: "Wanim ai gin helpim yu?",
    welcomeDescription: "Askim mi enijing baut ferst aid. Ai gin shoum yu step bai step.",
    inputPlaceholder: "Dalim mi wanim bin heppen...",
    disclaimer: "Dis nomo teik ples bla dokta. Ringap 000 wen imijinsi.",
    cpr: "CPR", choking: "Joking", burns: "Bern", snakeBite: "Sneik Bait",
    bleeding: "Bliding", fracture: "Breikim Boun", seizure: "Fit",
    anaphylaxis: "Bad Allerji", heartAttack: "Hat Etak", hypothermia: "Tu Kol",
    eyeInjury: "Ai Hert", electricShock: "Elektrik Shok", overdose: "Overdose",
  },
  yolngu: {
    emergencyBanner: "Ŋunhi buku-ḏäkthun, djamarrkuliw Triple Zero (000) ŋayi",
    appTitle: "First Aid Angel",
    appSubtitle: "Ŋarraku First Aid Helper",
    welcomeHeading: "Nhä ŋarra djäma?",
    welcomeDescription: "Ŋarrakuŋ dhäwu first aid. Ŋarra yäku djäma step by step.",
    inputPlaceholder: "Dhäwu ŋarrakuŋ nhä buku-ḏäkthun...",
    disclaimer: "Ga dhä-wirrka'yun doctor-wu. Djamarrkuliw 000 ŋunhi buku-ḏäkthun.",
    cpr: "CPR", choking: "Choking", burns: "Wäŋa guḻun'", snakeBite: "Bäpi",
    bleeding: "Ŋayaŋu ŋal'", fracture: "Ŋayaŋu dharpa", seizure: "Fit",
    anaphylaxis: "Buku allerji", heartAttack: "Ŋayaŋu dhärra", hypothermia: "Buku ŋal'marr",
    eyeInjury: "Mil ḏäkthun", electricShock: "Gurrtha shock", overdose: "Overdose",
  },
  pitjantjatjara: {
    emergencyBanner: "Uwankara alatjitu pikaringkunytjaku, Triple Zero (000) telephone-angka wangka",
    appTitle: "First Aid Angel",
    appSubtitle: "Nyuntumpa First Aid Helper",
    welcomeHeading: "Nyaaku ngayulu nyuntunya alpamilantjaku?",
    welcomeDescription: "First aid tjutaku ngayunya tjapina. Step by step ngayulu watjantjaku.",
    inputPlaceholder: "Nyaa puṯi nyuntunya...",
    disclaimer: "Ngangkari tjutaku wanti. 000 wangka emergency-angka.",
    cpr: "CPR", choking: "Choking", burns: "Waru pika", snakeBite: "Liru katantja",
    bleeding: "Milpatjunanyi", fracture: "Tara pakantja", seizure: "Fit",
    anaphylaxis: "Pika puḻka allerji", heartAttack: "Kurrunpa pika", hypothermia: "Wari puḻka",
    eyeInjury: "Kuru pika", electricShock: "Gurrtha shock", overdose: "Overdose",
  },
  arrernte: {
    emergencyBanner: "Arelhe atnyeneme apeke, Triple Zero (000) aketyarte ileme",
    appTitle: "First Aid Angel",
    appSubtitle: "Nhenhe First Aid Helper",
    welcomeHeading: "Nhenhe iwerre ngkwe?",
    welcomeDescription: "First aid-akerte ngkwe ayerneme. Step by step ngkwe tyerre arlkeme.",
    inputPlaceholder: "Nhenhe nthakenhe apenteme...",
    disclaimer: "Doctor-ke ayerneme impene. 000 ileme emergency-kenhe.",
    cpr: "CPR", choking: "Choking", burns: "Ure apenteme", snakeBite: "Apme ketye",
    bleeding: "Atnye anthurre", fracture: "Altye iyerrknge", seizure: "Fit",
    anaphylaxis: "Allerji anthurre", heartAttack: "Atnye irrpentye", hypothermia: "Atnye arenge",
    eyeInjury: "Ante apenteme", electricShock: "Gurrtha shock", overdose: "Overdose",
  },
  tsi: {
    emergencyBanner: "Wen big sik or hert, ringap Triple Zero (000) kwiktaim",
    appTitle: "First Aid Angel",
    appSubtitle: "Yupela First Aid Helpa",
    welcomeHeading: "Wanem mi save helpem yu?",
    welcomeDescription: "Askem mi eni first aid samting. Mi save showem yu step bai step.",
    inputPlaceholder: "Tokem mi wanem bin happen...",
    disclaimer: "Dis nomo teik ples blo dokta. Ringap 000 lo emergency.",
    cpr: "CPR", choking: "Choking", burns: "Burn", snakeBite: "Snake Bite",
    bleeding: "Bleeding", fracture: "Broken Bone", seizure: "Fit",
    anaphylaxis: "Bad Allerji", heartAttack: "Heart Attack", hypothermia: "Too Cold",
    eyeInjury: "Eye Hert", electricShock: "Electric Shock", overdose: "Overdose",
  },
};

export const languageFullName: Record<LanguageCode, string> = {
  en: "English",
  zh: "Mandarin Chinese (普通话)",
  yue: "Cantonese Chinese (廣東話)",
  ar: "Arabic (العربية)",
  vi: "Vietnamese (Tiếng Việt)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
  el: "Greek (Ελληνικά)",
  it: "Italian (Italiano)",
  kriol: "Australian Kriol (a creole language spoken across Northern Australia)",
  yolngu: "Yolŋu Matha (spoken in Arnhem Land, Northern Territory)",
  pitjantjatjara: "Pitjantjatjara (spoken in Central Australia, including parts of SA, WA, and NT)",
  arrernte: "Arrernte (spoken in the Alice Springs region, Northern Territory)",
  tsi: "Yumplatok / Torres Strait Creole (spoken in the Torres Strait Islands, Queensland)",
};

interface LanguageContextValue {
  language: LanguageCode;
  /** True when the language is following browser auto-detect (no manual override). */
  isAuto: boolean;
  /** Set a specific language (manual override). */
  setLanguage: (lang: LanguageCode) => void;
  /** Clear the manual override and re-sync to the browser's detected language. Returns the detected language. */
  setAuto: () => LanguageCode;
  t: (key: TranslationKey) => string;

}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "faa:lang";

/** Detect language from browser locale only (ignores stored override). */
const detectFromBrowser = (): LanguageCode => {
  const browserLangs =
    (typeof navigator !== "undefined" && (navigator.languages || [navigator.language])) || [];
  for (const bl of browserLangs) {
    if (!bl) continue;
    const lower = bl.toLowerCase();
    const exact = languages.find((l) => l.code === lower);
    if (exact) return exact.code;
    if (lower.startsWith("yue") || lower === "zh-hk" || lower === "zh-tw") return "yue";
    if (lower.startsWith("zh")) return "zh";
    const prefix = lower.split("-")[0];
    const match = languages.find((l) => l.code === prefix);
    if (match) return match.code;
  }
  return "en";
};

const readStored = (): LanguageCode | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (stored && languages.find((l) => l.code === stored)) return stored;
  } catch {
    /* ignore */
  }
  return null;
};

const initialLanguage = (): LanguageCode => readStored() ?? detectFromBrowser();

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>(initialLanguage);
  const [isAuto, setIsAuto] = useState<boolean>(() => readStored() === null);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    setIsAuto(false);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  };

  const setAuto = (): LanguageCode => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    const detected = detectFromBrowser();
    setIsAuto(true);
    setLanguageState(detected);
    return detected;
  };


  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] ?? translations.en[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, isAuto, setLanguage, setAuto, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const fallback: LanguageContextValue = {
  language: "en",
  isAuto: false,
  setLanguage: () => {},
  setAuto: () => "en",
  t: (key: TranslationKey) => translations.en[key] ?? key,
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  return ctx ?? fallback;
};
