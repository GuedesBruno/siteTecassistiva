// src/lib/imersao-data.mjs REAL: em CI qualquer falha de dados de imersão lança; fora de CI mantém o fallback.
import fs from 'node:fs';
import { suite, assert } from './harness.mjs';
import { fetchImersaoAPI, getImersaoBySlugInternal, getAllImersaoSlugsInternal } from '../src/lib/imersao-data.mjs';

const realFetch = globalThis.fetch, realWarn = console.warn, realError = console.error;
const saved = { CI: process.env.CI, URL: process.env.NEXT_PUBLIC_STRAPI_URL, TOKEN: process.env.STRAPI_API_TOKEN };
function env({ ci, config = true }) {
  if (ci === undefined) delete process.env.CI; else process.env.CI = ci;
  if (config) { process.env.NEXT_PUBLIC_STRAPI_URL = 'https://strapi.invalid'; process.env.STRAPI_API_TOKEN = 'token-ficticio'; }
  else { delete process.env.NEXT_PUBLIC_STRAPI_URL; delete process.env.STRAPI_API_TOKEN; }
}
const wrap = (fn) => async () => {
  console.warn = console.error = () => {};
  try { await fn(); } finally {
    globalThis.fetch = realFetch; console.warn = realWarn; console.error = realError;
    for (const [k, v] of [['CI', saved.CI], ['NEXT_PUBLIC_STRAPI_URL', saved.URL], ['STRAPI_API_TOKEN', saved.TOKEN]]) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  }
};
const respond = (status, body = { data: [] }) => { globalThis.fetch = async () => ({ ok: status >= 200 && status < 300, status, statusText: `S${status}`, json: async () => body }); };
const rede = () => { globalThis.fetch = async () => { throw new Error('ECONNRESET'); }; };

const t = suite('imersao-data: fail-fast em CI');
for (const [nome, prep] of [['HTTP 500', () => respond(500)], ['erro de rede', rede]]) {
  t.test(`CI: ${nome} lança (slug e lista)`, wrap(async () => {
    env({ ci: 'true' }); prep();
    await assert.rejects(() => getImersaoBySlugInternal('x'));
    await assert.rejects(() => getAllImersaoSlugsInternal());
  }));
  t.test(`fora de CI: ${nome} mantém fallback (null e [])`, wrap(async () => {
    env({ ci: undefined }); prep();
    assert.equal(await getImersaoBySlugInternal('x'), null);
    assert.deepEqual(await getAllImersaoSlugsInternal(), []);
  }));
}
t.test('CI: variáveis de ambiente ausentes lançam; fora de CI devolve null', wrap(async () => {
  env({ ci: '1', config: false }); await assert.rejects(() => fetchImersaoAPI('/api/imersaos'));
  env({ ci: undefined, config: false }); assert.equal(await fetchImersaoAPI('/api/imersaos'), null);
}));
t.test('CI com resposta OK: devolve dados e lista vazia legítima não lança', wrap(async () => {
  env({ ci: 'true' }); respond(200, { data: [{ id: 1, slug: 'a' }] });
  assert.deepEqual(await getAllImersaoSlugsInternal(), [{ slug: 'a' }]);
  respond(200, { data: [] });
  assert.equal(await getImersaoBySlugInternal('nao-existe'), null);
}));
t.test('páginas de imersão e outras páginas com catch relançam em CI', () => {
  const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
  for (const p of ['src/app/imersao/[slug]/page.js', 'src/app/atas-abertas/page.js', 'src/app/suporte/page.js', 'src/app/produtos/[slug]/page.js', 'src/app/produtos/fabricante/[slug]/page.js']) {
    assert.match(read(p), /if \(isCI\(\)\) throw/, p);
  }
  assert.match(read('src/app/produtos/imersao/[slug]/page.js'), /imersao\/\[slug\]\/page/);
});
process.exit((await t.run()) ? 1 : 0);
