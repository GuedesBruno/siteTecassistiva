'use client';

import { useEffect, useRef } from 'react';
import { useModalFocus } from '@/lib/useModalFocus';
import { sentinelFocusTarget } from '@/lib/videoModalFocus';

/**
 * Um componente de modal para exibir um player de vídeo do Vimeo ou YouTube.
 *
 * @param {object} props
 * @param {object | null} props.videoInfo - O objeto de informações do vídeo { type: 'vimeo'|'youtube', id: '...' }.
 * @param {() => void} props.onClose - Função a ser chamada para fechar o modal.
 */
export default function VideoModal({ videoInfo, onClose }) {
  const wakeLockRef = useRef(null);
  const closeButtonRef = useRef(null);
  const iframeRef = useRef(null);

  // Sentinelas antes e depois do iframe: vindo do Fechar entram no player; vindo do player voltam ao Fechar
  const handleSentinelFocus = (event) => {
    const target = sentinelFocusTarget(event.relatedTarget, closeButtonRef.current);
    (target === 'player' ? iframeRef.current : closeButtonRef.current)?.focus();
  };

  // Foco inicial, trap do Tab, Esc para fechar e retorno do foco ao elemento que abriu o modal
  const dialogRef = useModalFocus(Boolean(videoInfo), onClose);

  // Efeito para gerenciar o Wake Lock
  useEffect(() => {
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          if (process.env.NODE_ENV === 'development') {
            console.log('Wake Lock ativado!');
          }
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.error(`${err.name}, ${err.message}`);
          }
        }
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        if (process.env.NODE_ENV === 'development') {
          console.log('Wake Lock liberado.');
        }
      }
    };

    if (videoInfo) {
      requestWakeLock();
    }

    // Limpa o wake lock quando o componente é desmontado ou o vídeo é fechado
    return () => {
      releaseWakeLock();
    };
  }, [videoInfo]);

  if (!videoInfo) return null;

  let videoSrc = '';
  let videoTitle = '';

  if (videoInfo.type === 'vimeo') {
    const [id, hash] = videoInfo.id.split('/');
    videoSrc = `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ''}`;
    videoTitle = videoInfo.title ? `Vídeo: ${videoInfo.title}` : `Player de vídeo do Vimeo para o ID ${videoInfo.id}`;
  } else if (videoInfo.type === 'youtube') {
    videoSrc = `https://www.youtube.com/embed/${videoInfo.id}`;
    videoTitle = videoInfo.title ? `Vídeo: ${videoInfo.title}` : `Player de vídeo do YouTube para o ID ${videoInfo.id}`;
  }

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={videoTitle}
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100]"
      onClick={onClose} // Fecha ao clicar no overlay
    >
      <div
        className="bg-black w-full h-full md:w-full md:h-auto md:max-w-3xl md:p-2 md:rounded-lg shadow-xl relative"
        onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar no conteúdo do modal
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          data-autofocus
          className="absolute top-4 right-4 text-white bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center text-2xl z-10 hover:bg-gray-600 transition-colors"
          aria-label="Fechar vídeo"
        >
          &times;
        </button>
        <div className="aspect-video w-full h-full">
          <div tabIndex={0} onFocus={handleSentinelFocus} />
          <iframe
            ref={iframeRef}
            src={videoSrc}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={videoTitle}
          ></iframe>
          <div tabIndex={0} onFocus={handleSentinelFocus} />
        </div>
      </div>
    </div>
  );
}