'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Keyboard, A11y } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMediaUrl } from '@/lib/media';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BannerSlider({ banners }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!Array.isArray(banners) || banners.length === 0) {
    return (
      <section className="h-[70vh] bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Nenhum banner para exibir.</h2>
          <p className="text-gray-500">Não há banners disponíveis no momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-auto md:h-[58vh] bg-white group" aria-label="Destaques principais">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, Keyboard, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={isMounted}
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
              <div className={`w-full h-auto md:h-[58vh] flex flex-col md:flex-row ${isReversed ? 'md:flex-row-reverse' : ''}`}>

                {/* Text Section - Order 2 on Mobile (Bottom) */}
                <div className="w-full md:w-2/5 order-2 md:order-none bg-white flex items-center justify-center p-6 md:p-12">
                  <div className="max-w-md text-center md:text-left">
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-[#002554]">{titulo}</h2>
                    <p className="text-base sm:text-lg md:text-xl mb-6 text-[#002554] md:text-justify">{subtitulo}</p>
                    {texto_comercial && (
                      <p className="text-sm sm:text-base mb-6 text-[#002554] md:text-justify">{texto_comercial}</p>
                    )}
                    <Link href={link_do_botao || '#'} className="inline-block bg-[#002554] hover:bg-[#003377] text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-300">
                      {texto_do_botao}
                    </Link>
                  </div>
                </div>

                {/* Image Section - Order 1 on Mobile (Top) */}
                <div className="w-full md:w-3/5 order-1 md:order-none h-72 sm:h-96 md:h-full relative bg-white">
                  {fullImageUrl ? (
                    <>
                      <Image
                        src={fullImageUrl}
                        alt={imageAlt}
                        fill
                        className="object-contain object-top"
                        priority={index === 0}
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">Imagem não disponível</p>
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
