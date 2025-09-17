import ProductListClient from "@/components/ProductListClient";
// ✅ CORRIGIDO: Importa getFeaturedProducts no lugar de getAllProducts
import { getFeaturedProducts, getAllCategories } from "@/lib/api";

export default async function ProdutosPage() {
    // ✅ CORRIGIDO: Chama a função correta
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getAllCategories(),
  ]);

  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-10">Nossos Produtos</h1>
      <ProductListClient
        products={products || []}
        categories={categories || []}
      />
    </div>
  );
}