// --- FUNÇÃO HELPER DE FETCH ---
async function fetchAPI(endpoint) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error("ERRO GRAVE: Variáveis de ambiente do Strapi não estão definidas.");
    return { data: null, error: 'Variáveis de ambiente não configuradas' };
  }

  try {
    const res = await fetch(`${STRAPI_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
      // O cache do Next.js 14+ é muito agressivo, 'no-store' garante dados frescos.
      cache: 'no-store' 
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('Resposta da API não foi OK! Status:', res.status, 'Endpoint:', endpoint);
      console.error('Corpo do Erro:', errorBody);
      return { data: null, error: `Erro na requisição: ${res.status}` };
    }
    
    // Retorna sempre o JSON completo
    return await res.json(); 

  } catch (error) {
    console.error(`ERRO FINAL ao fazer fetch na API para o endpoint "${endpoint}":`, error.message);
    return { data: null, error: error.message };
  }
}

// --- FUNÇÕES EXPORTADAS ---

// Busca todos os produtos
export async function getProducts() {
  const response = await fetchAPI('/api/produtos?populate=*');
  return response.data || [];
}

// Busca um produto pelo slug
export async function getProductBySlug(slug) {
  const response = await fetchAPI(`/api/produtos?filters[slug][$eq]=${slug}&populate=*`);
  return response.data && response.data.length > 0 ? response.data[0] : null;
}

// Busca produtos em destaque
export async function getFeaturedProducts() {
  const response = await fetchAPI('/api/produtos?filters[destaque][$eq]=true&populate=*');
  return response.data || [];
}

// Busca todas as categorias
export async function getAllCategories() {
  const response = await fetchAPI('/api/categorias');
  return response.data || [];
}

// Busca uma categoria pelo slug com os seus produtos
export async function getCategoryBySlug(slug) {
  const response = await fetchAPI(`/api/categorias?filters[slug][$eq]=${slug}&populate[produtos][populate][0]=imagem_principal`);
  return response.data && response.data.length > 0 ? response.data[0] : null;
}

// Busca todos os banners do site
export async function getBanners() {
  // CORRIGIDO: A query de populate foi ajustada para o formato correto.
  const response = await fetchAPI('/api/banner-sites?sort=ordem:asc&populate[imagem]=*');
  return response.data || [];
}