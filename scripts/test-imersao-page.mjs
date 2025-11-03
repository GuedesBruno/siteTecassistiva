import { getImersaoBySlug } from '../src/lib/api.js';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env.local
dotenv.config({ path: '.env.local' });

const slugToTest = 'index-braille-everest';

async function testImersaoData() {
  console.log(`--- Iniciando teste para o slug: "${slugToTest}" ---`);

  if (!process.env.NEXT_PUBLIC_STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    console.error('ERRO: As variáveis de ambiente NEXT_PUBLIC_STRAPI_URL e STRAPI_API_TOKEN precisam estar definidas.');
    console.error('Verifique se você tem um arquivo .env.local na raiz do projeto com esses valores.');
    return;
  }

  try {
    console.log('1. Buscando dados da API...');
    const imersao = await getImersaoBySlug(slugToTest);

    if (!imersao) {
      console.error('ERRO GRAVE: A função getImersaoBySlug retornou null ou undefined.');
      console.error('Verifique se o item está publicado no Strapi.');
      return;
    }

    console.log('\n2. Dados recebidos da API (formato JSON completo):');
    console.log(JSON.stringify(imersao, null, 2));
    console.log('--- Fim dos dados completos ---');


    console.log('\n3. Simulando acesso aos dados como no componente da página...');

    if (!imersao || !imersao.attributes) {
        throw new Error('Teste falhou: Objeto "imersao" ou "imersao.attributes" não encontrado.');
    }
    console.log('-> "imersao.attributes" OK');

    const { produto: productData } = imersao.attributes;
    if (!productData) {
        throw new Error('Teste falhou: Objeto "produto" não encontrado nos atributos.');
    }
    console.log('-> "produto" OK');

    if (!productData.nome) {
        throw new Error('Teste falhou: "produto.nome" não foi encontrado.');
    }
    console.log('-> "produto.nome" OK');

    console.log('\n--- Simulação concluída com sucesso! ---');
    console.log('A estrutura dos dados parece correta.');
    console.log(`Nome do produto encontrado: ${productData.nome}`);

  } catch (error) {
    console.error('\n--- OCORREU UM ERRO DURANTE A SIMULAÇÃO ---');
    console.error(error);
  }
}

testImersaoData();
