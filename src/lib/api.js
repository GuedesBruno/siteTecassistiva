// Função centralizada para fazer chamadas à API do Strapi
async function fetchAPI(endpoint, options = {}) {
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
function getStrapiURL() {
  // Normaliza a URL base removendo barras finais e '/api' caso presente
  let base = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/+$/g, '');
  if (base.endsWith('/api')) base = base.replace(/\/api$/, '');
  return base;
}

// Gera a URL completa para um caminho de mídia retornado pelo Strapi
function getStrapiMediaUrl(path) {
  if (!path) return null;
  // Se já for uma URL absoluta, retorna tal qual
  if (/^https?:\/\//i.test(path) || /^\/\//.test(path)) return path;
  const base = getStrapiURL();
  // garante que exista uma barra entre base e path
  if (path.startsWith('/')) return `${base}${path}`;
  return `${base}/${path}`;
}

// Busca todos os produtos (apenas slugs para generateStaticParams)
async function getAllProducts() {
  const response = await fetchAPI('/api/produtos?fields[0]=slug&pagination[limit]=1000');
  return normalizeDataArray(response);
}

// Busca todos os produtos com dados para exibição
async function getAllProductsForDisplay() {
  try {
    // Busca todos os produtos com os campos necessários para os cards
    const fieldsQuery = 'fields[0]=nome&fields[1]=slug';
    const populateQuery = 'populate[0]=imagem_principal&populate[1]=subcategoria';

    const productsData = await fetchAPI(`/api/produtos?${fieldsQuery}&${populateQuery}&pagination[limit]=1000`);
    return normalizeDataArray(productsData);
  } catch (error) {
    console.error(`Falha ao buscar todos os produtos:`, error);
    return [];
  }
}

// Busca um produto pelo slug com todos os dados necessários
async function getProductBySlug(slug) {
  // Popula todas as relações e mídias necessárias para a página de detalhes.
  const populateFields = [
    'imagem_principal',
    'galeria_de_imagens',
    'categoria',
    'subcategoria',
    'documentos' // O campo 'documentos' é uma relação (mídia/upload), então deve ser populado.
  ];
  const fieldsToFetch = [
    'nome',
    'slug',
    'descricao_curta',
    'descricao_longa',
    'videos',
    'caracteristicas_funcionais',
    'caracteristicas_tecnicas',
    'acessorios',
    'visao_geral'
  ];

  // Constrói a query para ser mais explícita, pedindo tanto os campos de texto quanto as relações.
  const fieldsQuery = fieldsToFetch.map((field, i) => `fields[${i}]=${field}`).join('&');
  const populateQuery = populateFields.map((field, i) => `populate[${i}]=${field}`).join('&');

  const response = await fetchAPI(`/api/produtos?filters[slug][$eq]=${slug}&${fieldsQuery}&${populateQuery}`);
  const data = response.data || [];
  if (data.length === 0) return null;

  const item = data[0];
  if (item.attributes) return item;

  const { id, ...rest } = item;
  return { id, attributes: rest };
}

// Busca produtos em destaque
async function getFeaturedProducts() {
  // Busca produtos em destaque incluindo imagem principal
  const response = await fetchAPI('/api/produtos?filters[destaque][$eq]=true&fields[0]=nome&fields[1]=slug&populate=imagem_principal');
  return normalizeDataArray(response);
}

// Busca todas as categorias com seus produtos e imagens
async function getAllCategories() {
  // Busca categorias com subcategorias para montar o menu
  const response = await fetchAPI('/api/categorias?fields[0]=nome&fields[1]=slug&populate=subcategorias&pagination[limit]=100');
  return normalizeDataArray(response);
}

// Busca uma categoria pelo slug com os seus produtos
async function getCategoryBySlug(slug) {
  // Busca conservadora por categoria (retorna no formato { data: [...] } para compatibilidade)
  // Popula produtos diretos e produtos dentro das subcategorias para renderização
  // Tenta popular produtos diretos e produtos dentro das subcategorias usando a forma bracketed do Strapi
  try {
    const populateQuery = `populate[produtos][populate]=*&populate[subcategorias][populate][produtos][populate]=*`;
    const response = await fetchAPI(`/api/categorias?filters[slug][$eq]=${slug}&${populateQuery}`);
  const data = response.data || [];
  if (data.length === 0) return { data: [] };

  // Normaliza cada item para garantir { id, attributes }
  const normalized = data.map((item) => {
    if (item.attributes) return item;
    const { id, ...rest } = item;
    return { id, attributes: rest };
  });

  return { data: normalized };
  } catch (err) {
    // Se a requisição com populate falhar (ex: ValidationError do Strapi), fazemos fallback sem populate
    console.warn('getCategoryBySlug: populate request failed, falling back to no-populate:', err.message);
    try {
      const response = await fetchAPI(`/api/categorias?filters[slug][$eq]=${slug}`);
      const data = response.data || [];
      if (data.length === 0) return { data: [] };
      const normalized = data.map((item) => {
        if (item.attributes) return item;
        const { id, ...rest } = item;
        return { id, attributes: rest };
      });

      return { data: normalized };
    } catch (err2) {
      console.error('getCategoryBySlug fallback failed:', err2.message);
      return { data: [] };
    }
  }
}

// Busca todos os banners do site
async function getBanners() {
  const response = await fetchAPI('/api/banner-sites?sort=ordem:asc&populate=imagem');
  return normalizeDataArray(response);
}

// Normaliza respostas do Strapi: se os itens já vierem com `attributes`, deixa como está.
// Se os itens vierem 'flat' (campos no root), converte para o formato { id, attributes: { ...fields } }
function normalizeDataArray(response) {
  if (!response) return [];
  const data = response.data || [];
  // Retorna os dados diretamente, pois os componentes já esperam
  // a estrutura { id, attributes: {...} } do Strapi.
  return data;
}

module.exports = {
  fetchAPI,
  getStrapiURL,
  getStrapiMediaUrl,
  getAllProducts,
  getAllProductsForDisplay,
  getProductBySlug,
  getFeaturedProducts,
  getAllCategories,
  getCategoryBySlug,
  getBanners,
  normalizeDataArray,
};