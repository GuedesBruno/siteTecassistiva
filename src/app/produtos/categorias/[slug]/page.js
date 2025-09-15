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
              populate: "imagem_principal"
            }
          }
        }
      }
    });
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

// **CORREÇÃO AQUI**
export async function generateStaticParams() {
    const categories = await fetchAPI("/categorias");
    // Se a API falhar, categories será null. Retornamos um array vazio.
    if (!Array.isArray(categories)) {
        return [];
    }
    return categories.map((category) => ({
        slug: category.attributes.slug,
    }));
}