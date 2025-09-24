"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { getStrapiMediaUrl } from '@/lib/api';

function RichTextRenderer({ content }) {
  if (!content) return null;

  return content.map((block, index) => {
    if (block.type === 'paragraph' && block.children) {
      return (
        <p key={index} className="mb-4">
          {block.children.map((child, childIndex) => {
            if (child.type === 'text') {
              if (child.code) {
                return <div key={childIndex} dangerouslySetInnerHTML={{ __html: child.text }} />;
              }
              return <span key={childIndex}>{child.text}</span>;
            }
            return null;
          })}
        </p>
      );
    }
    return null;
  });
}

export default function ProductDetail({ product, breadcrumbs }) {
  const [activeTab, setActiveTab] = useState('Visão Geral');
  const { attributes: p } = product;
  const images = [p.imagem_principal, ...(p.galeria_de_imagens || [])].filter(Boolean);

  const tabs = [
    { name: 'Visão Geral', content: p.visao_geral },
    { name: 'Fotos', content: p.galeria_de_imagens },
    { name: 'Vídeos', content: p.videos },
    { name: 'Características Funcionais', content: p.caracteristicas_funcionais },
    { name: 'Características Técnicas', content: p.caracteristicas_tecnicas },
    { name: 'Downloads', content: p.documentos },
  ];

  return (
    <>
      <nav className="text-sm text-gray-500 mb-8">
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            {index > 0 && <span className="mx-2">&gt;</span>}
            {crumb.path ? (
              <Link href={crumb.path} className="hover:underline">
                {crumb.name}
              </Link>
            ) : (
              <span className="font-semibold text-gray-700">{crumb.name}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
        <div className="relative lg:col-span-2">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            className="w-full aspect-square rounded-lg border bg-gray-100"
          >
            {images.map((img) => (
              <SwiperSlide key={img.id}>
                <Image
                  src={getStrapiMediaUrl(img.url)}
                  alt={p.nome}
                  fill
                  className="object-contain"
                  priority={img.id === p.imagem_principal.id}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="swiper-button-prev absolute top-1/2 left-2 -translate-y-1/2 z-10 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button className="swiper-button-next absolute top-1/2 right-2 -translate-y-1/2 z-10 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="lg:col-span-3 flex flex-col">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{p.nome}</h1>
          <div className="prose max-w-none text-lg text-gray-600 leading-relaxed">
            <RichTextRenderer content={p.descricao_longa} />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-2 md:space-x-4 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              tab.content && (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`px-4 py-3 text-sm md:text-base font-semibold transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.name
                      ? 'border-b-2 border-tec-blue text-tec-blue'
                      : 'text-gray-500 hover:text-tec-blue'
                  }`}
                >
                  {tab.name}
                </button>
              )
            ))}
          </nav>
        </div>
        <div className="py-8">
          <div className="prose max-w-none">
            {tabs.map((tab) => (
              <div key={tab.name} className={activeTab === tab.name ? 'block' : 'hidden'}>
                {tab.name === 'Fotos' && <p>Galeria de fotos aqui.</p>}
                {tab.name === 'Downloads' && p.documentos?.map(doc => (
                  <a key={doc.id} href={getStrapiMediaUrl(doc.url)} target="_blank" rel="noopener noreferrer" className="block text-tec-blue hover:underline">{doc.name}</a>
                ))}
                {typeof tab.content === 'string' && <div className="whitespace-pre-line">{tab.content}</div>}
                {Array.isArray(tab.content) && tab.name !== 'Downloads' && <RichTextRenderer content={tab.content} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}