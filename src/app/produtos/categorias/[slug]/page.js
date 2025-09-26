import { getCategoryBySlug, getAllCategories, getAllCategoryPaths } from '@/lib/api';
import CategoryProductList from '@/components/CategoryProductList';
import CategoryMenu from '@/components/CategoryMenu';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

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
  
  // Fetch data in parallel
  const [categoryData, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getAllCategories()
  ]);

  if (!categoryData || !categoryData.data || categoryData.data.length === 0) {
    notFound();
  }
  
  const category = categoryData.data[0].attributes;

  const breadcrumbs = [
    { name: 'Página Inicial', path: '/' },
    { name: 'Produtos', path: '/produtos' },
    { name: 'Categorias', path: '/produtos/categorias' },
    { name: category.nome, path: `/produtos/categorias/${category.slug}` },
  ];

  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-4 py-8 px-8">
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <CategoryMenu
          categories={allCategories}
          activeCategorySlug={slug}
        />
      </aside>
      <main className="w-full md:w-3/4 lg:w-4/5 px-2 md:px-4 lg:px-6">
        <Breadcrumbs items={breadcrumbs} />
        <Suspense fallback={<div>Carregando...</div>}>
          <CategoryProductList
            category={category}
          />
        </Suspense>
      </main>
    </div>
  );
}