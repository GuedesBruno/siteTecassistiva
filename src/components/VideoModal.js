'use client';

import { useEffect } from 'react';

/**
 * A modal component to display a Vimeo or YouTube video player.
 *
 * @param {object} props
 * @param {object | null} props.videoInfo - The video info object { type: 'vimeo'|'youtube', id: '...' }.
 * @param {() => void} props.onClose - Function to call to close the modal.
 */
export default function VideoModal({ videoInfo, onClose }) {
  // Lida com a tecla "Esc" para fechar o modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!videoInfo) return null;

  let videoSrc = '';
  let videoTitle = '';

  if (videoInfo.type === 'vimeo') {
    const [id, hash] = videoInfo.id.split('/');
    videoSrc = `https://player.vimeo.com/video/${id}?autoplay=1${hash ? `&h=${hash}` : ''}`;
    videoTitle = `Player de vídeo do Vimeo para o ID ${videoInfo.id}`;
  } else if (videoInfo.type === 'youtube') {
    videoSrc = `https://www.youtube.com/embed/${videoInfo.id}?autoplay=1`;
    videoTitle = `Player de vídeo do YouTube para o ID ${videoInfo.id}`;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]"
      onClick={onClose} // Fecha ao clicar no overlay
    >
      <div
        className="bg-black p-2 rounded-lg shadow-xl relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar no conteúdo do modal
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 text-white bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center text-2xl z-10 hover:bg-gray-600 transition-colors"
          aria-label="Fechar vídeo"
        >
          &times;
        </button>
        <div className="aspect-video">
          <iframe
            src={videoSrc}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={videoTitle}
          ></iframe>
        </div>
      </div>
    </div>
  );
}