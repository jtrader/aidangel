import { createContext, useContext, useState, ReactNode } from "react";
import en from "@/locales/en.json";

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

// Load every locale catalog eagerly so t() is synchronous and bundled.
const catalogModules = import.meta.glob<Record<string, string>>("@/locales/*.json", {
  eager: true,
  import: "default",
});

const catalogs: Partial<Record<LanguageCode, Record<string, string>>> = {};
for (const [path, mod] of Object.entries(catalogModules)) {
  const code = path.split("/").pop()!.replace(".json", "") as LanguageCode;
  catalogs[code] = mod as Record<string, string>;
}

// English keys form the canonical key set used everywhere via t(...).
export type TranslationKey = keyof typeof en;

interface LanguageContextValue {
  language: LanguageCode;
  isAuto: boolean;
  setLanguage: (lang: LanguageCode) => void;
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

const translate = (lang: LanguageCode, key: TranslationKey): string => {
  const k = key as string;
  return (
    (catalogs[lang] as Record<string, unknown> | undefined)?.[k] as string ??
    (en as unknown as Record<string, string>)[k] ??
    k
  );
};

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

  const t = (key: TranslationKey): string => translate(language, key);

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
  t: (key: TranslationKey) => translate("en", key),
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  return ctx ?? fallback;
};
