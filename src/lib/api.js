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
  // Normaliza a URL base removendo barras finais e '/api' caso presente
  let base = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/+$/g, '');
  if (base.endsWith('/api')) base = base.replace(/\/api$/, '');
  return base;
}

// Gera a URL completa para um caminho de mídia retornado pelo Strapi
export function getStrapiMediaUrl(path) {
  if (!path) return null;
  // Se já for uma URL absoluta, retorna tal qual
  if (/^https?:\/\//i.test(path) || /^\/\//.test(path)) return path;
  const base = getStrapiURL();
  // garante que exista uma barra entre base e path
  if (path.startsWith('/')) return `${base}${path}`;
  return `${base}/${path}`;
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
  // Busca produtos em destaque incluindo imagem principal
  const response = await fetchAPI('/api/produtos?filters[destaque][$eq]=true&fields[0]=nome&fields[1]=slug&populate=imagem_principal');
  return normalizeDataArray(response);
}

// Busca todas as categorias com seus produtos e imagens
export async function getAllCategories() {
  // Busca categorias com subcategorias para montar o menu
  const response = await fetchAPI('/api/categorias?fields[0]=nome&fields[1]=slug&populate=subcategorias');
  return normalizeDataArray(response);
}

// Busca uma categoria pelo slug com os seus produtos
export async function getCategoryBySlug(slug) {
  // Busca segura por categoria sem usar populates agressivos (o Strapi remoto rejeita alguns populates)
  try {
    const response = await fetchAPI(`/api/categorias?filters[slug][$eq]=${encodeURIComponent(slug)}`);
    const data = response.data || [];
    if (data.length === 0) return { data: [] };

    const normalized = data.map((item) => {
      if (item.attributes) return item;
      const { id, ...rest } = item;
      return { id, attributes: rest };
    });

    // If the category doesn't include products, try fetching products by subcategories
    const categoryItem = normalized[0];
    const attrs = categoryItem.attributes || {};
    const hasDirectProducts = !!(attrs.produtos && (attrs.produtos.data || attrs.produtos).length);
    const hasProductsInSubs = !!(attrs.subcategorias && ((attrs.subcategorias.data && attrs.subcategorias.data.some(s => (s.attributes && (s.attributes.produtos || s.attributes.produtos?.data?.length)) ) ) || false));

    if (!hasDirectProducts && !hasProductsInSubs) {
      try {
        const products = await getProductsByCategorySlug(slug);
        categoryItem.attributes = categoryItem.attributes || {};
        categoryItem.attributes.produtos = products;
      } catch (pErr) {
        console.warn('getCategoryBySlug: failed to fetch products by subcategories:', pErr.message);
      }
    }

    return { data: normalized };
  } catch (err) {
    console.error('getCategoryBySlug failed:', err.message);
    return { data: [] };
  }
}

// Busca produtos pela slug da categoria via endpoint de produtos (filtrando pela relação)
export async function getProductsByCategorySlug(slug) {
  try {
    // Primeiro buscamos subcategorias via o endpoint dedicado para obter slugs/ids
    const subResp = await fetchAPI(`/api/subcategorias?filters[categoria][slug][$eq]=${encodeURIComponent(slug)}&populate=*`);
    const subs = subResp.data || [];
    if (subs.length === 0) return [];

    // Os itens podem vir planos (campos no root) ou com attributes — cobrimos ambos
    const subSlugs = subs.map(s => s.attributes?.slug || s.slug).filter(Boolean);
    const subIds = subs.map(s => s.id).filter(Boolean);

    // Primeiro tente filtrar pelos slugs usando o nome do campo de relação observado ('subcategoria' singular)
    if (subSlugs.length > 0) {
      try {
        const q = `/api/produtos?filters[subcategoria][slug][$in]=${encodeURIComponent(subSlugs.join(','))}&populate=imagem_principal`;
        const resp = await fetchAPI(q);
        return normalizeDataArray(resp);
      } catch (err) {
        console.warn('filter by subcategoria slug failed:', err.message);
      }
    }

    // Em último caso tente filtrar por id usando o mesmo campo de relação
    if (subIds.length > 0) {
      try {
        const q = `/api/produtos?filters[subcategoria][id][$in]=${encodeURIComponent(subIds.join(','))}&populate=imagem_principal`;
        const resp = await fetchAPI(q);
        return normalizeDataArray(resp);
      } catch (err) {
        console.warn('filter by subcategoria id failed:', err.message);
      }
    }

    // If remote filtering failed (ValidationError), fallback to fetching all products and filtering locally
    try {
      const allResp = await fetchAPI('/api/produtos?pagination[limit]=1000&populate=subcategoria,imagem_principal');
      const all = (allResp.data || []).map(item => {
        if (item.attributes) return item;
        const { id, ...rest } = item;
        return { id, attributes: rest };
      });

      // Filter locally by comparing subcategoria slug or id
      const filtered = all.filter(prod => {
        const prodAttrs = prod.attributes || prod;
        const sc = prodAttrs.subcategoria || prod.subcategoria;
        const prodSlug = sc?.slug || sc?.attributes?.slug || null;
        const prodId = sc?.id || null;
        if (prodSlug && subSlugs.includes(prodSlug)) return true;
        if (prodId && subIds.includes(prodId)) return true;
        return false;
      });

      return filtered;
    } catch (e) {
      console.warn('local filter fallback failed:', e.message);
      return [];
    }
  } catch (err) {
    console.warn('getProductsByCategorySlug failed:', err.message);
    return [];
  }
}

// Busca todos os banners do site
export async function getBanners() {
  const response = await fetchAPI('/api/banner-sites?sort=ordem:asc&populate=imagem');
  return normalizeDataArray(response);
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