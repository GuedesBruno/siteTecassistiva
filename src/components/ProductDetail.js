'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { getStrapiMediaUrl } from '@/lib/media';
import VideoModal from './VideoModal'; // Importa o Modal
import RichTextRenderer from './RichTextRenderer';
import ProductCard from './ProductCard'; // Importa o ProductCard

// --- Lógica de Vídeo adaptada para este componente ---
const getVideoId = (url) => {
  if (!url) return null;
  let match = /vimeo\.com\/([\d\/a-zA-Z]+)/i.exec(url);
  if (match && match[1]) return { type: 'vimeo', id: match[1] };
  
  match = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i.exec(url);
  if (match && match[1]) return { type: 'youtube', id: match[1] };
  
  return null;
};

const VideoCard = ({ video, onVideoClick }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const attrs = video.attributes || video;
  const videoInfo = getVideoId(attrs.link);

  useEffect(() => {
    if (!videoInfo) return;
    let isMounted = true;

    const fetchThumbnail = async () => {
      if (videoInfo.type === 'youtube') {
        if (isMounted) setThumbnailUrl(`https://i.ytimg.com/vi/${videoInfo.id}/hqdefault.jpg`);
      } else if (videoInfo.type === 'vimeo') {
        try {
          const response = await fetch(`https://vimeo.com/api/oembed.json?url=${attrs.link}`);
          if (response.ok) {
            const data = await response.json();
            if (isMounted) setThumbnailUrl(data.thumbnail_url);
          }
        } catch (error) {
          console.error("Erro ao buscar thumbnail do Vimeo:", error);
        }
      }
    };

    fetchThumbnail();
    return () => { isMounted = false; };
  }, [attrs.link, videoInfo]);

  if (!videoInfo) return null;

  return (
    <div className="group block rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      <button onClick={() => onVideoClick(videoInfo)} className="relative block w-full">
        <div className="aspect-video">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={attrs.titulo} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          )}
        </div>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
        </div>
      </button>
    </div>
  );
};
// --- Fim da lógica de vídeo ---

export default function ProductDetail({ product, breadcrumbs = [] }) {
  const [activeTab, setActiveTab] = useState('Visão Geral');
  const [selectedVideo, setSelectedVideo] = useState(null); // Estado para o modal
  const { attributes: p } = product;
  const images = [p.imagem_principal, ...(p.galeria_de_imagens || [])].filter(Boolean);

  const tabs = [
    { name: 'Visão Geral', content: p.visao_geral },
    { name: 'Fotos', content: p.galeria_de_imagens },
    { name: 'Vídeos', content: p.videos },
    { name: 'Características Funcionais', content: p.caracteristicas_funcionais },
    { name: 'Características Técnicas', content: p.caracteristicas_tecnicas },
    { name: 'Produtos Relacionados', content: p.relacao_acessorios?.data },
    { name: 'Downloads', content: p.documentos },
  ];

  // Analisa as URLs de vídeo do campo de texto 'videos' (uma URL por linha)
  const videoLinks = p.videos ? p.videos.split('\n').filter(link => link.trim() !== '') : [];
  const videoData = videoLinks.map((link, index) => ({
    id: `video-${index}`,
    attributes: {
      link: link,
      titulo: `Vídeo ${index + 1}` // Título genérico, já que não está disponível no campo de texto
    }
  }));

  return (
    <>
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
              navigation={true}
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
          </div>

          <div className="lg:col-span-3 flex flex-col">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{p.nome}</h1>
            <div className="prose max-w-none text-lg text-gray-600 leading-relaxed">
              <RichTextRenderer content={p.descricao_longa} />
            </div>

            {/* Botão Compre Agora via WhatsApp */}
            <div className="mt-8">
              <a
                href={`https://wa.me/5511995978139?text=${encodeURIComponent(`Olá, tenho interesse em comprar o produto: ${p.nome}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.06 22L7.32 20.58C8.77 21.39 10.37 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2ZM16.57 15.96C16.3 16.23 15.39 16.73 15.03 16.78C14.67 16.83 13.91 16.98 13.3 16.83C12.69 16.68 11.74 16.38 10.62 15.3C9.28 14.04 8.47 12.54 8.32 12.27C8.17 12 7.36 10.91 7.36 10.05C7.36 9.19 7.87 8.71 8.07 8.5C8.27 8.29 8.57 8.24 8.82 8.24C9.07 8.24 9.27 8.24 9.44 8.27C9.61 8.29 9.86 8.84 9.96 9.16C10.06 9.48 10.11 9.88 9.96 10.11C9.81 10.34 9.74 10.44 9.59 10.61C9.44 10.78 9.29 10.96 9.44 11.23C9.59 11.5 10.11 12.22 10.83 12.9C11.71 13.73 12.38 14.03 12.68 14.18C12.98 14.33 13.13 14.28 13.28 14.13C13.43 13.98 13.89 13.4 14.11 13.1C14.33 12.8 14.56 12.75 14.83 12.85C15.11 12.95 16.04 13.45 16.29 13.58C16.54 13.71 16.69 13.78 16.74 13.91C16.79 14.04 16.79 14.44 16.57 14.71L16.57 15.96Z"/></svg>
                Compre Agora via WhatsApp
              </a>
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
                    className={`px-4 py-3 text-sm md:text-base font-semibold transition-colors duration-200 whitespace-nowrap ${activeTab === tab.name
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
                  
                  {/* NOVA LÓGICA PARA VÍDEOS */}
                  {tab.name === 'Vídeos' && videoData.length > 0 && (
                    <div className="not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {videoData.map(video => (
                        <VideoCard key={video.id} video={video} onVideoClick={setSelectedVideo} />
                      ))}
                    </div>
                  )}

                  {tab.name === 'Produtos Relacionados' && p.relacao_acessorios?.data?.length > 0 && (
                    <div className="not-prose grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {p.relacao_acessorios.data.map((relatedProduct) => (
                        <ProductCard key={relatedProduct.id} product={relatedProduct} />
                      ))}
                    </div>
                  )}

                  {/* Lógica original ajustada para não renderizar a aba de vídeo como texto */}
                  {tab.name !== 'Vídeos' && tab.name !== 'Produtos Relacionados' && typeof tab.content === 'string' && <div className="whitespace-pre-line">{tab.content}</div>}
                  {tab.name !== 'Vídeos' && tab.name !== 'Produtos Relacionados' && Array.isArray(tab.content) && tab.name !== 'Downloads' && <RichTextRenderer content={tab.content} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Renderiza o modal de vídeo se um vídeo for selecionado */}
      {selectedVideo && (
        <VideoModal videoInfo={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </>
  );
}
