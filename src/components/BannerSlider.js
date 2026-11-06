'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Keyboard, A11y } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMediaUrl } from '@/lib/media';
import { safeUrl } from '@/lib/safeUrl';
import CarouselAutoplayToggle, { useCarouselAutoplay } from './CarouselAutoplayToggle';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BannerSlider({ banners }) {
  const [isMounted, setIsMounted] = useState(false);
  const { onSwiper, paused, toggle } = useCarouselAutoplay();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!Array.isArray(banners) || banners.length === 0) {
    return (
      <section className="min-h-[70vh] bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Nenhum banner para exibir.</h2>
          <p className="text-gray-500">Não há banners disponíveis no momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[58vh] bg-white group" aria-label="Destaques principais">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, Keyboard, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        onSwiper={onSwiper}
        watchSlidesProgress
        navigation={isMounted ? { prevEl: '.banner-slider-prev', nextEl: '.banner-slider-next' } : false}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        a11y={{
          prevSlideMessage: 'Slide anterior',
          nextSlideMessage: 'Próximo slide',
          paginationBulletMessage: 'Ir para slide {{index}}'
        }}
        loop={true}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        autoHeight={true}
        className="w-full h-full"
      >
        {banners.map((banner, index) => {
          const attrs = banner.attributes || banner;
          const { titulo, subtitulo, texto_comercial, texto_do_botao, link_do_botao, imagem } = attrs;

          const imageUrl = imagem?.data?.attributes?.url || imagem?.url || null;
          const imageAlt = imagem?.data?.attributes?.alternativeText || imagem?.alternativeText || titulo;
          const fullImageUrl = imageUrl ? getStrapiMediaUrl(imageUrl) : null;

          const isReversed = index % 2 !== 0;

          return (
            <SwiperSlide key={banner.id}>
              {/* Conteúdo limitado a --shell-max; o md:px-16 reserva a faixa das setas para que não cubram o texto */}
              <div className={`w-full max-w-[calc(var(--shell-max)+8rem)] mx-auto md:px-16 min-h-[58vh] flex flex-col md:flex-row ${isReversed ? 'md:flex-row-reverse' : ''}`}>

                {/* Text Section - Order 2 on Mobile (Bottom) */}
                <div className="w-full md:w-1/2 order-2 md:order-none bg-white flex items-center justify-center p-6 pb-20 md:p-8 lg:p-12">
                  <div className="w-full max-w-xl text-center md:text-left">
                    <h2 className="text-[clamp(1.75rem,3vw,2.75rem)] font-extrabold leading-[1.15] mb-4 text-[#002554] text-balance hyphens-auto">
                      {titulo}
                    </h2>
                    <p className="text-[clamp(1rem,1.5vw,1.125rem)] mb-6 text-[#002554]">
                      {subtitulo}
                    </p>
                    {texto_comercial && (
                      <p className="text-sm sm:text-base mb-6 text-[#002554]">
                        {texto_comercial}
                      </p>
                    )}
                    <Link href={safeUrl(link_do_botao) || '#'} className="inline-block bg-[#002554] hover:bg-[#003377] text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-300">
                      {texto_do_botao}
                    </Link>
                  </div>
                </div>

                {/* Image Section - Order 1 on Mobile (Top) */}
                <div className="w-full md:w-1/2 order-1 md:order-none min-h-[300px] sm:min-h-[400px] md:min-h-full relative bg-white">
                  {fullImageUrl ? (
                    <>
                      <Image
                        src={fullImageUrl}
                        alt={imageAlt}
                        fill
                        className="object-contain object-center p-4"
                        priority={index === 0}
                      />
                    </>
                  ) : (
                     <div className="w-full h-full min-h-[300px] bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">Imagem não disponível</p>
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <button type="button" className="swiper-button-prev banner-slider-prev" aria-label="Banner anterior"></button>
      <button type="button" className="swiper-button-next banner-slider-next" aria-label="Próximo banner"></button>
      <CarouselAutoplayToggle paused={paused} onToggle={toggle} label="carrossel de banners" className="bottom-4 left-4" />
    </section>
  );
}
