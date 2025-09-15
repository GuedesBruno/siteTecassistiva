// sitetecassistiva/src/app/produtos/categorias/[slug]/page.js

import { fetchAPI } from "@/lib/api";
import CategoryClientView from "@/components/CategoryClientView";

async function getCategoryBySlug(slug) {
  try {
    const categories = await fetchAPI("/categorias", {
      filters: { slug: { $eq: slug } },
      populate: {
        subcategorias: {
          populate: {
            produtos: {
              populate: "imagem_principal" // Popula a imagem principal dos produtos
            }
          }
        }
      }
    });

    // A API retorna um array, pegamos o primeiro elemento
    return categories && categories.length > 0 ? categories[0] : null;
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return null;
  }
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return <div>Categoria não encontrada.</div>;
  }

  return <CategoryClientView category={category} />;
}

// Opcional: Gerar rotas estáticas para melhor performance
export async function generateStaticParams() {
    const categories = await fetchAPI("/categorias");
    return categories.map((category) => ({
        slug: category.attributes.slug,
    }));
}