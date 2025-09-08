export async function getProducts() {
  // URL base da API
  const API_URL = 'http://tecassistiva.provisorio.ws/painel/wp-json/wc/v3/products';
  
  const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
  const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

  // ---- MUDANÇA PRINCIPAL AQUI ----
  // Adicionamos as chaves como parâmetros na URL em vez de no cabeçalho
  const fullUrl = `${API_URL}?consumer_key=${WC_CONSUMER_KEY}&consumer_secret=${WC_CONSUMER_SECRET}`;
  // ---------------------------------

  try {
    // Faz a chamada na URL completa, sem o cabeçalho de autorização
    const res = await fetch(fullUrl);

    if (!res.ok) {
      throw new Error(`Erro ao buscar produtos: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("ERRO na função getProducts:", error);
    return [];
  }
}