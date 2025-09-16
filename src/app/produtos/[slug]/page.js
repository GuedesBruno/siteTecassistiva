import { fetchAPI } from '@/lib/api';
import ProductViewClient from '@/components/ProductViewClient';

// GERA OS PARÂMETROS ESTÁTICOS (SLUGS) PARA CADA PÁGINA DE PRODUTO
export async function generateStaticParams() {
  try {
    const products = await fetchAPI("/produtos", { fields: ['slug'] });
    
    // CORREÇÃO APLICADA AQUI
    // 1. Verifica se a resposta da API é válida.
    // 2. Acessa o slug através de 'product.attributes.slug'.
    if (!products || products.length === 0) {
      return [];
    }

    return products
      .filter(product => product && product.attributes && product.attributes.slug)
      .map((product) => ({
        slug: product.attributes.slug,
      }));

  } catch (error) {
    console.error("Falha ao gerar slugs de produto:", error);
    return []; // Retorna um array vazio para não quebrar o build
  }
}

// BUSCA OS DADOS ESPECÍFICOS DE UM PRODUTO
async function getProductData(slug) {
  try {
    const products = await fetchAPI("/produtos", {
      filters: { slug: { $eq: slug } },
      populate: {
        imagem_principal: true,
        galeria: true,
        categoria: true,
        subcategoria: true,
      },
    });
    
    return products && products.length > 0 ? products[0] : null;
  } catch (error) {
    console.error(`Erro ao buscar dados do produto ${slug}:`, error);
    return null;
  }
}

// O COMPONENTE DA PÁGINA
export default async function ProductPage({ params }) {
  const { slug } = params;
  const product = await getProductData(slug);

  if (!product) {
    return (
      <div className="container mx-auto text-center py-10">
        <h1 className="text-3xl font-bold">Produto não encontrado</h1>
        <p>O produto que você está procurando não existe ou foi movido.</p>
      </div>
    );
  }

  return <ProductViewClient product={product} />;
}