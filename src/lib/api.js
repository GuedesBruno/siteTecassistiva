// Função centralizada para fazer chamadas à API do Strapi
export async function fetchAPI(endpoint) {
  // As variáveis de ambiente são lidas aqui
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  // Verificação crucial que acusa o erro no build do GitHub Actions
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error("ERRO GRAVE: As variáveis de ambiente NEXT_PUBLIC_STRAPI_URL e STRAPI_API_TOKEN devem estar definidas.");
    return { data: null }; // Retorna um objeto padrão para evitar que a aplicação quebre
  }

  try {
    const res = await fetch(`${STRAPI_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store' // Garante que os dados sejam sempre os mais recentes
    });

    if (!res.ok) {
      console.error(`Erro na requisição para ${endpoint}: ${res.status} ${res.statusText}`);
      return { data: null };
    }
    
    return await res.json(); 

  } catch (error) {
    console.error(`ERRO ao fazer fetch no endpoint "${endpoint}":`, error.message);
    return { data: null };
  }
}

// --- Funções Exportadas ---

// Retorna a URL base do Strapi para ser usada em componentes de cliente
export function getStrapiURL() {
    return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
}

// Busca todos os produtos
export async function getProducts() {
  const response = await fetchAPI('/api/produtos?populate=*');
  return response.data || [];
}

// Busca um produto pelo slug
export async function getProductBySlug(slug) {
  const response = await fetchAPI(`/api/produtos?filters[slug][$eq]=${slug}&populate=deep`);
  return response.data && response.data.length > 0 ? response.data[0] : null;
}

// Busca produtos em destaque
export async function getFeaturedProducts() {
  const response = await fetchAPI('/api/produtos?filters[destaque][$eq]=true&populate=*');
  return response.data || [];
}

// Busca todas as categorias
export async function getAllCategories() {
  const response = await fetchAPI('/api/categorias?populate=deep');
  return response.data || [];
}

// Busca uma categoria pelo slug com os seus produtos
export async function getCategoryBySlug(slug) {
  const response = await fetchAPI(`/api/categorias?filters[slug][$eq]=${slug}&populate[produtos][populate][0]=imagem_principal`);
  return response.data && response.data.length > 0 ? response.data[0] : null;
}

// Busca todos os banners do site
export async function getBanners() {
  const response = await fetchAPI('/api/banner-sites?sort=ordem:asc&populate=imagem');
  return response.data || [];
}