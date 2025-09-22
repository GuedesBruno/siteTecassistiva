'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMediaUrl } from '@/lib/api';
import ProductTabs from './ProductTabs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import RichTextRenderer from './RichTextRenderer';


/**
 * Renderiza a visualização detalhada de um produto, incluindo galeria de imagens,
 * descrição e abas adicionais.
 * @param {object} props
 * @param {object} props.product - O objeto completo do produto do Strapi.
 * @param {Array<object>} [props.breadcrumbs] - Array de links de breadcrumb.
 */
export default function ProductViewClient({ product, breadcrumbs = [] }) {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const attrs = product.attributes || product;
  const { nome, descricao_longa, imagem_principal, galeria_de_imagens } = attrs;

  // Lógica para combinar imagem principal e galeria para o carrossel
  const allImages = [
    ...(imagem_principal ? [imagem_principal] : []),
    ...(Array.isArray(galeria_de_imagens) ? galeria_de_imagens : []),
  ].filter(Boolean);

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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
        <div className="relative lg:col-span-2">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = navigationPrevRef.current;
              swiper.params.navigation.nextEl = navigationNextRef.current;
            }}
            loop={true}
            className="w-full aspect-square rounded-lg border bg-gray-100"
          >
            {allImages.length > 0 ? allImages.map((img) => {
              const imgAttrs = img.attributes || img;
              return (
                <SwiperSlide key={img.id}>
                  <Image
                    src={getStrapiMediaUrl(imgAttrs.url)}
                    alt={imgAttrs.alternativeText || nome}
                    fill
                    className="object-contain"
                    priority={img.id === imagem_principal?.id}
                  />
                </SwiperSlide>
              );
            }) : (
              <SwiperSlide>
                <div className="flex items-center justify-center h-full text-gray-500">Sem imagem</div>
              </SwiperSlide>
            )}
          </Swiper>
          {allImages.length > 1 && (
            <>
              <button ref={navigationPrevRef} className="absolute top-1/2 left-2 -translate-y-1/2 z-10 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button ref={navigationNextRef} className="absolute top-1/2 right-2 -translate-y-1/2 z-10 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
        </div>

        <div className="lg:col-span-3 flex flex-col">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{nome}</h1>
          <div className="prose max-w-none text-lg text-gray-600 leading-relaxed">
            {/* Renderiza o conteúdo rich text de forma segura com o componente RichTextRenderer */}
            {descricao_longa && <RichTextRenderer content={descricao_longa} />}
          </div>
        </div>
      </div>

      <ProductTabs product={product} />
    </div>
  );
}