
'use client';

import { useState } from 'react';
import DocumentCard from './DocumentCard';
import SoftwareCard from './SoftwareCard';
import CategoryMenu from './CategoryMenu'; // Reutilizando o menu de categorias

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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null); // Reset subcategory when a new category is selected
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };
  
  const filteredProducts = products.filter(product => {
    if (!selectedCategory) return true;
    
    const inCategory = product.attributes.categorias.data.some(cat => cat.slug === selectedCategory.slug);
    if (!selectedSubcategory) return inCategory;

    const inSubcategory = product.attributes.subcategoria?.data?.slug === selectedSubcategory.slug;
    return inCategory && inSubcategory;
  });

  const softwares = software.filter(s => s.attributes.tipo === 'Software');
  const drivers = software.filter(s => s.attributes.tipo === 'Driver' || s.attributes.tipo === 'Utilitario');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Central de Suporte</h1>
        <p className="mt-3 text-lg text-gray-600">Encontre documentos, softwares e drivers para nossos produtos.</p>
      </header>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <TabButton label="Documentos" isActive={activeTab === 'documentos'} onClick={() => setActiveTab('documentos')} />
          <TabButton label="Softwares" isActive={activeTab === 'softwares'} onClick={() => setActiveTab('softwares')} />
          <TabButton label="Drivers e Utilitários" isActive={activeTab === 'drivers'} onClick={() => setActiveTab('drivers')} />
        </nav>
      </div>

      <div>
        {activeTab === 'documentos' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-2xl font-bold mb-4">Categorias</h2>
                <CategoryMenu 
                  categories={categories}
                  onCategorySelect={handleCategorySelect}
                  onSubcategorySelect={handleSubcategorySelect}
                  selectedCategory={selectedCategory}
                  selectedSubcategory={selectedSubcategory}
                />
              </div>
            </aside>
            <main className="lg:col-span-3">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProducts.map(product => (
                    <DocumentCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 col-span-full">Nenhum documento encontrado para a seleção atual.</p>
              )}
            </main>
          </div>
        )}

        {activeTab === 'softwares' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {softwares.map(item => (
              <SoftwareCard key={item.id} software={item} />
            ))}
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {drivers.map(item => (
              <SoftwareCard key={item.id} software={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
