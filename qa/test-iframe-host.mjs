// Testa a função REAL getAllowedIframeSrc extraindo-a do código-fonte de RichTextRenderer.js (sem JSX/React).
import fs from 'node:fs';
import { suite, assert } from './harness.mjs';

const src = fs.readFileSync(new URL('../src/components/RichTextRenderer.js', import.meta.url), 'utf8');
const start = src.indexOf('const ALLOWED_IFRAME_HOSTS');
const end = src.indexOf('// Renderizador de Rich Text');
assert.ok(start > 0 && end > start, 'não achou o bloco no fonte');
const block = src.slice(start, end);
const { getAllowedIframeSrc, getIframeTitle } = new Function(`${block}; return { getAllowedIframeSrc, getIframeTitle };`)();

const t = suite('RichTextRenderer: validação de iframe');
const f = (s) => getAllowedIframeSrc(`<iframe src="${s}"></iframe>`);
t.test('vimeo https permitido', () => assert.equal(f('https://player.vimeo.com/video/123?h=abc'), 'https://player.vimeo.com/video/123?h=abc'));
t.test('&amp; é decodificado', () => assert.equal(f('https://player.vimeo.com/video/1?h=a&amp;title=0'), 'https://player.vimeo.com/video/1?h=a&title=0'));
t.test('youtube /embed/ permitido (www e nocookie)', () => {
  assert.ok(f('https://www.youtube.com/embed/abc')); assert.ok(f('https://www.youtube-nocookie.com/embed/abc'));
});
t.test('aspas simples e atributos antes do src', () =>
  assert.ok(getAllowedIframeSrc("<iframe width='1' height=2 src='https://www.youtube.com/embed/x' allowfullscreen>")));
t.test('rejeita http, outro host, subdomínio enganoso, youtube fora de /embed/', () => {
  for (const u of ['http://player.vimeo.com/video/1', 'https://evil.com/x', 'https://player.vimeo.com.evil.com/video/1',
    'https://evilplayer.vimeo.com/x', 'https://www.youtube.com/watch?v=1', 'https://www.youtube.com/embedded/1', 'https://youtube.com/embed/1',
    'javascript:alert(1)', 'data:text/html,x', '//player.vimeo.com/video/1', 'https://www.youtube.com/embed/../redirect?q=https://evil.com'])
    assert.equal(f(u), null, u);
});
t.test('userinfo não engana: host real é o avaliado', () => {
  assert.equal(f('https://player.vimeo.com@evil.com/video/1'), null);
});
t.test('sem src, src vazio, string vazia', () => {
  assert.equal(getAllowedIframeSrc('<iframe></iframe>'), null); assert.equal(f(''), null); assert.equal(getAllowedIframeSrc(''), null);
});
t.test('src falso dentro do title nunca resulta em host não permitido', () => {
  const r = getAllowedIframeSrc(`<iframe title=" src='https://player.vimeo.com/video/1'" src="https://evil.com/x"></iframe>`);
  assert.ok(r === null || r.startsWith('https://player.vimeo.com/'));
});
t.test('título: padrão, extraído, com acento', () => {
  assert.equal(getIframeTitle('<iframe src="x">'), 'Vídeo incorporado');
  assert.equal(getIframeTitle('<iframe title="Demonstração ç" src="x">'), 'Demonstração ç');
  assert.equal(getIframeTitle('<iframe title="" src="x">'), 'Vídeo incorporado');
});
t.test('renderer só trata texto que começa com "<iframe" minúsculo (outros viram texto em <code>)', () => {
  assert.ok(src.includes("startsWith('<iframe')"));
});
process.exit((await t.run()) ? 1 : 0);
