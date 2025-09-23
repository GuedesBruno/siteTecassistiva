'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/lib/api';
import VideoModal from './VideoModal.js';
import RichTextRenderer from './RichTextRenderer';

/**
 * Renders an interactive tab section for product details.
 * @param {object} props
 * @param {object} props.product - The full product object from Strapi.
 */
export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('visaoGeral');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const attrs = product.attributes || product;

  const {
    visao_geral,
    galeria_de_imagens,
    videos,
    caracteristicas_funcionais,
    caracteristicas_tecnicas,
    documentos,
    imagem_principal,
  } = attrs;

  // Parseia as URLs de vídeo do Vimeo para extrair os IDs e hashes
  const videoIds = videos
    ? videos.split(',').map(url => {
        try {
          const u = new URL(url.trim());
          // Retorna o caminho, ex: "1027687024/1a5058b7f8"
          return u.pathname.substring(1);
        } catch {
          return null;
        }
      }).filter(Boolean)
    : [];
  const getImgAttrs = (img) => img.attributes || img;
  const galleryImages = [
    ...(imagem_principal ? [imagem_principal] : []),
    ...(Array.isArray(galeria_de_imagens) ? galeria_de_imagens : []),
  ].filter(Boolean);

  const downloadFiles = documentos ? (Array.isArray(documentos) ? documentos : [documentos]) : [];

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
        return <div className="prose max-w-none"><RichTextRenderer content={visao_geral || 'Nenhuma visão geral disponível.'} /></div>;
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
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videoIds.map((vimeoId) => (
              <button 
                key={vimeoId}
                onClick={() => setSelectedVideo({ type: 'vimeo', id: vimeoId })}
                className="relative aspect-video bg-black rounded-lg overflow-hidden group cursor-pointer"
              >
                <img 
                  src={`https://vumbnail.com/${vimeoId}_large.jpg`} 
                  alt={`Thumbnail do vídeo ${vimeoId}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity group-hover:bg-opacity-50">
                  <svg className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        );
      case 'caracteristicasFuncionais':
        return <div className="prose max-w-none"><RichTextRenderer content={caracteristicas_funcionais || 'Nenhuma característica funcional disponível.'} /></div>;
      case 'caracteristicasTecnicas':
        return <div className="prose max-w-none"><RichTextRenderer content={caracteristicas_tecnicas || 'Nenhuma característica técnica disponível.'} /></div>;
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
          <TabButton id="visaoGeral" label="Visão Geral" disabled={!visao_geral} />
          <TabButton id="fotos" label="Fotos" disabled={galleryImages.length === 0} />
          <TabButton id="videos" label="Vídeos" disabled={videoIds.length === 0} />
          <TabButton id="caracteristicasFuncionais" label="Características Funcionais" disabled={!caracteristicas_funcionais} />
          <TabButton id="caracteristicasTecnicas" label="Características Técnicas" disabled={!caracteristicas_tecnicas} />
          <TabButton id="downloads" label="Downloads" disabled={downloadFiles.length === 0} />
        </nav>
      </div>
      <div className="py-8">
        {renderContent()}
      </div>
      {selectedVideo && (
        <VideoModal videoInfo={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}