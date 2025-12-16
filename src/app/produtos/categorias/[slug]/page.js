import CategoryProductList from '@/components/CategoryProductList';
import CategoryMenu from '@/components/CategoryMenu';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import fs from 'fs';
import path from 'path';

// Lazy load API functions to avoid compilation during SSG
async function getCategoryBySlug(slug) {
  const { getCategoryBySlug: _getCategoryBySlug } = await import('@/lib/api');
  return _getCategoryBySlug(slug);
}

async function getAllCategories() {
  const { getAllCategories: _getAllCategories } = await import('@/lib/api');
  return _getAllCategories();
}

async function getAllCategoryPaths() {
  const { getAllCategoryPaths: _getAllCategoryPaths } = await import('@/lib/api');
  return _getAllCategoryPaths();
}

export async function generateStaticParams() {
  const categories = await getAllCategoryPaths();

  return categories.map(category => ({
    slug: (category.attributes || category).slug,
  }));
}

export async function generateMetadata({ params }) {
  return {
    title: 'Produtos | Tecassistiva',
    description: 'Confira nossos produtos.',
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = params;

  // Busca os dados em paralelo
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
    { name: category.nome, path: `/produtos/categorias/${category.slug}` },
  ];

  return (
    <div className="container mx-auto px-4 py-3">
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex flex-col md:flex-row gap-8 mt-6">
        <aside className="w-full md:w-1/3 lg:w-1/4">
          <CategoryMenu
            categories={allCategories}
            activeCategorySlug={slug}
          />
        </aside>
        <main className="w-full md:w-2/3 lg:w-3/4">
          <Suspense fallback={<div>Carregando...</div>}>
            <CategoryProductList
              category={category}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}