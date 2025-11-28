import React from 'react';
import { getStrapiMediaUrl } from '@/lib/media';
import Image from 'next/image';
import RichTextRenderer from './RichTextRenderer';

// Função auxiliar para extrair com segurança a primeira URL de um campo Rich Text do Strapi
const extractLinkFromRichText = (content) => {
  if (!Array.isArray(content)) return null;
  try {
    for (const block of content) {
      if (block.children && Array.isArray(block.children)) {
        for (const child of block.children) {
          if (child.type === 'link' && child.url) {
            return child.url;
          }
        }
      }
    }
  } catch (error) {
    console.error("Error parsing rich text for link:", error);
    return null;
  }
  return null;
};


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
          {instaladores && instaladores.map((instalador) => {
            const onlineUrl = extractLinkFromRichText(instalador.link_online);
            const offline1Url = extractLinkFromRichText(instalador.link_offline_1);
            const offline2Url = extractLinkFromRichText(instalador.link_offline_2);

            return (
              <div key={instalador.id} className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium text-gray-800">Versão: {instalador.versao}</p>
                <div className="mt-2 flex flex-col space-y-2">
                  {onlineUrl && (
                    <a
                      href={onlineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Download Online
                    </a>
                  )}
                  {offline1Url && (
                    <a
                      href={offline1Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center w-full px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Download Offline 1
                    </a>
                  )}
                  {offline2Url && (
                    <a
                      href={offline2Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center w-full px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Download Offline 2
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}