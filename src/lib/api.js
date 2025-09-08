export async function getProducts() {
  // Por padrão, o Strapi roda localmente nesta porta
  const API_URL = 'http://devsite.tecassistiva.com.br/painel/wp-json/wc/v3/products';

  try {
    const res = await fetch(STRAPI_URL);
    const data = await res.json();
    // A resposta do Strapi é aninhada em um objeto 'data'
    return data.data; 
  } catch (error) {
    console.error("ERRO ao buscar produtos do Strapi:", error);
    return [];
  }
}