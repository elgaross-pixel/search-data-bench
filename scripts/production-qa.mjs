import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import process from 'node:process';

let failed = false;
const warn = (message) => console.warn(`WARNING: ${message}`);
const fail = (message) => { console.error(`FAIL: ${message}`); failed = true; };

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(path));
    else out.push(path);
  }
  return out;
}
const normalize = (u) => {
  try {
    const x = new URL(u);
    x.hash = ''; x.search = '';
    return x.href.endsWith('/') ? x.href : x.href + '/';
  } catch { return null; }
};

try { await stat('dist'); } catch { fail('dist/ does not exist; run npm run build first.'); }

const source = await readFile('site.config.ts', 'utf8');
const production = /status:\s*'production'/.test(source);
const indexable = /indexable:\s*true/.test(source);
const siteUrl = source.match(/url:\s*'([^']+)'/)?.[1];
const siteOrigin = siteUrl ? new URL(siteUrl).origin : null;

if (!siteUrl) fail('site.config.ts has no site URL.');
if (production && (!siteUrl?.startsWith('https://') || siteUrl.includes('example.invalid'))) fail('production site URL must be a real HTTPS origin.');
if (production && !indexable) warn('production asset is still non-indexable; allowed before OPEN_FOR_INDEXING.');

const files = await walk('dist');
const htmlFiles = files.filter((p) => p.endsWith('.html'));
const canonicals = new Set();

for (const path of htmlFiles) {
  const html = await readFile(path, 'utf8');
  const label = relative('dist', path).split(sep).join('/');
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1]
    ?? html.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i)?.[1];
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${label}: missing non-empty title.`);
  if (!/<meta\s+name=["']description["']\s+content=["'][^"']+["']/i.test(html)) fail(`${label}: missing non-empty meta description.`);
  if (!canonical) fail(`${label}: missing canonical URL.`);
  if (canonical) {
    const parsed = normalize(canonical);
    if (!parsed) fail(`${label}: invalid canonical URL.`);
    else {
      canonicals.add(parsed);
      if (production && new URL(parsed).origin !== siteOrigin) fail(`${label}: canonical origin does not match site URL.`);
    }
  }
  if (!production && !/name=["']robots["'][^>]*content=["']noindex,\s*follow["']/i.test(html)) fail(`${label}: planned/staging output must be noindex, follow.`);
  if (production && /\b(TBD|UNKNOWN|CHANGEME|example\.invalid)\b/i.test(html)) fail(`${label}: production output contains placeholder content.`);
}

const robots = await readFile('dist/robots.txt', 'utf8').catch(() => '');
if (!robots) fail('dist/robots.txt is missing.');
if (!production && !/Disallow:\s*\//i.test(robots)) fail('planned/staging robots.txt must block crawling.');
if (production && indexable && /Disallow:\s*\//i.test(robots)) fail('indexable production robots.txt blocks all crawling.');

const sitemapCandidates = files.filter((p) => /sitemap.*\.xml$/i.test(p));
if (!sitemapCandidates.length) fail('no generated sitemap XML found.');
const sitemapUrls = new Set();
for (const path of sitemapCandidates) {
  const xml = await readFile(path, 'utf8');
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const normalized = normalize(m[1]);
    if (!normalized) fail(`${relative('dist', path)}: invalid sitemap URL ${m[1]}`);
    else {
      sitemapUrls.add(normalized);
      if (production && new URL(normalized).origin !== siteOrigin) fail(`${relative('dist', path)}: sitemap origin does not match site URL.`);
    }
  }
  if (production && xml.includes('example.invalid')) fail(`${relative('dist', path)}: production sitemap uses example.invalid.`);
}
if (production && indexable) {
  for (const canonical of canonicals) if (!sitemapUrls.has(canonical)) fail(`canonical missing from sitemap: ${canonical}`);
}

for (const path of htmlFiles) {
  const html = await readFile(path, 'utf8');
  const hrefs = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)].map((m) => m[1]);
  for (const href of hrefs) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    const candidate = clean.endsWith('/') ? join('dist', clean.slice(1), 'index.html') : join('dist', clean.slice(1));
    const fallback = `${candidate}.html`;
    const exists = await stat(candidate).then(() => true).catch(() => false) || await stat(fallback).then(() => true).catch(() => false);
    if (!exists) fail(`${relative('dist', path)}: broken internal link ${href}`);
  }
}

if (failed) process.exit(1);
console.log(`Production QA PASS (${production ? 'production' : 'non-production'} mode): metadata, canonical origin, indexability, sitemap, robots, and internal links validated.`);
