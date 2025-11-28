import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { glob } from 'glob';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Função auxiliar para fetch API
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

async function generateSearchData() {
  console.log('Iniciando a geração de dados de busca abrangente...');

  try {
    // Fetch data from APIs
    const [products, productsWithDocs, atas, software] = await Promise.all([
      fetchAPI('/api/produtos?populate[0]=imagem_principal&populate[1]=subcategorias&populate[2]=categorias&pagination[limit]=1000&sort=ordem:asc').then(d => normalizeDataArray(d)),
      fetchAPI('/api/produtos?populate[0]=documentos&populate[1]=categorias&populate[2]=subcategorias&pagination[limit]=1000&sort=nome:asc').then(d => {
        const rawData = normalizeDataArray(d);
        return rawData.map(item => {
          if (item.attributes) return item;
          const { id, ...attributes } = item;
          return { id, attributes };
        });
      }),
      fetchAPI('/api/atas?sort=ordem:asc&pagination[limit]=1000').then(d => normalizeDataArray(d)),
      fetchAPI('/api/softwares?fields[0]=nome&fields[1]=tipo&populate[instaladores]=*&pagination[limit]=1000').then(d => normalizeDataArray(d)),
    ]);

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