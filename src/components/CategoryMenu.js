"use client";

import Link from 'next/link';

/**
 * Renderiza um menu de navegação lateral para categorias e subcategorias.
 * Destaca a categoria ativa e exibe suas subcategorias.
 * @param {object} props - As propriedades do componente.
 * @param {Array<object>} props.categories - A lista de categorias para exibir.
 * @param {string} props.activeCategorySlug - O slug da categoria atualmente ativa.
 * @param {string} [props.activeSubcategorySlug] - O slug da subcategoria atualmente ativa (opcional).
 */
export default function CategoryMenu({ categories = [], activeCategorySlug, activeSubcategorySlug }) {
  // Função auxiliar para acessar os atributos de forma segura,
  // já que os dados podem ou não estar aninhados em 'attributes'.
  const getAttrs = (item) => item.attributes || item;

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Categorias</h3>
      <nav>
        <ul className="space-y-1">
          {categories.map((category) => {
            const catAttrs = getAttrs(category);
            const isActive = catAttrs.slug === activeCategorySlug;
            const subcategories = catAttrs.subcategorias?.data || catAttrs.subcategorias || [];

            return (
              <li key={catAttrs.slug}>
                <Link
                  href={`/produtos/categorias/${catAttrs.slug}`}
                  className={`block w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-tec-blue text-white font-semibold shadow-sm'
                      : 'text-gray-800 hover:bg-gray-100 hover:text-tec-blue'
                  }`}
                >
                  {catAttrs.nome}
                </Link>
                {subcategories.length > 0 && (
                  <ul className="mt-2 pl-4 border-l-2 border-tec-blue-light space-y-1">
                    {subcategories.map((subcategory) => {
                      const subAttrs = getAttrs(subcategory);
                      const isSubActive = subAttrs.slug === activeSubcategorySlug;
                      return (
                        <li key={subAttrs.slug}>
                          <Link
                            href={`/produtos/categorias/${catAttrs.slug}/${subAttrs.slug}`}
                            className={`block px-4 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                              isSubActive
                                ? 'font-bold text-tec-blue bg-gray-100' // Estilo para subcategoria ativa
                                : 'text-gray-700 hover:text-tec-blue hover:bg-gray-100'
                            }`}
                          >
                            {subAttrs.nome}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}