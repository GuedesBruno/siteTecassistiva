import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ✅ CORREÇÃO: Usando import moderno para o módulo da API
import { getAllProductsForDisplay } from '../src/lib/api.js';

async function generateSearchData() {
  console.log('Iniciando a geração de dados de busca...');
  
  try {
    const products = await getAllProductsForDisplay();
    
    if (!products || products.length === 0) {
      console.warn('Nenhum produto encontrado. O arquivo search-data.json não será gerado.');
      // Cria um arquivo vazio para não quebrar a aplicação de busca no frontend
      const publicDir = path.join(process.cwd(), 'public');
      const outputPath = path.join(publicDir, 'search-data.json');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
      }
      fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
      console.log('Arquivo search-data.json vazio foi gerado.');
      return;
    }

    const searchData = products.map(product => {
      // Normaliza o acesso aos atributos, quer o produto já venha normalizado ou não
      const attrs = product.attributes || product;
      return {
        id: product.id,
        nome: attrs.nome,
        slug: attrs.slug,
        descricao_curta: attrs.descricao_curta || '',
        imagem_principal: attrs.imagem_principal, // Adiciona a imagem principal
      };
    });

    const publicDir = path.join(process.cwd(), 'public');
    const outputPath = path.join(publicDir, 'search-data.json');

    // Garante que o diretório 'public' existe
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(outputPath, JSON.stringify(searchData, null, 2));
    
    console.log(`Dados de busca gerados com sucesso em: ${outputPath}`);
    console.log(`${searchData.length} produtos foram indexados.`);

  } catch (error) {
    console.error('ERRO FATAL ao gerar os dados de busca:', error);
    // Lança o erro para que o processo de build pare
    process.exit(1);
  }
}

generateSearchData();