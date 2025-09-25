import ProductListClient from "@/components/ProductListClient";
import { getAllProductsForDisplay, getAllCategories } from "@/lib/api";

export default async function ProdutosPage() {
  const [products, categories] = await Promise.all([
    getAllProductsForDisplay(),
    getAllCategories(),
  ]);

  return (
    <div>
      <ProductListClient
        products={products || []}
        categories={categories || []}
      />
    </div>
  );
}