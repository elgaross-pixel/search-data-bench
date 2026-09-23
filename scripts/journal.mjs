import { readFile } from 'node:fs/promises';
import process from 'node:process';

if (!process.argv.includes('--check')) {
  console.error('Usage: node scripts/journal.mjs --check');
  process.exit(2);
}
let failed = false;
const fail = (message) => { console.error(`FAIL: ${message}`); failed = true; };

const asset = await readFile('journal/asset.yaml', 'utf8');
const lines = (await readFile('journal/events.jsonl', 'utf8')).split('\n').filter(Boolean);
const registry = JSON.parse(await readFile('journal/event-types.json', 'utf8'));
const assetId = asset.match(/^asset_id:\s*(\S+)/m)?.[1];

if (!assetId || !(assetId === 'WF-CORE' || /^WF-A\d{3,}$/.test(assetId))) fail('journal asset_id is missing or invalid.');
for (const section of ['domain:','repository:','deployment:','measurement:','commercial:','experiment:']) if (!asset.includes(section)) fail(`journal/asset.yaml missing section ${section}`);

const events = [];
for (const [i,line] of lines.entries()) {
  try { events.push({ ...JSON.parse(line), line: i + 1 }); }
  catch { fail(`invalid JSONL at line ${i + 1}`); }
}
const corrected = new Set(events.filter(e => e.event_type === 'JOURNAL_CORRECTION').map(e => e.evidence?.corrects_event_id).filter(Boolean));
const allowed = new Set(registry.event_types), ids = new Set();
let previousTime = null;
for (const event of events) {
  for (const field of registry.required_fields) if (!(field in event)) fail(`line ${event.line}: missing ${field}`);
  if (event.asset_id !== assetId && !corrected.has(event.event_id)) fail(`line ${event.line}: asset_id mismatch without correction`);
  if (!allowed.has(event.event_type)) fail(`line ${event.line}: unknown event_type ${event.event_type}`);
  if (ids.has(event.event_id)) fail(`line ${event.line}: duplicate event_id ${event.event_id}`);
  ids.add(event.event_id);
  const time=Date.parse(event.timestamp);
  if(Number.isNaN(time)) fail(`line ${event.line}: invalid timestamp`);
  if(previousTime!==null && time<previousTime) fail(`line ${event.line}: events are not chronological`);
  previousTime=time;
  if(event.event_type==='JOURNAL_CORRECTION'){
    const target=event.evidence?.corrects_event_id;
    if(!target) fail(`line ${event.line}: correction lacks corrects_event_id`);
    else if(!events.some(e=>e.event_id===target && e.line<event.line)) fail(`line ${event.line}: correction target must be an earlier event`);
  }
}
if(failed) process.exit(1);
console.log('Journal PASS: identity, registry, chronology, uniqueness, and append-only correction contract validated.');
