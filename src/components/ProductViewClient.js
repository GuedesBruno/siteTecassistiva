'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/lib/api';

export default function ProductViewClient({ product }) {
  const attrs = product.attributes || product;
  const nome = attrs.nome || 'Produto';
  const descricao_longa = attrs.descricao_longa || attrs.descricao || '';
  const imagem_principal = attrs.imagem_principal || attrs.imagem_principal?.data || null;
  const galeria_de_imagens = attrs.galeria_de_imagens || null;

  const mainImagePath = imagem_principal?.data?.attributes?.url || imagem_principal?.url || imagem_principal?.attributes?.url || null;
  const mainImageUrl = mainImagePath ? getStrapiMediaUrl(mainImagePath) : null;

  const galleryImages = [
    ...(mainImageUrl ? [mainImageUrl] : []),
    ...(Array.isArray(galeria_de_imagens?.data) ? galeria_de_imagens.data.map(img => {
      const path = img?.attributes?.url || img?.url || null;
      return path ? getStrapiMediaUrl(path) : null;
    }).filter(Boolean) : []),
  ];

  const [selectedImage, setSelectedImage] = useState(mainImageUrl || galleryImages[0] || null);
  const [activeTab, setActiveTab] = useState('visao');

  const renderThumbnails = () => (
    <div className="flex space-x-3 mt-4">
      {galleryImages.map((image, idx) => (
        <button key={idx} onClick={() => setSelectedImage(image)} className={`w-20 h-20 overflow-hidden ${selectedImage===image? 'ring-2 ring-sky-600':''}`}>
          <div className="relative w-full h-full">
            <Image src={image} alt={`Thumb ${idx+1}`} fill style={{ objectFit: 'cover' }} />
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">{nome}</h1>
            <div className="flex gap-6">
              <div className="w-2/3">
                <div className="w-full h-96 bg-gray-100 overflow-hidden">
                  {selectedImage ? (
                    <div className="relative w-full h-full">
                      <Image src={selectedImage} alt={nome} fill style={{ objectFit: 'contain' }} />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">Sem imagem</div>
                  )}
                </div>
                {renderThumbnails()}
              </div>

              <div className="w-1/3">
                <div className="space-y-4">
                  <div className="text-sm text-gray-700">Visão Geral</div>
                  <div className="text-gray-900">{(attrs.descricao_curta || '').slice(0,200)}</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex border-b">
                <button className={`px-4 py-2 ${activeTab==='visao' ? 'border-b-2 border-sky-600':''}`} onClick={()=>setActiveTab('visao')}>Visão Geral</button>
                <button className={`px-4 py-2 ${activeTab==='fotos' ? 'border-b-2 border-sky-600':''}`} onClick={()=>setActiveTab('fotos')}>Fotos</button>
                <button className={`px-4 py-2 ${activeTab==='videos' ? 'border-b-2 border-sky-600':''}`} onClick={()=>setActiveTab('videos')}>Vídeos</button>
                <button className={`px-4 py-2 ${activeTab==='carac' ? 'border-b-2 border-sky-600':''}`} onClick={()=>setActiveTab('carac')}>Características</button>
              </div>

              <div className="p-6 bg-white">
                {activeTab==='visao' && (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: descricao_longa }} />
                )}
                {activeTab==='fotos' && (
                  <div className="grid grid-cols-2 gap-4">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="w-full h-48 bg-gray-100 overflow-hidden relative">
                        <Image src={img} alt={`Foto ${i+1}`} fill style={{ objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
                {activeTab==='videos' && (
                  <div>Vídeos (não configurados)</div>
                )}
                {activeTab==='carac' && (
                  <div>
                    <h3 className="font-semibold mb-2">Características Funcionais</h3>
                    <div>{(attrs.caracteristicas_funcionais && JSON.stringify(attrs.caracteristicas_funcionais)) || 'Nenhuma característica registrada.'}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white border p-4">
            <h4 className="font-semibold">Especificações</h4>
            <div className="text-sm text-gray-600">{(attrs.caracteristicas_tecnicas && JSON.stringify(attrs.caracteristicas_tecnicas)) || '—'}</div>
          </div>
          <div className="bg-white border p-4">
            <h4 className="font-semibold">Downloads</h4>
            <p className="text-sm text-gray-600">Documentos e manuais disponíveis.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}