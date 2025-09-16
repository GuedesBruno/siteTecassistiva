// Função centralizada para fazer chamadas à API do Strapi
export async function fetchAPI(endpoint) {
  // As variáveis de ambiente são lidas aqui
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  // Verificação crucial
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error("ERRO GRAVE: As variáveis de ambiente NEXT_PUBLIC_STRAPI_URL e STRAPI_API_TOKEN devem estar definidas.");
    // Em um cenário de build estático, é melhor lançar um erro para parar o build.
    throw new Error("Variáveis de ambiente da API do Strapi não definidas.");
  }

  try {
    const res = await fetch(`${STRAPI_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error(`Erro na requisição para ${endpoint}: ${res.status} ${res.statusText}`);
      const errorText = await res.text();
      console.error("Detalhes do erro:", errorText);
      // Lançar um erro para falhar o build em caso de erro na API
      throw new Error(`Falha na requisição da API para ${endpoint}: ${res.status}`);
    }
    
    return await res.json(); 

  } catch (error) {
    console.error(`ERRO ao fazer fetch no endpoint "${endpoint}":`, error.message);
    // Propagar o erro para que o processo de build falhe
    throw error;
  }
}

// --- Funções Exportadas ---

// Retorna a URL base do Strapi para ser usada em componentes de cliente
export function getStrapiURL() {
    return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
}

// Busca todos os produtos (apenas slugs para generateStaticParams)
export async function getProducts() {
  const response = await fetchAPI('/api/produtos?fields[0]=slug');
  return response.data || [];
}

// Busca um produto pelo slug com todos os dados necessários
export async function getProductBySlug(slug) {
  const populateQuery = 'populate[imagem_principal]=*&populate[galeria_de_imagens]=*&populate[categorias][populate][subcategorias]=*';
  const response = await fetchAPI(`/api/produtos?filters[slug][$eq]=${slug}&${populateQuery}`);
  return response.data && response.data.length > 0 ? response.data[0] : null;
}

// Busca produtos em destaque
export async function getFeaturedProducts() {
  const response = await fetchAPI('/api/produtos?filters[destaque][$eq]=true&populate=imagem_principal');
  return response.data || [];
}

// Busca todas as categorias com seus produtos e imagens
export async function getAllCategories() {
  const populateQuery = 'populate[subcategorias][populate][produtos][populate]=imagem_principal';
  const response = await fetchAPI(`/api/categorias?${populateQuery}`);
  return response.data || [];
}

// Busca uma categoria pelo slug com os seus produtos
export async function getCategoryBySlug(slug) {
  const populateQuery = 'populate[subcategorias][populate][produtos][populate]=imagem_principal';
  const response = await fetchAPI(`/api/categorias?filters[slug][$eq]=${slug}&${populateQuery}`);
  return response.data && response.data.length > 0 ? response.data[0] : null;
}

// Busca todos os banners do site
export async function getBanners() {
  const response = await fetchAPI('/api/banner-sites?sort=ordem:asc&populate=imagem');
  return response.data || [];
}