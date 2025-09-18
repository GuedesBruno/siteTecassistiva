const fs = require('fs');
const path = require('path');

function parseEnv(file) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const env = {};
  for (const l of lines) {
    if (l.trim().length === 0) continue;
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
  if (!env.NEXT_PUBLIC_STRAPI_URL || !env.STRAPI_API_TOKEN) {
    console.error('Please set NEXT_PUBLIC_STRAPI_URL and STRAPI_API_TOKEN in .env.local');
    process.exit(2);
  }
  const base = env.NEXT_PUBLIC_STRAPI_URL.replace(/\/+$/,'').replace(/\/api$/,'');
  const token = env.STRAPI_API_TOKEN;

  const categorySlug = 'cegueira';
  console.log('Testing category:', categorySlug);

  const populateVariants = [
    'subcategorias',
    'subcategorias=*',
    'subcategorias][populate]=*',
    'subcategorias][populate][produtos]=*',
    'subcategorias][populate][produtos][populate]=imagem_principal'
  ];

  
  let foundSubs = [];
  for (const v of populateVariants) {
    const q = `${base}/api/categorias?filters[slug][$eq]=${encodeURIComponent(categorySlug)}&populate[${v}]`;
    
    console.log('\nTrying populate variant:', v);
    console.log(q);
    try {
      const res = await fetch(q, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Status:', res.status);
      const txt = await res.text();
      console.log('Body start:', txt.slice(0,400));
      try {
        const json = JSON.parse(txt);
        const data = json.data && json.data[0];
        if (data) {
          const subs = data.subcategorias?.data || data.subcategorias || [];
          if (Array.isArray(subs) && subs.length > 0) {
            foundSubs = subs.map(s => ({ id: s.id, slug: s.attributes?.slug || s.slug, name: s.attributes?.nome || s.nome }));
            break;
          }
        }
      } catch (e) {
        // ignore JSON parse
      }
    } catch (err) {
      console.error('Fetch error', err.message);
    }
  }

  if (foundSubs.length === 0) {
    console.log('\nNo subcategories found with populate variants. Trying /api/subcategorias?filters[categoria][slug][$eq]=...');
    const qsub = `${base}/api/subcategorias?filters[categoria][slug][$eq]=${encodeURIComponent(categorySlug)}&populate[categoria]=*`;
    console.log(qsub);
    try {
      const r = await fetch(qsub, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Status:', r.status);
      const t = await r.text();
      console.log('Body start:', t.slice(0,400));
      try {
        const j = JSON.parse(t);
        const subs = j.data || [];
        foundSubs = subs.map(s => ({ id: s.id, slug: s.attributes?.slug || s.slug, name: s.attributes?.nome || s.nome }));
      } catch (e) {}
    } catch (err) {
      console.error('Fetch error', err.message);
    }
  }

  console.log('\nFinal subcategories:', foundSubs);

  const subSlugs = foundSubs.map(s => s.slug).filter(Boolean);
  const subIds = foundSubs.map(s => s.id).filter(Boolean);

  if (subSlugs.length > 0) {
    const q1 = `${base}/api/produtos?filters[subcategoria][slug][$in]=${encodeURIComponent(subSlugs.join(','))}&populate=imagem_principal`;

    console.log('\nTrying filter by subcategory slugs:');
    console.log(q1);
    try {
      const r1 = await fetch(q1, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Status:', r1.status);
      const t1 = await r1.text();
      console.log('Body start:', t1.slice(0,800));
    } catch (e) { console.error('Fetch error', e.message); }
  }

  if (subIds.length > 0) {
    const q2 = `${base}/api/produtos?filters[subcategoria][id][$in]=${encodeURIComponent(subIds.join(','))}&populate=imagem_principal`;

    console.log('\nTrying filter by subcategory ids:');
    console.log(q2);
    try {
      const r2 = await fetch(q2, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Status:', r2.status);
      const t2 = await r2.text();
      console.log('Body start:', t2.slice(0,800));
    } catch (e) { console.error('Fetch error', e.message); }
  }

  // Try with singular relation name 'subcategoria' (observed on product object)
  if (subSlugs.length > 0) {
    const q3 = `${base}/api/produtos?filters[subcategoria][slug][$in]=${encodeURIComponent(subSlugs.join(','))}&populate=imagem_principal`;
    console.log('\nTrying filter by singular subcategoria slugs:');
    console.log(q3);
    try {
      const r3 = await fetch(q3, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Status:', r3.status);
      const t3 = await r3.text();
      console.log('Body start:', t3.slice(0,800));
    } catch (e) { console.error('Fetch error', e.message); }
  }

  if (subIds.length > 0) {
    const q4 = `${base}/api/produtos?filters[subcategoria][id][$in]=${encodeURIComponent(subIds.join(','))}&populate=imagem_principal`;
    console.log('\nTrying filter by singular subcategoria ids:');
    console.log(q4);
    try {
      const r4 = await fetch(q4, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Status:', r4.status);
      const t4 = await r4.text();
      console.log('Body start:', t4.slice(0,800));
    } catch (e) { console.error('Fetch error', e.message); }
  }

  // Fetch a sample product with populate=* to inspect relation fields
  console.log('\nFetching a sample product with populate=* to inspect fields');
  try {
    const qp = `${base}/api/produtos?pagination[limit]=1&populate=*`;
    console.log(qp);
    const rp = await fetch(qp, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Status:', rp.status);
    const tp = await rp.text();
    console.log('Product body start:', tp.slice(0,1200));
    try {
      const jp = JSON.parse(tp);
      const prod = jp.data && jp.data[0];
      if (prod) {
        console.log('Product top-level keys:', Object.keys(prod));
        console.log('Product attribute keys:', Object.keys(prod.attributes || {}));
      }
    } catch (e) {}
  } catch (e) {
    console.error('Fetch error', e.message);
  }

})();