'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { getStrapiMediaUrl } from '@/lib/api';

// Comprehensive RichTextRenderer to handle various formats from Strapi
function RichTextRenderer({ content }) {
  if (!content) return null;

  const renderNode = (node, index) => {
    if (node.type === 'text') {
      let text = <span key={index}>{node.text}</span>;
      if (node.bold) {
        text = <strong key={index}>{text}</strong>;
      }
      if (node.italic) {
        text = <em key={index}>{text}</em>;
      }
      if (node.underline) {
        text = <u key={index}>{text}</u>;
      }
      if (node.strikethrough) {
        text = <s key={index}>{text}</s>;
      }
      if (node.code) {
        return <div key={index} className="whitespace-pre-wrap bg-gray-100 p-2 rounded font-mono text-sm" dangerouslySetInnerHTML={{ __html: node.text }} />;
      }
      return text;
    }

    const children = node.children?.map(renderNode);

    switch (node.type) {
      case 'heading':
        switch (node.level) {
          case 1: return <h1 key={index} className="text-4xl font-bold my-4">{children}</h1>;
          case 2: return <h2 key={index} className="text-3xl font-bold my-4">{children}</h2>;
          case 3: return <h3 key={index} className="text-2xl font-bold my-3">{children}</h3>;
          case 4: return <h4 key={index} className="text-xl font-bold my-3">{children}</h4>;
          case 5: return <h5 key={index} className="text-lg font-bold my-2">{children}</h5>;
          case 6: return <h6 key={index} className="font-bold my-2">{children}</h6>;
          default: return <h2 key={index} className="text-3xl font-bold my-4">{children}</h2>;
        }
      case 'paragraph':
        return <p key={index} className="mb-4">{children}</p>;
      case 'list':
        if (node.format === 'ordered') {
          return <ol key={index} className="list-decimal list-inside mb-4 pl-4">{children}</ol>;
        }
        return <ul key={index} className="list-disc list-inside mb-4 pl-4">{children}</ul>;
      case 'list-item':
        return <li key={index}>{children}</li>;
      case 'link':
        return <a key={index} href={node.url} className="text-blue-600 hover:underline">{children}</a>;
      case 'image':
        return <Image key={index} src={node.image.url} alt={node.image.alternativeText || ''} width={node.image.width} height={node.image.height} className="my-4 rounded" />;
      default:
        return <p key={index}>{children}</p>;
    }
  };

  return content.map(renderNode);
}

export default function ProductDetail({ product, breadcrumbs = [] }) {
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                {tab.name === 'Fotos' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(p.galeria_de_imagens || []).map((img) => (
                      <div key={img.id} className="relative aspect-square border rounded-lg overflow-hidden">
                        <Image
                          src={getStrapiMediaUrl(img.url)}
                          alt={img.alternativeText || p.nome}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {tab.name === 'Downloads' && (p.documentos || []).map(doc => (
                  <a key={doc.id} href={getStrapiMediaUrl(doc.url)} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 py-1">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <span>{doc.name}</span>
                  </a>
                ))}
                {typeof tab.content === 'string' && <div className="whitespace-pre-line">{tab.content}</div>}
                {Array.isArray(tab.content) && tab.name !== 'Downloads' && <RichTextRenderer content={tab.content} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
