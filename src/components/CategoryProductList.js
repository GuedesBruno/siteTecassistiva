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
    
    // Se não, junta os produtos de todas as subcategorias da categoria principal
    const allProducts = category.subcategorias?.flatMap(sub => sub.produtos || []) || [];
    return {
      productsToShow: allProducts,
      title: category.nome
    };
    
  }, [category, subCategorySlug]);

  return (
    <>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">{title}</h1>
      {productsToShow.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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