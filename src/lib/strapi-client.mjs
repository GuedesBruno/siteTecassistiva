// Cliente HTTP único do Strapi, compartilhado pelo site (src/lib/api.js, páginas) e pelos
// scripts de build (scripts/*.js, .mjs). Por isso é .mjs puro: sem aliases "@/" e sem dependências.
// Cada chamador escolhe suas regras de tentativas e de falha (ver requestStrapi).

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Em CI (deploy) qualquer falha da API deve interromper o build; fora de CI mantemos o fallback com dados vazios.
// CI="false", "0" e "" contam como falso.
export function isCI() {
  return !['', 'false', '0'].includes(String(process.env.CI ?? '').trim().toLowerCase());
}

// Remove barras finais e um "/api" final, para aceitar tanto "https://x" quanto "https://x/api/".
export function trimStrapiBase(url) {
  let base = String(url).replace(/\/+$/g, '');
  if (base.endsWith('/api')) base = base.replace(/\/api$/, '');
  return base;
}

export function buildStrapiUrl(baseUrl, endpoint) {
  return `${trimStrapiBase(baseUrl)}/${endpoint.replace(/^\/+/, '')}`;
}

export function normalizeDataArray(response) {
  if (!response) return [];
  const data = response.data || [];
  return data;
}

// Faz a requisição com tentativas. Devolve a última Response (ok ou não) e só lança se a rede falhar
// em todas as tentativas. Quem chama decide o que fazer com uma resposta não-ok.
//   baseUrl, token      configuração do Strapi (o chamador valida e escolhe a mensagem de erro)
//   maxAttempts         total de tentativas (padrão 1 = sem repetição)
//   shouldRetryStatus   (status) => boolean; respostas não-ok que merecem nova tentativa
//   retryDelay          (tentativa) => ms de espera depois da tentativa que falhou
//   timeoutMs           cancela cada tentativa após esse tempo (padrão: sem limite)
//   fetchOptions        mesclado sobre o header Authorization (como `{ headers, ...options }`)
//   onRetry             (tentativa, motivo) => void, para log
export async function requestStrapi(endpoint, {
  baseUrl,
  token,
  maxAttempts = 1,
  shouldRetryStatus = () => false,
  retryDelay = () => 0,
  timeoutMs,
  fetchOptions = {},
  onRetry = () => {},
} = {}) {
  const url = buildStrapiUrl(baseUrl, endpoint);
  for (let attempt = 1; ; attempt++) {
    const controller = timeoutMs ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        ...(controller ? { signal: controller.signal } : {}),
        ...fetchOptions,
      });
      if (res.ok || attempt === maxAttempts || !shouldRetryStatus(res.status)) return res;
      onRetry(attempt, `${res.status}`);
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      onRetry(attempt, error.name === 'AbortError' ? 'timeout' : error.message);
    } finally {
      if (timer) clearTimeout(timer);
    }
    await sleep(retryDelay(attempt));
  }
}
