
import React from 'react';
import { getStrapiMediaUrl } from '@/lib/api';
import Image from 'next/image';
import RichTextRenderer from './RichTextRenderer'; // Supondo que você tenha um componente para renderizar rich text

export default function SoftwareCard({ software }) {
  const { nome, descricao, logo, instaladores } = software.attributes;

  const logoUrl = logo?.data?.attributes?.url ? getStrapiMediaUrl(logo.data.attributes.url) : '/file.svg';

  return (
    <div className="border rounded-lg p-6 bg-white shadow-md flex flex-col h-full">
      <div className="flex items-start mb-4">
        <div className="w-20 h-20 relative mr-4 flex-shrink-0">
            <Image
                src={logoUrl}
                alt={`Logo de ${nome}`}
                layout="fill"
                objectFit="contain"
                className="rounded-md"
            />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{nome}</h3>
      </div>
      
      <div className="text-gray-600 mb-6 flex-grow">
        {descricao && <RichTextRenderer content={descricao} />}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-3">Instaladores:</h4>
        <div className="space-y-4">
          {instaladores && instaladores.map((instalador) => (
            <div key={instalador.id} className="p-3 bg-gray-50 rounded-md">
              <p className="font-medium text-gray-800">Versão: {instalador.versao}</p>
              <div className="mt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                {instalador.link_online && (
                  <a
                    href={instalador.link_online}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Download Online
                  </a>
                )}
                {instalador.link_offline && (
                  <a
                    href={instalador.link_offline}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Download Offline
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
