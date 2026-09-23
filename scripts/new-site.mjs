import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, isAbsolute, relative, resolve } from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const value = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const outArg = value('--out');
const assetId = value('--asset-id');
const repository = value('--repo');

if (!outArg || !assetId || !repository) {
  console.error('Usage: npm run new-site -- --out ../site-repo --asset-id WF-A002 --repo owner/site-repo');
  process.exit(2);
}
if (!/^WF-A\d{3,}$/.test(assetId)) {
  console.error('asset-id must match WF-A###.');
  process.exit(2);
}
if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
  console.error('repo must use owner/name format.');
  process.exit(2);
}

const root = resolve('.');
const out = resolve(outArg);
const rel = relative(root, out);
if (!rel || (!rel.startsWith('..') && !isAbsolute(rel))) {
  console.error('Refusing to scaffold inside the factory repository.');
  process.exit(1);
}

await mkdir(out, { recursive: false }).catch((error) => {
  if (error.code === 'EEXIST') throw new Error('Output directory already exists; refusing to overwrite it.');
  throw error;
});

const copy = [
  'package.json','package-lock.json','astro.config.mjs','tsconfig.json','site.config.ts',
  'public','src','scripts','journal','.github','.gitignore'
];
for (const item of copy) await cp(resolve(item), resolve(out, item), { recursive: true });

const createdAt = new Date().toISOString();
const packageName = basename(out).toLowerCase().replace(/[^a-z0-9._-]+/g, '-');

const packagePath = resolve(out, 'package.json');
const pkg = JSON.parse(await readFile(packagePath, 'utf8'));
pkg.name = packageName;
pkg.version = '0.1.0';
await writeFile(packagePath, JSON.stringify(pkg, null, 2) + '\n');

const lockPath = resolve(out, 'package-lock.json');
const lock = JSON.parse(await readFile(lockPath, 'utf8'));
lock.name = packageName;
lock.version = '0.1.0';
if (lock.packages?.['']) {
  lock.packages[''].name = packageName;
  lock.packages[''].version = '0.1.0';
}
await writeFile(lockPath, JSON.stringify(lock, null, 2) + '\n');

const cfgPath = resolve(out, 'site.config.ts');
let cfg = await readFile(cfgPath, 'utf8');
cfg = cfg.replace(/id:\s*'(?:WF-CORE|WF-A\d+)'/, `id: '${assetId}'`);
await writeFile(cfgPath, cfg);

const assetPath = resolve(out, 'journal/asset.yaml');
let asset = await readFile(assetPath, 'utf8');
asset = asset
  .replace(/^asset_id:\s*\S+/m, `asset_id: ${assetId}`)
  .replace(/^name:\s*.*$/m, 'name: UNKNOWN')
  .replace(/^domain:\s*.*$/m, 'domain: UNKNOWN')
  .replace(/^vertical:\s*.*$/m, 'vertical: UNKNOWN')
  .replace(/^created_at:\s*.*$/m, `created_at: ${createdAt}`)
  .replace(/^  full_name:\s*.*$/m, `  full_name: ${repository}`)
  .replace(/^  created_at:\s*.*$/m, `  created_at: ${createdAt}`)
  .replace(/^  first_commit_at:\s*.*$/m, '  first_commit_at: null');
await writeFile(assetPath, asset);

const eventsPath = resolve(out, 'journal/events.jsonl');
const event = {
  event_id: 'evt-000001',
  timestamp: createdAt,
  asset_id: assetId,
  event_type: 'ASSET_CREATED',
  actor: 'web-factory',
  evidence: { scaffold_source: 'athena-web-factory', repository },
  notes: 'Generated in planned/non-indexable state. No domain or vertical assigned.'
};
await writeFile(eventsPath, JSON.stringify(event) + '\n');

console.log(`Scaffold created: ${out}`);
console.log(`Asset: ${assetId}; repository: ${repository}`);
console.log('Safety state: planned, non-indexable, placeholder domain.');
