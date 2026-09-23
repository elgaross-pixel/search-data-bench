import { access, readFile } from 'node:fs/promises';

const required = [
  'site.config.ts','astro.config.mjs','package-lock.json',
  'src/core/SEO.astro','src/core/BaseLayout.astro','src/core/EventTracker.astro','src/core/events.ts',
  'src/pages/index.astro','src/pages/robots.txt.ts',
  'journal/asset.yaml','journal/events.jsonl','journal/event-types.json',
  'scripts/qa.mjs','scripts/production-qa.mjs','scripts/new-site.mjs','scripts/acceptance.mjs',
  '.github/workflows/ci.yml',
];

for (const path of required) await access(path);

const config = await readFile('site.config.ts', 'utf8');
if (!config.includes("id: 'WF-CORE'")) throw new Error('Factory starter must use WF-CORE, not a web-asset ID.');
if (!config.includes("status: 'planned'")) throw new Error('Factory starter must remain planned.');
if (!config.includes('indexable: false')) throw new Error('Factory starter must remain non-indexable.');
if (!config.includes("url: 'https://example.invalid'")) throw new Error('Factory starter must retain placeholder URL.');

console.log('Scaffold PASS: v0.2.1 factory identity and required files validated.');
