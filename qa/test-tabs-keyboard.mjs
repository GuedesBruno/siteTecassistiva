import { suite, assert } from './harness.mjs';
import { handleTablistKeyDown } from '../src/lib/tabsKeyboard.js';

const t = suite('tabsKeyboard');
const ids = ['a', 'b', 'c'];
function run(key, current, { idsArg = ids, domHas = true } = {}) {
  const calls = { prevented: 0, selected: null, focused: null };
  globalThis.document = { getElementById: (id) => (domHas ? { focus: () => { calls.focused = id; } } : null) };
  handleTablistKeyDown({ key, preventDefault: () => calls.prevented++ }, idsArg, current, (n) => { calls.selected = n; }, (i) => `tab-${i}`);
  return calls;
}
t.test('ArrowRight avança e dá a volta', () => { assert.equal(run('ArrowRight', 'a').selected, 'b'); assert.equal(run('ArrowRight', 'c').selected, 'a'); });
t.test('ArrowLeft volta e dá a volta', () => { assert.equal(run('ArrowLeft', 'b').selected, 'a'); assert.equal(run('ArrowLeft', 'a').selected, 'c'); });
t.test('Home/End', () => { assert.equal(run('Home', 'c').selected, 'a'); assert.equal(run('End', 'a').selected, 'c'); });
t.test('foca o elemento correto e chama preventDefault', () => { const r = run('ArrowRight', 'a'); assert.equal(r.focused, 'tab-b'); assert.equal(r.prevented, 1); });
t.test('outras teclas (Tab, Enter, espaço, ArrowDown/Up) são ignoradas', () => {
  for (const k of ['Tab', 'Enter', ' ', 'ArrowDown', 'ArrowUp']) { const r = run(k, 'a'); assert.equal(r.selected, null); assert.equal(r.prevented, 0); }
});
t.test('id atual desconhecido não faz nada', () => assert.equal(run('ArrowRight', 'zzz').selected, null));
t.test('lista de 1 aba: setas mantêm a mesma', () => assert.equal(run('ArrowRight', 'a', { idsArg: ['a'] }).selected, 'a'));
t.test('lista vazia não lança', () => assert.equal(run('ArrowRight', 'a', { idsArg: [] }).selected, null));
t.test('elemento ausente no DOM não lança', () => assert.equal(run('End', 'a', { domHas: false }).selected, 'c'));
t.test('ids numéricos funcionam, incluindo 0', () => {
  const r = run('ArrowLeft', 1, { idsArg: [0, 1, 2] }); assert.equal(r.selected, 0); assert.equal(r.focused, 'tab-0');
});
process.exit((await t.run()) ? 1 : 0);
