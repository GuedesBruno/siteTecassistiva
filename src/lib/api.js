// Função centralizada para fazer chamadas à API do Strapi
async function fetchAPI(endpoint, options = {}) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error("ERRO GRAVE: As variáveis de ambiente NEXT_PUBLIC_STRAPI_URL e STRAPI_API_TOKEN devem estar definidas.");
    throw new Error("Variáveis de ambiente da API do Strapi não definidas.");
  }

  try {
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
      const errorText = await res.text();
      console.error(`Erro na requisição para ${url}: ${res.status} ${res.statusText}`, errorText);
      throw new Error(`Falha na requisição da API para ${endpoint}: ${res.status}`);
    }
    
    return await res.json(); 

  } catch (error) {
    console.error(`ERRO ao fazer fetch no endpoint "${endpoint}":`, error.message);
    throw error;
  }
}

// --- Funções Auxiliares Exportadas ---

export function getStrapiURL() {
  let base = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/+$/g, '');
  if (base.endsWith('/api')) base = base.replace(/\/api$/, '');
  return base;
}

export function getStrapiMediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path) || /^\/\//.test(path)) return path;
  const base = getStrapiURL();
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
}

export function normalizeDataArray(response) {
  if (!response) return [];
  return response.data || [];
}

// --- Funções de Busca de Dados ---

export async function getBanners() {
  const response = await fetchAPI('/api/banner-sites?sort=ordem:asc&populate=imagem');
  return normalizeDataArray(response);
}

export async function getFeaturedProducts() {
  const response = await fetchAPI('/api/produtos?filters[destaque][$eq]=true&fields[0]=nome&fields[1]=slug&fields[2]=descricao_curta&populate=imagem_principal');
  return normalizeDataArray(response);
}

export async function getManufacturers() {
  const response = await fetchAPI('/api/fabricantes?populate=logo&pagination[limit]=100&sort=ordem:asc');
  return normalizeDataArray(response);
}

export async function getHomeVideos() {
  const endpoint = '/api/video-homes?fields[0]=titulo&fields[1]=link&populate=thumbnail&sort=ordem:asc';
  const response = await fetchAPI(endpoint);
  return normalizeDataArray(response);
}

export async function getFeaturedTestimonial() {
  const response = await fetchAPI('/api/depoimentos?filters[destaque_home][$eq]=true&pagination[limit]=1');
  const data = normalizeDataArray(response);
  return data.length > 0 ? data[0] : null;
}

// ✅ FUNÇÃO QUE ESTAVA FALTANDO, AGORA ADICIONADA
export async function getAllTestimonials() {
  const response = await fetchAPI('/api/depoimentos');
  return normalizeDataArray(response);
}

export async function getAllProductsForDisplay() {
  const query = '/api/produtos?fields[0]=nome&fields[1]=slug&fields[2]=descricao_curta&populate[0]=imagem_principal&populate[1]=subcategoria&pagination[limit]=1000';
  const productsData = await fetchAPI(query);
  return normalizeDataArray(productsData);
}

export async function getProductBySlug(slug) {
  const query = `/api/produtos?filters[slug][$eq]=${slug}&populate[imagem_principal]=*&populate[galeria_de_imagens]=*&populate[categorias]=*&populate[subcategoria]=*&populate[documentos]=*`;
  const response = await fetchAPI(query);
  const data = normalizeDataArray(response);
  return data.length > 0 ? data[0] : null;
}

export async function getCategoryBySlug(slug) {
    const response = await fetchAPI(`/api/categorias?filters[slug][$eq]=${slug}&populate=subcategorias`);
    const data = normalizeDataArray(response);
    return data.length > 0 ? data[0] : null;
}

export async function getProductsByCategorySlug(slug) {
    const response = await fetchAPI(`/api/produtos?filters[categorias][slug][$eq]=${slug}&populate=*`);
    return normalizeDataArray(response);
}

export async function getSubcategoryBySlug(subslug) {
    const response = await fetchAPI(`/api/subcategorias?filters[slug][$eq]=${subslug}&populate=categoria`);
    const data = normalizeDataArray(response);
    return data.length > 0 ? data[0] : null;
}

export async function getProductsBySubcategorySlug(subslug) {
    const response = await fetchAPI(`/api/produtos?filters[subcategoria][slug][$eq]=${subslug}&populate=*`);
    return normalizeDataArray(response);
}

export async function getSubcategoriesForCategory(categorySlug) {
  const category = await getCategoryBySlug(categorySlug);
  if (!category || !category.attributes.subcategorias) {
    return [];
  }
  return category.attributes.subcategorias.data || [];
}

export async function getAllCategories() {
  const populateQuery = 'populate=subcategorias';
  const response = await fetchAPI(`/api/categorias?fields[0]=nome&fields[1]=slug&${populateQuery}&pagination[limit]=100`);
  return normalizeDataArray(response);
}

// --- Funções para `generateStaticParams` (Build Estático) ---

export async function getAllProductSlugs() {
    const response = await fetchAPI('/api/produtos?fields[0]=slug&pagination[limit]=1000');
    return normalizeDataArray(response);
}

export async function getAllCategoryPaths() {
    const response = await fetchAPI('/api/categorias?fields[0]=slug&populate[subcategorias][fields][0]=slug&pagination[limit]=200');
    return normalizeDataArray(response);
}