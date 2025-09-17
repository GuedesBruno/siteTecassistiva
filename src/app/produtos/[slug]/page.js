import { getAllProducts, getProductBySlug } from "@/lib/api";
import ProductViewClient from "@/components/ProductViewClient";

// ✅ CORRIGIDO: Busca todos os slugs de produtos da API para gerar as páginas
export async function generateStaticParams() {
  const products = await getAllProducts();

  // Se a API não retornar produtos, retorna um array vazio para não quebrar o build
  if (!products || !products.data) {
    return [];
  }

  return products.data.map((product) => ({
    slug: product.attributes.Slug,
  }));
}

// A página busca os dados do produto específico pelo slug
export default async function ProdutoSlugPage({ params }) {
  const productData = await getProductBySlug(params.slug);

  if (!productData || !productData.data || productData.data.length === 0) {
    return <div>Produto não encontrado.</div>;
  }

  // O componente recebe os dados do produto encontrado
  return <ProductViewClient product={productData.data[0]} />;
}