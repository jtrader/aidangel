// Curated donation directory for First Aid Angel.
// Three major first-aid / humanitarian NGOs, per country.
// `null` means the NGO has no dedicated national fundraising presence in that
// country — we fall back to the international site (see `donationUrl`).
// Countries are included if AT LEAST ONE of the three NGOs has a national
// fundraising presence there.

export type NgoId = "redcross" | "msf" | "stjohn";

export type NgoMeta = {
  id: NgoId;
  name: string;
  short: string;
  international: string;
};

export const NGOS: Record<NgoId, NgoMeta> = {
  redcross: {
    id: "redcross",
    name: "Red Cross / Red Crescent",
    short: "Red Cross",
    international: "https://www.icrc.org/en/donate",
  },
  msf: {
    id: "msf",
    name: "Médecins Sans Frontières (Doctors Without Borders)",
    short: "Doctors Without Borders",
    international: "https://www.msf.org/donate",
  },
  stjohn: {
    id: "stjohn",
    name: "St John Ambulance",
    short: "St John Ambulance",
    international: "https://www.orderofstjohn.org/donate/",
  },
};

export type Country = {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  flag: string;
  donations: Record<NgoId, string | null>;
};

export type CountryCode = string;

export const COUNTRIES: Country[] = [
  // ───── Oceania ─────
  { code: "AU", name: "Australia", flag: "🇦🇺", donations: {
      redcross: "https://www.redcross.org.au/donate/",
      msf: "https://www.msf.org.au/donate",
      stjohn: "https://www.stjohnvic.com.au/support-us/donations-2016-12/",
  }},
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", donations: {
      redcross: "https://www.redcross.org.nz/donate/",
      msf: "https://www.msf.org.nz/donate",
      stjohn: "https://www.stjohn.org.nz/donate/",
  }},
  { code: "FJ", name: "Fiji", flag: "🇫🇯", donations: {
      redcross: "https://www.redcross.com.fj/donate/",
      msf: null,
      stjohn: "https://stjohn.org.fj/donate/",
  }},
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬", donations: {
      redcross: "https://www.redcross.org.pg/",
      msf: null,
      stjohn: null,
  }},

  // ───── United Kingdom & Ireland ─────
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", donations: {
      redcross: "https://donate.redcross.org.uk/",
      msf: "https://www.msf.org.uk/donate",
      stjohn: "https://www.sja.org.uk/get-involved/donate/",
  }},
  { code: "IE", name: "Ireland", flag: "🇮🇪", donations: {
      redcross: "https://www.redcross.ie/donate/",
      msf: "https://www.msf.ie/donate",
      stjohn: "https://www.stjohn.ie/donate/",
  }},

  // ───── North America ─────
  { code: "US", name: "United States", flag: "🇺🇸", donations: {
      redcross: "https://www.redcross.org/donate/donation.html",
      msf: "https://donate.doctorswithoutborders.org/",
      stjohn: "https://stjohnus.org/donate/",
  }},
  { code: "CA", name: "Canada", flag: "🇨🇦", donations: {
      redcross: "https://www.redcross.ca/donate",
      msf: "https://www.doctorswithoutborders.ca/donate",
      stjohn: "https://sja.ca/en/donate",
  }},
  { code: "MX", name: "Mexico", flag: "🇲🇽", donations: {
      redcross: "https://www.cruzrojadonaciones.org/",
      msf: "https://www.msf.mx/donar",
      stjohn: null,
  }},

  // ───── Latin America ─────
  { code: "BR", name: "Brazil", flag: "🇧🇷", donations: {
      redcross: "https://www.cruzvermelha.org.br/doe/",
      msf: "https://doe.msf.org.br/",
      stjohn: null,
  }},
  { code: "AR", name: "Argentina", flag: "🇦🇷", donations: {
      redcross: "https://www.cruzroja.org.ar/donar/",
      msf: "https://donaciones.msf.org.ar/",
      stjohn: null,
  }},
  { code: "CL", name: "Chile", flag: "🇨🇱", donations: {
      redcross: "https://www.cruzroja.cl/donaciones/",
      msf: null,
      stjohn: null,
  }},
  { code: "CO", name: "Colombia", flag: "🇨🇴", donations: {
      redcross: "https://www.cruzrojacolombiana.org/dona-ya/",
      msf: null,
      stjohn: null,
  }},
  { code: "PE", name: "Peru", flag: "🇵🇪", donations: {
      redcross: "https://www.cruzroja.org.pe/donar/",
      msf: null,
      stjohn: null,
  }},

  // ───── Western Europe ─────
  { code: "DE", name: "Germany", flag: "🇩🇪", donations: {
      redcross: "https://www.drk.de/spenden/",
      msf: "https://www.aerzte-ohne-grenzen.de/spenden",
      stjohn: null,
  }},
  { code: "FR", name: "France", flag: "🇫🇷", donations: {
      redcross: "https://donner.croix-rouge.fr/",
      msf: "https://soutenir.msf.fr/",
      stjohn: null,
  }},
  { code: "IT", name: "Italy", flag: "🇮🇹", donations: {
      redcross: "https://dona.cri.it/",
      msf: "https://dona.medicisenzafrontiere.it/",
      stjohn: null,
  }},
  { code: "ES", name: "Spain", flag: "🇪🇸", donations: {
      redcross: "https://www2.cruzroja.es/donaciones",
      msf: "https://donaciones.msf.es/",
      stjohn: null,
  }},
  { code: "PT", name: "Portugal", flag: "🇵🇹", donations: {
      redcross: "https://www.cruzvermelha.pt/donativos.html",
      msf: null,
      stjohn: null,
  }},
  { code: "NL", name: "Netherlands", flag: "🇳🇱", donations: {
      redcross: "https://www.rodekruis.nl/doneren/",
      msf: "https://www.artsenzondergrenzen.nl/doneren/",
      stjohn: null,
  }},
  { code: "BE", name: "Belgium", flag: "🇧🇪", donations: {
      redcross: "https://www.rodekruis.be/gift",
      msf: "https://www.msf-azg.be/nl/doneer",
      stjohn: null,
  }},
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", donations: {
      redcross: "https://www.croix-rouge.lu/fr/donner/",
      msf: "https://www.msf.lu/fr/donner",
      stjohn: null,
  }},
  { code: "CH", name: "Switzerland", flag: "🇨🇭", donations: {
      redcross: "https://www.redcross.ch/en/donate",
      msf: "https://www.msf.ch/spenden",
      stjohn: null,
  }},
  { code: "AT", name: "Austria", flag: "🇦🇹", donations: {
      redcross: "https://www.roteskreuz.at/spenden",
      msf: "https://www.aerzte-ohne-grenzen.at/spenden",
      stjohn: null,
  }},

  // ───── Nordics ─────
  { code: "SE", name: "Sweden", flag: "🇸🇪", donations: {
      redcross: "https://www.rodakorset.se/stod-oss/ge-en-gava/",
      msf: "https://lakareutangranser.se/stod-oss",
      stjohn: null,
  }},
  { code: "NO", name: "Norway", flag: "🇳🇴", donations: {
      redcross: "https://www.rodekors.no/gi-en-gave/",
      msf: "https://legerutengrenser.no/stott-oss",
      stjohn: null,
  }},
  { code: "DK", name: "Denmark", flag: "🇩🇰", donations: {
      redcross: "https://www.rodekors.dk/stoet/giv-et-bidrag",
      msf: "https://laeger-uden-graenser.dk/stoet-os",
      stjohn: null,
  }},
  { code: "FI", name: "Finland", flag: "🇫🇮", donations: {
      redcross: "https://www.punainenristi.fi/lahjoita/",
      msf: "https://lakaretutangranser.fi/lahjoita",
      stjohn: null,
  }},
  { code: "IS", name: "Iceland", flag: "🇮🇸", donations: {
      redcross: "https://www.raudikrossinn.is/styrkja/",
      msf: null,
      stjohn: null,
  }},

  // ───── Central & Eastern Europe ─────
  { code: "PL", name: "Poland", flag: "🇵🇱", donations: {
      redcross: "https://pck.pl/wesprzyj-pck/",
      msf: "https://lekarze-bez-granic.pl/wesprzyj-nas/",
      stjohn: null,
  }},
  { code: "CZ", name: "Czechia", flag: "🇨🇿", donations: {
      redcross: "https://www.cervenykriz.eu/cs/darujte",
      msf: "https://www.lekari-bez-hranic.cz/podporte-nas",
      stjohn: null,
  }},
  { code: "SK", name: "Slovakia", flag: "🇸🇰", donations: {
      redcross: "https://redcross.sk/podporte-nas/",
      msf: null,
      stjohn: null,
  }},
  { code: "HU", name: "Hungary", flag: "🇭🇺", donations: {
      redcross: "https://voroskereszt.hu/tamogatas/",
      msf: null,
      stjohn: null,
  }},
  { code: "RO", name: "Romania", flag: "🇷🇴", donations: {
      redcross: "https://crucearosie.ro/doneaza/",
      msf: null,
      stjohn: null,
  }},
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", donations: {
      redcross: "https://www.redcross.bg/donate",
      msf: null,
      stjohn: null,
  }},
  { code: "HR", name: "Croatia", flag: "🇭🇷", donations: {
      redcross: "https://www.hck.hr/donacije/",
      msf: null,
      stjohn: null,
  }},
  { code: "SI", name: "Slovenia", flag: "🇸🇮", donations: {
      redcross: "https://www.rks.si/sl/Doniraj/",
      msf: null,
      stjohn: null,
  }},
  { code: "RS", name: "Serbia", flag: "🇷🇸", donations: {
      redcross: "https://www.redcross.org.rs/sr/donirajte/",
      msf: null,
      stjohn: null,
  }},
  { code: "GR", name: "Greece", flag: "🇬🇷", donations: {
      redcross: "https://www.redcross.gr/donations/",
      msf: "https://giving.msf.gr/",
      stjohn: null,
  }},
  { code: "UA", name: "Ukraine", flag: "🇺🇦", donations: {
      redcross: "https://redcross.org.ua/en/donate/",
      msf: null,
      stjohn: null,
  }},

  // ───── Baltics / Mediterranean ─────
  { code: "EE", name: "Estonia", flag: "🇪🇪", donations: {
      redcross: "https://www.redcross.ee/anneta/",
      msf: null,
      stjohn: null,
  }},
  { code: "LV", name: "Latvia", flag: "🇱🇻", donations: {
      redcross: "https://www.redcross.lv/atbalsti/",
      msf: null,
      stjohn: null,
  }},
  { code: "LT", name: "Lithuania", flag: "🇱🇹", donations: {
      redcross: "https://www.redcross.lt/parama/",
      msf: null,
      stjohn: null,
  }},
  { code: "CY", name: "Cyprus", flag: "🇨🇾", donations: {
      redcross: "https://www.redcross.org.cy/donate/",
      msf: null,
      stjohn: null,
  }},
  { code: "MT", name: "Malta", flag: "🇲🇹", donations: {
      redcross: "https://redcross.org.mt/donate/",
      msf: null,
      stjohn: "https://www.stjohn.org.mt/donate/",
  }},

  // ───── Middle East & North Africa ─────
  { code: "IL", name: "Israel", flag: "🇮🇱", donations: {
      redcross: "https://www.mdais.org/en/donation",
      msf: null,
      stjohn: "https://www.stjohneyehospital.org/donate/",
  }},
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", donations: {
      redcross: "https://www.rcuae.ae/en/Donate",
      msf: "https://msf-me.org/en/donate",
      stjohn: null,
  }},
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", donations: {
      redcross: "https://www.srca.org.sa/en",
      msf: null,
      stjohn: null,
  }},
  { code: "TR", name: "Türkiye", flag: "🇹🇷", donations: {
      redcross: "https://www.kizilay.org.tr/Bagis",
      msf: null,
      stjohn: null,
  }},
  { code: "EG", name: "Egypt", flag: "🇪🇬", donations: {
      redcross: "https://www.egyptianrc.org/Donation",
      msf: "https://www.msf-me.org/en/donate",
      stjohn: null,
  }},
  { code: "MA", name: "Morocco", flag: "🇲🇦", donations: {
      redcross: "https://www.croissant-rouge.ma/don/",
      msf: null,
      stjohn: null,
  }},

  // ───── Sub-Saharan Africa ─────
  { code: "ZA", name: "South Africa", flag: "🇿🇦", donations: {
      redcross: "https://www.redcross.org.za/donate/",
      msf: "https://www.msf.org.za/donate",
      stjohn: "https://stjohn.org.za/donate/",
  }},
  { code: "KE", name: "Kenya", flag: "🇰🇪", donations: {
      redcross: "https://www.redcross.or.ke/donate/",
      msf: null,
      stjohn: "https://www.stjohnkenya.org/donate/",
  }},
  { code: "NG", name: "Nigeria", flag: "🇳🇬", donations: {
      redcross: "https://redcrossnigeria.org/donate/",
      msf: null,
      stjohn: "https://stjohnnigeria.org/donate/",
  }},
  { code: "GH", name: "Ghana", flag: "🇬🇭", donations: {
      redcross: "https://www.redcrossghana.org/donate/",
      msf: null,
      stjohn: "https://stjohnambulanceghana.org/donate/",
  }},
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", donations: {
      redcross: "https://www.trcs.or.tz/donate/",
      msf: null,
      stjohn: "https://stjohntanzania.org/donate/",
  }},
  { code: "UG", name: "Uganda", flag: "🇺🇬", donations: {
      redcross: "https://www.redcrossug.org/donate/",
      msf: null,
      stjohn: "https://stjohnuganda.org/donate/",
  }},
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", donations: {
      redcross: "https://redcrosseth.org/donate/",
      msf: null,
      stjohn: null,
  }},
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼", donations: {
      redcross: "https://www.redcrosszim.org.zw/donate/",
      msf: null,
      stjohn: "https://stjohnzimbabwe.org/donate/",
  }},
  { code: "ZM", name: "Zambia", flag: "🇿🇲", donations: {
      redcross: "https://www.redcross.org.zm/donate/",
      msf: null,
      stjohn: "https://stjohnzambia.org/donate/",
  }},
  { code: "MW", name: "Malawi", flag: "🇲🇼", donations: {
      redcross: "https://www.malawiredcross.org/donate/",
      msf: null,
      stjohn: "https://www.stjohnmalawi.org/donate/",
  }},
  { code: "NA", name: "Namibia", flag: "🇳🇦", donations: {
      redcross: "https://www.redcross.org.na/donate/",
      msf: null,
      stjohn: "https://www.stjohnnamibia.org/donate/",
  }},
  { code: "BW", name: "Botswana", flag: "🇧🇼", donations: {
      redcross: "https://www.redcross.org.bw/donate/",
      msf: null,
      stjohn: null,
  }},
  { code: "MU", name: "Mauritius", flag: "🇲🇺", donations: {
      redcross: "https://www.redcross.mu/donate/",
      msf: null,
      stjohn: "https://stjohnmauritius.org/donate/",
  }},

  // ───── South Asia ─────
  { code: "IN", name: "India", flag: "🇮🇳", donations: {
      redcross: "https://indianredcross.org/ircs/donate",
      msf: "https://www.msfindia.in/donate/",
      stjohn: "https://stjohnindia.org/donate/",
  }},
  { code: "PK", name: "Pakistan", flag: "🇵🇰", donations: {
      redcross: "https://prcs.org.pk/donation/",
      msf: null,
      stjohn: null,
  }},
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", donations: {
      redcross: "https://bdrcs.org/donate/",
      msf: null,
      stjohn: null,
  }},
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", donations: {
      redcross: "https://www.redcross.lk/donate/",
      msf: null,
      stjohn: null,
  }},
  { code: "NP", name: "Nepal", flag: "🇳🇵", donations: {
      redcross: "https://nrcs.org/donate/",
      msf: null,
      stjohn: null,
  }},

  // ───── East & Southeast Asia ─────
  { code: "JP", name: "Japan", flag: "🇯🇵", donations: {
      redcross: "https://www.jrc.or.jp/contribute/",
      msf: "https://www.msf.or.jp/donate/",
      stjohn: null,
  }},
  { code: "KR", name: "South Korea", flag: "🇰🇷", donations: {
      redcross: "https://www.redcross.or.kr/donate/",
      msf: "https://msf.or.kr/donate",
      stjohn: null,
  }},
  { code: "TW", name: "Taiwan", flag: "🇹🇼", donations: {
      redcross: "https://www.redcross.org.tw/donate",
      msf: "https://msf.org.tw/donate",
      stjohn: null,
  }},
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", donations: {
      redcross: "https://www.redcross.org.hk/en/donation.html",
      msf: "https://www.msf.hk/en/donate",
      stjohn: "https://www.stjohn.org.hk/en/donation/",
  }},
  { code: "SG", name: "Singapore", flag: "🇸🇬", donations: {
      redcross: "https://www.redcross.sg/donate.html",
      msf: "https://www.msf.org/donate",
      stjohn: "https://www.stjohn.org.sg/donate/",
  }},
  { code: "MY", name: "Malaysia", flag: "🇲🇾", donations: {
      redcross: "https://www.redcrescent.org.my/donate/",
      msf: null,
      stjohn: "https://www.sja.org.my/donate/",
  }},
  { code: "TH", name: "Thailand", flag: "🇹🇭", donations: {
      redcross: "https://www.redcross.or.th/donate/",
      msf: null,
      stjohn: null,
  }},
  { code: "PH", name: "Philippines", flag: "🇵🇭", donations: {
      redcross: "https://redcross.org.ph/donate-now/",
      msf: null,
      stjohn: null,
  }},
  { code: "ID", name: "Indonesia", flag: "🇮🇩", donations: {
      redcross: "https://donasi.pmi.or.id/",
      msf: null,
      stjohn: null,
  }},
  { code: "VN", name: "Vietnam", flag: "🇻🇳", donations: {
      redcross: "https://redcross.org.vn/donate/",
      msf: null,
      stjohn: null,
  }},

  // ───── Caribbean ─────
  { code: "JM", name: "Jamaica", flag: "🇯🇲", donations: {
      redcross: "https://www.jamaicaredcross.org/donate/",
      msf: null,
      stjohn: "https://stjohnjamaica.org/donate/",
  }},
  { code: "TT", name: "Trinidad & Tobago", flag: "🇹🇹", donations: {
      redcross: "https://ttrcs.org/donate/",
      msf: null,
      stjohn: "https://stjohntt.org/donate/",
  }},
  { code: "BB", name: "Barbados", flag: "🇧🇧", donations: {
      redcross: "https://barbadosredcross.org/donate/",
      msf: null,
      stjohn: "https://stjohnbarbados.org/donate/",
  }},
  { code: "BS", name: "Bahamas", flag: "🇧🇸", donations: {
      redcross: "https://www.bahamasredcross.org/donate/",
      msf: null,
      stjohn: "https://stjohnbahamas.org/donate/",
  }},
];

