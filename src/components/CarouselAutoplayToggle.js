'use client';

import { useCallback, useEffect, useState } from 'react';

// Controla o autoplay de um carrossel Swiper: respeita prefers-reduced-motion
// (autoplay começa desligado) e permite pausar/reproduzir pelo botão.
// Também marca como inert os slides fora da vista.
export function useCarouselAutoplay() {
  const [swiper, setSwiper] = useState(null);
  const [paused, setPaused] = useState(false);

  // Se o usuário prefere menos movimento, o autoplay começa desligado
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPaused(true);
    }
  }, []);

  useEffect(() => {
    if (!swiper || !swiper.autoplay) return;
    if (paused) {
      swiper.autoplay.stop();
    } else {
      swiper.autoplay.start();
    }
  }, [swiper, paused]);

  // Slides fora da vista ficam inert + aria-hidden (sem foco nem leitura por leitor de tela).
  // Requer watchSlidesProgress no Swiper para marcar os slides visíveis.
  useEffect(() => {
    if (!swiper) return;
    const sync = () => {
      if (swiper.destroyed) return;
      swiper.slides.forEach((el) => {
        const visible = el.classList.contains('swiper-slide-visible') || el.classList.contains('swiper-slide-active');
        el.toggleAttribute('inert', !visible);
        if (visible) el.removeAttribute('aria-hidden');
        else el.setAttribute('aria-hidden', 'true');
      });
    };
    sync();
    swiper.on('transitionEnd', sync);
    swiper.on('resize', sync);
    swiper.on('breakpoint', sync);
    swiper.on('update', sync);
    return () => {
      if (swiper.destroyed) return;
      swiper.off('transitionEnd', sync);
      swiper.off('resize', sync);
      swiper.off('breakpoint', sync);
      swiper.off('update', sync);
    };
  }, [swiper]);

  const toggle = useCallback(() => setPaused((value) => !value), []);

  return { onSwiper: setSwiper, paused, toggle };
}

export default function CarouselAutoplayToggle({ paused, onToggle, label = 'carrossel', className = '' }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={paused ? `Reproduzir ${label} automaticamente` : `Pausar ${label}`}
      className={`absolute z-10 flex h-11 w-11 items-center justify-center bg-white text-[#002554] border-2 border-[#002554] shadow-md hover:bg-gray-100 ${className}`}
    >
      {paused ? (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4l10 6-10 6V4z" /></svg>
      ) : (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 4h4v12H5V4zm6 0h4v12h-4V4z" /></svg>
      )}
    </button>
  );
}
