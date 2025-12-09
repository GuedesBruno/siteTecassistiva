'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { getStrapiMediaUrl } from '@/lib/media';
import VideoModal from './VideoModal'; // Importa o Modal
import RichTextRenderer from './RichTextRenderer';
import SpecsTable from './SpecsTable';
import Breadcrumbs from './Breadcrumbs';
import InfoCard from './InfoCard';

// Componente ProductCard simples para produtos relacionados
const ProductCard = ({ product }) => {
  const { attributes: p } = product;
  const imageUrl = getStrapiMediaUrl(p.imagem_principal?.data?.attributes?.url);

  return (
    <Link href={`/produtos/${p.slug}`} className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
      <div className="aspect-square relative bg-gray-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={p.nome}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-tec-blue transition-colors mb-1">{p.nome}</h3>
        {p.descricao_curta && (
          <p className="text-sm text-gray-500 line-clamp-2">{p.descricao_curta}</p>
        )}
      </div>
    </Link>
  );
};

// Função para extrair o ID do vídeo do YouTube ou Vimeo
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
    const determineThumbnailUrl = async () => {
      const strapiThumbnail = attrs.thumbnail;
      const thumbnailUrlPath = strapiThumbnail?.data?.attributes?.url || strapiThumbnail?.url;
      const strapiUrl = getStrapiMediaUrl(thumbnailUrlPath);
      if (strapiUrl) {
        if (isMounted) setThumbnailUrl(strapiUrl);
        return;
      }
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
    determineThumbnailUrl();
    return () => { isMounted = false; };
  }, [attrs.link, attrs.thumbnail, videoInfo]);

  if (!videoInfo) return null;

  return (
    <div className="group block rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 text-left w-full bg-white border border-gray-100">
      <button onClick={() => onVideoClick(videoInfo)} className="relative block w-full">
        <div className="aspect-square">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={attrs.titulo} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          )}
        </div>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

    </div>
  );
};

// Helper para agrupar conteúdo Rich Text por títulos
const groupContentByHeading = (content) => {
  if (!content || !Array.isArray(content)) return [{ title: null, content: <RichTextRenderer content={content} /> }];

  const groups = [];
  let currentGroup = { title: null, rawContent: [] };

  content.forEach((node) => {
    if (node.type === 'heading') {
      if (currentGroup.rawContent.length > 0 || currentGroup.title) {
        groups.push({
          title: currentGroup.title,
          content: <RichTextRenderer content={currentGroup.rawContent} />
        });
      }
      const titleText = node.children?.map(c => c.text).join('') || '';
      currentGroup = { title: titleText, rawContent: [] };
    } else {
      currentGroup.rawContent.push(node);
    }
  });

  if (currentGroup.rawContent.length > 0 || currentGroup.title) {
    groups.push({
      title: currentGroup.title,
      content: <RichTextRenderer content={currentGroup.rawContent} />
    });
  }

  return groups;
};

