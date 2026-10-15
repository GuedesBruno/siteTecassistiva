// Lógica das sentinelas do VideoModal (src/lib/videoModalFocus.js) e presença delas no componente.
import fs from 'node:fs';
import { suite, assert } from './harness.mjs';
import { sentinelFocusTarget } from '../src/lib/videoModalFocus.js';

const t = suite('VideoModal: sentinelas de foco');
const close = {}, outro = {};

t.test('vindo do Fechar (Tab ou Shift+Tab com trap) entra no player', () => assert.equal(sentinelFocusTarget(close, close), 'player'));
t.test('vindo do player (relatedTarget nulo) volta ao Fechar, em qualquer sentido', () => assert.equal(sentinelFocusTarget(null, close), 'close'));
t.test('vindo de outro elemento volta ao Fechar', () => assert.equal(sentinelFocusTarget(outro, close), 'close'));
t.test('sem botão Fechar montado não entra no player por engano', () => assert.equal(sentinelFocusTarget(null, null), 'close'));

// Simulação da ordem de Tab: Fechar, S1, iframe, S2 (trap do useModalFocus: Shift+Tab no 1o vai ao último, Tab no último vai ao 1o)
const order = ['close', 's1', 'iframe', 's2'];
function press(from, shift) {
  let i = order.indexOf(from);
  if (from === 'iframe') { // o foco sai do iframe: relatedTarget nulo
    const next = order[shift ? i - 1 : i + 1];
    return settle(next, null);
  }
  const next = shift ? order[(i + order.length - 1) % order.length] : order[(i + 1) % order.length];
  return settle(next, from === 'close' ? close : outro);
}
function settle(el, related) {
  if (el !== 's1' && el !== 's2') return el;
  return sentinelFocusTarget(related, close) === 'player' ? 'iframe' : 'close';
}
t.test('Tab no Fechar chega ao player', () => assert.equal(press('close', false), 'iframe'));
t.test('Shift+Tab no Fechar chega ao player', () => assert.equal(press('close', true), 'iframe'));
t.test('saindo do player com Tab ou Shift+Tab volta ao Fechar (sem armadilha nem vazamento)', () => {
  assert.equal(press('iframe', false), 'close'); assert.equal(press('iframe', true), 'close');
});

t.test('VideoModal usa duas sentinelas, uma antes e outra depois do iframe', () => {
  const src = fs.readFileSync(new URL('../src/components/VideoModal.js', import.meta.url), 'utf8');
  const a = src.indexOf('onFocus={handleSentinelFocus}'), b = src.indexOf('<iframe'), c = src.lastIndexOf('onFocus={handleSentinelFocus}');
  assert.ok(a > 0 && a < b && c > b, 'sentinelas fora de posição');
});
process.exit((await t.run()) ? 1 : 0);
