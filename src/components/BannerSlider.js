'use client'; 

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BannerSlider({ banners }) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  if (!Array.isArray(banners) || banners.length === 0) {
    return null; 
  }

  return (
    <section className="h-[70vh] bg-gray-200">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="w-full h-full"
      >
        {banners.map((banner, index) => {
          const { titulo, subtitulo, texto_do_botao, link_do_botao, imagem } = banner;
          
          const imageUrl = imagem?.data?.attributes?.url || imagem?.url;
          const imageAlt = imagem?.data?.attributes?.alternativeText || imagem?.alternativeText || titulo;
          const fullImageUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : null;

          // Define a ordem do layout: par (texto esquerda), ímpar (texto direita)
          const isReversed = index % 2 !== 0;

          return (
            <SwiperSlide key={banner.id}>
              {/* Container do Slide: 
                - No mobile (padrão): flex-col (texto em cima, imagem embaixo)
                - No desktop (lg): flex-row (lado a lado)
                - 'lg:flex-row-reverse' inverte a ordem para slides ímpares no desktop
              */}
              <div className={`w-full h-full flex flex-col lg:flex-row ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Coluna do Texto (1/3 no desktop) */}
                <div className="w-full lg:w-1/3 bg-gray-300 text-tec-blue flex items-center justify-center p-8 lg:p-12">
                  <div className="max-w-md text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold font-extrapold mb-4">{titulo}</h1>
                    <p className="text-lg md:text-xl mb-6">{subtitulo}</p>
                    <Link href={link_do_botao || '#'} className="bg-tec-blue-light hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
                      {texto_do_botao}
                    </Link>
                  </div>
                </div>

                {/* Coluna da Imagem (2/3 no desktop) */}
                <div className="w-full lg:w-2/3 h-64 lg:h-full relative">
                  {fullImageUrl ? (
                    <Image
                      src={fullImageUrl}
                      alt={imageAlt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                      <p className="text-white">Imagem não disponível</p>
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