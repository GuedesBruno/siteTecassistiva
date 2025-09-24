import { getCategoryBySlug, getProductsByCategorySlug, getAllCategoryPaths } from '@/lib/api';
import CategoryProductList from '@/components/CategoryProductList';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// ✅ PASSO FINAL: Informa ao Next.js quais páginas de categoria construir


export async function generateStaticParams() {
  const categories = await getAllCategoryPaths();
  // FIX: Aplicando a lógica defensiva
  return categories.map(c => ({
    slug: c.attributes?.slug || c.slug,
  })).filter(c => c.slug);
}

export async function generateMetadata({ params }) {
  const category = await getCategoryBySlug(params.slug);
  // FIX: Aplicando a lógica defensiva
  const categoryAttributes = category?.attributes || category;
  if (!categoryAttributes) {
    return {
      title: 'Categoria não encontrada',
    };
  }
  return {
    title: `${categoryAttributes.nome} | Tecassistiva`,
    description: `Confira nossos produtos para ${categoryAttributes.nome}.`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const categoryData = await getCategoryBySlug(slug);

  if (!categoryData) {
    notFound();
  }
  
  const products = await getProductsByCategorySlug(slug);
  
  // FIX: Aplicando a lógica defensiva
  const categoryName = categoryData?.attributes?.nome || categoryData?.nome || 'Produtos';

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CategoryProductList
        title={categoryName}
        products={products}
      />
    </Suspense>
  );
}