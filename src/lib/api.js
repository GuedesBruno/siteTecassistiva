import qs from "qs";

export function getStrapiURL(path = "") {
  return `${
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
  }${path}`;
}

export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  // A linha 'Authorization' foi descomentada para reativar a autenticação
  const mergedOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
    ...options,
  };

  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ""}`
  )}`;

  console.log("Fetching from URL:", requestUrl);

  try {
    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      console.error("Erro na resposta da API:", response.status, response.statusText);
      throw new Error(`Erro ao buscar dados da API: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Falha na chamada da API:", error);
    return null;
  }
}