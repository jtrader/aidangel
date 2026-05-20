import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://firstaidangel.lovekeyring.org";

interface SitemapEntry { path: string; changefreq?: string; priority?: string; }

const meta = JSON.parse(readFileSync(resolve("kb/_meta.json"), "utf8")) as Array<{ slug: string }>;

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/kb", changefreq: "weekly", priority: "0.9" },
  ...meta.map((t) => ({ path: `/kb/${t.slug}`, changefreq: "monthly", priority: "0.7" })),
];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) => [
    `  <url>`,
    `    <loc>${BASE_URL}${e.path}</loc>`,
    e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
    e.priority ? `    <priority>${e.priority}</priority>` : null,
    `  </url>`,
  ].filter(Boolean).join("\n")),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
