import { fetchAPI } from "@/lib/api";
import CategoryClientView from "@/components/CategoryClientView";

// Esta função busca todos os slugs de categoria no momento do build
export async function generateStaticParams() {
  try {
    const categories = await fetchAPI("/categorias", { populate: "*" });

    if (categories && categories.data) {
      return categories.data.map((category) => ({
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
  const categories = await fetchAPI("/categorias", {
    filters: { slug: { $eq: slug } },
    populate: "deep",
  });

  if (!categories || !categories.data || categories.data.length === 0) {
    return <div>Categoria não encontrada.</div>;
  }

  const category = categories.data[0];

  return <CategoryClientView category={category} />;
}