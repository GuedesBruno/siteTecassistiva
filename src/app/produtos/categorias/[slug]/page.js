// Arquivo: src/app/produtos/categorias/[slug]/page.js
import CategoryClientView from "@/components/CategoryClientView";
import { staticCategories } from "@/lib/static-data";

export default function CategoriaSlugPage({ params }) {
  // Encontra a categoria pelo slug ou pega a primeira como fallback
  const category = staticCategories.find(c => c.attributes.Slug === params.slug) || staticCategories[0];

  if (!category) {
    return <div>Categoria não encontrada.</div>;
  }

  return <CategoryClientView category={category} />;
}