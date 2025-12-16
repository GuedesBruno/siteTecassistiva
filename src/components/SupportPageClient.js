'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaWhatsapp, FaPhoneAlt, FaEnvelope, FaCertificate } from 'react-icons/fa';
import DocumentListItem from './DocumentListItem';
import SoftwareListItem from './SoftwareListItem';
import CategoryMenu from './CategoryMenu';
import SoftwareListMenu from './SoftwareListMenu';


const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 font-semibold border-b-4 transition-colors duration-300 ${isActive
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
  }, [tabFromUrl]);

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

  const productsWithDocs = products.filter(p => {
    const attrs = getAttrs(p);
    const docsArray = Array.isArray(attrs.documentos) ? attrs.documentos : (attrs.documentos?.data || []);
    return docsArray.length > 0;
  });

  // DEBUG: Log para verificar a estrutura dos dados (apenas em desenvolvimento)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    if (productsWithDocs.length > 0) {
      // console.log('Primeiro produto com docs:', getAttrs(productsWithDocs[0]));
    }
  }

  // Função auxiliar para extrair slugs de relacionamentos (funciona com .data ou diretamente)
  const extractSlugs = (items) => {
    if (!items) return [];
    // Se for um array direto
    if (Array.isArray(items)) {
      return items
        .filter(item => item) // Filtra itens null/undefined
        .map(item => (item.attributes?.slug || item.slug))
        .filter(Boolean);
    }
    // Se for um objeto com .data
    if (items.data && Array.isArray(items.data)) {
      return items.data
        .filter(item => item) // Filtra itens null/undefined
        .map(item => (item.attributes?.slug || item.slug))
        .filter(Boolean);
    }
    return [];
  };

  const relevantCatSlugs = new Set(productsWithDocs.flatMap(p => extractSlugs(getAttrs(p).categorias)));
  const relevantSubcatSlugs = new Set(productsWithDocs.flatMap(p => extractSlugs(getAttrs(p).subcategorias)));

  categories.forEach(cat => {
    const catAttrs = getAttrs(cat);
    const subcatSlugs = extractSlugs(catAttrs.subcategorias);
    const hasRelevantSubcat = subcatSlugs.some(subslug => relevantSubcatSlugs.has(subslug));
    if (hasRelevantSubcat) {
      relevantCatSlugs.add(catAttrs.slug);
    }
  });

  const filteredCategoriesForMenu = categories
    .filter(cat => cat && relevantCatSlugs.has(getAttrs(cat).slug))
    .map(cat => {
      const catAttrs = getAttrs(cat);
      const subcategoriesData = Array.isArray(catAttrs.subcategorias)
        ? catAttrs.subcategorias
        : (catAttrs.subcategorias?.data || []);
      return {
        ...catAttrs,
        id: cat.id,
        subcategorias: subcategoriesData
          .filter(sub => sub && relevantSubcatSlugs.has(getAttrs(sub).slug))
          .map(s => ({ ...getAttrs(s), id: s.id }))
      };
    });

  const filteredProducts = productsWithDocs.filter(product => {
    const pAttrs = getAttrs(product);
    if (selectedSubcategory) {
      const subcatSlugs = extractSlugs(pAttrs.subcategorias);
      return subcatSlugs.includes(selectedSubcategory.slug);
    }
    if (selectedCategory) {
      const catSlugs = extractSlugs(pAttrs.categorias);
      return catSlugs.includes(selectedCategory.slug);
    }
    return true;
  });

  const softwares = software
    .filter(s => s && (s?.attributes && s.attributes.tipo !== 'Driver' && s.attributes.tipo !== 'Utilitario' || !s?.attributes?.tipo))
    .sort((a, b) => {
      const ordemA = getAttrs(a).ordem ?? 9999;
      const ordemB = getAttrs(b).ordem ?? 9999;
      if (ordemA !== ordemB) return ordemA - ordemB;

      const nameA = getAttrs(a).nome || '';
      const nameB = getAttrs(b).nome || '';
      return nameA.localeCompare(nameB);
    });

  const drivers = software
    .filter(s => s && s?.attributes && (s.attributes.tipo === 'Driver' || s.attributes.tipo === 'Utilitario'))
    .sort((a, b) => {
      const ordemA = getAttrs(a).ordem ?? 9999;
      const ordemB = getAttrs(b).ordem ?? 9999;
      if (ordemA !== ordemB) return ordemA - ordemB;

      const nameA = getAttrs(a).nome || '';
      const nameB = getAttrs(b).nome || '';
      return nameA.localeCompare(nameB);
    });

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
        return null; // ou manter vazio
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
        const allItems = activeTab === 'softwares' ? softwares : drivers;
        const itemsToShow = selectedItem
          ? allItems.filter(item => item.id === selectedItem.id)
          : allItems;
        return (
          <div className="flex flex-col">
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
                    <a
                      href="tel:+5511326643111"
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      +55 (11) 3266-4311
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Ao ligar, escolha a <span className="font-bold">opção 2</span> para ser direcionado ao Suporte.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaWhatsapp className="text-green-500 mt-1 mr-4 flex-shrink-0" size={22} />
                  <div>
                    <h3 className="font-semibold text-lg">WhatsApp</h3>
                    <a
                      href="https://wa.me/5511995978139"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 hover:underline font-medium"
                    >
                      +55 (11) 99597-8139
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Ao iniciar a conversa, escolha a <span className="font-bold">opção 2</span> no menu para falar com o Suporte.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaEnvelope className="text-red-500 mt-1 mr-4 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="font-semibold text-lg">E-mail</h3>
                    <a
                      href="mailto:suporte@tecassistiva.com.br"
                      className="text-red-600 hover:text-red-800 hover:underline font-medium"
                    >
                      suporte@tecassistiva.com.br
                    </a>
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <header className="mb-3 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Central de Suporte</h1>
        <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
          Encontre documentos, softwares e drivers para seus produtos.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {activeTab !== 'contato' && (
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              {renderSidebarContent()}
            </div>
          </aside>
        )}

        <main className={activeTab !== 'contato' ? "lg:col-span-3" : "lg:col-span-4"}>
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex flex-wrap justify-center space-x-8" aria-label="Tabs">
              <TabButton label="Softwares" isActive={activeTab === 'softwares'} onClick={() => handleTabClick('softwares')} />
              <TabButton label="Drivers e Utilitários" isActive={activeTab === 'drivers'} onClick={() => handleTabClick('drivers')} />
              <TabButton label="Manuais e Documentos" isActive={activeTab === 'documentos'} onClick={() => handleTabClick('documentos')} />
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