/**
 * Busca todos os produtos da API do Strapi.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de produtos.
 */
export async function getProducts() {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  // CORREÇÃO: Alterado de 'products' para 'produtos'
  const endpoint = `${STRAPI_URL}/api/produtos?populate=*`;

  try {
    const res = await fetch(endpoint);
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
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  // CORREÇÃO: Alterado de 'products' para 'produtos'
  const endpoint = `${STRAPI_URL}/api/produtos?filters[slug][$eq]=${slug}&populate=*`;

  try {
    const res = await fetch(endpoint);
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