import ProductListClient from "@/components/ProductListClient";
import { getAllProducts, getAllCategories } from "@/lib/api";

export default async function ProdutosPage() {
  const [productsData, categoriesData] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-10">Nossos Produtos</h1>
      <ProductListClient
        products={productsData?.data || []}
        categories={categoriesData?.data || []}
      />
    </div>
  );
}