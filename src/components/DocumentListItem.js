import React from 'react';
import { getStrapiMediaUrl } from '@/lib/api';

const DownloadIcon = () => (
  <svg className="w-5 h-5 mr-2 inline-block flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
  </svg>
);

export default function DocumentListItem({ product }) {
  // The product object is flattened, so we access properties directly.
  const { nome, documentos } = product;

  if (!documentos || documentos.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0 flex items-start">
      <div className="w-1/3 font-bold text-gray-800 pr-4">
        <h3 className="text-lg">{nome}</h3>
      </div>
      <div className="w-2/3">
        <ul className="space-y-2">
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
    </div>
  );
}
