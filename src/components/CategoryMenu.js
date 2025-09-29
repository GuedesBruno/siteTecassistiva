"use client";

import Link from 'next/link';
import { useState } from 'react';

/**
 * Renderiza um menu de navegação lateral para categorias e subcategorias.
 * Destaca a categoria ativa e exibe suas subcategorias.
 * @param {object} props - As propriedades do componente.
 * @param {Array<object>} props.categories - A lista de categorias para exibir.
 * @param {string} props.activeCategorySlug - O slug da categoria atualmente ativa.
 * @param {string} [props.activeSubcategorySlug] - O slug da subcategoria atualmente ativa (opcional).
 */
export default function CategoryMenu({ categories = [], activeCategorySlug, activeSubcategorySlug }) {
  const [isOpen, setIsOpen] = useState(false);
  // Função auxiliar para acessar os atributos de forma segura,
  // já que os dados podem ou não estar aninhados em 'attributes'.
  const getAttrs = (item) => item.attributes || item;

  // Ordena as categorias em ordem alfabética
  const sortedCategories = [...categories].sort((a, b) =>
    getAttrs(a).nome.localeCompare(getAttrs(b).nome)
  );

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md border border-gray-200 md:p-0 md:bg-transparent md:shadow-none md:border-none">
      {/* Botão para expandir/recolher em telas pequenas */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 border border-gray-200 rounded-lg md:hidden"
      >
        <h3 className="font-bold text-lg text-gray-800">Selecione a Categoria</h3>
        <svg
          className={`w-6 h-6 text-gray-600 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Conteúdo do menu (condicionalmente visível em telas pequenas) */}
      <div className={`${isOpen ? 'block' : 'hidden'} mt-4 md:block`}>
        <div className="w-full bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2 hidden md:block">Categorias</h3>
          <nav>
            <ul className="space-y-1">
              {sortedCategories.map((category) => {
                const catAttrs = getAttrs(category);
                const isActive = catAttrs.slug === activeCategorySlug;
                const subcategories = catAttrs.subcategorias?.data || catAttrs.subcategorias || [];
                
                // Ordena as subcategorias em ordem alfabética
                const sortedSubcategories = [...subcategories].sort((a, b) =>
                  getAttrs(a).nome.localeCompare(getAttrs(b).nome)
                );

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
                    {sortedSubcategories.length > 0 && (
                      <ul className="mt-2 pl-4 border-l-2 border-tec-blue-light space-y-1">
                        {sortedSubcategories.map((subcategory) => {
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
      </div>
    </div>
  );
}