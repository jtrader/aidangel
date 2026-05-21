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
  { code: "es", name: "Spanish", nativeName: "Español", region: "Spain & Latin America" },
  { code: "pt", name: "Portuguese", nativeName: "Português", region: "Brazil & Portugal" },
  { code: "de", name: "German", nativeName: "Deutsch", region: "Germany, Austria, Switzerland" },
  { code: "fr", name: "French", nativeName: "Français", region: "France, Belgium, Luxembourg" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", region: "Netherlands" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", region: "Sweden" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", region: "Norway" },
  { code: "da", name: "Danish", nativeName: "Dansk", region: "Denmark" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", region: "Finland" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska", region: "Iceland" },
  { code: "pl", name: "Polish", nativeName: "Polski", region: "Poland" },
  { code: "cs", name: "Czech", nativeName: "Čeština", region: "Czechia" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", region: "Slovakia" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", region: "Hungary" },
  { code: "ro", name: "Romanian", nativeName: "Română", region: "Romania" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", region: "Bulgaria" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", region: "Croatia" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina", region: "Slovenia" },
  { code: "sr", name: "Serbian", nativeName: "Српски", region: "Serbia" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", region: "Ukraine" },
  { code: "et", name: "Estonian", nativeName: "Eesti", region: "Estonia" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu", region: "Latvia" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", region: "Lithuania" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", region: "Türkiye" },
  { code: "ja", name: "Japanese", nativeName: "日本語", region: "Japan" },
  { code: "ko", name: "Korean", nativeName: "한국어", region: "South Korea" },
  { code: "th", name: "Thai", nativeName: "ไทย", region: "Thailand" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", region: "Indonesia" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", region: "Malaysia" },
  { code: "ur", name: "Urdu", nativeName: "اردو", region: "Pakistan" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", region: "Bangladesh" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", region: "Sri Lanka" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", region: "Nepal" },
  { code: "tl", name: "Tagalog", nativeName: "Tagalog", region: "Philippines" },
  { code: "he", name: "Hebrew", nativeName: "עברית", region: "Israel" },
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
  es: {
    emergencyBanner: "En una emergencia que ponga en peligro la vida, llame inmediatamente a Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Su asistente de primeros auxilios • Desarrollado por The St John of God First Aid Manual 5th Edition",
    welcomeHeading: "¿En qué puedo ayudarle?",
    welcomeDescription: "Pregúntame sobre cualquier situación de primeros auxilios. Te proporcionaré una guía paso a paso basada en el Manual de primeros auxilios de St John of God.",
    inputPlaceholder: "Describa su situación de primeros auxilios...",
    disclaimer: "No sustituye el consejo médico profesional. Siempre llame al 000 en caso de emergencia.",
    cpr: "RCP", choking: "Asfixia", burns: "Quemaduras", snakeBite: "Mordedura de serpiente",
    bleeding: "Hemorragia", fracture: "Fractura", seizure: "Convulsión",
    anaphylaxis: "Anafilaxia", heartAttack: "Ataque al corazón", hypothermia: "Hipotermia",
    eyeInjury: "Lesión ocular", electricShock: "Descarga eléctrica", overdose: "Sobredosis",
  },
  pt: {
    emergencyBanner: "Em uma emergência com risco de vida, ligue para o Triple Zero (000) imediatamente",
    appTitle: "First Aid Angel",
    appSubtitle: "Seu Assistente de Primeiros Socorros • Alimentado pelo St John of God First Aid Manual 5th Edition",
    welcomeHeading: "Como posso ajudar?",
    welcomeDescription: "Pergunte-me sobre qualquer situação de primeiros socorros. Fornecerei orientação passo a passo com base no St John of God First Aid Manual.",
    inputPlaceholder: "Descreva sua situação de primeiros socorros...",
    disclaimer: "Não substitui o aconselhamento médico profissional. Sempre ligue para 000 em emergências.",
    cpr: "RCP", choking: "Engasgo", burns: "Queimaduras", snakeBite: "Picada de Cobra",
    bleeding: "Sangramento", fracture: "Fratura", seizure: "Convulsão",
    anaphylaxis: "Anafilaxia", heartAttack: "Ataque Cardíaco", hypothermia: "Hipotermia",
    eyeInjury: "Lesão Ocular", electricShock: "Choque Elétrico", overdose: "Overdose",
  },
  de: {
    emergencyBanner: "Rufen Sie in einem lebensbedrohlichen Notfall sofort Triple Zero (000) an",
    appTitle: "First Aid Angel",
    appSubtitle: "Ihr Erste-Hilfe-Assistent • Basierend auf dem St John of God First Aid Manual 5. Auflage",
    welcomeHeading: "Wie kann ich helfen?",
    welcomeDescription: "Fragen Sie mich nach jeder Erste-Hilfe-Situation. Ich werde eine Schritt-für-Schritt-Anleitung basierend auf dem St John of God First Aid Manual geben.",
    inputPlaceholder: "Beschreiben Sie Ihre Erste-Hilfe-Situation...",
    disclaimer: "Kein Ersatz für professionelle medizinische Beratung. Rufen Sie in Notfällen immer 000 an.",
    cpr: "HLW", choking: "Ersticken", burns: "Verbrennungen", snakeBite: "Schlangenbiss",
    bleeding: "Blutung", fracture: "Fraktur", seizure: "Anfall",
    anaphylaxis: "Anaphylaxie", heartAttack: "Herzinfarkt", hypothermia: "Unterkühlung",
    eyeInjury: "Augenverletzung", electricShock: "Stromschlag", overdose: "Überdosis",
  },
  fr: {
    emergencyBanner: "En cas d'urgence vitale, composez immédiatement le Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Votre assistant de premiers secours • Alimenté par la 5e édition du manuel de premiers secours St John of God",
    welcomeHeading: "Comment puis-je vous aider ?",
    welcomeDescription: "Interrogez-moi sur toute situation de premiers secours. Je vous fournirai des conseils étape par étape basés sur le manuel de premiers secours de St John of God.",
    inputPlaceholder: "Décrivez votre situation de premiers secours...",
    disclaimer: "Ne remplace pas un avis médical professionnel. Appelez toujours le 000 en cas d'urgence.",
    cpr: "RCP", choking: "Étouffement", burns: "Brûlures", snakeBite: "Morsure de serpent",
    bleeding: "Saignement", fracture: "Fracture", seizure: "Crise d'épilepsie",
    anaphylaxis: "Anaphylaxie", heartAttack: "Crise cardiaque", hypothermia: "Hypothermie",
    eyeInjury: "Lésion oculaire", electricShock: "Choc électrique", overdose: "Overdose",
  },
  nl: {
    emergencyBanner: "Bel bij een levensbedreigende noodsituatie onmiddellijk Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Uw EHBO-assistent • Mogelijk gemaakt door The St John of God First Aid Manual 5th Edition",
    welcomeHeading: "Hoe kan ik helpen?",
    welcomeDescription: "Vraag me naar elke EHBO-situatie. Ik geef stap-voor-stap begeleiding op basis van The St John of God First Aid Manual.",
    inputPlaceholder: "Beschrijf uw EHBO-situatie...",
    disclaimer: "Geen vervanging voor professioneel medisch advies. Bel altijd 000 in noodgevallen.",
    cpr: "Reanimatie", choking: "Verstikking", burns: "Brandwonden", snakeBite: "Slangenbeet",
    bleeding: "Bloeding", fracture: "Breuk", seizure: "Toeval",
    anaphylaxis: "Anafylaxie", heartAttack: "Hartaanval", hypothermia: "Onderkoeling",
    eyeInjury: "Oogletsel", electricShock: "Elektrische schok", overdose: "Overdosis",
  },
  sv: {
    emergencyBanner: "Vid en livshotande nödsituation, ring Triple Zero (000) omedelbart",
    appTitle: "First Aid Angel",
    appSubtitle: "Din Första Hjälpen-assistent • Drivs av The St John of God First Aid Manual 5th Edition",
    welcomeHeading: "Hur kan jag hjälpa till?",
    welcomeDescription: "Fråga mig om vilken första hjälpen-situation som helst. Jag ger steg-för-steg-vägledning baserad på The St John of God First Aid Manual.",
    inputPlaceholder: "Beskriv din första hjälpen-situation...",
    disclaimer: "Ersätter inte professionell medicinsk rådgivning. Ring alltid 000 i nödsituationer.",
    cpr: "HLR", choking: "Kvävning", burns: "Brännskador", snakeBite: "Ormbett",
    bleeding: "Blödning", fracture: "Fraktur", seizure: "Krampanfall",
    anaphylaxis: "Anafylaxi", heartAttack: "Hjärtattack", hypothermia: "Hypotermi",
    eyeInjury: "Ögonskada", electricShock: "Elektrisk stöt", overdose: "Överdos",
  },
  no: {
    emergencyBanner: "I en livstruende nødsituasjon, ring Triple Zero (000) umiddelbart",
    appTitle: "First Aid Angel",
    appSubtitle: "Din Førstehjelpsassistent • Drevet av The St John of God First Aid Manual 5th Edition",
    welcomeHeading: "Hvordan kan jeg hjelpe?",
    welcomeDescription: "Spør meg om enhver førstehjelpssituasjon. Jeg vil gi trinnvis veiledning basert på The St John of God First Aid Manual.",
    inputPlaceholder: "Beskriv din førstehjelpssituasjon...",
    disclaimer: "Ikke en erstatning for profesjonell medisinsk rådgivning. Ring alltid 000 i nødsituasjoner.",
    cpr: "HLR", choking: "Kvelning", burns: "Brannsår", snakeBite: "Slangebitt",
    bleeding: "Blødning", fracture: "Brudd", seizure: "Anfall",
    anaphylaxis: "Anafylaksi", heartAttack: "Hjerteinfarkt", hypothermia: "Hypotermi",
    eyeInjury: "Øyeskade", electricShock: "Elektrisk støt", overdose: "Overdose",
  },
  da: {
    emergencyBanner: "I en livstruende nødsituation, ring omgående til Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Din førstehjælpsassistent • Drevet af The St John of God First Aid Manual 5th Edition",
    welcomeHeading: "Hvordan kan jeg hjælpe?",
    welcomeDescription: "Spørg mig om enhver førstehjælpssituation. Jeg vil give trin-for-trin vejledning baseret på The St John of God First Aid Manual.",
    inputPlaceholder: "Beskriv din førstehjælpssituation...",
    disclaimer: "Ikke en erstatning for professionel lægefaglig rådgivning. Ring altid 000 i nødsituationer.",
    cpr: "Hjerte-lunge-redning", choking: "Kvælning", burns: "Forbrændinger", snakeBite: "Slangebid",
    bleeding: "Blødning", fracture: "Brud", seizure: "Anfald",
    anaphylaxis: "Anafylaksi", heartAttack: "Hjerteanfald", hypothermia: "Hypotermi",
    eyeInjury: "Øjenskade", electricShock: "Elektrisk stød", overdose: "Overdosis",
  },
  fi: {
    emergencyBanner: "Henkeä uhkaavassa hätätilanteessa soita välittömästi numeroon Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Ensiapuassistenttisi • Perustuu St John of God First Aid Manual 5. painokseen",
    welcomeHeading: "Miten voin auttaa?",
    welcomeDescription: "Kysy minulta mistä tahansa ensiaputilanteesta. Annan vaiheittaiset ohjeet The St John of God First Aid Manual -käsikirjan perusteella.",
    inputPlaceholder: "Kuvaile ensiaputilannetta...",
    disclaimer: "Ei korvaa ammattimaista lääketieteellistä neuvontaa. Soita aina numeroon 000 hätätilanteessa.",
    cpr: "CPR", choking: "Tukehtuminen", burns: "Palovammat", snakeBite: "Käärmeen purema",
    bleeding: "Verenvuoto", fracture: "Murtuma", seizure: "Kohtaus",
    anaphylaxis: "Anafylaksia", heartAttack: "Sydänkohtaus", hypothermia: "Hypotermia",
    eyeInjury: "Silmävamma", electricShock: "Sähköisku", overdose: "Yliannostus",
  },
  is: {
    emergencyBanner: "Í lífshættulegum neyðartilvikum, hringdu strax í Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Fyrstu hjálpar aðstoðarmaður þinn • Knúið af The St John of God First Aid Manual 5. útgáfa",
    welcomeHeading: "Hvernig get ég hjálpað?",
    welcomeDescription: "Spurðu mig um hvaða skyndihjálparaðstæður sem er. Ég mun veita skref-fyrir-skref leiðbeiningar byggðar á The St John of God First Aid Manual.",
    inputPlaceholder: "Lýstu skyndihjálparaðstæðum þínum...",
    disclaimer: "Ekki í staðinn fyrir faglega læknisráðgjöf. Hringdu alltaf í 000 í neyðartilvikum.",
    cpr: "Endurlífgun", choking: "Köfnun", burns: "Brunasár", snakeBite: "Snákabít",
    bleeding: "Blæðingar", fracture: "Brot", seizure: "Flog",
    anaphylaxis: "Bráðaofnæmi", heartAttack: "Hjartaáfall", hypothermia: "Kæling",
    eyeInjury: "Augnskaði", electricShock: "Rafmagnssjokk", overdose: "Ofskömmtun",
  },
  pl: {
    emergencyBanner: "W sytuacji zagrożenia życia natychmiast zadzwoń pod numer Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Twój Asystent Pierwszej Pomocy • Oparty na The St John of God First Aid Manual wydanie 5",
    welcomeHeading: "Jak mogę pomóc?",
    welcomeDescription: "Zapytaj mnie o dowolną sytuację wymagającą pierwszej pomocy. Udzielę wskazówek krok po kroku, bazując na The St John of God First Aid Manual.",
    inputPlaceholder: "Opisz swoją sytuację awaryjną...",
    disclaimer: "Nie zastępuje profesjonalnej porady medycznej. Zawsze dzwoń pod 000 w nagłych wypadkach.",
    cpr: "RKO", choking: "Zakrztuszenie", burns: "Oparzenia", snakeBite: "Ukąszenie węża",
    bleeding: "Krwawienie", fracture: "Złamanie", seizure: "Drgawki",
    anaphylaxis: "Anafilaksja", heartAttack: "Zawał serca", hypothermia: "Hipotermia",
    eyeInjury: "Uraz oka", electricShock: "Porażenie prądem", overdose: "Przedawkowanie",
  },
  cs: {
    emergencyBanner: "V život ohrožující nouzové situaci okamžitě volejte Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Váš asistent první pomoci • Používá se příručka první pomoci St John of God, 5. vydání",
    welcomeHeading: "Jak mohu pomoci?",
    welcomeDescription: "Zeptejte se mě na jakoukoli situaci první pomoci. Poskytnu podrobné pokyny na základě příručky první pomoci St John of God.",
    inputPlaceholder: "Popište svou situaci první pomoci...",
    disclaimer: "Nenahrazuje odbornou lékařskou radu. V případě nouze vždy volejte 000.",
    cpr: "Kardiopulmonální resuscitace", choking: "Dušení", burns: "Popáleniny", snakeBite: "Uštknutí hadem",
    bleeding: "Krvácení", fracture: "Zlomenina", seizure: "Záchvat",
    anaphylaxis: "Anafylaxe", heartAttack: "Infarkt", hypothermia: "Podchlazení",
    eyeInjury: "Poranění oka", electricShock: "Úraz elektrickým proudem", overdose: "Předávkování",
  },
  sk: {
    emergencyBanner: "V život ohrozujúcej situácii okamžite volajte Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Váš asistent prvej pomoci • Používa Príručku prvej pomoci St John of God 5. vydanie",
    welcomeHeading: "Ako môžem pomôcť?",
    welcomeDescription: "Opýtajte sa ma na akúkoľvek situáciu prvej pomoci. Poskytnem podrobné pokyny na základe Príručka prvej pomoci St John of God.",
    inputPlaceholder: "Popíšte svoju situáciu prvej pomoci...",
    disclaimer: "Nenahrádza odbornú lekársku pomoc. V prípade núdze vždy volajte 000.",
    cpr: "KPR", choking: "Dusenie", burns: "Popáleniny", snakeBite: "Uštipnutie hadom",
    bleeding: "Krvácanie", fracture: "Zlomenina", seizure: "Záchvat",
    anaphylaxis: "Anafylaxia", heartAttack: "Infarkt", hypothermia: "Hypotermia",
    eyeInjury: "Poranenie oka", electricShock: "Elektrický šok", overdose: "Predávkovanie",
  },
  hu: {
    emergencyBanner: "Életveszélyes vészhelyzet esetén azonnal hívja a Triple Zero (000) számot",
    appTitle: "First Aid Angel",
    appSubtitle: "Az Ön elsősegélynyújtó asszisztense • A St John of God First Aid Manual 5. kiadása alapján",
    welcomeHeading: "Miben segíthetek?",
    welcomeDescription: "Kérdezzen bármilyen elsősegély-helyzetről. Lépésről lépésre segítek a St John of God First Aid Manual alapján.",
    inputPlaceholder: "Írja le az elsősegély-helyzetet...",
    disclaimer: "Nem helyettesíti a professzionális orvosi tanácsot. Vészhelyzet esetén mindig hívja a 000-t.",
    cpr: "CPR", choking: "Fulladás", burns: "Égési sérülések", snakeBite: "Kígyómarás",
    bleeding: "Vérzés", fracture: "Törés", seizure: "Roham",
    anaphylaxis: "Anafilaxia", heartAttack: "Szívroham", hypothermia: "Hipothermia",
    eyeInjury: "Szemsérülés", electricShock: "Áramütés", overdose: "Túladagolás",
  },
  ro: {
    emergencyBanner: "Într-o urgență care pune viața în pericol, apelați imediat la Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Asistentul tău de prim ajutor • Susținut de St John of God First Aid Manual Ediția a 5-a",
    welcomeHeading: "Cum te pot ajuta?",
    welcomeDescription: "Întreabă-mă despre orice situație de prim ajutor. Voi oferi instrucțiuni pas cu pas bazate pe St John of God First Aid Manual.",
    inputPlaceholder: "Descrie situația ta de prim ajutor...",
    disclaimer: "Nu înlocuiește sfatul medical profesional. Apelați întotdeauna 000 în caz de urgențe.",
    cpr: "Resuscitare cardio-pulmonară (RCP)", choking: "Sufocare", burns: "Arsuri", snakeBite: "Mușcătura de șarpe",
    bleeding: "Sângerare", fracture: "Fractură", seizure: "Criză epileptică",
    anaphylaxis: "Anafilaxie", heartAttack: "Infarct", hypothermia: "Hipotermie",
    eyeInjury: "Leziuni oculare", electricShock: "Electroșoc", overdose: "Supradozaj",
  },
  bg: {
    emergencyBanner: "При животозастрашаваща спешност, обадете се на Triple Zero (000) незабавно",
    appTitle: "First Aid Angel",
    appSubtitle: "Вашият помощник за първа помощ • Подкрепен от наръчника за първа помощ „Свети Йоан от Бога“ 5-то издание",
    welcomeHeading: "С какво мога да помогна?",
    welcomeDescription: "Попитайте ме за всяка ситуация, изискваща първа помощ. Ще предоставя насоки стъпка по стъпка въз основа на Наръчника за първа помощ „Свети Йоан от Бога“.",
    inputPlaceholder: "Опишете вашата ситуация, изискваща първа помощ...",
    disclaimer: "Не замества професионалния медицински съвет. Винаги се обаждайте на 000 при спешни случаи.",
    cpr: "СЛР", choking: "Задавяне", burns: "Изгаряния", snakeBite: "Ухапване от змия",
    bleeding: "Кървене", fracture: "Фрактура", seizure: "Припадък",
    anaphylaxis: "Анафилаксия", heartAttack: "Сърдечен удар", hypothermia: "Хипотермия",
    eyeInjury: "Нараняване на окото", electricShock: "Токов удар", overdose: "Свръхдоза",
  },
  hr: {
    emergencyBanner: "U hitnim slučajevima opasnim po život, odmah nazovite Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Vaš pomoćnik za prvu pomoć • Stvoren prema St John of God First Aid Manual 5. izdanje",
    welcomeHeading: "Kako mogu pomoći?",
    welcomeDescription: "Pitajte me o bilo kojoj situaciji pružanja prve pomoći. Pružit ću vam detaljne upute temeljene na priručniku St John of God First Aid Manual.",
    inputPlaceholder: "Opišite svoju situaciju prve pomoći...",
    disclaimer: "Nije zamjena za profesionalni medicinski savjet. U hitnim slučajevima uvijek nazovite 000.",
    cpr: "CPR", choking: "Gušenje", burns: "Opekline", snakeBite: "Ujed zmije",
    bleeding: "Krvarenje", fracture: "Prijelom", seizure: "Napadaj",
    anaphylaxis: "Anafilaksija", heartAttack: "Srčani udar", hypothermia: "Hipotermija",
    eyeInjury: "Ozljeda oka", electricShock: "Strujni udar", overdose: "Predoziranje",
  },
  sl: {
    emergencyBanner: "V življenjsko nevarnih nujnih primerih takoj pokličite Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Vaš pomočnik za prvo pomoč • poganja 5. izdaja priročnika prve pomoči St John of God",
    welcomeHeading: "Kako lahko pomagam?",
    welcomeDescription: "Vprašajte me o kateri koli situaciji prve pomoči. Zagotovil vam bom navodila po korakih, ki temeljijo na priročniku prve pomoči St John of God.",
    inputPlaceholder: "Opišite svojo situacijo prve pomoči...",
    disclaimer: "Ni nadomestilo za strokovni zdravniški nasvet. V nujnih primerih vedno pokličite 000.",
    cpr: "CPR", choking: "Zadušitev", burns: "Opekline", snakeBite: "Kačji ugriz",
    bleeding: "Krvavitev", fracture: "Zlom", seizure: "Napadi",
    anaphylaxis: "Anafilaksija", heartAttack: "Srčni napad", hypothermia: "Hiporermija",
    eyeInjury: "Poškodbe oči", electricShock: "Električni udar", overdose: "Prevelik odmerek",
  },
  sr: {
    emergencyBanner: "U hitnim slučajevima opasnim po život, odmah pozovite Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Vaš asistent za prvu pomoć • Pokreće ga St John of God First Aid Manual 5. izdanje",
    welcomeHeading: "Kako mogu pomoći?",
    welcomeDescription: "Pitajte me o bilo kojoj situaciji pružanja prve pomoći. Pružiću vam uputstva korak po korak zasnovana na St John of God First Aid Manual-u.",
    inputPlaceholder: "Opišite vašu situaciju prve pomoći...",
    disclaimer: "Nije zamena za profesionalni medicinski savet. Uvek pozovite 000 u hitnim slučajevima.",
    cpr: "CPR", choking: "Gušenje", burns: "Opekotine", snakeBite: "Ujed zmije",
    bleeding: "Krvarenje", fracture: "Prelom", seizure: "Napad",
    anaphylaxis: "Anafilaksija", heartAttack: "Srčani udar", hypothermia: "Hipotermija",
    eyeInjury: "Povreda oka", electricShock: "Strujni udar", overdose: "Predoziranje",
  },
  uk: {
    emergencyBanner: "У разі небезпечної для життя надзвичайної ситуації негайно телефонуйте на Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Ваш помічник з першої допомоги • Працює на основі посібника The St John of God First Aid Manual, 5-те видання",
    welcomeHeading: "Чим я можу допомогти?",
    welcomeDescription: "Запитайте мене про будь-яку ситуацію з надання першої допомоги. Я надам покрокові вказівки на основі посібника The St John of God First Aid Manual.",
    inputPlaceholder: "Опишіть вашу ситуацію з надання першої допомоги...",
    disclaimer: "Не є заміною професійної медичної консультації. Завжди телефонуйте 000 у надзвичайних ситуаціях.",
    cpr: "Серцево-легенева реанімація", choking: "Задуха", burns: "Опіки", snakeBite: "Укус змії",
    bleeding: "Кровотеча", fracture: "Перелом", seizure: "Напад",
    anaphylaxis: "Анафілаксія", heartAttack: "Інфаркт", hypothermia: "Переохолодження",
    eyeInjury: "Травма ока", electricShock: "Ураження електричним струмом", overdose: "Передозування",
  },
  et: {
    emergencyBanner: "Eluohtliku hädaolukorra korral helistage kohe Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Teie esmaabijuht • Powered by The St John of God First Aid Manual 5th Edition",
    welcomeHeading: "Kuidas saan abistada?",
    welcomeDescription: "Küsi minult mis tahes esmaabi olukorra kohta. Pakun samm-sammult juhiseid, mis põhinevad The St John of God First Aid Manualil.",
    inputPlaceholder: "Kirjeldage oma esmaabi olukorda...",
    disclaimer: "Ei asenda professionaalset meditsiinilist nõuannet. Hädaolukorras helista alati 000.",
    cpr: "CPR", choking: "Lämbumine", burns: "Põletused", snakeBite: "Maohammustus",
    bleeding: "Verejooks", fracture: "Murd", seizure: "Krambid",
    anaphylaxis: "Anafülaksia", heartAttack: "Südameatakk", hypothermia: "Hüpotermia",
    eyeInjury: "Silmavigastus", electricShock: "Elektrilöök", overdose: "Üledoos",
  },
  lv: {
    emergencyBanner: "Dzīvībai bīstamā ārkārtas situācijā nekavējoties zvaniet uz Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Jūsu pirmās palīdzības asistents • Darbojas ar St John of God First Aid Manual 5. izdevumu",
    welcomeHeading: "Kā es varu palīdzēt?",
    welcomeDescription: "Jautājiet man par jebkuru pirmās palīdzības situāciju. Es sniegšu soli pa solim norādījumus, pamatojoties uz St John of God First Aid Manual.",
    inputPlaceholder: "Aprakstiet savu pirmās palīdzības situāciju...",
    disclaimer: "Nav profesionālas medicīniskās palīdzības aizstājējs. Ārkārtas situācijās vienmēr zvaniet 000.",
    cpr: "Atdzīvināšana", choking: "Aizrīšanās", burns: "Apdegumi", snakeBite: "Čūskas kodums",
    bleeding: "Asiņošana", fracture: "Lūzums", seizure: "Krampji",
    anaphylaxis: "Anafilakse", heartAttack: "Sirdslēkme", hypothermia: "Hipotermija",
    eyeInjury: "Acu trauma", electricShock: "Elektriskais šoks", overdose: "Pārdozēšana",
  },
  lt: {
    emergencyBanner: "Esant pavojui gyvybei, nedelsiant skambinkite „Triple Zero (000)“",
    appTitle: "First Aid Angel",
    appSubtitle: "Jūsų pirmosios pagalbos asistentas • Paremtas „The St John of God First Aid Manual 5th Edition“",
    welcomeHeading: "Kuo galiu padėti?",
    welcomeDescription: "Klauskite manęs apie bet kokią pirmosios pagalbos situaciją. Pateiksiu nuoseklias gaires, paremtas „The St John of God First Aid Manual“. ",
    inputPlaceholder: "Apibūdinkite savo pirmosios pagalbos situaciją...",
    disclaimer: "Nėra profesionalios medicininės konsultacijos pakaitalas. Avariniais atvejais visada skambinkite 000.",
    cpr: "Gaivinimas", choking: "Užspringimas", burns: "Nudegimai", snakeBite: "Gyvatės įkandimas",
    bleeding: "Kraujavimas", fracture: "Lūžis", seizure: "Traukuliai",
    anaphylaxis: "Anafilaksija", heartAttack: "Širdies priepuolis", hypothermia: "Hiporermija",
    eyeInjury: "Akies trauma", electricShock: "Elektros šokas", overdose: "Perdozavimas",
  },
  tr: {
    emergencyBanner: "Hayatı tehdit eden bir acil durumda hemen Triple Zero (000) numarayı arayın",
    appTitle: "First Aid Angel",
    appSubtitle: "İlk Yardım Asistanınız • The St John of God First Aid Manual 5. Baskısı Tarafından Desteklenmektedir",
    welcomeHeading: "Nasıl yardımcı olabilirim?",
    welcomeDescription: "Bana herhangi bir ilk yardım durumu hakkında soru sorun. Size The St John of God First Aid Manual'a göre adım adım rehberlik sağlayacağım.",
    inputPlaceholder: "İlk yardım durumunuzu açıklayın...",
    disclaimer: "Profesyonel tıbbi tavsiye yerine geçmez. Acil durumlarda daima 000'ı arayın.",
    cpr: "CPR", choking: "Boğulma", burns: "Yanıklar", snakeBite: "Yılan Isırığı",
    bleeding: "Kanama", fracture: "Kırık", seizure: "Nöbet",
    anaphylaxis: "Anafilaksi", heartAttack: "Kalp Krizi", hypothermia: "Hiporermi",
    eyeInjury: "Göz Yaralanması", electricShock: "Elektrik Çarpması", overdose: "Doz Aşımı",
  },
  ja: {
    emergencyBanner: "生命にかかわる緊急事態には、直ちにTriple Zero (000) に電話してください。",
    appTitle: "First Aid Angel",
    appSubtitle: "応急処置アシスタント • St John of God First Aid Manual 第5版提供",
    welcomeHeading: "どのようにお手伝いできますか？",
    welcomeDescription: "応急処置の状況について何でもお尋ねください。St John of God First Aid Manual に基づいて、段階的なガイダンスを提供します。",
    inputPlaceholder: "応急処置の状況を説明してください...",
    disclaimer: "これは専門家の医学的アドバイスの代わりとなるものではありません。緊急時には常に000に電話してください。",
    cpr: "心肺蘇生法", choking: "窒息", burns: "火傷", snakeBite: "蛇咬傷",
    bleeding: "出血", fracture: "骨折", seizure: "発作",
    anaphylaxis: "アナフィラキシー", heartAttack: "心臓発作", hypothermia: "低体温症",
    eyeInjury: "眼の損傷", electricShock: "感電", overdose: "過剰摂取",
  },
  ko: {
    emergencyBanner: "생명을 위협하는 응급 상황 발생 시 즉시 Triple Zero (000)으로 전화하십시오.",
    appTitle: "First Aid Angel",
    appSubtitle: "귀하의 응급 처치 도우미 • The St John of God First Aid Manual 제공",
    welcomeHeading: "무엇을 도와드릴까요?",
    welcomeDescription: "응급 처치 상황에 대해 질문해 주세요. St John of God 응급 처치 매뉴얼에 따라 단계별 지침을 제공해 드립니다.",
    inputPlaceholder: "응급 처치 상황을 설명해 주세요...",
    disclaimer: "전문 의료 조언을 대체할 수 없습니다. 응급 상황 시에는 항상 000으로 전화하십시오.",
    cpr: "CPR", choking: "질식", burns: "화상", snakeBite: "뱀 물림",
    bleeding: "출혈", fracture: "골절", seizure: "발작",
    anaphylaxis: "아나필락시스", heartAttack: "심장 마비", hypothermia: "저체온증",
    eyeInjury: "눈 부상", electricShock: "감전", overdose: "과다 복용",
  },
  th: {
    emergencyBanner: "ในกรณีฉุกเฉินที่คุกคามถึงชีวิต ให้โทร Triple Zero (000) ทันที",
    appTitle: "First Aid Angel",
    appSubtitle: "ผู้ช่วยปฐมพยาบาลของคุณ • ขับเคลื่อนโดย The St John of God First Aid Manual ฉบับพิมพ์ครั้งที่ 5",
    welcomeHeading: "ฉันช่วยอะไรได้บ้าง?",
    welcomeDescription: "ถามฉันเกี่ยวกับสถานการณ์การปฐมพยาบาลใดๆ ฉันจะให้คำแนะนำทีละขั้นตอนตาม The St John of God First Aid Manual",
    inputPlaceholder: "อธิบายสถานการณ์การปฐมพยาบาลของคุณ...",
    disclaimer: "ไม่สามารถทดแทนคำแนะนำทางการแพทย์จากผู้เชี่ยวชาญได้ โทร 000 เสมอในกรณีฉุกเฉิน",
    cpr: "การช่วยชีวิต", choking: "สำลัก", burns: "แผลไหม้", snakeBite: "งูกัด",
    bleeding: "มีเลือดออก", fracture: "กระดูกหัก", seizure: "อาการชัก",
    anaphylaxis: "อาการแพ้อย่างรุนแรง", heartAttack: "ภาวะหัวใจวาย", hypothermia: "ภาวะตัวเย็นเกิน",
    eyeInjury: "การบาดเจ็บที่ตา", electricShock: "ไฟฟ้าช็อต", overdose: "การใช้ยาเกินขนาด",
  },
  id: {
    emergencyBanner: "Dalam keadaan darurat yang mengancam jiwa, segera hubungi Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Asisten Pertolongan Pertama Anda • Didukung oleh The St John of God First Aid Manual Edisi ke-5",
    welcomeHeading: "Bagaimana saya bisa membantu?",
    welcomeDescription: "Tanyakan kepada saya tentang situasi pertolongan pertama apa pun. Saya akan memberikan panduan langkah demi langkah berdasarkan The St John of God First Aid Manual.",
    inputPlaceholder: "Jelaskan situasi pertolongan pertama Anda...",
    disclaimer: "Bukan pengganti nasihat medis profesional. Selalu hubungi 000 dalam keadaan darurat.",
    cpr: "CPR", choking: "Tersedak", burns: "Luka Bakar", snakeBite: "Gigitan Ular",
    bleeding: "Pendarahan", fracture: "Patah Tulang", seizure: "Kejang",
    anaphylaxis: "Anafilaksis", heartAttack: "Serangan Jantung", hypothermia: "Hipotermia",
    eyeInjury: "Cedera Mata", electricShock: "Sengatan Listrik", overdose: "Overdosis",
  },
  ms: {
    emergencyBanner: "Dalam kecemasan yang mengancam nyawa, hubungi Triple Zero (000) dengan segera",
    appTitle: "First Aid Angel",
    appSubtitle: "Pembantu Pertolongan Cemas Anda • Dikuasakan oleh Manual Pertolongan Cemas St John of God Edisi ke-5",
    welcomeHeading: "Bagaimana saya boleh bantu?",
    welcomeDescription: "Tanya saya tentang sebarang situasi pertolongan cemas. Saya akan memberikan panduan langkah demi langkah berdasarkan Manual Pertolongan Cemas St John of God.",
    inputPlaceholder: "Terangkan situasi pertolongan cemas anda...",
    disclaimer: "Bukan pengganti nasihat perubatan profesional. Sentiasa hubungi 000 dalam kecemasan.",
    cpr: "CPR", choking: "Tercekik", burns: "Melecur", snakeBite: "Gigitan Ular",
    bleeding: "Pendarahan", fracture: "Patah Tulang", seizure: "Sawan",
    anaphylaxis: "Anafilaksis", heartAttack: "Serangan Jantung", hypothermia: "Hiportermia",
    eyeInjury: "Kecederaan Mata", electricShock: "Kejutan Elektrik", overdose: "Terlebih Dos",
  },
  ur: {
    emergencyBanner: "جان لیوا ہنگامی صورتحال میں، فوری طور پر Triple Zero (000) پر کال کریں۔",
    appTitle: "First Aid Angel",
    appSubtitle: "آپ کا فرسٹ ایڈ اسسٹنٹ • The St John of God First Aid Manual 5th Edition سے تقویت یافتہ",
    welcomeHeading: "میں کس طرح مدد کر سکتا ہوں؟",
    welcomeDescription: "کسی بھی فرسٹ ایڈ کی صورتحال کے بارے میں مجھ سے پوچھیں۔ میں The St John of God First Aid Manual کی بنیاد پر مرحلہ وار رہنمائی فراہم کروں گا۔",
    inputPlaceholder: "اپنی فرسٹ ایڈ کی صورتحال بیان کریں...",
    disclaimer: "پیشہ ورانہ طبی مشورے کا متبادل نہیں۔ ہنگامی صورتحال میں ہمیشہ 000 پر کال کریں۔",
    cpr: "سی پی آر", choking: "دم گھٹنا", burns: "جلنا", snakeBite: "سانپ کا کاٹنا",
    bleeding: "خون بہنا", fracture: "ہڈی کا ٹوٹنا", seizure: "دورہ",
    anaphylaxis: "شدید الرجی", heartAttack: "دل کا دورہ", hypothermia: "جسم کا ٹھنڈا پڑ جانا",
    eyeInjury: "آنکھ کی چوٹ", electricShock: "بجلی کا جھٹکا", overdose: "زیادتی خوراک",
  },
  bn: {
    emergencyBanner: "জীবন-হুমকির ক্ষেত্রে, অবিলম্বে Triple Zero (000) নম্বরে কল করুন",
    appTitle: "First Aid Angel",
    appSubtitle: "আপনার প্রাথমিক চিকিৎসার সহকারী • The St John of God First Aid Manual 5th Edition দ্বারা পরিচালিত",
    welcomeHeading: "আমি কিভাবে সাহায্য করতে পারি?",
    welcomeDescription: "যেকোনো প্রাথমিক চিকিৎসার পরিস্থিতি সম্পর্কে আমাকে জিজ্ঞাসা করুন। আমি The St John of God First Aid Manual এর উপর ভিত্তি করে ধাপে ধাপে নির্দেশনা দেব।",
    inputPlaceholder: "আপনার প্রাথমিক চিকিৎসার পরিস্থিতি বর্ণনা করুন...",
    disclaimer: "পেশাদার চিকিৎসা পরামর্শের বিকল্প নয়। জরুরি অবস্থায় সর্বদা 000 নম্বরে কল করুন।",
    cpr: "সিপিআর", choking: "শ্বাসরোধ", burns: "পোড়া", snakeBite: "সাপের কামড়",
    bleeding: "রক্তপাত", fracture: "হাড় ভাঙ্গা", seizure: "খিঁচুনি",
    anaphylaxis: "অ্যানাফিল্যাক্সিস", heartAttack: "হার্ট অ্যাটাক", hypothermia: "হাইপোথার্মিয়া",
    eyeInjury: "চোখের আঘাত", electricShock: "বৈদ্যুতিক শক", overdose: "ওভারডোজ",
  },
  si: {
    emergencyBanner: "ජීවිතයට තර්ජනයක් වන හදිසි අවස්ථාවකදී වහාම Triple Zero (000) අමතන්න.",
    appTitle: "First Aid Angel",
    appSubtitle: "ඔබේ ප්‍රථමාධාර සහායකයා • St John of God First Aid Manual 5th සංස්කරණය මඟින් බලගන්වා ඇත",
    welcomeHeading: "මට ඔබට උදව් කළ හැකිද?",
    welcomeDescription: "ඕනෑම ප්‍රථමාධාර තත්වයක් ගැන මගෙන් විමසන්න. මම St John of God First Aid Manual මත පදනම්ව පියවරෙන් පියවර මග පෙන්වීමක් ලබා දෙන්නෙමි.",
    inputPlaceholder: "ඔබේ ප්‍රථමාධාර තත්වය විස්තර කරන්න...",
    disclaimer: "වෘත්තීය වෛද්‍ය උපදෙස් සඳහා ආදේශකයක් නොවේ. හදිසි අවස්ථාවන්හිදී සෑම විටම 000 අමතන්න.",
    cpr: "CPR", choking: "හුස්ම හිරවීම", burns: "පිළිස්සුම්", snakeBite: "සර්ප දෂ්ට කිරීම",
    bleeding: "ලේ ගැලීම", fracture: "අස්ථි බිඳීම", seizure: "කම්පනය",
    anaphylaxis: "ඇනෆිලැක්සිස්", heartAttack: "හෘදයාබාධය", hypothermia: "හයිපෝතර්මියාව",
    eyeInjury: "ඇස් තුවාල", electricShock: "විදුලි සැර වැදීම", overdose: "මාත්‍රාව ඉක්මවා ගැනීම",
  },
  ne: {
    emergencyBanner: "जीवन-घातक आपतकालिन अवस्थामा, तुरुन्तै Triple Zero (000) मा कल गर्नुहोस्",
    appTitle: "First Aid Angel",
    appSubtitle: "तपाईंको प्राथमिक उपचार सहायक • St John of God First Aid Manual 5th Edition द्वारा संचालित",
    welcomeHeading: "म कसरी मद्दत गर्न सक्छु?",
    welcomeDescription: "मलाई कुनै पनि प्राथमिक उपचार अवस्थाको बारेमा सोध्नुहोस्। म St John of God First Aid Manual मा आधारित चरण-दर-चरण निर्देशनहरू प्रदान गर्नेछु।",
    inputPlaceholder: "तपाईंको प्राथमिक उपचार अवस्थाको वर्णन गर्नुहोस्...",
    disclaimer: "व्यावसायिक चिकित्सा सल्लाहको विकल्प होइन। आपतकालिन अवस्थामा सधैँ 000 मा कल गर्नुहोस्।",
    cpr: "सीपीआर", choking: "दम घुटना", burns: "जलेको", snakeBite: "सर्पको टोकाइ",
    bleeding: "रक्तस्राव", fracture: "भाँचिएको", seizure: "छारे रोग",
    anaphylaxis: "एनाफिलेक्सिस", heartAttack: "हृदयघात", hypothermia: "हाइपोथर्मिया",
    eyeInjury: "आँखामा चोट", electricShock: "विद्युतीय झट्का", overdose: "अधिक मात्रा",
  },
  tl: {
    emergencyBanner: "Sa isang emergency na nagbabanta sa buhay, tumawag kaagad sa Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "Ang Iyong Kasama sa First Aid • Pinapatakbo ng The St John of God First Aid Manual 5th Edition",
    welcomeHeading: "Paano ako makakatulong?",
    welcomeDescription: "Tanungin ako tungkol sa anumang sitwasyon ng first aid. Magbibigay ako ng sunud-sunod na gabay batay sa The St John of God First Aid Manual.",
    inputPlaceholder: "Ilarawan ang iyong sitwasyon ng first aid...",
    disclaimer: "Hindi kapalit ng propesyonal na payong medikal. Palaging tumawag sa 000 sa mga emergency.",
    cpr: "CPR", choking: "Pagkaumay", burns: "Mga paso", snakeBite: "Kagat ng ahas",
    bleeding: "Pagdurugo", fracture: "Bali", seizure: "Pag-atake",
    anaphylaxis: "Anaphylaxis", heartAttack: "Atake sa puso", hypothermia: "Hypothermia",
    eyeInjury: "Pinsala sa mata", electricShock: "Kuryente", overdose: "Overdose",
  },
  he: {
    emergencyBanner: "במקרה חירום מסכן חיים, התקשר מיד ל-Triple Zero (000)",
    appTitle: "First Aid Angel",
    appSubtitle: "העוזר שלך לעזרה ראשונה • מבוסס על The St John of God First Aid Manual מהדורה חמישית",
    welcomeHeading: "במה אוכל לעזור?",
    welcomeDescription: "שאל אותי על כל מצב של עזרה ראשונה. אספק הנחיות שלב אחר שלב המבוססות על The St John of God First Aid Manual.",
    inputPlaceholder: "תאר את מצב העזרה הראשונה שלך...",
    disclaimer: "אינו מהווה תחליף לייעוץ רפואי מקצועי. תמיד התקשר ל-000 במקרי חירום.",
    cpr: "החייאה", choking: "חנק", burns: "כוויות", snakeBite: "הכשת נחש",
    bleeding: "דימום", fracture: "שבר", seizure: "התקף אפילפטי",
    anaphylaxis: "אנפילקסיס", heartAttack: "התקף לב", hypothermia: "היפותרמיה",
    eyeInjury: "פגיעת עין", electricShock: "הלם חשמלי", overdose: "מנת יתר",
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
