import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { glob } from 'glob';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Import API functions
import * as api from '../src/lib/api.js';

// Function to strip HTML/JSX tags and extract text
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
    const [products, atas, software] = await Promise.all([
      api.getAllProductsForDisplay({ populateSubcategories: true }),
      api.getOpenAtas(),
      api.getSoftwareAndDrivers(),
    ]);

    // Process API data
    const productData = products.map(p => {
        const attrs = p.attributes || p;
        const imageUrl = api.getStrapiMediaUrl(attrs.imagem_principal?.data?.attributes?.url);
        return {
            id: `product-${p.id}`,
            title: attrs.nome,
            slug: `/produtos/${attrs.slug}`,
            description: attrs.descricao_curta || '',
            imageUrl: imageUrl || null,
            type: 'Produto',
        }
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
        return {
            id: `software-${s.id}`,
            title: attrs.nome,
            slug: '/suporte',
            description: `Tipo: ${s.attributes.tipo}`,
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
    console.log(`- ${ataData.length} Atas`);
    console.log(`- ${softwareData.length} Softwares/Drivers`);
    console.log(`- ${pageData.length} Páginas`);

  } catch (error) {
    console.error('ERRO FATAL ao gerar os dados de busca:', error);
    process.exit(1);
  }
}

generateSearchData();