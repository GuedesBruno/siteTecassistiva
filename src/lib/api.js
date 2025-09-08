export async function getProducts() {
  // Por padrão, o Strapi roda localmente nesta porta
  const STRAPI_URL = 'http://localhost:1337/api/produtos'; 

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