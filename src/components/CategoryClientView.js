// sitetecassistiva/src/components/CategoryClientView.js

"use client";

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function CategoryClientView({ category }) {
  if (!category) {
    return <p className="text-center text-red-500">Categoria não encontrada.</p>;
  }

  const attrs = category.attributes || category;
  const nome = attrs.nome || 'Categoria';

  const subcategoriesData = attrs.subcategorias?.data || attrs.subcategorias || [];
  const directProducts = attrs.produtos?.data || attrs.produtos || [];

  const [fallbackProducts, setFallbackProducts] = useState(null);
  const [loadingFallback, setLoadingFallback] = useState(false);
  const [fallbackError, setFallbackError] = useState(null);

  useEffect(() => {
    // If there are no direct products and no products inside subcategories, try the fallback API.
    const hasProductsInsideSubs = (subcategoriesData && subcategoriesData.some(sub => {
      const sAttrs = sub.attributes || sub;
      const p = sAttrs.produtos?.data || sAttrs.produtos || [];
      return (p && p.length > 0);
    }));

    if ((!directProducts || directProducts.length === 0) && !hasProductsInsideSubs) {
      setLoadingFallback(true);
      fetch(`/api/products-by-category?slug=${encodeURIComponent(attrs.slug || attrs)} `)
        .then(r => r.json())
        .then(j => {
          setFallbackProducts(j.data || []);
        })
        .catch(err => setFallbackError(err.message || String(err)))
        .finally(() => setLoadingFallback(false));
    }
  }, [category]);

  // helper to render a grid of products
  const renderGrid = (products) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );

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
                renderGrid(productsData)
              ) : (
                <p>Nenhum produto nesta subcategoria.</p>
              )}
            </div>
          );
        })
      ) : directProducts && directProducts.length > 0 ? (
        renderGrid(directProducts)
      ) : (
        <div>
          {loadingFallback ? (
            <p>Carregando produtos...</p>
          ) : fallbackError ? (
            <p className="text-red-500">Erro ao carregar produtos: {fallbackError}</p>
          ) : fallbackProducts && fallbackProducts.length > 0 ? (
            renderGrid(fallbackProducts)
          ) : (
            <p>Nenhum produto encontrado nesta categoria.</p>
          )}
        </div>
      )}
    </div>
  );
}