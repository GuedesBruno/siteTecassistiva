// ✅ CORRIGIDO: Importa as funções que realmente existem no seu api.js
import { getFeaturedProducts, getProductBySlug } from "@/lib/api";
import ProductViewClient from "@/components/ProductViewClient";

// ✅ CORRIGIDO: Usa getFeaturedProducts para buscar os slugs
export async function generateStaticParams() {
  const products = await getFeaturedProducts(); // Usando a função correta

  if (!products || !products.data) {
    return [];
  }

  return products.data.map((product) => ({
    slug: product.attributes.Slug,
  }));
}

export default async function ProdutoSlugPage({ params }) {
  const productData = await getProductBySlug(params.slug);

  if (!productData || !productData.data || productData.data.length === 0) {
    return <div>Produto não encontrado.</div>;
  }

  return <ProductViewClient product={productData.data[0]} />;
}