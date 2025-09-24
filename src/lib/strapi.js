// /lib/strapi.js
export async function fetchStrapiData(endpoint) {
  const baseUrl = process.env.STRAPI_URL || 'http://localhost:1337';
  const response = await fetch(`${baseUrl}/api${endpoint}`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch from Strapi: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data;
}