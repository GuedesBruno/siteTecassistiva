import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { glob } from 'glob';
import qs from 'qs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Função auxiliar para fetch API
// Função auxiliar para fetch API com timeout e retry
async function fetchAPI(endpoint, retries = 3) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

  if (!STRAPI_URL || !STRAPI_TOKEN) {
    throw new Error("Variáveis de ambiente não definidas");
  }

  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      let base = STRAPI_URL.replace(/\/+$/g, '');
      if (base.endsWith('/api')) {
        base = base.replace(/\/api$/, '');
      }
      const path_ep = endpoint.replace(/^\/+/, '');
      const url = `${base}/${path_ep}`;

      // Aumenta timeout para 600 segundos (10 minutos)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600000);

      if (attempt > 1) {
        console.log(`  Tentativa ${attempt}/${retries} para ${endpoint}...`);
      }

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        // Tenta ler o erro
        let errorMsg = `API Error: ${res.status}`;
        try {
          const errorBody = await res.json();
          if (errorBody && errorBody.error && errorBody.error.message) {
            errorMsg += ` - ${errorBody.error.message}`;
          }
        } catch (e) { /* ignore */ }
        throw new Error(errorMsg);
      }

      return await res.json();
    } catch (error) {
      lastError = error;

      if (error.name === 'AbortError') {
        console.error(`Timeout ao fazer fetch (tentativa ${attempt}/${retries}): ${endpoint}`);
      } else {
        console.error(`Erro ao fazer fetch (tentativa ${attempt}/${retries}): ${error.message} (${endpoint})`);
      }

      // Se não for a última tentativa, aguarda antes de tentar novamente (exponential backoff)
      if (attempt < retries) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Max 10s
        console.log(`  Aguardando ${waitTime}ms antes de tentar novamente...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}

function getStrapiMediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path) || /^\/\//.test(path)) return path;
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const base = STRAPI_URL.replace(/\/+$/g, '').replace(/\/api$/, '');
  if (path.startsWith('/')) return `${base}${path}`;
  return `${base}/${path}`;
}

function normalizeDataArray(response) {
  if (!response) return [];
  const data = response.data || [];
  return data;
}

// Function to strip HTML/JSX tags and extract text.
function stripTags(content) {
  return content
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Função que busca TODAS as páginas (paginação automática)
async function fetchAllData(endpoint) {
  let allData = [];
  let page = 1;
  let pageCount = 1;
  const limit = 30; // Reduzido para 30 para garantir que não dê timeout

  const [pathPart, queryPart] = endpoint.split('?');
  const queryParams = queryPart ? qs.parse(queryPart) : {};

  // Remove qualquer paginação existente na string original para evitar conflito
  if (queryParams.pagination) {
    delete queryParams.pagination;
  }

  do {
    // console.log(`   > Buscando página ${page}...`); // Debug opcional

    const currentParams = {
      ...queryParams,
      pagination: {
        page: page,
        pageSize: limit // CORRECTED: Strapi v4 uses pageSize with page
      }
    };

    // Encode parameters standardly (brackets encoded) to match safely with strict fetch/servers
    const queryString = qs.stringify(currentParams);
    const pagedUrl = `${pathPart}?${queryString}`;

    try {
      const res = await fetchAPI(pagedUrl);

      if (res.data) {
        allData = allData.concat(res.data);
        if (res.meta && res.meta.pagination) {
          pageCount = res.meta.pagination.pageCount;
        } else {
          // Se não tiver paginação, deve ser single type ou array simples, para por aqui
          pageCount = 1;
        }
      } else {
        // Fallback
        if (Array.isArray(res)) allData = allData.concat(res);
        pageCount = 0;
      }
    } catch (err) {
      console.error(`Erro na página ${page} de ${pathPart}:`, err.message);
      throw err;
    }

    page++;
  } while (page <= pageCount);

  return allData;
}

async function generateSearchData() {
  console.log('Iniciando a geração de dados de busca abrangente...');

  try {
    // Fetch data from APIs sequencialmente com paginação robusta
    console.log('Buscando produtos...');
    const products = await fetchAllData('/api/produtos?populate[0]=imagem_principal&populate[1]=subcategorias&populate[2]=categorias&sort=ordem:asc');

    console.log('Buscando produtos com documentos...');
    const productsWithDocsRaw = await fetchAllData('/api/produtos?populate[0]=documentos&populate[1]=categorias&populate[2]=subcategorias&sort=nome:asc');
    // Normalizar
    const productsWithDocs = productsWithDocsRaw.map(item => {
      const { id, ...attributes } = item.attributes ? item : { id: item.id, ...item };
      return { id, attributes };
    });

    console.log('Buscando atas...');
    const atas = await fetchAllData('/api/atas?sort=ordem:asc');

    console.log('Buscando softwares...');
    const software = await fetchAllData('/api/softwares?fields[0]=nome&fields[1]=tipo&populate[instaladores]=*');


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

      // Combina conteúdo para busca mais completa
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

        // Extrai extensão do arquivo
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

      let title = slug.split('/').pop() || 'Página Inicial';
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
        type: 'Página',
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

    const publicDir = path.join(process.cwd(), 'public');
    const outputPath = path.join(publicDir, 'search-data.json');

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
    console.log(`- ${pageData.length} Páginas`);

  } catch (error) {
    console.error('ERRO FATAL ao gerar os dados de busca:', error);
    process.exit(1);
  }
}

generateSearchData();