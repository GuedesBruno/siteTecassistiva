import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { glob } from 'glob';
import qs from 'qs';
import { normalizeDataArray, requestStrapi } from '../src/lib/strapi-client.mjs';
import { getStrapiMediaUrl } from '../src/lib/media.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Busca na API com timeout de 10 minutos e retry agressivo (5 tentativas, backoff de 2s a 30s)
// para lidar com 503s do Strapi Cloud. Qualquer resposta não-ok é repetida; ao fim, lança o último erro.
// (Quem decide se a falha derruba o build é safeFetch, olhando CI.)
async function fetchAPI(endpoint, retries = 5) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_URL || !STRAPI_TOKEN) {
    throw new Error("Variáveis de ambiente não definidas");
  }

  let res;
  try {
    res = await requestStrapi(endpoint, {
      baseUrl: STRAPI_URL,
      token: STRAPI_TOKEN,
      maxAttempts: retries,
      shouldRetryStatus: () => true,
      retryDelay: (attempt) => {
        const waitTime = Math.min(2000 * Math.pow(2, attempt - 1), 30000);
        console.log(`  Aguardando ${waitTime}ms antes de tentar novamente...`);
        return waitTime;
      },
      timeoutMs: 600000,
      onRetry: (attempt, reason) => console.error(`Erro ao fazer fetch (tentativa ${attempt}/${retries}): ${reason} (${endpoint})`),
    });
  } catch (error) {
    console.error(`Erro ao fazer fetch (tentativa ${retries}/${retries}): ${error.name === 'AbortError' ? 'timeout' : error.message} (${endpoint})`);
    throw error;
  }

  if (!res.ok) {
    let errorMsg = `API Error: ${res.status}`;
    try {
      const errorBody = await res.json();
      if (errorBody && errorBody.error && errorBody.error.message) {
        errorMsg += ` - ${errorBody.error.message}`;
      }
    } catch (e) { /* ignore */ }
    console.error(`Erro ao fazer fetch (tentativa ${retries}/${retries}): ${errorMsg} (${endpoint})`);
    throw new Error(errorMsg);
  }

  return await res.json();
}

