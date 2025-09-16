import { fetchAPI } from '@/lib/api';
import ProductViewClient from '@/components/ProductViewClient';

export async function generateStaticParams() {
  console.log("A tentar gerar parâmetros estáticos para produtos...");
  const products = await fetchAPI("/produtos", { fields: ['slug'] });

  // CORREÇÃO: Adicionada uma verificação explícita para falhar o build com uma mensagem clara
  if (!products || products.length === 0) {
    throw new Error("A API não retornou produtos para gerar as páginas. Verifique as permissões da API e o estado do conteúdo.");
  }

  console.log(`Encontrados ${products.length} produtos para gerar as páginas.`);

  return products
    .filter(product => product && product.attributes && product.attributes.slug)
    .map((product) => ({
      slug: product.attributes.slug,
    }));
}

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