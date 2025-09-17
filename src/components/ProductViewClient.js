'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getStrapiURL } from '@/lib/api';

export default function ProductViewClient({ product }) {
  // CORREÇÃO: 'preco' foi removido da desestruturação
  const {
    nome,
    descricao_longa,
    imagem_principal,
    galeria_de_imagens,
  } = product.attributes;
  // Defensive image access: verify existence before reading nested attributes
  const mainImageUrl = (imagem_principal && imagem_principal.data && imagem_principal.data.attributes && imagem_principal.data.attributes.url)
    ? getStrapiURL(imagem_principal.data.attributes.url)
    : null;

  // Prepara a lista de imagens para a galeria, incluindo a imagem principal quando existir
  const galleryImages = [
    ...(mainImageUrl ? [mainImageUrl] : []),
    ...(Array.isArray(galeria_de_imagens?.data) ? galeria_de_imagens.data.map(img => (img?.attributes?.url ? getStrapiURL(img.attributes.url) : null)).filter(Boolean) : []),
  ];

  const [selectedImage, setSelectedImage] = useState(mainImageUrl || galleryImages[0] || null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Coluna da Galeria de Imagens */}
        <div>
          <div className="relative w-full h-96 border rounded-lg overflow-hidden mb-4">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={nome || 'Imagem do produto'}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">Sem imagem</div>
            )}
          </div>
          <div className="flex space-x-2">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`relative w-20 h-20 border rounded-md overflow-hidden cursor-pointer ${selectedImage === image ? 'border-blue-500 border-2' : ''}`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Coluna de Informações do Produto */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{nome}</h1>
          
          {/* CORREÇÃO: Seção de preço removida */}

          <div>
            <h2 className="text-xl font-semibold mb-2">Descrição</h2>
            {/* Usando dangerouslySetInnerHTML para renderizar o HTML do Rich Text */}
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: descricao_longa }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}