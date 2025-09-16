'use client'; 

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiURL } from '@/lib/api'; // Importa a função para a URL

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BannerSlider({ banners }) {
  const STRAPI_URL = getStrapiURL();

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
    <section className="h-[70vh] bg-gray-200">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full h-full"
      >
        {banners.map((banner, index) => {
          // CORREÇÃO: Acedemos a banner.attributes
          const { titulo, subtitulo, texto_do_botao, link_do_botao, imagem } = banner.attributes;
          
          const imageUrl = imagem?.data?.attributes?.url;
          const imageAlt = imagem?.data?.attributes?.alternativeText || titulo;
          const fullImageUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : null;

          const isReversed = index % 2 !== 0;

          return (
            <SwiperSlide key={banner.id}>
              <div className={`w-full h-full flex flex-col lg:flex-row ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/3 bg-tec-blue text-white flex items-center justify-center p-8 lg:p-12">
                  <div className="max-w-md text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrapold mb-4">{titulo}</h1>
                    <p className="text-lg md:text-xl mb-6">{subtitulo}</p>
                    <Link href={link_do_botao || '#'} className="bg-tec-blue-light hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
                      {texto_do_botao}
                    </Link>
                  </div>
                </div>
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