import ProductListClient from "@/components/ProductListClient";
import { getAllProductsForDisplay, getAllCategories } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryMenu from "@/components/CategoryMenu"; // Importar o CategoryMenu

export default async function ProdutosPage() {
  const [products, categories] = await Promise.all([
    getAllProductsForDisplay(),
    getAllCategories(),
  ]);

  const breadcrumbs = [
    { name: 'Página Inicial', path: '/' },
    { name: 'Produtos', path: '/produtos' },
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto flex flex-col md:flex-row gap-4 px-4">
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <CategoryMenu categories={categories} />
      </aside>
      <main className="w-full md:w-3/4 lg:w-4/5">
        <Breadcrumbs items={breadcrumbs} />
        <ProductListClient
          products={products || []}
          // categories não é mais necessário aqui, pois o CategoryMenu já as recebe
        />
      </main>
      </div>
    </div>
  );
}