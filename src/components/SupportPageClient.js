'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaWhatsapp, FaPhoneAlt, FaEnvelope, FaCertificate } from 'react-icons/fa';
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
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'softwares');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); // Estado para o item selecionado (software ou driver)

  // Efeito para atualizar a aba ativa se a URL mudar
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [searchParams, activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedItem(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedItem(null);
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedItem(null);
    setSelectedSubcategory(subcategory);
    const parentCategory = categories.find(cat => 
      cat.attributes.subcategorias?.data?.some(sub => sub.attributes.slug === subcategory.slug)
    );
    setSelectedCategory(parentCategory || null);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  // Função auxiliar para acessar atributos de forma segura
  const getAttrs = (item) => item.attributes || item;

  const productsWithDocs = products.filter(p => getAttrs(p).documentos?.data?.length > 0);
  const relevantCatSlugs = new Set(productsWithDocs.flatMap(p => getAttrs(p).categorias?.data?.map(c => getAttrs(c).slug) || []));
  const relevantSubcatSlugs = new Set(productsWithDocs.flatMap(p => getAttrs(p).subcategorias?.data?.map(s => getAttrs(s).slug)).filter(Boolean));

  categories.forEach(cat => {
      const hasRelevantSubcat = (getAttrs(cat).subcategorias?.data || []).some(sub => relevantSubcatSlugs.has(getAttrs(sub).slug));
      if (hasRelevantSubcat) {
          relevantCatSlugs.add(getAttrs(cat).slug);
      }
  });

  const filteredCategoriesForMenu = categories
      .filter(cat => relevantCatSlugs.has(cat.attributes.slug))
      .map(cat => {
          const catAttrs = getAttrs(cat);
          return {
              ...catAttrs,
              id: cat.id,
              subcategorias: (catAttrs.subcategorias?.data || []).filter(sub => relevantSubcatSlugs.has(getAttrs(sub).slug)).map(s => ({...getAttrs(s), id: s.id}))
          };
      });

  const filteredProducts = productsWithDocs.filter(product => {
    const pAttrs = getAttrs(product);
    if (selectedSubcategory) return pAttrs.subcategorias?.data?.some(s => getAttrs(s).slug === selectedSubcategory.slug);
    if (selectedCategory) return pAttrs.categorias?.data?.some(cat => getAttrs(cat).slug === selectedCategory.slug);
    return true;
  });

  const softwares = software
    .filter(s => s?.attributes?.tipo === 'Software')
    .sort((a, b) => a.attributes.nome.localeCompare(b.attributes.nome));

  const drivers = software
    .filter(s => s?.attributes && (s.attributes.tipo === 'Driver' || s.attributes.tipo === 'Utilitario'))
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
      case 'contato':
        return null;
      default:
        return null;
    }
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'documentos':
        return filteredProducts.length > 0 ? (
          <div className="flex flex-col">
            {filteredProducts.map(product => <DocumentListItem key={product.id} product={getAttrs(product)} />)}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">Nenhum documento encontrado para a seleção atual.</p>
        );
      case 'softwares':
      case 'drivers':
        if (selectedItem) {
          return <SoftwareListItem software={selectedItem} />;
        }
        const itemsToShow = activeTab === 'softwares' ? softwares : drivers;
        return (
          <div className="flex flex-col space-y-4">
            {itemsToShow.map(item => (
              <SoftwareListItem key={item.id} software={item} />
            ))}
          </div>
        );
      case 'contato':
        return (
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Fale com nosso Suporte Técnico</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                      <div className="flex items-start">
                          <FaPhoneAlt className="text-blue-600 mt-1 mr-4 flex-shrink-0" size={20} />
                          <div>
                              <h3 className="font-semibold text-lg">Telefone</h3>
                              <p className="text-gray-600">+55 (11) 3266-4311</p>
                              <p className="text-sm text-gray-500">Ao ligar, escolha a <span className="font-bold">opção 2</span> para ser direcionado ao Suporte.</p>
                          </div>
                      </div>
                      <div className="flex items-start">
                          <FaWhatsapp className="text-green-500 mt-1 mr-4 flex-shrink-0" size={22} />
                          <div>
                              <h3 className="font-semibold text-lg">WhatsApp</h3>
                              <p className="text-gray-600">+55 (11) 9 9597-8139</p>
                              <p className="text-sm text-gray-500">Ao iniciar a conversa, escolha a <span className="font-bold">opção 2</span> no menu para falar com o Suporte.</p>
                          </div>
                      </div>
                      <div className="flex items-start">
                          <FaEnvelope className="text-red-500 mt-1 mr-4 flex-shrink-0" size={20} />
                          <div>
                              <h3 className="font-semibold text-lg">E-mail</h3>
                              <p className="text-gray-600">suporte@tecassistiva.com.br</p>
                          </div>
                      </div>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 flex items-start">
                      <FaCertificate className="text-blue-600 mt-1 mr-4 flex-shrink-0" size={24} />
                      <div>
                          <h3 className="font-semibold text-lg text-blue-800">Equipe Certificada</h3>
                          <p className="text-gray-700 mt-2">Nossos técnicos são treinados e certificados diretamente pelas fabricantes dos produtos. Como representantes oficiais da maioria das marcas que trabalhamos, garantimos um suporte especializado e de alta qualidade para você.</p>
                      </div>
                  </div>
              </div>
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
            <nav className="-mb-px flex flex-wrap" aria-label="Tabs">
              <TabButton label="Softwares" isActive={activeTab === 'softwares'} onClick={() => handleTabClick('softwares')} />
              <TabButton label="Manuais e Documentos" isActive={activeTab === 'documentos'} onClick={() => handleTabClick('documentos')} />
              <TabButton label="Drivers e Utilitários" isActive={activeTab === 'drivers'} onClick={() => handleTabClick('drivers')} />
              <TabButton label="Contato do Suporte" isActive={activeTab === 'contato'} onClick={() => handleTabClick('contato')} />
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