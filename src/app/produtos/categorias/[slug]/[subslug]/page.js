import { getSubcategoryBySlug, getProductsBySubcategorySlug, getAllCategoryPaths } from '@/lib/api';
import CategoryProductList from '@/components/CategoryProductList';
import { notFound } from 'next/navigation';

// ✅ ADICIONE ESTA FUNÇÃO
export async function generateStaticParams() {
  const categories = await getAllCategoryPaths();

  const paths = categories.flatMap(category => 
    (category.subcategorias || []).map(sub => ({
      slug: category.slug,
      subslug: sub.slug,
    }))
  );

  return paths;
}

export async function generateMetadata({ params }) {
  const subcategory = await getSubcategoryBySlug(params.subslug);
  if (!subcategory) {
    return {
      title: 'Subcategoria não encontrada',
    };
  }
  return {
    title: `${subcategory.nome} | Tecassistiva`,
    description: `Produtos da subcategoria ${subcategory.nome}.`,
  };
}

export default async function SubcategoryPage({ params }) {
  const { subslug } = params;
  const subcategoryData = await getSubcategoryBySlug(subslug);
  
  if (!subcategoryData) {
    notFound();
  }

  const products = await getProductsBySubcategorySlug(subslug);

  return (
    <CategoryProductList
      title={subcategoryData.nome}
      products={products}
    />
  );
}