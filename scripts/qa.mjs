import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

const forbidden = ['SelectVerdict', 'selectverdict.com', 'systeme.io'];
const placeholders = /\b(TBD|UNKNOWN|CHANGEME)\b|example\.invalid/i;
let failed = false;
const fail = (message) => { console.error(`FAIL: ${message}`); failed = true; };

async function filesUnder(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await filesUnder(path));
    else out.push(path);
  }
  return out;
}

for (const path of ['site.config.ts', 'astro.config.mjs', ...await filesUnder('src')]) {
  const content = await readFile(path, 'utf8');
  for (const token of forbidden) if (content.includes(token)) fail(`${path} contains forbidden reference token: ${token}`);
}

const config = await readFile('site.config.ts', 'utf8');
const status = config.match(/status:\s*'([^']+)'/)?.[1];
const assetId = config.match(/id:\s*'([^']+)'/)?.[1];
const domain = config.match(/domain:\s*'([^']+)'/)?.[1];
const url = config.match(/url:\s*'([^']+)'/)?.[1];
const indexable = /indexable:\s*true/.test(config);
const provider = config.match(/provider:\s*'([^']+)'/)?.[1];
const analyticsIdNull = /analyticsId:\s*null/.test(config);

if (!['planned','staging','production','archived'].includes(status)) fail(`invalid asset status: ${status}`);
if (!(assetId === 'WF-CORE' || /^WF-A\d{3,}$/.test(assetId ?? ''))) fail(`invalid asset id: ${assetId}`);
if (!url) fail('site URL missing.');
if (status === 'staging' && indexable) fail('staging assets must not be indexable.');
if (status !== 'production' && url !== 'https://example.invalid') fail('non-production starter URL must remain https://example.invalid.');
if (status === 'production') {
  if (placeholders.test(config)) fail('production config contains placeholders.');
  let parsed;
  try { parsed = new URL(url); } catch { fail('production site URL is invalid.'); }
  if (parsed && parsed.protocol !== 'https:') fail('production site URL must use HTTPS.');
  if (parsed && domain !== parsed.hostname) fail(`domain/url host mismatch: ${domain} vs ${parsed.hostname}`);
}
if (provider === 'none' && !analyticsIdNull) fail('analyticsId must be null when measurement provider is none.');

const astroConfig = await readFile('astro.config.mjs', 'utf8');
if (!astroConfig.includes('site: siteConfig.site.url')) fail('Astro site URL must derive from site.config.ts.');
if (!astroConfig.includes('trailingSlash: siteConfig.seo.trailingSlash')) fail('trailing-slash policy must derive from site.config.ts.');

if (failed) process.exit(1);
console.log(`QA PASS: config, identity, boundary, measurement, and indexability rules validated for ${status} mode.`);
