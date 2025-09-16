import { getAllCategories } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default async function ProductsPage() {
  const categories = await getAllCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center my-8">Nossos Produtos</h1>

      {categories && categories.length > 0 ? (
        <div className="space-y-12">
          {categories.map((category) => {
            const { nome, slug, subcategorias } = category.attributes;
            const subcategoriesData = subcategorias?.data || [];
            const allProducts = subcategoriesData.flatMap(sub => sub.attributes.produtos?.data || []);

            return (
              <div key={category.id}>
                <h2 className="text-2xl font-bold mb-4">
                  <Link href={`/produtos/categorias/${slug}`} className="hover:underline">
                    {nome}
                  </Link>
                </h2>
                {allProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <p>Nenhum produto nesta categoria.</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">Nenhuma categoria de produto encontrada.</p>
      )}
    </div>
  );
}