import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Polyfill para __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseEnv(file) {
  try {
    const content = readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);
    const env = {};
    for (const l of lines) {
      if (l.trim().length === 0 || l.startsWith('#')) continue;
      const m = l.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (m) {
        let val = m[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        env[m[1]] = val;
      }
    }
    return env;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Arquivo .env não encontrado em: ${file}`);
      console.error('Certifique-se de que o arquivo .env.local existe no diretório raiz do projeto.');
      process.exit(1);
    }
    throw error;
  }
}

(async function(){
  const envPath = path.resolve(__dirname, '..', '.env.local');
  const env = parseEnv(envPath);

  const strapiUrl = env.NEXT_PUBLIC_STRAPI_URL;
  const token = env.STRAPI_API_TOKEN;

  if (!strapiUrl || !token) {
    console.error('As variáveis de ambiente NEXT_PUBLIC_STRAPI_API_URL e STRAPI_API_TOKEN devem estar definidas em .env.local');
    process.exit(1);
  }

  // Constrói a URL da API de forma segura
  const url = new URL('/api/produtos', strapiUrl);
  url.searchParams.set('fields[0]', 'slug');
  url.searchParams.set('fields[1]', 'nome'); // Adiciona o nome para facilitar a associação
  url.searchParams.set('pagination[limit]', '1000');

  console.log('Consultando a API em:', url.toString());

  try {
    const response = await fetch(url.toString(), { 
      headers: { Authorization: `Bearer ${token}` } 
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    const data = json.data || [];
    
    console.log(`\nEncontrados ${data.length} produtos:\n`);

    // Mapeia slug para nome para facilitar a referência
    const productMap = data.map(item => ({
      nome: item.nome,
      slug: item.slug
    }));

    console.table(productMap);

  } catch (error) {
    console.error('\nFalha ao buscar produtos:', error.message);
    process.exit(1);
  }
})();