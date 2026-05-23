// Generates a multilingual sitemap.xml with <xhtml:link rel="alternate" hreflang>
// for every route × every supported language, plus x-default → English.
// Runs via predev/prebuild npm hooks.
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://firstaidangel.org";

const LANGS = [
  "en", "zh", "yue", "ar", "vi", "pa", "el", "it",
  "kriol", "yolngu", "pitjantjatjara", "arrernte", "tsi",
] as const;
type Lang = (typeof LANGS)[number];

const HREFLANG: Record<Lang, string> = {
  en: "en-AU",
  zh: "zh-CN",
  yue: "yue-HK",
  ar: "ar",
  vi: "vi",
  pa: "pa",
  el: "el",
  it: "it",
  kriol: "rop",
  tsi: "tcs",
  yolngu: "x-yolngu",
  pitjantjatjara: "x-pitjantjatjara",
  arrernte: "x-arrernte",
};

const meta = JSON.parse(readFileSync(resolve("kb/_meta.json"), "utf8")) as Array<{ slug: string }>;

// Long-tail symptom landers — keep slugs in sync with src/data/symptomLanders.ts
const LANDER_SLUGS = [
  "chest-pain",
  "severe-bleeding",
  "choking-adult",
  "choking-child",
  "choking-baby",
  "anaphylaxis-epipen",
  "stroke-signs",
  "snake-bite-australia",
  "burn-first-aid",
  "asthma-attack",
  "seizure-first-aid",
  "drowning-rescue",
];

// Workplace verticals — keep slugs in sync with src/data/workplaceVerticals.ts
const WORKPLACE_SLUGS = [
  "construction","mining","manufacturing","agriculture","healthcare-aged-care",
  "education-childcare","retail","hospitality","transport-logistics","office",
  "emergency-services","aviation","aquatic-leisure","entertainment","laboratory-research",
  "utilities-telco","maritime-offshore","waste-recycling","security-corrections","beauty-wellness",
];

// AED local SEO hub — keep slugs in sync with src/lib/aedLocations.ts
const AED_COUNTRIES: Array<{ slug: string; cities: string[] }> = [
  { slug: "australia", cities: ["sydney","melbourne","brisbane","perth","adelaide","canberra","hobart","darwin","gold-coast","newcastle"] },
  { slug: "new-zealand", cities: ["auckland","wellington","christchurch","hamilton","dunedin"] },
  { slug: "united-kingdom", cities: ["london","manchester","birmingham","edinburgh","glasgow","liverpool","leeds","bristol","cardiff","belfast"] },
  { slug: "ireland", cities: ["dublin","cork","galway","limerick"] },
  { slug: "united-states", cities: ["new-york","los-angeles","chicago","houston","phoenix","philadelphia","san-francisco","seattle","boston","washington-dc"] },
  { slug: "canada", cities: ["toronto","montreal","vancouver","calgary","ottawa","edmonton"] },
  { slug: "germany", cities: ["berlin","hamburg","munich","cologne","frankfurt","stuttgart"] },
  { slug: "france", cities: ["paris","marseille","lyon","toulouse","nice","bordeaux"] },
  { slug: "netherlands", cities: ["amsterdam","rotterdam","the-hague","utrecht"] },
  { slug: "belgium", cities: ["brussels","antwerp","ghent"] },
  { slug: "italy", cities: ["rome","milan","naples","turin","florence"] },
  { slug: "spain", cities: ["madrid","barcelona","valencia","seville"] },
  { slug: "portugal", cities: ["lisbon","porto"] },
  { slug: "poland", cities: ["warsaw","krakow","gdansk","wroclaw"] },
  { slug: "sweden", cities: ["stockholm","gothenburg","malmo"] },
  { slug: "norway", cities: ["oslo","bergen","trondheim"] },
  { slug: "denmark", cities: ["copenhagen","aarhus"] },
  { slug: "japan", cities: ["tokyo","osaka","kyoto","yokohama"] },
];

const aedPaths: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "/aed", changefreq: "weekly", priority: "0.9" },
  { path: "/aed-finder", changefreq: "weekly", priority: "0.8" },
  ...AED_COUNTRIES.map((c) => ({ path: `/aed/${c.slug}`, changefreq: "weekly", priority: "0.8" })),
  ...AED_COUNTRIES.flatMap((c) =>
    c.cities.map((city) => ({ path: `/aed/${c.slug}/${city}`, changefreq: "weekly", priority: "0.7" })),
  ),
];

const basePaths: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/kb", changefreq: "weekly", priority: "0.9" },
  { path: "/symptoms", changefreq: "weekly", priority: "0.9" },
  ...LANDER_SLUGS.map((s) => ({ path: `/symptoms/${s}`, changefreq: "monthly", priority: "0.8" })),
  ...meta.map((t) => ({ path: `/kb/${t.slug}`, changefreq: "monthly", priority: "0.7" })),
];

const localized = (lang: Lang, p: string) => {
  if (lang === "en") return p === "" ? "/" : p;
  if (p === "/") return `/${lang}`;
  return `/${lang}${p}`;
};

const urls: string[] = [];
for (const lang of LANGS) {
  for (const b of basePaths) {
    const loc = `${BASE_URL}${localized(lang, b.path)}`;
    const lines: string[] = [
      `  <url>`,
      `    <loc>${loc}</loc>`,
      `    <changefreq>${b.changefreq}</changefreq>`,
      `    <priority>${b.priority}</priority>`,
    ];
    for (const l of LANGS) {
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="${HREFLANG[l]}" href="${BASE_URL}${localized(l, b.path)}" />`,
      );
    }
    lines.push(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${localized("en", b.path)}" />`,
    );
    lines.push(`  </url>`);
    urls.push(lines.join("\n"));
  }
}

// AED hub: English-only URLs (routes are not localized).
for (const b of aedPaths) {
  urls.push(
    [
      `  <url>`,
      `    <loc>${BASE_URL}${b.path}</loc>`,
      `    <changefreq>${b.changefreq}</changefreq>`,
      `    <priority>${b.priority}</priority>`,
      `  </url>`,
    ].join("\n"),
  );
}

// LMS / Courses (catalog only — course detail URLs are dynamic & emitted at runtime)
const lmsPaths = [
  { path: "/courses", changefreq: "weekly", priority: "0.9" },
];
for (const b of lmsPaths) {
  urls.push(
    [
      `  <url>`,
      `    <loc>${BASE_URL}${b.path}</loc>`,
      `    <changefreq>${b.changefreq}</changefreq>`,
      `    <priority>${b.priority}</priority>`,
      `  </url>`,
    ].join("\n"),
  );
}

// Workplace verticals hub
const workplacePaths = [
  { path: "/workplace", changefreq: "monthly", priority: "0.9" },
  ...WORKPLACE_SLUGS.map((s) => ({ path: `/workplace/${s}`, changefreq: "monthly", priority: "0.8" })),
];
for (const b of workplacePaths) {
  urls.push(
    [
      `  <url>`,
      `    <loc>${BASE_URL}${b.path}</loc>`,
      `    <changefreq>${b.changefreq}</changefreq>`,
      `    <priority>${b.priority}</priority>`,
      `  </url>`,
    ].join("\n"),
  );
}



const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ...urls,
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${urls.length} entries across ${LANGS.length} languages)`);
