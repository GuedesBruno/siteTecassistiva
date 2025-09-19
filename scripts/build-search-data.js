const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do arquivo .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Importa as funções da API usando caminho relativo
const { fetchAPI, normalizeDataArray } = require('../src/lib/api.js');

async function buildSearchData() {
  console.log('Building search data index...');
  try {
    // Busca todos os produtos com os campos necessários para a busca e para os cards de resultado
    const fieldsToSearch = [
      'nome',
      'slug',
      'descricao_curta'
    ];
    const relationsToPopulate = ['imagem_principal', 'subcategoria'];

    const fieldsQuery = fieldsToSearch.map((field, i) => `fields[${i}]=${field}`).join('&');
    const populateQuery = relationsToPopulate.map((relation, i) => `populate[${i}]=${relation}`).join('&');

    // Constrói a query completa, pedindo tanto os campos de texto quanto as relações
    const productsData = await fetchAPI(`/api/produtos?${fieldsQuery}&${populateQuery}&pagination[limit]=1000`);
    const normalizedProducts = normalizeDataArray(productsData);

    const searchData = {
      products: normalizedProducts,
      // No futuro, podemos adicionar outras fontes de conteúdo (páginas, posts) aqui
    };

    const dataPath = path.join(process.cwd(), 'public', 'search-data.json');
    await fs.writeFile(dataPath, JSON.stringify(searchData, null, 2));

    console.log(`✅ Successfully built search data at ${dataPath}`);
  } catch (error) {
    console.error('❌ Failed to build search data:', error);
    // Falha o processo de build se o script não conseguir gerar os dados
    process.exit(1);
  }
}

buildSearchData();