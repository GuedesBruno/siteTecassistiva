import qs from 'qs';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function fetchAPI(endpoint, options = {}) {
  const url = new URL(endpoint, STRAPI_URL);
  
  // Mescla as opções padrão com as opções fornecidas pelo utilizador
  const mergedOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
    },
    // ==================================================================
    // AQUI ESTÁ A CORREÇÃO CRÍTICA: Desativa o cache de dados
    // ==================================================================
    cache: 'no-store',
  };

  try {
    const response = await fetch(url.href, mergedOptions);
    if (!response.ok) {
      console.error(`ERRO HTTP: ${response.status} para ${url.href}`);
      const errorBody = await response.text();
      console.error("Corpo do erro:", errorBody);
      return null;
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`ERRO FINAL ao fazer fetch para "${endpoint}":`, error);
    return null;
  }
}

// Usando populate=* para buscar todas as relações de primeiro nível, incluindo imagens.
const populateAll = qs.stringify({ populate: '*' });

export async function getProducts() {
  return fetchAPI(`/api/produtos?${populateAll}`);
}

export async function getFeaturedProducts() {
  const query = qs.stringify({
    filters: { destaque: { $eq: true } },
    populate: '*',
  });
  return fetchAPI(`/api/produtos?${query}`);
}

export async function getProductBySlug(slug) {
  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: '*',
  });
  const products = await fetchAPI(`/api/produtos?${query}`);
  return products && products.length > 0 ? products[0] : null;
}

export async function getAllCategories() {
  return fetchAPI(`/api/categorias?${populateAll}`);
}

export async function getCategoryBySlug(slug) {
  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: {
        produtos: {
            populate: ['imagem_principal'],
        },
    },
  });
  const categories = await fetchAPI(`/api/categorias?${query}`);
  return categories && categories.length > 0 ? categories[0] : null;
}

export async function getBanners() {
  const query = qs.stringify({
    sort: 'ordem:asc',
    populate: '*',
  });
  return fetchAPI(`/api/banner-sites?${query}`);
}