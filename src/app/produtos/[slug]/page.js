// sitetecassistiva/src/app/produtos/page.js

import CategoryProductList from "@/components/CategoryProductList";
import { fetchAPI } from "@/lib/api";

async function getAllCategoriesWithProducts() {
  try {
    const categories = await fetchAPI("/categorias", {
      populate: {
        subcategorias: {
          populate: {
            produtos: {
              populate: "imagem_principal",
            },
          },
        },
      },
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch all categories:", error);
    return []; // Retorna array vazio em caso de erro
  }
}

export default async function ProductsPage() {
  const categories = await getAllCategoriesWithProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Nossos Produtos</h1>
      <CategoryProductList categories={categories} />
    </div>
  );
}