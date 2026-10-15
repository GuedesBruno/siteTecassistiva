// Testa src/lib/api.js REAL (fetchWithRetry/fetchAPI e fail-fast em CI) com fetch mockado e setTimeout instantâneo.
// Gera uma cópia do api.js em qa/.tmp-api com os imports sem extensão ajustados (Node ESM exige extensão); apagada ao final.
import fs from 'node:fs';
import { suite, assert } from './harness.mjs';

const root = new URL('..', import.meta.url);
const tmp = new URL('./.tmp-api/', import.meta.url);
fs.mkdirSync(tmp, { recursive: true });
let code = fs.readFileSync(new URL('src/lib/api.js', root), 'utf8');
code = code.replace("from './utils'", "from './utils-stub.mjs'").replace("from './ambientes-data'", "from './ambientes-stub.mjs'");
fs.writeFileSync(new URL('api-under-test.mjs', tmp), code);
fs.writeFileSync(new URL('utils-stub.mjs', tmp), 'export const sortItemsByOrder = (a) => a;');
fs.writeFileSync(new URL('ambientes-stub.mjs', tmp), 'export const ambientesData = [{ slug: "MOCK" }];');

const realFetch = globalThis.fetch, realTimeout = globalThis.setTimeout;
const realWarn = console.warn, realError = console.error, realLog = console.log;
let n = 0;
async function load(ci) {
  if (ci === undefined) delete process.env.CI; else process.env.CI = ci;
  process.env.NEXT_PUBLIC_STRAPI_URL = 'https://strapi.invalid/api/';
  process.env.STRAPI_API_TOKEN = 'token-ficticio';
  return import(new URL(`api-under-test.mjs?v=${++n}`, tmp).href);
}
function mock(seq) {
  const calls = []; const delays = [];
  globalThis.fetch = async (url, opts) => {
    calls.push({ url, opts });
    const step = seq[Math.min(calls.length - 1, seq.length - 1)];
    if (step instanceof Error) throw step;
    return { ok: step >= 200 && step < 300, status: step, statusText: `S${step}`, json: async () => ({ data: [{ id: 1, slug: 'x' }] }) };
  };
  globalThis.setTimeout = (fn, ms) => { delays.push(ms); fn(); return 0; };
  return { calls, delays };
}
const quiet = () => { console.warn = console.error = console.log = () => {}; };
const loud = () => { console.warn = realWarn; console.error = realError; console.log = realLog; };

const t = suite('api.js: retry e fail-fast');
const wrap = (fn) => async () => { quiet(); try { await fn(); } finally { loud(); globalThis.fetch = realFetch; globalThis.setTimeout = realTimeout; } };

