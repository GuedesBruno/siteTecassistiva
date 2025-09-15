// sitetecassistiva/src/components/CategoryClientView.js

"use client";

import ProductCard from './ProductCard';

export default function CategoryClientView({ category }) {
  if (!category) {
    return <p className="text-center text-red-500">Categoria não encontrada.</p>;
  }

  const { nome, subcategorias } = category.attributes;

  const subcategoriesData = subcategorias?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{nome}</h1>

      {subcategoriesData.length > 0 ? (
        subcategoriesData.map((sub) => {
          const { nome: subNome, produtos } = sub.attributes;
          const productsData = produtos?.data || [];
          
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
      ) : (
        <p>Nenhuma subcategoria encontrada.</p>
      )}
    </div>
  );
}