import qs from 'qs';
import { sortItemsByOrder } from './utils';

async function fetchAPI(endpoint, options = {}) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error("ERRO GRAVE: As variáveis de ambiente NEXT_PUBLIC_STRAPI_URL e STRAPI_API_TOKEN devem estar definidas.");
    throw new Error("Variáveis de ambiente da API do Strapi não definidas.");
  }

  // Validação adicional para evitar placeholders óbvios (ex: 'seu-strapi') ou URLs sem protocolo
  if (!/^https?:\/\//i.test(STRAPI_URL) || /seu-?strapi|your[_-]?strapi/i.test(STRAPI_URL)) {
    console.error(`NEXT_PUBLIC_STRAPI_URL inválida detectada: ${STRAPI_URL}`);
    throw new Error('NEXT_PUBLIC_STRAPI_URL inválida. Defina uma URL válida (ex: https://meu-strapi.exemplo) nas variáveis de ambiente ou secrets do CI.');
  }

  try {
    let base = STRAPI_URL.replace(/\/+$/g, '');
    if (base.endsWith('/api')) {
      base = base.replace(/\/api$/, '');
    }
    const path = endpoint.replace(/^\/+/, '');
    const url = `${base}/${path}`;

    console.log(`🔌 Fetching API: ${url}`); // Log para debug

    const fetchOptions = {
      headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
      ...options,
    };

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      console.error(`Erro na requisição para ${endpoint}: ${res.status} ${res.statusText}`);
      const errorText = await res.text();
      console.error("Detalhes do erro:", errorText);
      throw new Error(`Falha na requisição da API para ${endpoint}: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error(`ERRO ao fazer fetch no endpoint "${endpoint}":`, error.message);
    throw error;
  }
}

export function getStrapiURL() {
  let base = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/+$/g, '');
  if (base.endsWith('/api')) base = base.replace(/\/api$/, '');
  return base;
}

export function getStrapiMediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path) || /^\/\//.test(path)) return path;
  const base = getStrapiURL();
  if (path.startsWith('/')) return `${base}${path}`;
  return `${base}/${path}`;
}

export function normalizeDataArray(response) {
  if (!response) return [];
  const data = response.data || [];
  return data;
}

export async function getAllProductsForDisplay() {
  try {
    // Populating subcategorias, categorias e imagem_principal para display completo
    const populateQuery = 'populate[0]=imagem_principal&populate[1]=subcategorias&populate[2]=categorias';
    const productsData = await fetchAPI(`/api/produtos?${populateQuery}&pagination[limit]=1000&sort=ordem:asc`);
    return sortItemsByOrder(normalizeDataArray(productsData));
  } catch (error) {
    console.error(`Falha ao buscar todos os produtos:`, error);
    return [];
  }
}

export async function getAllProducts() {
  // Usando a mesma lógica de getAllProductsForDisplay para garantir consistência
  return getAllProductsForDisplay();
}

export async function getFeaturedProducts() {
  const response = await fetchAPI('/api/produtos?filters[destaque][$eq]=true&fields[0]=nome&fields[1]=slug&fields[2]=descricao_curta&populate=imagem_principal');
  return normalizeDataArray(response);
}

export async function getProductBySlug(slug) {
  const query = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    fields: [
      'nome',
      'slug',
      'descricao_curta',
      'descricao_longa',
      'caracteristicas_funcionais',
      'caracteristicas_tecnicas',
      'visao_geral',
      'videos',
      'Fabricante',
    ],
    populate: {
      imagem_principal: { fields: ['url', 'alternativeText', 'width', 'height'] },
      galeria_de_imagens: { fields: ['url', 'alternativeText', 'width', 'height'] },
      subcategorias: { fields: ['nome', 'slug', 'ordem'] },
      categorias: { fields: ['nome', 'slug', 'ordem'] },
      relacao_fabricante: { populate: '*' },
      documentos: { fields: ['url', 'name', 'ext', 'size'] },
      especificacoes_por_categoria: {
        populate: '*',
      },
    },
  }, {
    encodeValuesOnly: true,
  });

  const response = await fetchAPI(`/api/produtos?${query}`);
  const data = response.data || [];
  if (data.length === 0) return null;

  const item = data[0];
  // The API response might already be normalized, but this ensures it is.
  if (item.attributes) return item;

  const { id, ...rest } = item;
  return { id, attributes: rest };
}

export async function getAllCategories() {
  const response = await fetchAPI('/api/categorias?sort=nome:asc&fields[0]=nome&fields[1]=slug&fields[2]=ordem&populate[subcategorias][fields][0]=nome&populate[subcategorias][fields][1]=slug&populate[subcategorias][fields][2]=ordem&pagination[limit]=100');
  const data = normalizeDataArray(response);
  // Manually normalize if attributes is missing
  const normalized = data.map(item => {
    if (item.attributes) {
      return item;
    }
    const { id, ...attributes } = item;
    return { id, attributes };
  });

  // Sort categories
  const sortedCategories = sortItemsByOrder(normalized);

  // Sort subcategories within each category
  sortedCategories.forEach(cat => {
    const catAttrs = cat.attributes || cat;
    if (catAttrs.subcategorias) {
      if (Array.isArray(catAttrs.subcategorias)) {
        catAttrs.subcategorias = sortItemsByOrder(catAttrs.subcategorias);
      } else if (catAttrs.subcategorias.data) {
        catAttrs.subcategorias.data = sortItemsByOrder(catAttrs.subcategorias.data);
      }
    }
  });

  return sortedCategories;
}

export async function getCategoryBySlug(slug) {
  try {
    const populateQuery = `populate[produtos][populate]=*&populate[subcategorias][populate][produtos][populate]=*`;
    const response = await fetchAPI(`/api/categorias?filters[slug][$eq]=${slug}&${populateQuery}`);
    const data = response.data || [];
    if (data.length === 0) return { data: [] };

    const normalized = data.map((item) => {
      if (item.attributes) return item;
      const { id, ...rest } = item;
      return { id, attributes: rest };
    });

    return { data: normalized };
  } catch (err) {
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

export async function getBanners() {
  const response = await fetchAPI('/api/banner-sites?sort=ordem:asc&populate=imagem');
  return normalizeDataArray(response);
}

// Funções que eu adicionei e que podem ser necessárias
export async function getManufacturers() {
  const response = await fetchAPI('/api/fabricantes?fields[0]=nome&fields[1]=slug&populate=logo&pagination[limit]=100&sort=ordem:asc');
  return normalizeDataArray(response);
}

export async function getHomeVideos() {
  const endpoint = '/api/video-homes?fields[0]=titulo&fields[1]=link&populate=thumbnail&sort=ordem:asc';
  const response = await fetchAPI(endpoint);
  return normalizeDataArray(response);
}

export async function getAllTestimonials() {
  const response = await fetchAPI('/api/depoimentos');
  return normalizeDataArray(response);
}

// Adicionando funções que podem estar faltando para o build
export async function getAllCategoryPaths() {
  const response = await fetchAPI(
    '/api/categorias?fields[0]=slug&populate[subcategorias][fields][0]=slug&pagination[limit]=200',
    { cache: 'no-store' } // Força a busca de dados novos, evitando cache
  );
  return normalizeDataArray(response);
}

export async function getProductsByCategorySlug(slug) {
  const filters = `filters[$or][0][categorias][slug][$eq]=${slug}&filters[$or][1][subcategorias][categorias][slug][$eq]=${slug}`;
  const response = await fetchAPI(`/api/produtos?${filters}&populate=*&sort=ordem:asc`);
  return sortItemsByOrder(normalizeDataArray(response));
}

export async function getProductsBySubcategorySlug(subslug) {
  const response = await fetchAPI(`/api/produtos?filters[subcategorias][slug][$eq]=${subslug}&populate=*&sort=ordem:asc`);
  return sortItemsByOrder(normalizeDataArray(response));
}

export async function getOpenAtas() {
  // Using explicit populate syntax to ensure deep nesting works for components and relations.
  // item_ata is a component (repeating). relacao_produto is a relation in that component. imagem_principal is a media field in the product.
  const query = qs.stringify({
    sort: 'ordem:asc',
    populate: {
      item_ata: {
        populate: {
          relacao_produto: {
            populate: {
              imagem_principal: {
                fields: ['url', 'alternativeText', 'width', 'height']
              }
            }
          }
        }
      },
      documentos: {
        fields: ['url', 'name', 'ext', 'size']
      }
    }
  }, {
    encodeValuesOnly: true,
  });

  const response = await fetchAPI(`/api/atas?${query}`);
  const data = normalizeDataArray(response);
  // Manually normalize if attributes is missing
  return data.map(item => {
    if (item.attributes) {
      return item;
    }
    const { id, ...attributes } = item;
    return { id, attributes };
  });
}


export async function getProductsWithDocuments() {
  try {
    // Popula documentos, categorias e subcategorias para filtro no componente
    const query = 'populate[0]=documentos&populate[1]=categorias&populate[2]=subcategorias&pagination[limit]=1000&sort=ordem:asc';

    const productsData = await fetchAPI(`/api/produtos?${query}`);
    const rawData = normalizeDataArray(productsData);

    // Normaliza os dados para garantir a estrutura { id, attributes }
    const normalized = rawData.map(item => {
      if (item.attributes) {
        return item;
      }
      const { id, ...attributes } = item;
      return { id, attributes };
    });
    return sortItemsByOrder(normalized);
  } catch (error) {
    console.error(`Falha ao buscar produtos com documentos:`, error);
    return [];
  }
}

export async function getSoftwareAndDrivers() {
  try {
    const params = new URLSearchParams({
      'fields[0]': 'nome',
      'fields[1]': 'tipo',
      'fields[2]': 'ordem',
      'populate[instaladores]': '*',
      'pagination[limit]': 1000,
    }).toString();

    // Adiciona a população do produto separadamente para maior robustez.
    const query = `${params}&populate=produto`;

    const softwareData = await fetchAPI(`/api/softwares?${query}`);

    const rawData = softwareData.data || [];
    const normalizedData = rawData.map(item => {
      if (item.attributes) {
        return item;
      }
      const { id, ...attributes } = item;
      return { id, attributes };
    });

    return sortItemsByOrder(normalizedData);

  } catch (error) {
    console.error(`Falha ao buscar softwares e drivers:`, error);
    return [];
  }
}

export async function getAllSimplePages() {
  try {
    // Tenta buscar como uma coleção
    const pagesData = await fetchAPI(`/api/paginas?fields[0]=titulo&fields[1]=slug&pagination[limit]=100`);
    if (pagesData && pagesData.length > 0) {
      return normalizeDataArray(pagesData);
    }
    // Se falhar ou retornar vazio, tenta como um tipo único (single type)
    const singlePageData = await fetchAPI(`/api/pagina?fields[0]=titulo&fields[1]=slug`);
    if (singlePageData && singlePageData.id) {
      // Encapsula em um array para manter a consistência do tipo de retorno
      return [singlePageData];
    }
    return [];
  } catch (error) {
    console.error(`Falha ao buscar páginas simples, tentando como coleção e tipo único:`, error);
    return [];
  }
}

export async function getProductsByManufacturerSlug(slug) {
  const response = await fetchAPI(`/api/produtos?filters[relacao_fabricante][slug][$eq]=${slug}&populate=*&sort=ordem:asc`);
  return sortItemsByOrder(normalizeDataArray(response));
}

export async function getManufacturerBySlug(slug) {
  const response = await fetchAPI(`/api/fabricantes?filters[slug][$eq]=${slug}`);
  const data = normalizeDataArray(response);
  return data.length > 0 ? data[0] : null;
}

export async function getImersaoBySlug(slug) {
  const populateQuery = 'populate[personalizado]=*&populate[produto][fields][0]=nome&populate[produto][fields][1]=descricao_curta&populate[produto][populate][0]=imagem_principal&populate[produto][populate][1]=categorias&populate[produto][populate][2]=relacao_fabricante&fields[0]=genero_descricao&fields[1]=curso&fields[2]=guia&fields[3]=manual&fields[4]=botoes_padrao';
  const res = await fetchAPI(`/api/imersaos?filters[slug][$eq]=${slug}&${populateQuery}`);
  const data = normalizeDataArray(res);
  if (data.length === 0) return null;

  const item = data[0];
  // Normalize if the attributes object is missing
  if (item.attributes) {
    return item;
  }
  const { id, ...attributes } = item;
  return { id, attributes };
}

export async function getAllImersaoSlugs() {
  // ADICIONADO: populate[produto][fields] para verificar se existe relação
  const populateQuery = 'populate[produto][fields][0]=slug&populate[produto][fields][1]=nome&fields[0]=slug';
  console.log(`🔍 Buscando imersões com populate: /api/imersaos?${populateQuery}`);

  try {
    const res = await fetchAPI(`/api/imersaos?${populateQuery}`);
    console.log(`✅ Resposta da API:`, JSON.stringify(res, null, 2).substring(0, 500));

    const data = normalizeDataArray(res);
    console.log(`📊 Data após normalize:`, data.length, 'itens');

    // Normalize each item if the attributes object is missing
    const normalizedData = data.map(item => {
      if (!item) return null;
      if (item.attributes) {
        console.log(`  - Item com slug: ${item.attributes?.slug}, produto: ${item.attributes?.produto?.data ? 'SIM' : 'NÃO'}`);
        return item;
      }
      const { id, ...attributes } = item;
      return { id, attributes };
    });

    const filtered = normalizedData.filter(item =>
      item &&
      item.attributes?.slug &&
      item.attributes?.produto?.data
    );

    console.log(`✅ Imersões com produto vinculado: ${filtered.length}`);
    return filtered;
  } catch (error) {
    console.error(`❌ ERRO ao buscar imersões:`, error.message);
    return [];
  }
}

export { fetchAPI };