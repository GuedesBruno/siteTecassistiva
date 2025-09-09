// --- FUNÇÃO HELPER DE FETCH ---

async function fetchAPI(endpoint) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error("ERRO GRAVE: Variáveis de ambiente do Strapi não estão definidas.");
    return { error: 'Variáveis de ambiente não configuradas', data: null };
  }

  try {
    const res = await fetch(`${STRAPI_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-cache'
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('Resposta da API não foi OK! Status:', res.status, 'Endpoint:', endpoint);
      console.error('Corpo do Erro:', errorBody);
      throw new Error(`Erro na requisição: ${res.status} ${res.statusText}`);
    }
    
    return await res.json();

  } catch (error) {
    console.error(`ERRO FINAL ao fazer fetch na API para o endpoint "${endpoint}":`, error.message);
    return { error: error.message, data: null };
  }
}

// --- FUNÇÕES DE PRODUTOS E CATEGORIAS ---

export async function getProducts() {
  const json = await fetchAPI('/api/produtos?populate=*');
  return Array.isArray(json) ? json : json.data || [];
}

export async function getProductBySlug(slug) {
  const json = await fetchAPI(`/api/produtos?filters[slug][$eq]=${slug}&populate=*`);
  const productData = Array.isArray(json) ? json : json.data;
  return productData && productData.length > 0 ? productData[0] : null;
}

export async function getFeaturedProducts() {
  const json = await fetchAPI('/api/produtos?filters[destaque][$eq]=true&populate=*');
  return Array.isArray(json) ? json : json.data || [];
}

export async function getAllCategories() {
  const json = await fetchAPI('/api/categorias');
  return Array.isArray(json) ? json : json.data || [];
}

export async function getCategoryBySlug(slug) {
  const json = await fetchAPI(`/api/categorias?filters[slug][$eq]=${slug}&populate[produtos][populate][0]=imagem_principal`);
  const categoryData = Array.isArray(json) ? json : json.data;
  return categoryData && categoryData.length > 0 ? categoryData[0] : null;
}

// --- NOVA FUNÇÃO PARA OS BANNERS ---

/**
 * Busca todos os banners da Home, ordenados pelo campo 'ordem'.
 */
export async function getBanners() {
  // O endpoint deve corresponder ao API ID (Plural) que o Strapi criou.
  const json = await fetchAPI('/api/banner-sites?sort=ordem:asc&populate=*');
  return Array.isArray(json) ? json : json.data || [];
}