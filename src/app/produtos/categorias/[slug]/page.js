// ✅ CORRIGIDO: Importa as funções que realmente existem no seu api.js
import { getAllCategories, getCategoryBySlug } from "@/lib/api";
import CategoryClientView from "@/components/CategoryClientView";

async function generateStaticParamsImpl() {
  try {
    const categories = await getAllCategories();

    if (!categories || categories.length === 0) return [];

    return categories.map(c => ({ slug: c.attributes?.slug || c.slug })).filter(Boolean);
  } catch (err) {
    console.error('generateStaticParams (categorias) failed:', err.message);
    return [];
  }
}

export const generateStaticParams = generateStaticParamsImpl;

export default async function CategoriaSlugPage({ params }) {
  const categoryData = await getCategoryBySlug(params.slug);

  if (!categoryData || !categoryData.data || categoryData.data.length === 0) {
    return <div>Categoria não encontrada.</div>;
  }

  return <CategoryClientView category={categoryData.data[0]} />;
}