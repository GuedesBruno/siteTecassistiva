// ✅ CORRIGIDO: Importa as funções que realmente existem no seu api.js
import { getAllProducts, getProductBySlug } from "@/lib/api";
import ProductViewClient from "@/components/ProductViewClient";

// ✅ CORRIGIDO: Usa getFeaturedProducts para buscar os slugs
export async function generateStaticParams() {
  try {
    const products = await getAllProducts();

    if (!products || products.length === 0) return [];

    // Mapeia slugs diretamente — não fazemos validação por slug (reduz riscos de falha no build)
    return products.map(p => ({ slug: p.attributes?.slug || p.slug })).filter(Boolean);
  } catch (err) {
    console.error('generateStaticParams (produtos) failed:', err.message);
    return [];
  }
}

export default async function ProdutoSlugPage({ params }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return <div>Produto não encontrado.</div>;
  }

  return <ProductViewClient product={product} />;
}