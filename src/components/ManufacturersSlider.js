'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMediaUrl } from '@/lib/api';

export default function ManufacturersSlider({ fabricantes }) {
  if (!fabricantes || fabricantes.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Fornecedores</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Trabalhamos com os principais desenvolvedores e fabricantes de tecnologia assistiva do mundo.
          </p>
        </div>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={50}
          slidesPerView={2}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 40 },
            768: { slidesPerView: 5, spaceBetween: 50 },
            1024: { slidesPerView: 6, spaceBetween: 60 },
            1280: { slidesPerView: 8, spaceBetween: 70 },
          }}
          className="w-full"
        >
          {fabricantes.map((fabricante) => {
            // Adaptado para a estrutura de dados "flat" (plana) que a API está retornando.
            const logoUrl = getStrapiMediaUrl(fabricante.logo?.url);
            return (
              <SwiperSlide key={fabricante.id} className="flex items-center justify-center h-24">
                {logoUrl && <Link href={fabricante.url || '#'} target="_blank" rel="noopener noreferrer"><Image src={logoUrl} alt={fabricante.nome || 'Logo do fabricante'} width={120} height={60} className="object-contain max-h-16 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" /></Link>}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
