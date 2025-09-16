import { getAllCategories, getCategoryBySlug } from "@/lib/api";
import CategoryClientView from "@/components/CategoryClientView";

// Esta função busca todos os slugs de categoria no momento do build
export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();

    if (categories) {
      return categories.map((category) => ({
        slug: category.attributes.slug,
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to generate static params for categories:", error);
    return [];
  }
}

// Sua página continua aqui...
export default async function CategoriaPage({ params }) {
  const { slug } = params;

  // Lógica para buscar os dados da categoria específica
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return <div>Categoria não encontrada.</div>;
  }

  return <CategoryClientView category={category} />;
}