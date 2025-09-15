// src/lib/api.js

// ... (funções existentes) ...

export async function getAllCategoriesWithProducts() {
  const query = qs.stringify({
    populate: {
        subcategorias: {
            populate: {
                produtos: {
                    populate: ['imagem_principal'],
                },
            },
        },
    },
  });
  return fetchAPI(`/api/categorias?${query}`);
}