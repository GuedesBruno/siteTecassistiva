import qs from "qs";

/**
 * Obtém a URL completa para a API Strapi.
 * @param {string} path - O caminho para o recurso da API (ex: "/posts").
 * @returns {string} A URL completa.
 */
export function getStrapiURL(path = "") {
  return `${
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
  }${path}`;
}

/**
 * Função helper para fazer chamadas de API para o Strapi.
 * @param {string} path - O caminho do endpoint da API.
 * @param {object} urlParamsObject - Objeto com os parâmetros de URL (filtros, populate, etc.).
 * @param {object} options - Opções adicionais para a função fetch.
 * @returns {Promise<any>} Os dados retornados pela API.
 */
export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  // Mescla as opções padrão com as opções fornecidas pelo usuário
  const mergedOptions = {
    headers: {
      "Content-Type": "application/json",
      // Adiciona o token de autorização da API
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    ...options,
  };

  // Constrói a URL da requisição com os parâmetros
  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ""}`
  )}`;

  console.log("Fetching from URL:", requestUrl); // Log para depuração

  try {
    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      console.error("Erro na resposta da API:", response.status, response.statusText);
      // Lança um erro para que possa ser tratado no local da chamada
      throw new Error(`Erro ao buscar dados da API: ${response.statusText}`);
    }

    const data = await response.json();
    // A API do Strapi v4 aninha os dados em uma propriedade 'data'
    return data.data;
  } catch (error) {
    console.error("Falha na chamada da API:", error);
    // Retorna null ou um objeto de erro para tratamento no frontend
    return null;
  }
}