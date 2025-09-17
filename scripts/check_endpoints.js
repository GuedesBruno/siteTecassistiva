const fs = require('fs');
const path = require('path');

function parseEnv(file) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const env = {};
  for (const l of lines) {
    const m = l.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) {
      let val = m[2];
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[m[1]] = val;
    }
  }
  return env;
}

(async function(){
  const envPath = path.resolve(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local not found');
    process.exit(2);
  }
  const env = parseEnv(envPath);
  const base = env.NEXT_PUBLIC_STRAPI_URL;
  const token = env.STRAPI_API_TOKEN;
  if (!base || !token) {
    console.error('Missing NEXT_PUBLIC_STRAPI_URL or STRAPI_API_TOKEN in .env.local');
    process.exit(2);
  }

  const normalizeBase = (b) => b.replace(/\/+$/,'').replace(/\/api$/,'');
  const baseUrl = normalizeBase(base);

  const endpoints = [
    '/api/produto',
    '/api/produtos',
    '/api/categoria',
    '/api/categorias'
  ];

  // Testa também algumas URLs com populate usadas pelo site
  const extra = [
    '/api/produtos?filters[destaque][$eq]=true&populate=imagem_principal',
    '/api/produtos?filters[slug][$eq]=everest-dv-5&populate[imagem_principal]=*&populate[galeria_de_imagens]=*&populate[categorias][populate][subcategorias]=*',
    '/api/categorias?populate[subcategorias][populate][produtos][populate]=imagem_principal',
    '/api/produtos?filters[slug][$eq]=ruby-10',
  ];

  endpoints.push(...extra);

  for (const ep of endpoints) {
    const url = `${baseUrl}${ep}`;
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const text = await res.text();
      console.log('==>', url);
      console.log('Status:', res.status);
      console.log('Body (first 400 chars):', text.slice(0,400));
      console.log('\n');
    } catch (err) {
      console.error('Error fetching', url, err.message);
    }
  }
})();
