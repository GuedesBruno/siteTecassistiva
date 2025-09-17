// Função centralizada para fazer chamadas à API do Strapi
export async function fetchAPI(endpoint, options = {}) {
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
    // Normaliza a URL base removendo barras finais
    // Se a URL terminar com '/api', removemos essa parte para evitar chamadas como '/api/api/...'
    let base = STRAPI_URL.replace(/\/+$/g, '');
    if (base.endsWith('/api')) {
      base = base.replace(/\/api$/,'');
    }
    const path = endpoint.replace(/^\/+/, '');
    const url = `${base}/${path}`;

    const fetchOptions = {
      headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
      ...options,
    };

    const res = await fetch(url, fetchOptions);

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
export async function getAllProducts() {
  const response = await fetchAPI('/api/produtos?fields[0]=slug');
  return normalizeDataArray(response);
}

// Busca um produto pelo slug com todos os dados necessários
export async function getProductBySlug(slug) {
  // Busca conservadora: sem populates para evitar ValidationError em Strapi remoto
  const response = await fetchAPI(`/api/produtos?filters[slug][$eq]=${slug}`);
  const data = response.data || [];
  if (data.length === 0) return null;
  const item = data[0];
  if (item.attributes) return item;
  const { id, ...rest } = item;
  return { id, attributes: rest };
}

// Busca produtos em destaque
export async function getFeaturedProducts() {
  // Busca mínima para destaques (evita populates arriscados)
  const response = await fetchAPI('/api/produtos?filters[destaque][$eq]=true&fields[0]=nome&fields[1]=slug');
  return normalizeDataArray(response);
}

// Busca todas as categorias com seus produtos e imagens
export async function getAllCategories() {
  // Busca leve: apenas campos necessários para o menu (nome e slug)
  const response = await fetchAPI('/api/categorias?fields[0]=nome&fields[1]=slug');
  return normalizeDataArray(response);
}

// Busca uma categoria pelo slug com os seus produtos
export async function getCategoryBySlug(slug) {
  // Busca conservadora por categoria (sem populates complexos)
  const response = await fetchAPI(`/api/categorias?filters[slug][$eq]=${slug}`);
  const data = response.data || [];
  if (data.length === 0) return null;
  const item = data[0];
  if (item.attributes) return item;
  const { id, ...rest } = item;
  return { id, attributes: rest };
}

// Busca todos os banners do site
export async function getBanners() {
  const response = await fetchAPI('/api/banner-sites?sort=ordem:asc&populate=imagem');
  return response.data || [];
}

// Normaliza respostas do Strapi: se os itens já vierem com `attributes`, deixa como está.
// Se os itens vierem 'flat' (campos no root), converte para o formato { id, attributes: { ...fields } }
function normalizeDataArray(response) {
  if (!response) return [];
  const data = response.data || [];
  // se items já têm attributes, retorna como está
  if (data.length > 0 && data[0].attributes) return data;

  // converte cada item plano para o formato esperado pelo app
  return data.map((item) => {
    const { id, ...rest } = item;
    return { id, attributes: rest };
  });
}