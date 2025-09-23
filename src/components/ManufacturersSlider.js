'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { getStrapiMediaUrl } from '@/lib/api';

export default function ManufacturersSlider({ fabricantes }) {
  if (!fabricantes || fabricantes.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      {/* AQUI ESTÁ A MUDANÇA: Ajuste do padding horizontal (px) */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Nossos Fornecedores</h2>
          <p className="text-lg text-gray-600 mt-2">Trabalhamos com as melhores marcas do mercado.</p>
        </div>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={50}
          slidesPerView={2}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          className="w-full"
        >
          {fabricantes.map((fabricante) => {
            const attrs = fabricante.attributes || fabricante;
            const logo = attrs.logo;
            const logoUrlPath = logo?.data?.attributes?.url || logo?.url;
            const logoUrl = getStrapiMediaUrl(logoUrlPath);
            return (
              <SwiperSlide key={fabricante.id} className="flex items-center justify-center">
                {logoUrl ? (
                  <a href={attrs.site} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                    <img
                      src={logoUrl}
                      alt={attrs.nome}
                      className="max-h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </a>
                ) : (
                  <span className="text-gray-500">{attrs.nome}</span>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}