/**
 * Busca todos os produtos da API do Strapi.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de produtos.
 */
export async function getProducts() {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
  const endpoint = `${STRAPI_URL}/api/produtos?populate=*`;

  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error("Variáveis de ambiente do Strapi não estão definidas.");
    return [];
  }

  try {
    const res = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });
    if (!res.ok) throw new Error(`Erro na requisição: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("ERRO ao buscar a lista de produtos do Strapi:", error);
    return [];
  }
}

/**
 * Busca um único produto pelo seu slug.
 * @param {string} slug O slug do produto a ser buscado.
 * @returns {Promise<Object|null>} Uma promessa que resolve para o objeto do produto ou nulo se não for encontrado.
 */
export async function getProductBySlug(slug) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
  const endpoint = `${STRAPI_URL}/api/produtos?filters[slug][$eq]=${slug}&populate=*`;
  
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error("Variáveis de ambiente do Strapi não estão definidas.");
    return null;
  }

  try {
    const res = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });
    if (!res.ok) throw new Error(`Erro na requisição do produto: ${res.status} ${res.statusText}`);
    const data = await res.json();
    if (data.data && data.data.length > 0) {
      return data.data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(`ERRO ao buscar o produto com slug "${slug}":`, error);
    return null;
  }
}