// --- FUNÇÕES DA API ---

async function fetchAPI(endpoint) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error("ERRO GRAVE: Variáveis de ambiente do Strapi não estão definidas.");
    // Retorna um objeto com erro para ser tratado pela função que chamou
    return { error: 'Variáveis de ambiente não configuradas', data: [] };
  }

  try {
    const res = await fetch(`${STRAPI_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      cache: 'no-cache'
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('Resposta da API não foi OK! Status:', res.status);
      console.error('Corpo do Erro:', errorBody);
      throw new Error(`Erro na requisição: ${res.status} ${res.statusText}`);
    }
    
    return await res.json(); // Retorna o objeto JSON completo

  } catch (error) {
    console.error("ERRO FINAL ao fazer fetch na API:", error.message);
    return { error: error.message, data: [] };
  }
}

// --- FUNÇÕES DE PRODUTOS ---

export async function getProducts() {
  const json = await fetchAPI('/api/produtos?populate=*');
  // Se o formato for plano (sem attributes), apenas retorna json
  // Se for o formato padrão do Strapi, retorna json.data
  return Array.isArray(json) ? json : json.data || [];
}

export async function getProductBySlug(slug) {
  const json = await fetchAPI(`/api/produtos?filters[slug][$eq]=${slug}&populate=*`);
  const productData = Array.isArray(json) ? json : json.data;
  return productData && productData.length > 0 ? productData[0] : null;
}

// --- NOVA FUNÇÃO ---
export async function getFeaturedProducts() {
  const json = await fetchAPI('/api/produtos?filters[destaque][$eq]=true&populate=*');
  return Array.isArray(json) ? json : json.data || [];
}