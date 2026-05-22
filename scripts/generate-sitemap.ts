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

const basePaths: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/kb", changefreq: "weekly", priority: "0.9" },
  { path: "/symptoms", changefreq: "weekly", priority: "0.9" },
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

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ...urls,
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${urls.length} entries across ${LANGS.length} languages)`);
