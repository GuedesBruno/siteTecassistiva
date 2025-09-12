'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function ProductListClient({ category }) {
  const searchParams = useSearchParams();
  const subCategorySlug = searchParams.get('sub');
  
  // Usamos useMemo para filtrar os produtos apenas quando a URL muda
  const { productsToShow, title, breadcrumb } = useMemo(() => {
    if (!category) {
      return { productsToShow: [], title: 'Carregando...', breadcrumb: null };
    }

    if (subCategorySlug) {
      const activeSubCategory = category.subcategorias?.find(sub => sub.slug === subCategorySlug);
      return {
        productsToShow: activeSubCategory?.produtos || [],
        title: activeSubCategory?.nome || category.nome,
        breadcrumb: activeSubCategory?.nome || null
      };
    } else {
      const allProducts = category.subcategorias?.flatMap(sub => sub.produtos || []) || [];
      return {
        productsToShow: allProducts,
        title: category.nome,
        breadcrumb: null
      };
    }
  }, [category, subCategorySlug]);

  return (
    <>
      {/* O Breadcrumb é atualizado aqui no cliente */}
      <div className="text-sm text-gray-500 mb-6 -mt-12 lg:hidden">
          <Link href="/" className="hover:underline">Página Inicial</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/produtos" className="hover:underline">Produtos</Link>
          <span className="mx-2">&gt;</span>
          {breadcrumb ? (
              <>
                <Link href={`/produtos/categorias/${category.slug}`} className="hover:underline">{category.nome}</Link>
                <span className="mx-2">&gt;</span>
                <span className="font-semibold text-gray-700">{breadcrumb}</span>
              </>
          ) : (
            <span className="font-semibold text-gray-700">{category.nome}</span>
          )}
      </div>

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