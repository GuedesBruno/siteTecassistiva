'use client'; 

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BannerSlider({ banners }) {
  const validBanners = banners?.filter(b => b.attributes) || [];

  if (validBanners.length === 0) {
    return (
      <div className="h-[70vh] bg-gray-200 flex items-center justify-center">
        <p>Nenhum banner para exibir.</p>
      </div>
    );
  }

  return (
    <section className="h-[80vh] max-h-[700px] w-full bg-gray-100">
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
        {validBanners.map((banner, index) => {
          const bannerAttrs = banner.attributes;
          const fullImageUrl = bannerAttrs.imagem?.data?.attributes?.url;
          const imageAlt = bannerAttrs.imagem?.data?.attributes?.alternativeText || bannerAttrs.titulo;
          const isReversed = index % 2 !== 0;

          return (
            <SwiperSlide key={banner.id}>
              <div className={`w-full h-full flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                <div className="w-full lg:w-1/3 h-1/2 lg:h-full bg-grey-450 text-tec-blue flex items-center justify-center p-8 lg:p-12 order-2 lg:order-1">
                  <div className="max-w-md text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{bannerAttrs.titulo}</h1>
                    <p className="text-lg md:text-xl mb-6">{bannerAttrs.subtitulo}</p>
                    {bannerAttrs.link_do_botao && bannerAttrs.texto_do_botao && (
                        <Link href={bannerAttrs.link_do_botao} className="bg-tec-blue-light hover:bg-tec-blue text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
                            {bannerAttrs.texto_do_botao}
                        </Link>
                    )}
                  </div>
                </div>
                <div className="w-full lg:w-2/3 h-1/2 lg:h-full relative order-1 lg:order-2">
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