export const DEFAULT_COUNTRY: CountryCode = "AU";

export function getCountry(code: string | null | undefined): Country {
  const found = COUNTRIES.find((c) => c.code === code);
  return found ?? COUNTRIES.find((c) => c.code === DEFAULT_COUNTRY)!;
}

/** Guess country from a BCP-47 locale string like "en-AU" or "fr-CH". */
export function guessCountryFromLocale(locale: string | undefined): CountryCode {
  if (!locale) return DEFAULT_COUNTRY;
  const region = locale.split("-")[1]?.toUpperCase();
  if (region && COUNTRIES.some((c) => c.code === region)) {
    return region as CountryCode;
  }
  return DEFAULT_COUNTRY;
}

export function donationUrl(country: Country, ngo: NgoId): string {
  return country.donations[ngo] ?? NGOS[ngo].international;
}

/**
 * Country → preferred UI language code. All values map to one of our 48
 * supported LanguageContext codes. Multilingual countries pick the most-spoken
 * supported tongue.
 */
export const COUNTRY_PRIMARY_LANGUAGE: Record<string, string> = {
  // English-primary
  AU: "en", NZ: "en", GB: "en", US: "en", CA: "en", IE: "en", ZA: "en",
  SG: "en", FJ: "en", PG: "en", JM: "en", TT: "en", BB: "en", BS: "en",
  KE: "en", NG: "en", GH: "en", TZ: "en", UG: "en", ZW: "en", ZM: "en",
  MW: "en", NA: "en", BW: "en", MU: "en", ET: "en",
  // Chinese
  HK: "yue", TW: "zh",
  // Arabic
  SA: "ar", AE: "ar", EG: "ar", MA: "ar",
  // Romance
  IT: "it", ES: "es", PT: "pt", BR: "pt", MX: "es", AR: "es", CL: "es",
  CO: "es", PE: "es", FR: "fr", BE: "fr", LU: "fr",
  // Germanic
  DE: "de", AT: "de", CH: "de", NL: "nl",
  // Nordic
  SE: "sv", NO: "no", DK: "da", FI: "fi", IS: "is",
  // Central / Eastern Europe
  PL: "pl", CZ: "cs", SK: "sk", HU: "hu", RO: "ro", BG: "bg", HR: "hr",
  SI: "sl", RS: "sr", UA: "uk", EE: "et", LV: "lv", LT: "lt", TR: "tr",
  // Mediterranean
  GR: "el", CY: "el", MT: "en",
  // Middle East
  IL: "he",
  // East Asia
  JP: "ja", KR: "ko",
  // Southeast Asia
  TH: "th", ID: "id", MY: "ms", PH: "tl", VN: "vi",
  // South Asia
  IN: "pa", PK: "ur", BD: "bn", LK: "si", NP: "ne",
};


/** Get the best-supported UI language code for a country. */
export function languageForCountry(code: string | null | undefined): string {
  if (!code) return "en";
  return COUNTRY_PRIMARY_LANGUAGE[code] ?? "en";
}

