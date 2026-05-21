// Curated directory of online first aid shops that ship to their country.
// Pattern mirrors `donations.ts`: each country lists up to three vendors,
// preferring St John where present, plus reputable national alternatives.
// `null` means no national online store — we fall back to international.

import { COUNTRIES, type CountryCode, getCountry, DEFAULT_COUNTRY } from "@/lib/donations";

export type ShopId = "stjohn" | "redcross" | "national";

export type ShopMeta = {
  id: ShopId;
  name: string;
  short: string;
  international: string;
};

export const SHOPS: Record<ShopId, ShopMeta> = {
  stjohn: {
    id: "stjohn",
    name: "St John First Aid Shop",
    short: "St John First Aid",
    international: "https://shop.stjohn.org.au/",
  },
  redcross: {
    id: "redcross",
    name: "Red Cross First Aid Shop",
    short: "Red Cross Shop",
    international: "https://www.redcross.org.uk/shop",
  },
  national: {
    id: "national",
    name: "National First Aid Supplier",
    short: "National Supplier",
    international: "https://www.firstaidonly.com/",
  },
};

/** Per-country online shops. Keys map to a SHOPS id. URL `null` = no national store. */
export const COUNTRY_SHOPS: Record<string, Partial<Record<ShopId, string>>> = {
  // ───── Oceania ─────
  AU: {
    stjohn: "https://shop.stjohn.org.au/",
    redcross: "https://shop.redcross.org.au/",
    national: "https://www.survival.net.au/collections/first-aid-kits",
  },
  NZ: {
    stjohn: "https://shop.stjohn.org.nz/",
    national: "https://www.firstaid.co.nz/",
  },
  FJ: { stjohn: "https://stjohn.org.fj/shop/" },
  PG: {},

  // ───── UK & Ireland ─────
  GB: {
    stjohn: "https://www.sja.org.uk/first-aid-supplies/",
    redcross: "https://www.redcross.org.uk/shop/first-aid-supplies",
    national: "https://www.firstaid4less.co.uk/",
  },
  IE: {
    stjohn: "https://www.stjohn.ie/first-aid-supplies/",
    national: "https://www.firstaidsuppliesireland.ie/",
  },

  // ───── North America ─────
  US: {
    redcross: "https://www.redcrossstore.org/",
    national: "https://www.firstaidonly.com/",
  },
  CA: {
    stjohn: "https://www.sja.ca/en/shop",
    redcross: "https://shop.redcross.ca/",
    national: "https://www.firstaidcentral.ca/",
  },
  MX: { national: "https://www.botiquinesdf.com/" },

  // ───── Latin America ─────
  BR: { national: "https://www.kitprimeirossocorros.com.br/" },
  AR: { national: "https://www.primerosauxilios.com.ar/" },
  CL: { national: "https://www.primerosauxilios.cl/" },
  CO: { national: "https://www.primerosauxilios.com.co/" },
  PE: { national: "https://www.primerosauxilios.pe/" },

  // ───── Western Europe ─────
  DE: {
    redcross: "https://shop.drk.de/",
    national: "https://www.holthaus-medical.com/",
  },
  FR: {
    redcross: "https://boutique.croix-rouge.fr/",
    national: "https://www.lifa-international.com/",
  },
  IT: {
    redcross: "https://shop.cri.it/",
    national: "https://www.pharmasi.it/primo-soccorso",
  },
  ES: {
    redcross: "https://tienda.cruzroja.es/",
    national: "https://www.botiquinesonline.com/",
  },
  PT: { national: "https://www.farmaciascom.pt/primeiros-socorros" },
  NL: { redcross: "https://shop.rodekruis.nl/", national: "https://www.ehbo-shop.nl/" },
  BE: { redcross: "https://shop.rodekruis.be/", national: "https://www.ehbo-winkel.be/" },
  LU: { redcross: "https://shop.croix-rouge.lu/" },
  CH: { redcross: "https://shop.redcross.ch/", national: "https://www.iv-shop.ch/" },
  AT: { redcross: "https://shop.roteskreuz.at/", national: "https://www.oebh-shop.at/" },

  // ───── Nordics ─────
  SE: { redcross: "https://shop.rodakorset.se/", national: "https://www.medic24.se/" },
  NO: { redcross: "https://shop.rodekors.no/", national: "https://www.norsafe.no/" },
  DK: { redcross: "https://shop.rodekors.dk/", national: "https://www.foersteshjaelp.dk/" },
  FI: { redcross: "https://shop.punainenristi.fi/", national: "https://www.ensiapu.fi/" },
  IS: { redcross: "https://shop.raudikrossinn.is/" },

  // ───── Central & Eastern Europe ─────
  PL: { redcross: "https://sklep.pck.pl/", national: "https://www.apteczki.pl/" },
  CZ: { redcross: "https://shop.cervenykriz.eu/", national: "https://www.lekarnicky.cz/" },
  SK: { redcross: "https://shop.redcross.sk/" },
  HU: { redcross: "https://shop.voroskereszt.hu/" },
  RO: { redcross: "https://shop.crucearosie.ro/" },
  BG: { redcross: "https://shop.redcross.bg/" },
  HR: { redcross: "https://shop.hck.hr/" },
  SI: { redcross: "https://shop.rks.si/" },
  RS: { redcross: "https://shop.redcross.org.rs/" },
  GR: { redcross: "https://shop.redcross.gr/", national: "https://www.farmakeio.gr/proton-voitheion" },
  UA: { redcross: "https://shop.redcross.org.ua/" },
  EE: { redcross: "https://shop.redcross.ee/" },
  LV: { redcross: "https://shop.redcross.lv/" },
  LT: { redcross: "https://shop.redcross.lt/" },
  CY: { redcross: "https://shop.redcross.org.cy/" },
  MT: { stjohn: "https://www.stjohn.org.mt/shop/", redcross: "https://shop.redcross.org.mt/" },

  // ───── Middle East & North Africa ─────
  IL: { redcross: "https://shop.mdais.org/" },
  AE: { redcross: "https://shop.rcuae.ae/" },
  SA: { redcross: "https://shop.srca.org.sa/" },
  TR: { redcross: "https://shop.kizilay.org.tr/", national: "https://www.ilkyardimmarketi.com/" },
  EG: { redcross: "https://shop.egyptianrc.org/" },
  MA: { redcross: "https://shop.croissant-rouge.ma/" },

  // ───── Sub-Saharan Africa ─────
  ZA: {
    stjohn: "https://stjohn.org.za/shop/",
    redcross: "https://shop.redcross.org.za/",
    national: "https://www.firstaidkits.co.za/",
  },
  KE: { stjohn: "https://www.stjohnkenya.org/shop/" },
  NG: { stjohn: "https://stjohnnigeria.org/shop/" },
  GH: { stjohn: "https://stjohnambulanceghana.org/shop/" },
  TZ: { stjohn: "https://stjohntanzania.org/shop/" },
  UG: { stjohn: "https://stjohnuganda.org/shop/" },
  ET: {},
  ZW: { stjohn: "https://stjohnzimbabwe.org/shop/" },
  ZM: { stjohn: "https://stjohnzambia.org/shop/" },
  MW: { stjohn: "https://www.stjohnmalawi.org/shop/" },
  NA: { stjohn: "https://www.stjohnnamibia.org/shop/" },
  BW: {},
  MU: { stjohn: "https://stjohnmauritius.org/shop/" },

  // ───── South Asia ─────
  IN: {
    stjohn: "https://stjohnindia.org/shop/",
    redcross: "https://shop.indianredcross.org/",
    national: "https://www.firstaidindia.com/",
  },
  PK: { redcross: "https://shop.prcs.org.pk/" },
  BD: { redcross: "https://shop.bdrcs.org/" },
  LK: { redcross: "https://shop.redcross.lk/" },
  NP: { redcross: "https://shop.nrcs.org/" },

  // ───── East & Southeast Asia ─────
  JP: { redcross: "https://shop.jrc.or.jp/", national: "https://www.amazon.co.jp/s?k=救急セット" },
  KR: { redcross: "https://shop.redcross.or.kr/" },
  TW: { redcross: "https://shop.redcross.org.tw/" },
  HK: {
    stjohn: "https://www.stjohn.org.hk/en/shop/",
    redcross: "https://shop.redcross.org.hk/",
  },
  SG: {
    stjohn: "https://www.stjohn.org.sg/shop/",
    redcross: "https://shop.redcross.sg/",
  },
  MY: {
    stjohn: "https://www.sja.org.my/shop/",
    redcross: "https://shop.redcrescent.org.my/",
  },
  TH: { redcross: "https://shop.redcross.or.th/" },
  PH: { redcross: "https://shop.redcross.org.ph/" },
  ID: { redcross: "https://shop.pmi.or.id/" },
  VN: { redcross: "https://shop.redcross.org.vn/" },

  // ───── Caribbean ─────
  JM: { stjohn: "https://stjohnjamaica.org/shop/" },
  TT: { stjohn: "https://stjohntt.org/shop/" },
  BB: { stjohn: "https://stjohnbarbados.org/shop/" },
  BS: { stjohn: "https://stjohnbahamas.org/shop/" },
};

export function shopsForCountry(code: string | null | undefined): Array<{ id: ShopId; url: string; isNational: boolean }> {
  const country = getCountry(code ?? DEFAULT_COUNTRY);
  const national = COUNTRY_SHOPS[country.code] ?? {};
  // Maintain a stable order: St John, Red Cross, National.
  const order: ShopId[] = ["stjohn", "redcross", "national"];
  return order.map((id) => {
    const url = national[id];
    return { id, url: url ?? SHOPS[id].international, isNational: !!url };
  });
}

export function shopUrl(code: string | null | undefined, id: ShopId): string {
  const national = COUNTRY_SHOPS[(code ?? DEFAULT_COUNTRY) as CountryCode];
  return national?.[id] ?? SHOPS[id].international;
}

export { COUNTRIES };
