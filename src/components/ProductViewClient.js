'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMediaUrl } from '@/lib/api';
import ProductTabs from './ProductTabs';

/**
 * Renderiza a visualização detalhada de um produto, incluindo galeria de imagens,
 * descrição e abas adicionais.
 * @param {object} props
 * @param {object} props.product - O objeto completo do produto do Strapi.
 * @param {Array<object>} [props.breadcrumbs] - Array de links de breadcrumb.
 */
export default function ProductViewClient({ product, breadcrumbs = [] }) {
  const attrs = product.attributes || product;
  const { nome, descricao_curta, imagem_principal, galeria_de_imagens } = attrs;

  // Lógica CORRIGIDA para lidar com a estrutura de dados da API
  const allImages = [
    ...(imagem_principal ? [imagem_principal] : []),
    ...(Array.isArray(galeria_de_imagens) ? galeria_de_imagens : []),
  ].filter(Boolean);

  const [selectedImage, setSelectedImage] = useState(allImages[0] || null);

  // Função para acessar atributos de forma segura
  const getImgAttrs = (img) => img.attributes || img;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-8">
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            <Link href={crumb.path} className="hover:underline">
              {crumb.name}
            </Link>
            {index < breadcrumbs.length - 1 && <span className="mx-2">&gt;</span>}
          </span>
        ))}
        <span className="mx-2">&gt;</span>
        <span className="font-semibold text-gray-700">{nome}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border">
            {selectedImage ? (
              <Image
                src={getStrapiMediaUrl(getImgAttrs(selectedImage).url)}
                alt={getImgAttrs(selectedImage).alternativeText || nome}
                fill
                className="object-contain"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">Sem imagem</div>
            )}
          </div>
          <div className="flex space-x-3 mt-4">
            {allImages.map((img) => {
              const imgAttrs = getImgAttrs(img);
              return (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 relative rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage?.id === img.id ? 'border-tec-blue' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={getStrapiMediaUrl(imgAttrs.url)}
                    alt={`Thumbnail de ${nome}`}
                    fill
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{nome}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{descricao_curta}</p>
        </div>
      </div>

      <ProductTabs product={product} />
    </div>
  );
}