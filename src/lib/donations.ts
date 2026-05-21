// Curated donation directory for First Aid Angel.
// Three major first-aid / humanitarian NGOs, per country.
// `null` means the NGO has no dedicated national presence in that country
// — we fall back to the international site for those.

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

export type CountryCode =
  | "AU" | "NZ" | "GB" | "US" | "CA" | "IE" | "ZA" | "IN"
  | "SG" | "HK" | "DE" | "FR" | "IT" | "ES" | "NL" | "BE"
  | "CH" | "AT" | "SE" | "NO";

export type Country = {
  code: CountryCode;
  name: string;
  flag: string;
  donations: Record<NgoId, string | null>;
};

export const COUNTRIES: Country[] = [
  {
    code: "AU", name: "Australia", flag: "🇦🇺",
    donations: {
      redcross: "https://www.redcross.org.au/donate/",
      msf: "https://www.msf.org.au/donate",
      stjohn: "https://www.stjohnvic.com.au/support-us/donations-2016-12/",
    },
  },
  {
    code: "NZ", name: "New Zealand", flag: "🇳🇿",
    donations: {
      redcross: "https://www.redcross.org.nz/donate/",
      msf: "https://www.msf.org.nz/donate",
      stjohn: "https://www.stjohn.org.nz/donate/",
    },
  },
  {
    code: "GB", name: "United Kingdom", flag: "🇬🇧",
    donations: {
      redcross: "https://donate.redcross.org.uk/",
      msf: "https://www.msf.org.uk/donate",
      stjohn: "https://www.sja.org.uk/get-involved/donate/",
    },
  },
  {
    code: "US", name: "United States", flag: "🇺🇸",
    donations: {
      redcross: "https://www.redcross.org/donate/donation.html",
      msf: "https://donate.doctorswithoutborders.org/",
      stjohn: "https://stjohnus.org/donate/",
    },
  },
  {
    code: "CA", name: "Canada", flag: "🇨🇦",
    donations: {
      redcross: "https://www.redcross.ca/donate",
      msf: "https://www.doctorswithoutborders.ca/donate",
      stjohn: "https://sja.ca/en/donate",
    },
  },
  {
    code: "IE", name: "Ireland", flag: "🇮🇪",
    donations: {
      redcross: "https://www.redcross.ie/donate/",
      msf: "https://www.msf.ie/donate",
      stjohn: "https://www.stjohn.ie/donate/",
    },
  },
  {
    code: "ZA", name: "South Africa", flag: "🇿🇦",
    donations: {
      redcross: "https://www.redcross.org.za/donate/",
      msf: "https://www.msf.org.za/donate",
      stjohn: "https://stjohn.org.za/donate/",
    },
  },
  {
    code: "IN", name: "India", flag: "🇮🇳",
    donations: {
      redcross: "https://indianredcross.org/ircs/donate",
      msf: "https://www.msfindia.in/donate/",
      stjohn: "https://stjohnindia.org/donate/",
    },
  },
  {
    code: "SG", name: "Singapore", flag: "🇸🇬",
    donations: {
      redcross: "https://www.redcross.sg/donate.html",
      msf: "https://www.msf.org/donate",
      stjohn: "https://www.stjohn.org.sg/donate/",
    },
  },
  {
    code: "HK", name: "Hong Kong", flag: "🇭🇰",
    donations: {
      redcross: "https://www.redcross.org.hk/en/donation.html",
      msf: "https://www.msf.hk/en/donate",
      stjohn: "https://www.stjohn.org.hk/en/donation/",
    },
  },
  {
    code: "DE", name: "Germany", flag: "🇩🇪",
    donations: {
      redcross: "https://www.drk.de/spenden/",
      msf: "https://www.aerzte-ohne-grenzen.de/spenden",
      stjohn: null,
    },
  },
  {
    code: "FR", name: "France", flag: "🇫🇷",
    donations: {
      redcross: "https://donner.croix-rouge.fr/",
      msf: "https://soutenir.msf.fr/",
      stjohn: null,
    },
  },
  {
    code: "IT", name: "Italy", flag: "🇮🇹",
    donations: {
      redcross: "https://dona.cri.it/",
      msf: "https://dona.medicisenzafrontiere.it/",
      stjohn: null,
    },
  },
  {
    code: "ES", name: "Spain", flag: "🇪🇸",
    donations: {
      redcross: "https://www2.cruzroja.es/donaciones",
      msf: "https://donaciones.msf.es/",
      stjohn: null,
    },
  },
  {
    code: "NL", name: "Netherlands", flag: "🇳🇱",
    donations: {
      redcross: "https://www.rodekruis.nl/doneren/",
      msf: "https://www.artsenzondergrenzen.nl/doneren/",
      stjohn: null,
    },
  },
  {
    code: "BE", name: "Belgium", flag: "🇧🇪",
    donations: {
      redcross: "https://www.rodekruis.be/gift",
      msf: "https://www.msf-azg.be/nl/doneer",
      stjohn: null,
    },
  },
  {
    code: "CH", name: "Switzerland", flag: "🇨🇭",
    donations: {
      redcross: "https://www.redcross.ch/en/donate",
      msf: "https://www.msf.ch/spenden",
      stjohn: null,
    },
  },
  {
    code: "AT", name: "Austria", flag: "🇦🇹",
    donations: {
      redcross: "https://www.roteskreuz.at/spenden",
      msf: "https://www.aerzte-ohne-grenzen.at/spenden",
      stjohn: null,
    },
  },
  {
    code: "SE", name: "Sweden", flag: "🇸🇪",
    donations: {
      redcross: "https://www.rodakorset.se/stod-oss/ge-en-gava/",
      msf: "https://lakareutangranser.se/stod-oss",
      stjohn: null,
    },
  },
  {
    code: "NO", name: "Norway", flag: "🇳🇴",
    donations: {
      redcross: "https://www.rodekors.no/gi-en-gave/",
      msf: "https://legerutengrenser.no/stott-oss",
      stjohn: null,
    },
  },
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
