import { getCategoryBySlug, getProductsByCategorySlug, getAllCategoryPaths } from '@/lib/api';
import CategoryProductList from '@/components/CategoryProductList';
import { notFound } from 'next/navigation';

// ✅ ADICIONE ESTA FUNÇÃO
export async function generateStaticParams() {
  const categories = await getAllCategoryPaths();
  return categories.map(category => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    return {
      title: 'Categoria não encontrada',
    };
  }
  return {
    title: `${category.nome} | Tecassistiva`,
    description: `Confira nossos produtos para ${category.nome}.`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const categoryData = await getCategoryBySlug(slug);

  if (!categoryData) {
    notFound();
  }
  
  const products = await getProductsByCategorySlug(slug);
  
  return (
    <CategoryProductList
      title={categoryData.nome}
      products={products}
    />
  );
}