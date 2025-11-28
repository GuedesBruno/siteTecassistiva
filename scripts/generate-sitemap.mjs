// scripts/generate-sitemap.mjs
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SITE_URL = 'https://www.tecassistiva.com.br';

// Funções de fetch sem dependência de src/lib/api.js
async function fetchAPI(endpoint) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_URL || !STRAPI_TOKEN) {
    throw new Error("Variáveis de ambiente não definidas");
  }

  try {
    let base = STRAPI_URL.replace(/\/+$/g, '');
    if (base.endsWith('/api')) {
      base = base.replace(/\/api$/, '');
    }
    const path_ep = endpoint.replace(/^\/+/, '');
    const url = `${base}/${path_ep}`;

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Erro ao fazer fetch: ${error.message}`);
    throw error;
  }
}

function normalizeDataArray(response) {
  if (!response) return [];
  const data = response.data || [];
  return data;
}

async function getAllProductSlugs() {
  const data = await fetchAPI('/api/produtos?fields[0]=slug&pagination[limit]=1000&sort=ordem:asc');
  const products = normalizeDataArray(data);
  return products.map(p => ({
    slug: p.attributes?.slug || p.slug,
  })).filter(p => p.slug);
}

async function getAllCategoryPaths() {
  const data = await fetchAPI('/api/categorias?fields[0]=slug&populate[subcategorias][fields][0]=slug&pagination[limit]=200');
  const categories = normalizeDataArray(data);
  return categories.map(c => {
    const attrs = c.attributes || c;
    const subcategorias = Array.isArray(attrs.subcategorias) 
      ? attrs.subcategorias 
      : (attrs.subcategorias?.data || []);
    
    return {
      slug: attrs.slug,
      subcategorias: subcategorias.map(s => ({
        slug: s.attributes?.slug || s.slug,
      })),
    };
  });
}

async function generateSitemap() {
  console.log('Gerando sitemap...');

  const productSlugs = await getAllProductSlugs();
  const categoryPaths = await getAllCategoryPaths();

  const staticPages = [
    '/',
    '/produtos',
    '/atas-abertas',
    '/suporte',
    '/contato',
    '/tecassistiva',
  ];

  const sitemapContent = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages.map(page => `
        <url>
          <loc>${`${SITE_URL}${page}`}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        </url>
      `).join('')}

      ${productSlugs.map(p => `
        <url>
          <loc>${`${SITE_URL}/produtos/${p.slug}`}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        </url>
      `).join('')}

      ${categoryPaths.map(c => `
        <url>
          <loc>${`${SITE_URL}/produtos/categorias/${c.slug}`}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        </url>
        ${(c.subcategorias || []).map(sub => `
          <url>
            <loc>${`${SITE_URL}/produtos/categorias/${c.slug}/${sub.slug}`}</loc>
            <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          </url>
        `).join('')}
      `).join('')}
    </urlset>
  `.trim();

  fs.writeFileSync('public/sitemap.xml', sitemapContent);
  console.log('Sitemap gerado com sucesso em public/sitemap.xml');
}

generateSitemap();