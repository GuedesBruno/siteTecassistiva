// sitetecassistiva/src/components/BannerSlider.js

"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { getStrapiURL } from '@/lib/api';
import Image from 'next/image';

export default function BannerSlider({ banners }) {

  // Validação para garantir que banners é um array e não está vazio
  if (!Array.isArray(banners) || banners.length === 0) {
    return <div>Não há banners para exibir.</div>;
  }

  return (
    <div className="relative w-full h-96">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
      >
        {banners.map((banner) => {
          // Acesso correto aos atributos na v4
          const { titulo, descricao, imagem } = banner.attributes;
          
          // Verificação da existência da imagem e de seus dados
          const imageUrl = imagem?.data?.attributes?.url 
            ? getStrapiURL(imagem.data.attributes.url)
            : '/placeholder.jpg'; // Imagem padrão caso não exista

          return (
            <SwiperSlide key={banner.id}>
              <div className="w-full h-96 relative">
                <Image
                  src={imageUrl}
                  alt={titulo || 'Banner Image'}
                  layout="fill"
                  objectFit="cover"
                  priority={true} // Prioriza o carregamento da primeira imagem
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4">
                  <h2 className="text-4xl font-bold mb-2">{titulo}</h2>
                  <p className="text-lg">{descricao}</p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}