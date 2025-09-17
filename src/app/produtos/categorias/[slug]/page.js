// ✅ CORRIGIDO: Importa as funções que realmente existem no seu api.js
import { getAllCategories, getCategoryBySlug } from "@/lib/api";
import CategoryClientView from "@/components/CategoryClientView";

export async function generateStaticParams() {
  const categories = await getAllCategories();

  if (!categories || !categories.data) {
    return [];
  }

  return categories.data.map((category) => ({
    slug: category.attributes.Slug,
  }));
}

export default async function CategoriaSlugPage({ params }) {
  const categoryData = await getCategoryBySlug(params.slug);

  if (!categoryData || !categoryData.data || categoryData.data.length === 0) {
    return <div>Categoria não encontrada.</div>;
  }

  return <CategoryClientView category={categoryData.data[0]} />;
}