export default function ProductDetail({ product, breadcrumbs = [] }) {
  const { attributes: p } = product;

  // --- Data Processing ---

  // 1. Videos
  let videoList = [];
  if (typeof p.videos === 'string') {
    videoList = p.videos.split('\n').filter(link => link.trim() !== '').map((link, index) => ({
      id: `vid-${index}`,
      attributes: {
        link: link.trim(),
        titulo: 'Vídeo',
        thumbnail: null
      }
    }));
  } else if (Array.isArray(p.videos)) {
    videoList = p.videos;
  }

  const videoData = videoList.map(video => {
    const attrs = video.attributes || video;
    const videoId = getVideoId(attrs.link);
    return { ...video, videoId };
  }).filter(v => v.videoId);

  // 2. Specs
  const hasStructuredSpecs = p.especificacoes_por_categoria && p.especificacoes_por_categoria.length > 0;
  const technicalSpecsContent = hasStructuredSpecs ? p.especificacoes_por_categoria : p.caracteristicas_tecnicas;

  // 3. Images (for gallery)
  const images = [p.imagem_principal, ...(p.galeria_de_imagens || [])].filter(Boolean);

  // --- Tabs Logic ---
  const hasContent = (data) => {
    if (!data) return false;
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === 'string') return data.trim().length > 0;
    return true;
  };

  const allTabs = [
    { name: 'Visão Geral', content: p.visao_geral, isVisible: hasContent(p.visao_geral) },
    { name: 'Características Funcionais', content: p.caracteristicas_funcionais, isVisible: hasContent(p.caracteristicas_funcionais) },
    { name: 'Características Técnicas', content: technicalSpecsContent, isStructured: hasStructuredSpecs, isVisible: hasContent(technicalSpecsContent) },
    { name: 'Produtos Relacionados', content: p.relacao_acessorios?.data, isVisible: p.relacao_acessorios?.data?.length > 0 },
    { name: 'Downloads', content: p.documentos, isVisible: hasContent(p.documentos) },
    { name: 'Fotos', content: p.galeria_de_imagens, isVisible: hasContent(p.galeria_de_imagens) },
    { name: 'Vídeos', content: p.videos, isVisible: videoData.length > 0 },
  ];

  // Filter only visible tabs
  const tabs = allTabs.filter(t => t.isVisible);
  const initialTab = tabs.length > 0 ? tabs[0].name : '';

  // --- State ---
  // Initialize with the first visible tab
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [swiper, setSwiper] = useState(null);

  // Effect to handle prop changes or empty states
  useEffect(() => {
    // If current activeTab is not in the visible list, reset to first visible
    if (tabs.length > 0 && !tabs.find(t => t.name === activeTab)) {
      setActiveTab(tabs[0].name);
    }
  }, [p.slug, tabs, activeTab]); // Depend on slug to reset on product change

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Image Gallery and Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="relative group lg:col-span-5">
            <div className="aspect-square relative rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100">
              {images.length > 0 ? (
                <Swiper
                  modules={[Navigation]}
                  onSwiper={setSwiper}
                  navigation={{
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next',
                  }}
                  loop={images.length > 1}
                  className="h-full w-full"
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={img.id || idx}>
                      <div className="relative w-full h-full">
                        <Image
                          src={getStrapiMediaUrl(img.url)}
                          alt={img.alternativeText || p.nome}
                          fill
                          className="object-contain p-8"
                          priority={idx === 0}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                  <div className="swiper-button-prev !text-white after:!text-2xl !w-10 !h-10 !bg-tec-blue/50 !rounded-full !shadow-md hover:!bg-tec-blue transition-all opacity-0 group-hover:opacity-100"></div>
                  <div className="swiper-button-next !text-white after:!text-2xl !w-10 !h-10 !bg-tec-blue/50 !rounded-full !shadow-md hover:!bg-tec-blue transition-all opacity-0 group-hover:opacity-100"></div>
                </Swiper>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-tec-blue transition-colors"
                    onClick={() => swiper?.slideTo(idx)}
                  >
                    <Image
                      src={getStrapiMediaUrl(img.url)}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Video Gallery */}
            {videoData.length > 0 && (
              <div className="mt-2">
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={10}
                  slidesPerView={3.5}
                  navigation={{
                    prevEl: '.video-swiper-button-prev',
                    nextEl: '.video-swiper-button-next',
                  }}
                  breakpoints={{
                    640: { slidesPerView: 4.5 },
                    1024: { slidesPerView: 5 },
                  }}
                  className="w-full relative group/video"
                >
                  {videoData.map((video) => (
                    <SwiperSlide key={video.id}>
                      <VideoCard video={video} onVideoClick={setSelectedVideo} />
                    </SwiperSlide>
                  ))}
                  <div className="video-swiper-button-prev swiper-button-prev !text-white after:!text-xl !w-8 !h-8 !bg-tec-blue/50 !rounded-full !shadow-md hover:!bg-tec-blue transition-all opacity-0 group-hover/video:opacity-100"></div>
                  <div className="video-swiper-button-next swiper-button-next !text-white after:!text-xl !w-8 !h-8 !bg-tec-blue/50 !rounded-full !shadow-md hover:!bg-tec-blue transition-all opacity-0 group-hover/video:opacity-100"></div>
                </Swiper>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{p.nome}</h1>

            {/* Descrição Longa (Rich Text) ao lado da imagem */}
            <div className="prose prose-lg mb-8 [&>div:first-child]:text-xl [&>div:first-child]:font-medium [&>div:first-child]:text-gray-900 [&>div:first-child]:leading-relaxed">
              {p.descricao_longa ? (
                <RichTextRenderer content={p.descricao_longa} />
              ) : (
                p.descricao_curta && <p>{p.descricao_curta}</p>
              )}
            </div>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/5511999999999?text=Olá, gostaria de saber mais sobre o produto ${p.nome}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.015-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              Solicitar Orçamento via WhatsApp
            </a>
          </div>
        </div>

        <div className="w-full">
          <div className="border-b border-gray-200 sticky top-[var(--header-height)] z-40 bg-white transition-all duration-300">
            <nav className="-mb-px flex space-x-2 md:space-x-4 overflow-x-auto no-scrollbar" aria-label="Tabs">
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
                  {/* Lógica para Visão Geral e Características Funcionais (Cards Verticais) */}
                  {(tab.name === 'Visão Geral' || tab.name === 'Características Funcionais') && (
                    <div className="flex flex-col gap-6">
                      {groupContentByHeading(tab.content).map((item, idx) => (
                        <InfoCard
                          key={idx}
                          title={item.title}
                          variant="blue"
                          isSticky={false}
                        >
                          {item.content}
                        </InfoCard>
                      ))}
                    </div>
                  )}

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

                  {/* Lógica para Especificações Técnicas Estruturadas (Lista Normal) */}
                  {tab.name === 'Características Técnicas' && tab.isStructured && (
                    <div className="flex flex-col gap-6">
                      {tab.content.map((group, idx) => (
                        <InfoCard
                          key={idx}
                          title={group.titulo}
                          isSticky={false}
                        >
                          <SpecsTable specGroups={[group]} showTitle={false} />
                        </InfoCard>
                      ))}
                    </div>
                  )}

                  {tab.name === 'Características Técnicas' && !tab.isStructured && (
                    <InfoCard title="Especificações">
                      {typeof tab.content === 'string' ? <div className="whitespace-pre-line">{tab.content}</div> : <RichTextRenderer content={tab.content} />}
                    </InfoCard>
                  )}
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