// Function to strip HTML/JSX tags and extract text.
function stripTags(content) {
  return content
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Fun├º├úo que busca TODAS as p├íginas (pagina├º├úo autom├ítica)
async function fetchAllData(endpoint) {
  let allData = [];
  let page = 1;
  let pageCount = 1;
  const limit = 30; // Reduzido para 30 para garantir que n├úo d├¬ timeout

  const [pathPart, queryPart] = endpoint.split('?');
  const queryParams = queryPart ? qs.parse(queryPart) : {};

  // Remove qualquer pagina├º├úo existente na string original para evitar conflito
  if (queryParams.pagination) {
    delete queryParams.pagination;
  }

  do {
    // console.log(`   > Buscando p├ígina ${page}...`); // Debug opcional

    // Simplifica a paginação: anexa diretamente como string sem usar qs.
    // O qs.stringify às vezes codifica arrays complexos de um jeito que o Strapi Cloud
    // recusa com 503 Timeout
    const pagedUrl = queryPart 
      ? `${pathPart}?${queryPart}&pagination[page]=${page}&pagination[pageSize]=${limit}`
      : `${pathPart}?pagination[page]=${page}&pagination[pageSize]=${limit}`;

    try {
      const res = await fetchAPI(pagedUrl);

      if (res.data) {
        allData = allData.concat(res.data);
        if (res.meta && res.meta.pagination) {
          pageCount = res.meta.pagination.pageCount;
        } else {
          // Se n├úo tiver pagina├º├úo, deve ser single type ou array simples, para por aqui
          pageCount = 1;
        }
      } else {
        // Fallback
        if (Array.isArray(res)) allData = allData.concat(res);
        pageCount = 0;
      }
    } catch (err) {
      console.error(`Erro na p├ígina ${page} de ${pathPart}:`, err.message);
      throw err;
    }

    page++;
  } while (page <= pageCount);

  return allData;
}

async function generateSearchData() {
  console.log('Iniciando a gera├º├úo de dados de busca abrangente...');

  const publicDir = path.join(process.cwd(), 'public');
  const outputPath = path.join(publicDir, 'search-data.json');

  // Helper para buscar com fallback seguro
  async function safeFetch(label, endpoint) {
    try {
      console.log(`Buscando ${label}...`);
      return await fetchAllData(endpoint);
    } catch (err) {
      // Em CI (deploy) não publica busca incompleta: falha o build
      if (process.env.CI) throw err;
      console.warn(`AVISO: Falha ao buscar ${label} (${err.message}). Usando array vazio como fallback.`);
      return [];
    }
  }

  try {
    const productsData = await safeFetch('produtos', '/api/produtos?populate[0]=imagem_principal&populate[1]=subcategorias&populate[2]=categorias&sort=ordem:asc');
    const products = productsData.filter(item => item && (item.attributes || item).ocultar_do_catalogo !== true);

    const productsWithDocsData = await safeFetch('produtos com documentos', '/api/produtos?populate[0]=documentos&populate[1]=categorias&populate[2]=subcategorias&sort=nome:asc');
    // Não filtramos produtos com documentos, pois queremos que os manuais de produtos ocultos fiquem disponíveis na busca e suporte
    const productsWithDocsRaw = productsWithDocsData;
    // Normalizar
    const productsWithDocs = productsWithDocsRaw.map(item => {
      const { id, ...attributes } = item.attributes ? item : { id: item.id, ...item };
      return { id, attributes };
    });

    const atas = await safeFetch('atas', '/api/atas?sort=ordem:asc');

    const software = await safeFetch('softwares', '/api/softwares?fields[0]=nome&fields[1]=tipo&populate[instaladores]=*');

    // Se todos os dados da API vieram vazios (API completamente indispon├¡vel),
    // tenta reutilizar o arquivo de busca do ├║ltimo build bem-sucedido
    const apiTotalItems = products.length + productsWithDocsRaw.length + atas.length + software.length;
    if (apiTotalItems === 0 && fs.existsSync(outputPath)) {
      console.warn('AVISO: Nenhum dado retornado pela API. Reutilizando search-data.json do ├║ltimo build bem-sucedido.');
      console.log('Build continuar├í sem atualizar os dados de busca.');
      return;
    }


    // Process API data - Products
    const productData = products.map(p => {
      const attrs = p.attributes || p;
      const imageUrl = getStrapiMediaUrl(attrs.imagem_principal?.data?.attributes?.url || attrs.imagem_principal?.url);

      // Extrai categorias e subcategorias
      const categoriesArray = Array.isArray(attrs.categorias)
        ? attrs.categorias
        : (attrs.categorias?.data || []);
      const subcategoriesArray = Array.isArray(attrs.subcategorias)
        ? attrs.subcategorias
        : (attrs.subcategorias?.data || []);

      const categories = categoriesArray
        .map(c => (c.attributes?.nome || c.nome))
        .filter(Boolean)
        .join(', ');

      const subcategories = subcategoriesArray
        .map(s => (s.attributes?.nome || s.nome))
        .filter(Boolean)
        .join(', ');

      // Combina conte├║do para busca mais completa
      const content = [
        attrs.descricao_curta || '',
        attrs.descricao_longa ? stripTags(JSON.stringify(attrs.descricao_longa)) : '',
        categories,
        subcategories,
        attrs.Fabricante || '',
      ].filter(Boolean).join(' ');

      return {
        id: `product-${p.id}`,
        title: attrs.nome,
        slug: `/produtos/${attrs.slug}`,
        description: attrs.descricao_curta || '',
        imageUrl: imageUrl || null,
        type: 'Produto',
        content: content,
        categories: categories,
        subcategories: subcategories,
        fabricante: attrs.Fabricante || '',
      }
    });

    // Extract documents from products
    const documentData = [];
    productsWithDocs.forEach(p => {
      const attrs = p.attributes || p;
      const documentosArray = Array.isArray(attrs.documentos)
        ? attrs.documentos
        : (attrs.documentos?.data || []);

      documentosArray.forEach(doc => {
        const docAttrs = doc.attributes || doc;
        const fileName = docAttrs.name || docAttrs.nome || 'Documento';
        const fileUrl = docAttrs.url || '';

        // Extrai extens├úo do arquivo
        const extension = fileName.split('.').pop().toLowerCase();
        const docType = {
          'pdf': 'PDF',
          'doc': 'Word',
          'docx': 'Word',
          'xls': 'Excel',
          'xlsx': 'Excel',
          'txt': 'Texto',
          'zip': 'Compactado',
        }[extension] || 'Documento';

        documentData.push({
          id: `doc-${p.id}-${doc.id}`,
          title: `${fileName} - ${attrs.nome}`,
          slug: `/produtos/${attrs.slug}`,
          description: `Documento do produto ${attrs.nome}`,
          type: 'Documento',
          documentType: docType,
          productTitle: attrs.nome,
          productSlug: `/produtos/${attrs.slug}`,
          fileName: fileName,
          fileUrl: getStrapiMediaUrl(fileUrl),
          content: `${fileName} ${docType} ${attrs.nome}`,
          isProductHidden: attrs.ocultar_do_catalogo === true,
        });
      });
    });

    const ataData = atas.map(a => {
      const attrs = a.attributes || a;
      return {
        id: `ata-${a.id}`,
        title: attrs.orgao,
        slug: '/atas-abertas',
        description: attrs.descricao || '',
        type: 'Ata',
      }
    });

    const softwareData = software.map(s => {
      const attrs = s.attributes || s;
      const tipo = attrs.tipo || 'Software/Driver';
      return {
        id: `software-${s.id}`,
        title: attrs.nome,
        slug: '/suporte',
        description: `Tipo: ${tipo}`,
        type: 'Software/Driver',
      }
    });

    // Process static pages
    const pageFiles = await glob('src/app/**/page.js', {
      ignore: ['src/app/api/**', 'src/app/produtos/**'],
    });

    const pageData = pageFiles.map(file => {
      const content = fs.readFileSync(file, 'utf-8');
      const textContent = stripTags(content);
      const slug = file
        .replace('src/app', '')
        .replace('/page.js', '') || '/';

      const description = textContent.substring(0, 150) + '...';

      let title = slug.split('/').pop() || 'P├ígina Inicial';
      title = title.charAt(0).toUpperCase() + title.slice(1).replace(/-/g, ' ');

      const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1];
      }

      return {
        id: `page-${slug}`,
        title: title,
        slug: slug,
        description: description,
        content: textContent,
        type: 'P├ígina',
      };
    });


    // Combine all data
    const searchData = [
      ...productData,
      ...documentData,
      ...ataData,
      ...softwareData,
      ...pageData,
    ];



    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(outputPath, JSON.stringify(searchData, null, 2));

    console.log(`Dados de busca gerados com sucesso em: ${outputPath}`);
    console.log(`${searchData.length} itens foram indexados.`);
    console.log(`- ${productData.length} Produtos`);
    console.log(`- ${documentData.length} Documentos`);
    console.log(`- ${ataData.length} Atas`);
    console.log(`- ${softwareData.length} Softwares/Drivers`);
    console.log(`- ${pageData.length} P├íginas`);

  } catch (error) {
    console.error('ERRO FATAL ao gerar os dados de busca:', error);
    process.exit(1);
  }
}

generateSearchData();
