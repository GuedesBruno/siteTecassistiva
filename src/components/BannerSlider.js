'use client'; 

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMediaUrl } from '@/lib/api';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BannerSlider({ banners }) {

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
    <section className="h-[70vh] sm:h-[60vh] md:h-[72vh] bg-gray-200">
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
          // Banner pode vir no formato { id, attributes: {...} } ou plano { id, titulo, ... }
          const attrs = banner.attributes || banner;
          const { titulo, subtitulo, texto_do_botao, link_do_botao, imagem } = attrs;

          const imageUrl = imagem?.data?.attributes?.url || imagem?.url || null;
          const imageAlt = imagem?.data?.attributes?.alternativeText || imagem?.alternativeText || titulo;
          const fullImageUrl = imageUrl ? getStrapiMediaUrl(imageUrl) : null;

          const isReversed = index % 2 !== 0;

          return (
            <SwiperSlide key={banner.id}>
              <div className={`w-full h-full flex flex-col lg:flex-row ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                {/* Left text panel 1/3 on large screens */}
                <div className="w-full lg:w-1/3 bg-gray-100 flex items-center p-6 md:p-12">
                  <div className="max-w-lg lg:max-w-xs text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-[#002554]">{titulo}</h1>
                    <p className="text-lg md:text-xl mb-6 text-[#002554]">{subtitulo}</p>
                    <Link href={link_do_botao || '#'} className="inline-block bg-[#002554] hover:bg-[#003377] text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-300">
                      {texto_do_botao}
                    </Link>
                  </div>
                </div>

                {/* Right image panel (2/3) */}
                <div className="w-full lg:w-2/3 h-64 lg:h-full relative">
                  {fullImageUrl ? (
                    <>
                      <Image
                        src={fullImageUrl}
                        alt={imageAlt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                      {/* subtle dark gradient overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />
                    </>
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