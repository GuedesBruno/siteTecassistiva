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

  if (!Array.isArray(banners)) {
    return null; 
  }

  return (
    <section className="relative h-[60vh] bg-gray-800 text-white">
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
          // ATUALIZADO: Trocamos 'imagem_de_fundo' por 'imagem'
          const { titulo, subtitulo, texto_do_botao, link_do_botao, imagem } = banner;
          
          const imageUrl = imagem?.data?.attributes?.url || imagem?.url;
          const imageAlt = imagem?.data?.attributes?.alternativeText || imagem?.alternativeText || titulo;
          const fullImageUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : null;

          const isReversed = index % 2 === 0;

          return (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full h-full flex items-center">
                {fullImageUrl ? (
                  <>
                    <Image
                      src={fullImageUrl}
                      alt={imageAlt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                    <p>Imagem não disponível</p>
                  </div>
                )}

                <div className={`container mx-auto px-6 relative z-10 flex ${isReversed ? 'justify-start' : 'justify-end'}`}>
                  <div className="max-w-2xl text-left">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">{titulo}</h1>
                    <p className="text-xl md:text-2xl mb-6 drop-shadow-md">{subtitulo}</p>
                    <Link href={link_do_botao || '#'} className="bg-tec-blue-light hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
                      {texto_do_botao}
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}