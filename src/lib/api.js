import qs from 'qs';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function fetchAPI(endpoint) {
  const url = new URL(endpoint, STRAPI_URL);
  
  const options = {
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
    },
    cache: 'no-store', // Garante que os dados estão sempre atualizados
  };

  try {
    const response = await fetch(url.href, options);
    if (!response.ok) {
      console.error(`ERRO HTTP: ${response.status} para ${url.href}`);
      const errorBody = await response.text();
      console.error("Corpo do erro:", errorBody);
      return null;
    }
    const data = await response.json();
    // A API do Strapi v4/v5 retorna os dados dentro de uma chave "data"
    return data.data; 
  } catch (error) {
    console.error(`ERRO FINAL ao fazer fetch para "${endpoint}":`, error);
    return null;
  }
}

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

// ATUALIZADO: Busca todas as categorias e popula suas subcategorias
export async function getAllCategories() {
  const query = qs.stringify({
    populate: ['subcategorias'],
  });
  return fetchAPI(`/api/categorias?${query}`);
}

// ATUALIZADO: Busca uma categoria e todos os seus dados aninhados
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
  }, { encodeValuesOnly: true }); // Garante a codificação correta da URL
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