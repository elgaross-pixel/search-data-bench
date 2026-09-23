import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const run = (cmd, args, cwd) => {
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

const temp = await mkdtemp(join(tmpdir(), 'athena-wf-'));
const child = join(temp, 'acceptance-site');
try {
  run(process.execPath, ['scripts/new-site.mjs','--out',child,'--asset-id','WF-A999','--repo','acceptance/acceptance-site'], process.cwd());
  run('npm', ['ci'], child);
  run('npm', ['run','build'], child);
  run('npm', ['run','qa'], child);
  run('npm', ['run','qa:production'], child);
  run('npm', ['run','journal:check'], child);

  const pkg = JSON.parse(await readFile(join(child,'package.json'),'utf8'));
  if (pkg.name !== 'acceptance-site') throw new Error('child package identity was not rewritten.');
  const journal = await readFile(join(child,'journal/asset.yaml'),'utf8');
  if (!journal.includes('asset_id: WF-A999')) throw new Error('child asset ID was not rewritten.');
  if (!journal.includes('full_name: acceptance/acceptance-site')) throw new Error('child repository metadata was not rewritten.');
  if (journal.includes('full_name: elgaross-pixel/athena-web-factory')) throw new Error('factory repository identity leaked into child journal.');

  // Exercise production QA with a controlled production fixture, then restore nothing because child is disposable.
  let cfg = await readFile(join(child,'site.config.ts'),'utf8');
  cfg = cfg
    .replace("status: 'planned'", "status: 'production'")
    .replace("name: 'TBD'", "name: 'Acceptance Site'")
    .replace("domain: 'TBD'", "domain: 'acceptance.example'")
    .replace("url: 'https://example.invalid'", "url: 'https://acceptance.example'")
    .replace("tagline: 'TBD'", "tagline: 'Acceptance tagline'")
    .replace("description: 'TBD'", "description: 'Acceptance description'")
    .replace("publisherName: 'TBD'", "publisherName: 'Acceptance Publisher'")
    .replace('indexable: false', 'indexable: true');
  await writeFile(join(child,'site.config.ts'), cfg);
  run('npm', ['run','build'], child);
  run('npm', ['run','qa'], child);
  run('npm', ['run','qa:production'], child);

  console.log('Acceptance PASS: child generation, metadata rewrite, npm ci, build, QA, journal, and production-mode QA validated.');
} finally {
  await rm(temp, { recursive: true, force: true });
}
