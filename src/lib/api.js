// src/lib/api.js
export async function getProducts() {
  // URL CORRIGIDA para apontar para a sua instalação do WP
  const API_URL = 'http://tecassistiva.provisorio.ws/novositeteca/wp-json/wc/v3/products';

  const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
  const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;
  const auth = Buffer.from(WC_CONSUMER_KEY + ':' + WC_CONSUMER_SECRET).toString('base64');

  try {
    const res = await fetch(API_URL, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });

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