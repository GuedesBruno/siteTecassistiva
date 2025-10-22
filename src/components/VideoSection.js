'use client';

import React, { useState, useEffect } from 'react';
import { getStrapiMediaUrl } from '@/lib/api';
import VideoModal from './VideoModal.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Função para extrair o ID do vídeo do YouTube ou Vimeo
const getVideoId = (url) => {
  if (!url) return null;
  // Regex atualizado para Vimeo para capturar ID e hash
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
      // Prioridade 1: Usar a thumbnail do Strapi se existir
      const strapiThumbnail = attrs.thumbnail;
      const thumbnailUrlPath = strapiThumbnail?.data?.attributes?.url || strapiThumbnail?.url;
      const strapiUrl = getStrapiMediaUrl(thumbnailUrlPath);
      if (strapiUrl) {
        if (isMounted) setThumbnailUrl(strapiUrl);
        return;
      }

      // Prioridade 2: Fallback para o provedor de vídeo
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
          // Opcional: definir uma imagem de placeholder em caso de falha
        }
      }
    };

    determineThumbnailUrl();

    return () => { isMounted = false; };
  }, [attrs.link, attrs.thumbnail, videoInfo]);

  if (!videoInfo) return null;

  const handleClick = () => {
    onVideoClick(videoInfo);
  };

  return (
    <div className="group block rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 text-left w-full bg-white">
      <button onClick={handleClick} className="relative block w-full">
        <div className="aspect-video">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={attrs.titulo} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          )}
        </div>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
      <div className="p-4 bg-gray-100">
        <h3 className="text-gray-800 font-bold text-lg truncate">{attrs.titulo}</h3>
      </div>
    </div>
  );
};

export default function VideoSection({ videos }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  if (!videos || videos.length === 0) return null;

  return (
    <section className="bg-tec-blue py-16 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Vídeos em Destaque</h2>
          <p className="text-lg text-gray-200 mt-2">Veja nossos produtos em ação.</p>
        </div>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          navigation={{
            prevEl: '.video-section-prev',
            nextEl: '.video-section-next',
          }}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            reverseDirection: true,
          }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
        >
          {videos.map((video) => (
            <SwiperSlide key={video.id}>
              <VideoCard video={video} onVideoClick={setSelectedVideo} />
            </SwiperSlide>
          ))}
        </Swiper>
        {selectedVideo && (
          <VideoModal videoInfo={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
      </div>
      {/* Botões de navegação personalizados */}
      <div className="swiper-button-prev video-section-prev"></div>
      <div className="swiper-button-next video-section-next"></div>
    </section>
  );
}