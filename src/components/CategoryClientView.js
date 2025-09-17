// sitetecassistiva/src/components/CategoryClientView.js

"use client";

import ProductCard from './ProductCard';

export default function CategoryClientView({ category }) {
  if (!category) {
    return <p className="text-center text-red-500">Categoria não encontrada.</p>;
  }

  const attrs = category.attributes || category;
  const nome = attrs.nome || 'Categoria';

  const subcategoriesData = attrs.subcategorias?.data || attrs.subcategorias || [];
  const directProducts = attrs.produtos?.data || attrs.produtos || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{nome}</h1>

      {subcategoriesData && subcategoriesData.length > 0 ? (
        subcategoriesData.map((sub) => {
          const subAttrs = sub.attributes || sub;
          const subNome = subAttrs.nome;
          const productsData = subAttrs.produtos?.data || subAttrs.produtos || [];

          return (
            <div key={sub.id} className="mb-10">
              <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">{subNome}</h2>
              {productsData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {productsData.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p>Nenhum produto nesta subcategoria.</p>
              )}
            </div>
          );
        })
      ) : directProducts && directProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {directProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>Nenhum produto encontrado nesta categoria.</p>
      )}
    </div>
  );
}