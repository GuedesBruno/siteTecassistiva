// sitetecassistiva/src/lib/api.js

import qs from "qs";

export const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";
export const NEXT_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = "") {
  return `${API_URL}${path}`;
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {object} urlParamsObject URL params object, will be stringified
 * @param {object} options Options passed to fetch
 * @returns {Promise} Resolved promise with JSON data
 */
export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  // Merge default and user options
  const mergedOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  // Build request URL
  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ""}`)}`;

  console.log("Fetching from URL:", requestUrl); // Log para depuração

  // Trigger API call
  try {
    const response = await fetch(requestUrl, mergedOptions);

    // Handle response
    if (!response.ok) {
      console.error(`Error fetching ${requestUrl}: ${response.status} ${response.statusText}`);
      const errorData = await response.json();
      console.error('Error details:', errorData);
      throw new Error(`An error occurred please try again. Details: ${JSON.stringify(errorData)}`);
    }
    const data = await response.json();
    // A API do Strapi v4 aninha os dados em uma propriedade 'data'
    return data.data; 
  } catch (error) {
    console.error(`Failed to fetch API: ${error.message}`);
    // Retornar null ou um array vazio em caso de erro pode ser mais seguro para os componentes
    return null; 
  }
}