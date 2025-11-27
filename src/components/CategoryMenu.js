"use client";

import Link from 'next/link';
import { useState } from 'react';

/**
 * Renderiza um menu de navegação lateral para categorias e subcategorias.
 * Suporta dois modos de operação:
 * 1. Modo Callback (com `onCategorySelect`): Renderiza botões para manipulação de estado no cliente.
 * 2. Modo Link (sem `onCategorySelect`): Renderiza links de navegação padrão do Next.js.
 */
export default function CategoryMenu({
  categories = [],
  // Props para o modo Callback
  onCategorySelect,
  onSubcategorySelect,
  selectedCategory,
  selectedSubcategory,
  // Props para o modo Link
  activeCategorySlug,
  activeSubcategorySlug,
  basePath = '/produtos/categorias', // Caminho padrão para os links
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isCallbackMode = typeof onCategorySelect === 'function';

  const getAttrs = (item) => item.attributes || item;

  const sortedCategories = [...categories].sort((a, b) =>
    getAttrs(a).nome.localeCompare(getAttrs(b).nome)
  );

  const handleCategoryClick = (category) => {
    if (isCallbackMode) {
      onCategorySelect(getAttrs(category));
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    if (isCallbackMode && onSubcategorySelect) {
      onSubcategorySelect(getAttrs(subcategory));
    }
  };

  const renderItem = (item, isSub = false, parentCategorySlug = null) => {
    const attrs = getAttrs(item);
    const slug = attrs.slug;
    const parentSlug = parentCategorySlug || (isSub ? activeCategorySlug || selectedCategory?.slug : undefined);

    const isActive = isSub
      ? (isCallbackMode ? selectedSubcategory?.slug === slug : activeSubcategorySlug === slug)
      : (isCallbackMode ? selectedCategory?.slug === slug : activeCategorySlug === slug);

    const commonClasses = `block w-full text-left px-4 transition-colors duration-200 rounded-md ${isSub ? 'py-1.5 text-sm' : 'py-2'}`;
    
    const activeClasses = isSub 
      ? 'font-bold text-tec-blue bg-gray-100' 
      : 'bg-tec-blue text-white font-semibold shadow-sm';
      
    const inactiveClasses = isSub 
      ? 'text-gray-700 hover:text-tec-blue hover:bg-gray-100' 
      : 'text-gray-800 hover:bg-gray-100 hover:text-tec-blue';

    const className = `${commonClasses} ${isActive ? activeClasses : inactiveClasses}`;

    if (isCallbackMode) {
      return (
        <button onClick={() => isSub ? handleSubcategoryClick(item) : handleCategoryClick(item)} className={className}>
          {attrs.nome}
        </button>
      );
    }

    const href = isSub ? `${basePath}/${parentSlug}/${slug}` : `${basePath}/${slug}`;
    return (
      <Link href={href} className={className}>
        {attrs.nome}
      </Link>
    );
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md border border-gray-200 md:p-0 md:bg-transparent md:shadow-none md:border-none">
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

      <div className={`${isOpen ? 'block' : 'hidden'} mt-4 md:block`}>
        <div className="w-full bg-white p-4 rounded-lg shadow-md border border-gray-200">
          
          <nav>
            <ul className="space-y-1">
              {sortedCategories.map((category) => {
                const catAttrs = getAttrs(category);
                const isActive = isCallbackMode ? 
                  selectedCategory?.slug === catAttrs.slug : 
                  activeCategorySlug === catAttrs.slug;
                
                // Lidar com ambas estruturas: .data ou array direto
                const subcategories = Array.isArray(catAttrs.subcategorias) 
                  ? catAttrs.subcategorias 
                  : (catAttrs.subcategorias?.data || []);
                const sortedSubcategories = [...subcategories].sort((a, b) =>
                  getAttrs(a).nome.localeCompare(getAttrs(b).nome)
                );

                return (
                  <li key={catAttrs.slug}>
                    {renderItem(category, false)}
                    {sortedSubcategories.length > 0 && (
                      <ul className="mt-2 pl-4 border-l-2 border-tec-blue-light space-y-1">
                        {sortedSubcategories.map((subcategory) => (
                          <li key={getAttrs(subcategory).slug}>
                            {renderItem(subcategory, true, catAttrs.slug)}
                          </li>
                        ))}
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