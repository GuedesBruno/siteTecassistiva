import qs from 'qs';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://light-dog-088c5ec318.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function fetchAPI(endpoint, options = {}) {
  // Construção da URL garantindo que não haja barras duplas
  const url = `${STRAPI_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  
  const mergedOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
    },
    next: {
      revalidate: 10, // Revalida o cache a cada 10 segundos
    }
  };

  try {
    const response = await fetch(url, mergedOptions);
    if (!response.ok) {
      console.error(`ERRO HTTP: ${response.status} para ${url}`);
      const errorBody = await response.text();
      console.error("Corpo do erro:", errorBody);
      return null;
    }
    const data = await response.json();
    return data.data; // Retorna apenas o campo 'data' da resposta do Strapi
  } catch (error) {
    console.error(`ERRO FINAL ao fazer fetch para "${endpoint}":`, error);
    return null;
  }
}

// ==================================================================
// AQUI ESTÃO TODAS AS FUNÇÕES RESTAURADAS E EXPORTADAS CORRETAMENTE
// ==================================================================

export async function getProducts() {
  const query = qs.stringify({ populate: '*' });
  return fetchAPI(`/api/produtos?${query}`);
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
  const query = qs.stringify({
    populate: ['subcategorias'],
  });
  return fetchAPI(`/api/categorias?${query}`);
}

export async function getCategoryBySlug(slug) {
  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: {
        subcategorias: {
            populate: {
                produtos: {
                    populate: ['imagem_principal'],
                },
            },
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

// A nova função que adicionámos, também exportada
export async function getAllCategoriesWithProducts() {
  const query = qs.stringify({
    populate: {
        subcategorias: {
            populate: {
                produtos: {
                    populate: ['imagem_principal'],
                },
            },
        },
    },
  });
  return fetchAPI(`/api/categorias?${query}`);
}