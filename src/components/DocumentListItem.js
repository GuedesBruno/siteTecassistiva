import React from 'react';
import { getStrapiMediaUrl } from '@/lib/media';
import { FaDownload } from 'react-icons/fa';

// Função para ordenar os documentos
const sortDocuments = (docs) => {
  if (!docs || !Array.isArray(docs)) return [];

  // Filtrar documentos nulos e extrair atributos
  const validDocs = docs.filter(doc => doc).map(doc => {
    const attrs = doc.attributes || doc;
    return { ...attrs, id: doc.id || attrs.id };
  });

  const order = { 'catalogo': 1, 'guia': 2, 'manual': 3 };
  return [...validDocs].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();

    const orderA = Object.keys(order).find(key => nameA.includes(key)) ? order[Object.keys(order).find(key => nameA.includes(key))] : 99;
    const orderB = Object.keys(order).find(key => nameB.includes(key)) ? order[Object.keys(order).find(key => nameB.includes(key))] : 99;

    if (orderA !== orderB) return orderA - orderB;
    return nameA.localeCompare(nameB);
  });
};

export default function DocumentListItem({ product }) {
  const { nome, documentos } = product;

  const docsArray = Array.isArray(documentos) ? documentos : (documentos?.data || []);

  if (docsArray.length === 0) {
    return null;
  }

  const sortedDocs = sortDocuments(docsArray);

  return (
    <div
      className="bg-white border-2 border-gray-300 shadow-lg rounded-xl mb-4 p-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-400 hover:bg-blue-50"
    >
      {/* Header com linha divisória */}
      <div className="border-b-2 border-gray-200 pb-3 mb-4">
        <h3 className="text-base font-bold text-[#002554]">
          {nome}
        </h3>
      </div>

      {/* Download links horizontais */}
      <div className="flex flex-wrap gap-3">
        {sortedDocs.map((doc) => {
          const docUrl = doc.url || doc.attributes?.url;
          const docName = doc.name || doc.attributes?.name;

          if (!docUrl || !docName) return null;

          return (
            <a
              key={doc.id}
              href={getStrapiMediaUrl(docUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#002554] hover:bg-[#003d7a] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <FaDownload size={12} />
              <span>{docName}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}