t.test('200 direto: 1 chamada, sem espera, header Authorization, URL sem /api duplicado', wrap(async () => {
  const { fetchAPI } = await load(undefined); const m = mock([200]);
  const r = await fetchAPI('/api/produtos?x=1');
  assert.equal(m.calls.length, 1); assert.deepEqual(m.delays, []);
  assert.equal(m.calls[0].url, 'https://strapi.invalid/api/produtos?x=1');
  assert.equal(m.calls[0].opts.headers.Authorization, 'Bearer token-ficticio');
  assert.equal(r.data.length, 1);
}));
t.test('500,500,200: 3 tentativas, esperas 1000 e 2000ms, devolve dados', wrap(async () => {
  const { fetchAPI } = await load('true'); const m = mock([500, 502, 200]);
  const r = await fetchAPI('/api/x');
  assert.equal(m.calls.length, 3); assert.deepEqual(m.delays, [1000, 2000]); assert.equal(r.data.length, 1);
}));
t.test('erro de rede, rede, 200: recupera', wrap(async () => {
  const { fetchAPI } = await load('true'); const m = mock([new Error('ECONNRESET'), new Error('ETIMEDOUT'), 200]);
  assert.equal((await fetchAPI('/api/x')).data.length, 1); assert.equal(m.calls.length, 3);
}));
t.test('5xx persistente SEM CI: exatamente 3 tentativas e fallback {data:[]}', wrap(async () => {
  const { fetchAPI } = await load(undefined); const m = mock([503]);
  assert.deepEqual(await fetchAPI('/api/x'), { data: [] }); assert.equal(m.calls.length, 3); assert.deepEqual(m.delays, [1000, 2000]);
}));
t.test('5xx persistente COM CI: lança (fail-fast) após 3 tentativas', wrap(async () => {
  const { fetchAPI } = await load('true'); const m = mock([503]);
  await assert.rejects(() => fetchAPI('/api/x'), /Falha na API do Strapi \(503\)/); assert.equal(m.calls.length, 3);
}));
t.test('401/404 NÃO repete; SEM CI => {data:[]}; COM CI => lança', wrap(async () => {
  for (const code of [401, 404, 429]) {
    let l = await load(undefined); let m = mock([code]);
    assert.deepEqual(await l.fetchAPI('/api/x'), { data: [] }); assert.equal(m.calls.length, 1, `status ${code}`);
    l = await load('1'); m = mock([code]);
    await assert.rejects(() => l.fetchAPI('/api/x'), new RegExp(`\\(${code}\\)`)); assert.equal(m.calls.length, 1);
  }
}));
t.test('erro de rede persistente: SEM CI => {data:[]}, COM CI => lança o erro original', wrap(async () => {
  let l = await load(undefined); let m = mock([new Error('boom')]);
  assert.deepEqual(await l.fetchAPI('/api/x'), { data: [] }); assert.equal(m.calls.length, 3);
  l = await load('true'); m = mock([new Error('boom')]);
  await assert.rejects(() => l.fetchAPI('/api/x'), /boom/);
}));
t.test('CI vazio ("") conta como não-CI', wrap(async () => {
  const l = await load(''); mock([500]); assert.deepEqual(await l.fetchAPI('/api/x'), { data: [] });
}));
t.test('variáveis ausentes ou URL placeholder lançam mesmo fora de CI', wrap(async () => {
  const l = await load(undefined); mock([200]);
  delete process.env.STRAPI_API_TOKEN; await assert.rejects(() => l.fetchAPI('/api/x'), /não definidas/);
  process.env.STRAPI_API_TOKEN = 't'; process.env.NEXT_PUBLIC_STRAPI_URL = 'https://seu-strapi.exemplo.com';
  await assert.rejects(() => l.fetchAPI('/api/x'), /inválida/);
  process.env.NEXT_PUBLIC_STRAPI_URL = 'strapi.sem.protocolo';
  await assert.rejects(() => l.fetchAPI('/api/x'), /inválida/);
}));
t.test('CI="false" ou "0" ativam fail-fast (string não vazia) - documenta pegadinha', wrap(async () => {
  for (const v of ['false', '0']) { const l = await load(v); mock([500]); await assert.rejects(() => l.fetchAPI('/api/x')); }
}));

// --- Comportamento DESEJADO pelo objetivo "falhar o build em CI": hoje os wrappers engolem o erro. ---
t.defect('CI: getAllProductsForDisplay deveria propagar a falha da API (hoje devolve [])', wrap(async () => {
  const l = await load('true'); mock([500]);
  await assert.rejects(() => l.getAllProductsForDisplay());
}));
t.defect('CI: getAmbientes deveria falhar em vez de publicar o mock estático (hoje devolve mockAmbientes)', wrap(async () => {
  const l = await load('true'); mock([500]);
  await assert.rejects(() => l.getAmbientes());
}));
t.defect('CI: getCategoryBySlug deveria propagar a falha (hoje devolve {data:[]})', wrap(async () => {
  const l = await load('true'); mock([500]);
  await assert.rejects(() => l.getCategoryBySlug('x'));
}));
t.defect('CI: getAllImersaoSlugs / getSoftwareAndDrivers / getProductsWithDocuments deveriam propagar (hoje devolvem [])', wrap(async () => {
  const l = await load('true'); mock([500]);
  await assert.rejects(() => l.getAllImersaoSlugs());
  await assert.rejects(() => l.getSoftwareAndDrivers());
  await assert.rejects(() => l.getProductsWithDocuments());
}));
t.test('CI: funções sem try/catch propagam (getBanners, getFeaturedProducts, getProductBySlug)', wrap(async () => {
  const l = await load('true'); mock([500]);
  await assert.rejects(() => l.getBanners()); await assert.rejects(() => l.getFeaturedProducts()); await assert.rejects(() => l.getProductBySlug('x'));
}));

const failures = await t.run();
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(failures ? 1 : 0);
