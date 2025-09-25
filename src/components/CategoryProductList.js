'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

export default function ProductListClient({ category }) {
  const searchParams = useSearchParams();
  const subCategorySlug = searchParams.get('sub');
  
  // Usamos useMemo para filtrar os produtos apenas quando a URL muda
  const { productsToShow, title } = useMemo(() => {
    if (!category) {
      return { productsToShow: [], title: 'Carregando...' };
    }

    // Se uma subcategoria estiver selecionada na URL, mostra apenas os produtos dela
    if (subCategorySlug) {
      const activeSubCategory = category.subcategorias?.find(sub => sub.slug === subCategorySlug);
      return {
        productsToShow: activeSubCategory?.produtos || [],
        title: activeSubCategory?.nome || category.nome
      };
    } 
    
    // Junta produtos diretos da categoria e produtos das subcategorias
    const directProducts = category.produtos || [];
    const productsFromSubcategories = category.subcategorias?.flatMap(sub => sub.produtos || []) || [];
    
    // Evita duplicatas caso um produto esteja em ambos os lugares
    const allProductsMap = new Map();
    [...directProducts, ...productsFromSubcategories].forEach(p => allProductsMap.set(p.id, p));
    const allProducts = Array.from(allProductsMap.values());

    return {
      productsToShow: allProducts,
      title: category.nome
    };
    
  }, [category, subCategorySlug]);

  return (
    <>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">{title}</h1>
      {productsToShow.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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