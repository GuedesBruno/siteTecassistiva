'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { getStrapiURL } from '@/lib/api';

export default function BannerSlider({ banners }) {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
      >
        {banners.map((banner) => {
          const { titulo, subtitulo, imagem, texto_do_botao, link_do_botao } = banner.attributes;
          const imageUrl = getStrapiURL(imagem?.data?.attributes?.url);

          return (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full h-[60vh] max-h-[500px]">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={titulo || 'Banner Image'}
                    layout="fill"
                    objectFit="cover"
                    priority={true}
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white p-4">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">{titulo}</h2>
                  {/* CORREÇÃO: O campo 'descricao' foi alterado para 'subtitulo' */}
                  <p className="text-lg md:text-xl max-w-2xl mb-6">{subtitulo}</p>
                  {texto_do_botao && link_do_botao && (
                    <a
                      href={link_do_botao}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      {texto_do_botao}
                    </a>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}