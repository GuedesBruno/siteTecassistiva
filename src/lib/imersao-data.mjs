// Busca de dados das páginas de imersão (/imersao/[slug] e /produtos/imersao/[slug]).
// Fora de CI, qualquer falha devolve null/[] (a página cai em notFound). Em CI (deploy) a falha
// interrompe o build, como no restante do site (ver isCI em strapi-client.mjs).
import { isCI, normalizeDataArray, requestStrapi } from './strapi-client.mjs';

export async function fetchImersaoAPI(endpoint) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_URL || !STRAPI_TOKEN) {
    if (isCI()) throw new Error('[Imersão] NEXT_PUBLIC_STRAPI_URL e STRAPI_API_TOKEN devem estar definidas.');
    console.warn('[Imersão] Variáveis de ambiente não definidas. Retornando dados vazios.');
    return null;
  }

  try {
    const res = await requestStrapi(endpoint, { baseUrl: STRAPI_URL, token: STRAPI_TOKEN });

    if (!res.ok) {
      console.error(`[Imersão] API Error: ${res.status}`);
      if (isCI()) throw new Error(`Falha na API do Strapi (${res.status}) em ${endpoint}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`[Imersão] Erro ao fazer fetch: ${error.message}`);
    if (isCI()) throw error;
    return null;
  }
}

export async function getImersaoBySlugInternal(slug) {
  const populateQuery = 'populate[personalizado]=*&populate[produto][fields][0]=nome&populate[produto][fields][1]=descricao_curta&populate[produto][populate][0]=imagem_principal&populate[produto][populate][1]=categorias&populate[produto][populate][2]=relacao_fabricante&fields[0]=genero_descricao&fields[1]=curso&fields[2]=guia&fields[3]=manual&fields[4]=botoes_padrao&fields[5]=link_playstore&fields[6]=link_appstore';
  const res = await fetchImersaoAPI(`/api/imersaos?filters[slug][$eq]=${slug}&${populateQuery}`);
  const data = normalizeDataArray(res);
  if (data.length === 0) return null;

  const item = data[0];
  if (item.attributes) {
    return item;
  }
  const { id, ...attributes } = item;
  return { id, attributes };
}

export async function getAllImersaoSlugsInternal() {
  const res = await fetchImersaoAPI('/api/imersaos?fields[0]=slug&pagination[limit]=1000');
  const items = normalizeDataArray(res);
  return items.map(i => ({
    slug: i.attributes?.slug || i.slug,
  })).filter(i => i.slug);
}
