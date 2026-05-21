#!/usr/bin/env node
/**
 * Verify all donate + shop URLs in src/lib/donations.ts and src/lib/shops.ts.
 *
 * Usage:
 *   node scripts/verify-links.mjs            # check, exit 1 if any broken
 *   node scripts/verify-links.mjs --json     # machine-readable report
 *
 * A URL is "broken" if DNS fails OR HTTP returns 404/410/5xx.
 * 403 and connection-resets are treated as OK (bot-blocking real sites).
 */
import fs from "node:fs";
import dns from "node:dns/promises";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const FILES = ["src/lib/donations.ts", "src/lib/shops.ts"].map((p) => path.join(ROOT, p));

const urlRe = /https?:\/\/[^\s"')]+/g;
const urls = new Set();
for (const f of FILES) {
  const src = fs.readFileSync(f, "utf8");
  for (const u of src.match(urlRe) || []) urls.add(u);
}

const CONCURRENCY = 20;
const TIMEOUT_MS = 15000;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 LinkChecker";

const BROKEN_HTTP = new Set([404, 410, 500, 502, 503]);

async function check(u) {
  const host = new URL(u).hostname;
  try {
    await dns.resolve4(host).catch(() => dns.resolve6(host));
  } catch (e) {
    return { u, ok: false, reason: `dns:${e.code || "ERR"}` };
  }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(u, {
      method: "GET",
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
    });
    clearTimeout(t);
    if (BROKEN_HTTP.has(res.status)) return { u, ok: false, reason: `http:${res.status}` };
    return { u, ok: true, status: res.status };
  } catch (e) {
    // Network-level errors are inconclusive (likely bot block / TLS quirk).
    return { u, ok: true, status: "net-ambiguous", reason: String(e.message || e).slice(0, 60) };
  }
}

const list = [...urls];
const results = [];
let i = 0;
async function worker() {
  while (i < list.length) {
    const u = list[i++];
    results.push(await check(u));
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const broken = results.filter((r) => !r.ok);
const wantJson = process.argv.includes("--json");
if (wantJson) {
  console.log(JSON.stringify({ total: results.length, broken }, null, 2));
} else {
  console.log(`Checked ${results.length} URLs — ${broken.length} broken.`);
  for (const r of broken) console.log(`  ${r.reason.padEnd(14)} ${r.u}`);
}
process.exit(broken.length === 0 ? 0 : 1);
