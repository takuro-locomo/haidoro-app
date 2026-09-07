import assert from 'node:assert/strict';
import test, { after } from 'node:test';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const vite = await createServer({ configFile: false, root, appType: 'custom', server: { middlewareMode: true } });
after(() => vite.close());
const { REGIONS, getRegion, getTarget, treatmentFrame, LINE_URL } = await vite.ssrLoadModule('/lib/hydro/data.ts');

test('every symptom resolves a distinct, locally available anatomy plate and valid layer', async () => {
  assert.deepEqual(REGIONS.map(r => r.id), ['neck','scapula','lumbar','thigh','calf']);
  for (const region of REGIONS) {
    await access(`${root}/public${region.asset}`);
    assert.equal(getTarget(region, 'stale-selection').id, region.targets[0].id);
    for (const target of region.targets) assert.ok(target.layers.length >= 4);
    const [x,y,w,h] = region.crop.split(' ').map(Number);
    assert.ok(x >= 0 && y >= 0 && w > 0 && h > 0);
    assert.ok(x+w <= region.imageSize[0] && y+h <= region.imageSize[1]);
  }
  assert.equal(getRegion('unknown').id, 'neck');
  assert.equal(getTarget(getRegion('lumbar'),'multifidus-longissimus').kind, 'lumbar');
  assert.equal(getTarget(getRegion('lumbar'),'lamina').kind, 'bone');
  assert.equal(LINE_URL, 'https://lin.ee/zNl8pfQ');
});

test('the illustration stays bounded and removes the needle at the end', () => {
  for (const value of [-100, NaN, Infinity, 0, 20, 58, 85, 86, 99, 100, 200]) {
    const f = treatmentFrame(value);
    for (const v of [f.spread,f.needle,f.glide]) assert.ok(v >= 0 && v <= 1 && Number.isFinite(v));
  }
  const before = treatmentFrame(0), during = treatmentFrame(58), after = treatmentFrame(100);
  assert.equal(before.needle, 0); assert.equal(before.spread, 0); assert.equal(before.glide, 0);
  assert.equal(during.needle, 1); assert.ok(during.spread > 0);
  assert.equal(after.needle, 0); assert.equal(after.spread, 1); assert.equal(after.phase, 'after');
});
