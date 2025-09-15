'use client'; 

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from './ProductCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function FeaturedProductsSlider({ products }) {
  // Filtra para garantir que apenas produtos com 'attributes' sejam processados
  const validProducts = products?.filter(p => p.attributes) || [];

  if (validProducts.length === 0) {
    return <p className="text-center text-gray-500">Nenhum produto em destaque encontrado.</p>;
  }

  return (
    <div className="relative px-24">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="!pb-12"
      >
        {validProducts.map((product) => (
          <SwiperSlide key={product.id} className="h-auto">
            <ProductCard product={product} />
          </SwiperSlide> 
        ))}
      </Swiper>
    </div>
  );
}