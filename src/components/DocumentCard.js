import React from 'react';
import { getStrapiMediaUrl } from '@/lib/api';

// Ícone de exemplo para download
const DownloadIcon = () => (
  <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
  </svg>
);

export default function DocumentCard({ product }) {
  // Extrai o nome e os documentos do produto.
  const { nome, documentos } = product;

  // Se não houver documentos, não renderiza o card.
  if (!documentos || documentos.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-lg p-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{nome}</h3>
      <ul className="space-y-3">
        {documentos.map((doc) => (
          <li key={doc.id}>
            <a
              href={getStrapiMediaUrl(doc.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
              <DownloadIcon />
              <span>{doc.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}