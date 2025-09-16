import { getAllCategories, getCategoryBySlug } from "@/lib/api";
import CategoryClientView from "@/components/CategoryClientView";

// Esta função busca todos os slugs de categoria no momento do build
export async function generateStaticParams() {
  const categories = await getAllCategories();
  if (!categories) return [];
  return categories.map((category) => ({
    slug: category.attributes.slug,
  }));
}

// Sua página continua aqui...
export default async function CategoriaPage({ params }) {
  const { slug } = params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return <div>Categoria não encontrada.</div>;
  }

  return <CategoryClientView category={category} />;
}