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

// Get category slugs from search-data.json (generated at build time)
// This avoids calling the API during static generation
async function getCategorySlugsFromSearchData() {
  try {
    const searchDataPath = path.join(process.cwd(), 'public', 'search-data.json');
    const searchData = JSON.parse(fs.readFileSync(searchDataPath, 'utf-8'));
    
    // Extract unique category slugs from search data
    const categoryMap = new Map();
    searchData.forEach(item => {
      if (item.type === 'Produto' && item.categories) {
        // Assuming categories might have slugs or we need to extract them
        // For now, store the category name/slug
        const catName = item.categories;
        if (catName && !categoryMap.has(catName)) {
          categoryMap.set(catName, { slug: catName.toLowerCase().replace(/\s+/g, '-') });
        }
      }
    });
    
    return Array.from(categoryMap.values());
  } catch (error) {
    console.error('Error reading category slugs from search-data.json:', error);
    return [];
  }
}

export async function generateStaticParams() {
  // Get slugs from pre-generated search data instead of calling API
  const categorySlugs = await getCategorySlugsFromSearchData();
  
  if (!categorySlugs || categorySlugs.length === 0) {
    console.warn('No category slugs found in search-data.json');
    return [];
  }
  
  console.log(`Generating ${categorySlugs.length} category pages...`);
  return categorySlugs;
}

export async function generateMetadata({ params }) {
  // Return minimal metadata - full metadata loads on-demand with ISR
  // This prevents API calls during static generation
  try {
    const category = await getCategoryBySlug(params.slug);
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
  } catch (error) {
    // During build, return minimal metadata
    return {
      title: 'Produtos | Tecassistiva',
      description: 'Confira nossos produtos.',
    };
  }
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
    <div className="py-8">
    <div className="flex flex-col md:flex-row py-8 px-8">
      <aside className="w-full md:w-1/4 lg:w-1/5 md:pr-2">
        <CategoryMenu
          categories={allCategories}
          activeCategorySlug={slug}
        />
      </aside>
      <main className="w-full md:w-3/4 lg:w-4/5 md:pl-2">
        <Breadcrumbs items={breadcrumbs} />
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