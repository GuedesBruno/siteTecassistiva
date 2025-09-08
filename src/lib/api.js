export async function getProducts() {
  // **IMPORTANTE:** Substitua pela URL da sua API Strapi.
  // O parâmetro `?populate=*` é usado para incluir todas as relações, como imagens.
  const STRAPI_URL = 'http://URL_DO_SEU_STRAPI/api/products?populate=*';

  // Opção para guardar a URL em uma variável de ambiente (mais seguro)
  // const STRAPI_URL = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?populate=*`;

  if (!STRAPI_URL.startsWith('http')) {
    console.error("ERRO: A URL do Strapi não foi definida. Verifique o arquivo /src/lib/api.js");
    return [];
  }

  try {
    const res = await fetch(STRAPI_URL);
    // Se a requisição falhar, lança um erro
    if (!res.ok) {
      throw new Error(`Falha na requisição: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    
    // A resposta do Strapi aninha os dados em um objeto 'data'
    // Se não houver dados, retorna um array vazio
    return data.data || [];
  } catch (error) {
    console.error("ERRO ao buscar produtos do Strapi:", error);
    // Em caso de erro, retorna um array vazio para não quebrar a página
    return [];
  }
}