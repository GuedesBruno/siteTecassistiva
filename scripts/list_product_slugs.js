const { readFileSync } = require('fs');
const path = require('path');

function parseEnv(file) {
  const content = readFileSync(file, 'utf8');
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
  const env = parseEnv(envPath);
  const base = env.NEXT_PUBLIC_STRAPI_URL.replace(/\/+$/,'').replace(/\/api$/,'');
  const token = env.STRAPI_API_TOKEN;

  const q = `${base}/api/produtos?fields[0]=slug&pagination[limit]=1000`;
  console.log('Query:', q);
  const r = await fetch(q, { headers: { Authorization: `Bearer ${token}` } });
  const j = await r.json();
  const data = j.data || [];
  console.log('Count:', data.length);
  console.log(data.map(d => d.slug || d.attributes?.slug || d.attributes?.slug));
})();