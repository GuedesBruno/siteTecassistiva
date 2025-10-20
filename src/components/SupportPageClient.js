'use client';

import { useState } from 'react';
import DocumentListItem from './DocumentListItem';
import SoftwareListItem from './SoftwareListItem';
import CategoryMenu from './CategoryMenu';
import SoftwareListMenu from './SoftwareListMenu'; // Novo menu para softwares

const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 font-semibold border-b-4 transition-colors duration-300 ${
      isActive
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
    }`}
  >
    {label}
  </button>
);

export default function SupportPageClient({ products, software, categories }) {
  const [activeTab, setActiveTab] = useState('documentos');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); // Estado para o item selecionado (software ou driver)

  const handleCategorySelect = (category) => {
    setSelectedItem(null);
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedItem(null);
    setSelectedSubcategory(subcategory);
    // Encontra e define a categoria pai para garantir que o filtro funcione
    const parentCategory = categories.find(cat => 
      cat.subcategorias?.some(sub => sub.slug === subcategory.slug)
    );
    setSelectedCategory(parentCategory || null); // Define como nulo se não encontrar
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedItem(null);
  };

  // Filter categories and subcategories to only show those with products that have documents.
  const productsWithDocs = products.filter(p => p.documentos && p.documentos.length > 0);
  const relevantCatSlugs = new Set(productsWithDocs.flatMap(p => p.categorias?.map(c => c.slug) || []));
  const relevantSubcatSlugs = new Set(productsWithDocs.map(p => p.subcategoria?.slug).filter(Boolean));

  categories.forEach(cat => {
      const hasRelevantSubcat = (cat.subcategorias || []).some(sub => relevantSubcatSlugs.has(sub.slug));
      if (hasRelevantSubcat) {
          relevantCatSlugs.add(cat.slug);
      }
  });

  const filteredCategoriesForMenu = categories
      .filter(cat => relevantCatSlugs.has(cat.slug))
      .map(cat => ({
          ...cat,
          subcategorias: (cat.subcategorias || []).filter(sub => relevantSubcatSlugs.has(sub.slug))
      }));

  const filteredProducts = productsWithDocs.filter(product => {
    if (selectedSubcategory) {
      return product.subcategoria?.slug === selectedSubcategory.slug;
    }
    if (selectedCategory) {
      return product.categorias?.some(cat => cat.slug === selectedCategory.slug);
    }
    return true;
  });

  const softwares = software
    .filter(s => s && s.attributes && s.attributes.tipo === 'Software')
    .sort((a, b) => a.attributes.nome.localeCompare(b.attributes.nome));

  const drivers = software
    .filter(s => s && s.attributes && (s.attributes.tipo === 'Driver' || s.attributes.tipo === 'Utilitario'))
    .sort((a, b) => a.attributes.nome.localeCompare(b.attributes.nome));

  const renderSidebarContent = () => {
    switch (activeTab) {
      case 'documentos':
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Categorias</h2>
            <CategoryMenu 
              categories={filteredCategoriesForMenu}
              onCategorySelect={handleCategorySelect}
              onSubcategorySelect={handleSubcategorySelect}
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
            />
          </>
        );

      case 'softwares':
        return <SoftwareListMenu items={softwares} selectedItem={selectedItem} onItemSelect={handleItemSelect} />;
      case 'drivers':
        return <SoftwareListMenu items={drivers} selectedItem={selectedItem} onItemSelect={handleItemSelect} />;
      default:
        return null;
    }
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'documentos':
        return filteredProducts.length > 0 ? (
          <div className="flex flex-col">
            {filteredProducts.map(product => <DocumentListItem key={product.id} product={product} />)}
          </div>
        ) : (
          <p className="text-center text-gray-500">Nenhum documento encontrado para a seleção atual.</p>
        );
      case 'softwares':
      case 'drivers':
        if (selectedItem) {
          // Se um item for selecionado, exibe apenas seus detalhes.
          return <SoftwareListItem software={selectedItem} />;
        }
        // Se nenhum item for selecionado, exibe a lista completa da aba ativa.
        const itemsToShow = activeTab === 'softwares' ? softwares : drivers;
        return (
          <div className="flex flex-col space-y-4">
            {itemsToShow.map(item => (
              <SoftwareListItem key={item.id} software={item} />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Central de Suporte</h1>
        <p className="mt-3 text-lg text-gray-600">Encontre documentos, softwares e drivers para nossos produtos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            {renderSidebarContent()}
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <TabButton label="Documentos" isActive={activeTab === 'documentos'} onClick={() => handleTabClick('documentos')} />
              <TabButton label="Softwares" isActive={activeTab === 'softwares'} onClick={() => handleTabClick('softwares')} />
              <TabButton label="Drivers e Utilitários" isActive={activeTab === 'drivers'} onClick={() => handleTabClick('drivers')} />
            </nav>
          </div>
          <div>
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
}