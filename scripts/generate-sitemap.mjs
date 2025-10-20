// scripts/generate-sitemap.mjs
import fs from 'fs';
import 'dotenv/config';
import { getAllProductSlugs, getAllCategoryPaths } from '../src/lib/api.js';

const SITE_URL = 'https://www.tecassistiva.com.br'; // Substitua pela URL final do seu site

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