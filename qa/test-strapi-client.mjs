// Testa src/lib/strapi-client.mjs (requestStrapi) com fetch e setTimeout mockados.
import { suite, assert } from './harness.mjs';
import { requestStrapi, buildStrapiUrl, trimStrapiBase, isCI, normalizeDataArray } from '../src/lib/strapi-client.mjs';

const realFetch = globalThis.fetch, realTimeout = globalThis.setTimeout;
function mock(seq) {
  const calls = []; const delays = [];
  globalThis.fetch = async (url, opts) => {
    calls.push({ url, opts });
    const step = seq[Math.min(calls.length - 1, seq.length - 1)];
    if (step instanceof Error) throw step;
    return { ok: step >= 200 && step < 300, status: step };
  };
  globalThis.setTimeout = (fn, ms) => { delays.push(ms); if (ms < 600000) fn(); return 0; };
  return { calls, delays };
}
const wrap = (fn) => async () => { try { await fn(); } finally { globalThis.fetch = realFetch; globalThis.setTimeout = realTimeout; } };
const base = { baseUrl: 'https://strapi.invalid/api/', token: 't' };

const t = suite('strapi-client');
t.test('URL: remove barra final e /api duplicado; endpoint com ou sem barra inicial', () => {
  assert.equal(buildStrapiUrl('https://x.invalid/api/', '/api/produtos?a=1'), 'https://x.invalid/api/produtos?a=1');
  assert.equal(trimStrapiBase('https://x.invalid///'), 'https://x.invalid');
});
t.test('isCI: vazio/false/0 são falsos; true/1 são verdadeiros', () => {
  const old = process.env.CI;
  try {
    for (const [v, esperado] of [['', false], ['false', false], ['0', false], ['true', true], ['1', true]]) { process.env.CI = v; assert.equal(isCI(), esperado, v); }
    delete process.env.CI; assert.equal(isCI(), false);
  } finally { if (old === undefined) delete process.env.CI; else process.env.CI = old; }
});
t.test('normalizeDataArray', () => { assert.deepEqual(normalizeDataArray(null), []); assert.deepEqual(normalizeDataArray({ data: [1] }), [1]); });
t.test('padrão: 1 tentativa, devolve a resposta não-ok sem repetir', wrap(async () => {
  const m = mock([503]); const r = await requestStrapi('/api/x', base);
  assert.equal(r.status, 503); assert.equal(m.calls.length, 1); assert.equal(m.calls[0].opts.headers.Authorization, 'Bearer t');
}));
t.test('configuração do search-data: 5 tentativas, qualquer não-ok repetido (inclui 4xx), esperas 2s/4s/8s/16s, timeout de 600s', wrap(async () => {
  const m = mock([404]);
  const r = await requestStrapi('/api/x', { ...base, maxAttempts: 5, shouldRetryStatus: () => true, timeoutMs: 600000,
    retryDelay: (a) => Math.min(2000 * 2 ** (a - 1), 30000) });
  assert.equal(r.status, 404); assert.equal(m.calls.length, 5);
  assert.deepEqual(m.delays.filter((d) => d < 600000), [2000, 4000, 8000, 16000]);
  assert.ok(m.calls[0].opts.signal);
}));
t.test('erro de rede: lança o erro original após as tentativas', wrap(async () => {
  const m = mock([new Error('boom')]);
  await assert.rejects(() => requestStrapi('/api/x', { ...base, maxAttempts: 2 }), /boom/); assert.equal(m.calls.length, 2);
}));
t.test('fetchOptions substitui os headers padrão (mesmo comportamento de { headers, ...options })', wrap(async () => {
  const m = mock([200]); await requestStrapi('/api/x', { ...base, fetchOptions: { cache: 'no-store' } });
  assert.equal(m.calls[0].opts.cache, 'no-store'); assert.equal(m.calls[0].opts.headers.Authorization, 'Bearer t');
}));

process.exit(await t.run() ? 1 : 0);
