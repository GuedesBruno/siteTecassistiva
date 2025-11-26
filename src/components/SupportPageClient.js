'use client';

import { useState } from 'react';
import { FaWhatsapp, FaPhoneAlt, FaEnvelope, FaCertificate } from 'react-icons/fa';

export default function SupportPageClient({ products, software }) {
  const [activeTab, setActiveTab] = useState('software');

  // Filtra os itens recebidos em 'software' para suas respectivas categorias
  const softwareItems = software.filter(s => s.attributes?.tipo === 'Software');
  const driverItems = software.filter(s => s.attributes?.tipo === 'Driver' || s.attributes?.tipo === 'Utilitário');

  // Função para ordenar os documentos
  const sortDocuments = (docs) => {
    if (!docs || !Array.isArray(docs)) return [];
    const order = { 'catalogo': 1, 'guia': 2, 'manual': 3 };
    return [...docs].sort((a, b) => {
      const nameA = a.attributes.name.toLowerCase();
      const nameB = b.attributes.name.toLowerCase();
      
      const orderA = Object.keys(order).find(key => nameA.includes(key)) ? order[Object.keys(order).find(key => nameA.includes(key))] : 99;
      const orderB = Object.keys(order).find(key => nameB.includes(key)) ? order[Object.keys(order).find(key => nameB.includes(key))] : 99;

      if (orderA !== orderB) return orderA - orderB;
      return nameA.localeCompare(nameB); // Fallback para ordem alfabética
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">Suporte Técnico</h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
          Encontre manuais, drivers e entre em contato com nossa equipe.
        </p>
      </header>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-6 justify-center" aria-label="Tabs">
          <button onClick={() => setActiveTab('software')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'software' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Softwares
          </button>
          <button onClick={() => setActiveTab('documentos')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'documentos' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Manuais e Documentos
          </button>
          <button onClick={() => setActiveTab('drivers')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'drivers' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Drivers e Utilitários
          </button>
          <button onClick={() => setActiveTab('contato')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${activeTab === 'contato' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Contato do Suporte
          </button>
        </nav>
      </div>

      {activeTab === 'documentos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products && products.filter(p => p.attributes?.documentos?.data?.length > 0).map(product => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">{product.attributes.nome}</h3>
              <ul className="mt-3 space-y-2">
                {sortDocuments(product.attributes.documentos.data).map(doc => (
                  <li key={doc.id}>
                    <a href={`${process.env.NEXT_PUBLIC_STRAPI_URL}${doc.attributes.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      <span>{doc.attributes.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'software' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {softwareItems.map(sw => (
            <div key={sw.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">{sw.attributes.nome}</h3>
              <p className="text-sm text-gray-500 mb-3">Tipo: {sw.attributes.tipo}</p>
              <ul className="space-y-2">
                {sw.attributes.instaladores?.data?.map(installer => (
                  <li key={installer.id}>
                    <a href={`${process.env.NEXT_PUBLIC_STRAPI_URL}${installer.attributes.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      <span>{installer.attributes.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'drivers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {driverItems.map(sw => (
            <div key={sw.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">{sw.attributes.nome}</h3>
              <p className="text-sm text-gray-500 mb-3">Tipo: {sw.attributes.tipo}</p>
              <ul className="space-y-2">
                {sw.attributes.instaladores?.data?.map(installer => (
                  <li key={installer.id}>
                    <a href={`${process.env.NEXT_PUBLIC_STRAPI_URL}${installer.attributes.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      <span>{installer.attributes.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'contato' && (
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
      )}
    </div>
  );
}