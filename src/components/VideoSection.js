'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMediaUrl } from '@/lib/api';

function getEmbedUrl(url) {
  if (!url) return '';

  try {
    if (url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(\d+)(?:\/(\w+))?/);
      if (match && match[1]) {
        const videoId = match[1];
        const hash = match[2];
        const params = new URLSearchParams({ autoplay: '1' });
        if (hash) {
          params.set('h', hash);
        }
        return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
      }
    }

    if (url.includes('youtube.com/watch')) {
      const videoUrl = new URL(url);
      const videoId = videoUrl.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    }
  } catch (error) {
    console.error("Error parsing video URL:", error);
    return ''; // Return empty string on error to avoid broken iframe
  }

  return url; // Fallback for other video types or direct links
}

export default function VideoSection({ videos }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section className="bg-tec-blue py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">Vídeos</h2>
        <p className="max-w-2xl mx-auto text-gray-200 mb-12">
          Assista aos nossos vídeos para conhecer melhor os produtos e aprender a utilizá-los.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {videos.map((video) => {
            const { titulo, link, thumbnail } = video;
            const thumbnailUrl = getStrapiMediaUrl(thumbnail?.url);

            return (
              <button
                key={video.id}
                onClick={() => setSelectedVideo(link)}
                className="group relative bg-black rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 w-full"
              >
                <div className="relative w-full aspect-video">
                  {thumbnailUrl ? (
                    <Image src={thumbnailUrl} alt={titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Sem imagem</span>
                    </div>
                  )}
                  {/* Overlay com ícone de Play */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                  </div>
                  {/* Overlay com o título */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="font-semibold text-white text-lg drop-shadow-md">{titulo}</h3>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]" onClick={() => setSelectedVideo(null)}>
          <div className="relative w-full max-w-4xl aspect-video bg-black" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-10 right-0 text-white text-3xl font-bold"
              aria-label="Fechar modal"
            >
              &times;
            </button>
            <iframe
              className="w-full h-full"
              src={getEmbedUrl(selectedVideo)}
              title="Video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
}
