import { suite, assert } from './harness.mjs';
import { safeUrl } from '../src/lib/safeUrl.js';

const t = suite('safeUrl');
const ok = (u, expected = u) => assert.equal(safeUrl(u), expected, JSON.stringify(u));
const bad = (u) => assert.equal(safeUrl(u), null, JSON.stringify(u));

t.test('aceita http/https/mailto/tel', () => {
  ok('https://example.com/a?b=1#c'); ok('http://example.com'); ok('mailto:a@b.com'); ok('tel:+5511999999999');
});
t.test('aceita caminhos internos e âncoras', () => { ok('/produtos/x/'); ok('/'); ok('#topo'); ok('/suporte?tab=softwares'); });
t.test('faz trim', () => ok('  https://example.com  ', 'https://example.com'));
t.test('rejeita javascript/data/vbscript/file/blob em todas as variações', () => {
  for (const u of ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', ' javascript:alert(1)', 'java\nscript:alert(1)', 'java\tscript:alert(1)',
    '\u0001javascript:alert(1)', 'data:text/html,<script>1</script>', 'vbscript:x', 'file:///etc/passwd', 'blob:https://x/1', 'ftp://x/y']) bad(u);
});
t.test('rejeita protocolo relativo e barra invertida (open redirect)', () => {
  for (const u of ['//evil.com', '///evil.com', '/\\evil.com', '/\t/evil.com', '/\n/evil.com', '\\\\evil.com', '/ /evil.com', '/ x']) bad(u);
});
t.test('rejeita não-string, vazio e nulo', () => {
  for (const u of [null, undefined, 42, {}, [], '', '   ']) bad(u);
});
t.test('rejeita relativo sem barra e domínio sem protocolo (comportamento a documentar)', () => {
  bad('produtos/x'); bad('www.site.com'); bad('?a=1');
});
t.test('URL malformada não lança', () => { bad('http://['); bad('https://'); });
t.test('aceita acentos e unicode em caminho/URL', () => { ok('/produtos/ação'); ok('https://exemplo.com/ç?x=á'); });
process.exit((await t.run()) ? 1 : 0);
