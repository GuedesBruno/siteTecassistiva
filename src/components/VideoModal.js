'use client';

import { useEffect } from 'react';

/**
 * A modal component to display a Vimeo video player.
 *
 * @param {object} props
 * @param {string | null} props.vimeoId - The ID and optional hash of the Vimeo video (e.g., "1027687024/1a5058b7f8").
 * @param {() => void} props.onClose - Function to call to close the modal.
 */
export default function VideoModal({ vimeoId, onClose }) {
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

  if (!vimeoId) return null;

  const [id, hash] = vimeoId.split('/');
  const videoSrc = `https://player.vimeo.com/video/${id}?autoplay=1${hash ? `&h=${hash}` : ''}`;

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
            title={`Player de vídeo do Vimeo para o ID ${vimeoId}`}
          ></iframe>
        </div>
      </div>
    </div>
  );
}