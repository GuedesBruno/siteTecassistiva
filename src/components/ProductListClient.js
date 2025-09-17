'use client';

import { useMemo } from 'react';
import ProductCard from '@/components/ProductCard';

export default function ProductListClient({ category, subCategorySlug, products }) {
  
  // Se um array de `products` for passado diretamente (página Produtos), usamos ele.
  // Caso contrário, caímos na lógica anterior que usa `category` + `subCategorySlug`.
  const { productsToShow, title } = useMemo(() => {
    if (Array.isArray(products) && products.length > 0) {
      return { productsToShow: products, title: 'Produtos em destaque' };
    }

    if (!category) {
      return { productsToShow: [], title: 'Carregando...' };
    }

    if (subCategorySlug) {
      const activeSubCategory = category.subcategorias?.find(sub => sub.slug === subCategorySlug);
      return {
        productsToShow: activeSubCategory?.produtos || [],
        title: activeSubCategory?.nome || category.nome
      };
    } else {
      const allProducts = category.subcategorias?.flatMap(sub => sub.produtos || []) || [];
      return {
        productsToShow: allProducts,
        title: category.nome
      };
    }
  }, [category, subCategorySlug, products]);

  return (
    <>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">{title}</h1>
      {productsToShow.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsToShow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Nenhum produto encontrado para esta seleção.</p>
      )}
    </>
  );
}