'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/lib/api';

/**
 * Renders an interactive tab section for product details.
 * @param {object} props
 * @param {object} props.product - The full product object from Strapi.
 */
export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('visaoGeral');
  const attrs = product.attributes || product;

  const {
    descricao_longa,
    galeria_de_imagens,
    videos,
    caracteristicas_funcionais,
    caracteristicas_tecnicas,
    documentos,
    imagem_principal,
  } = attrs;

  // Lógica corrigida para lidar com dados de mídia planos ou aninhados
  const getImgAttrs = (img) => img.attributes || img;
  const galleryImages = [
    ...(imagem_principal ? [imagem_principal] : []),
    ...(Array.isArray(galeria_de_imagens) ? galeria_de_imagens : []),
  ].filter(Boolean);

  const downloadFiles = documentos ? (Array.isArray(documentos) ? documentos : [documentos]) : [];

  // Helper para converter o rich text do Strapi em uma string HTML
  const renderRichText = (richTextData) => {
    if (!richTextData) return '';
    if (typeof richTextData === 'string') return richTextData;
    if (!Array.isArray(richTextData)) return '';
    return richTextData.map((block) => {
      if (block.type === 'paragraph' && Array.isArray(block.children)) {
        const content = block.children.map((child) => {
          if (child.type !== 'text') return '';
          let text = child.text || '';
          if (child.bold) text = `<strong>${text}</strong>`;
          if (child.italic) text = `<em>${text}</em>`;
          return text;
        }).join('');
        return `<p>${content}</p>`;
      }
      if (block.type === 'list' && Array.isArray(block.children)) {
        const listTag = block.format === 'ordered' ? 'ol' : 'ul';
        const items = block.children.map((item) => `<li>${item.children.map((child) => child.text || '').join('')}</li>`).join('');
        return `<${listTag}>${items}</${listTag}>`;
      }
      return '';
    }).join('');
  };

  const TabButton = ({ id, label, disabled = false }) => (
    <button
      onClick={() => setActiveTab(id)}
      disabled={disabled}
      className={`px-4 py-3 text-sm md:text-base font-semibold transition-colors duration-200 whitespace-nowrap ${
        activeTab === id
          ? 'border-b-2 border-tec-blue text-tec-blue'
          : 'text-gray-500 hover:text-tec-blue'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'visaoGeral':
        return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: renderRichText(descricao_longa) || 'Nenhuma visão geral disponível.' }} />;
      case 'fotos':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.length > 0 ? galleryImages.map((img) => {
              const imgAttrs = getImgAttrs(img);
              const imageUrl = getStrapiMediaUrl(imgAttrs.url);
              return (
                <div key={img.id} className="relative aspect-square">
                  <Image
                    src={imageUrl}
                    alt={imgAttrs.alternativeText || 'Foto do produto'}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              );
            }) : <p>Nenhuma foto adicional disponível.</p>}
          </div>
        );
      case 'videos':
        return <p>Nenhum vídeo disponível no momento.</p>;
      case 'caracteristicasFuncionais':
        return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: renderRichText(caracteristicas_funcionais) || 'Nenhuma característica funcional disponível.' }} />;
      case 'caracteristicasTecnicas':
        return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: renderRichText(caracteristicas_tecnicas) || 'Nenhuma característica técnica disponível.' }} />;
      case 'downloads':
        return (
          <div>
            {downloadFiles.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {downloadFiles.map(file => {
                  const fileAttrs = getImgAttrs(file);
                  return (
                    <li key={file.id}>
                      <a href={getStrapiMediaUrl(fileAttrs.url)} target="_blank" rel="noopener noreferrer" className="text-tec-blue hover:underline">
                        {fileAttrs.name || 'Download'}
                      </a>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p>Nenhum download disponível no momento.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-2 md:space-x-4 overflow-x-auto" aria-label="Tabs">
          <TabButton id="visaoGeral" label="Visão Geral" disabled={!descricao_longa} />
          <TabButton id="fotos" label="Fotos" disabled={galleryImages.length === 0} />
          <TabButton id="videos" label="Vídeos" disabled={!videos || videos.length === 0} />
          <TabButton id="caracteristicasFuncionais" label="Características Funcionais" disabled={!caracteristicas_funcionais} />
          <TabButton id="caracteristicasTecnicas" label="Características Técnicas" disabled={!caracteristicas_tecnicas} />
          <TabButton id="downloads" label="Downloads" disabled={downloadFiles.length === 0} />
        </nav>
      </div>
      <div className="py-8">
        {renderContent()}
      </div>
    </div>
  );
}