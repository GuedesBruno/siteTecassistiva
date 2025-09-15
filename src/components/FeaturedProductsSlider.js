// sitetecassistiva/src/components/FeaturedProductsSlider.js

"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import ProductCard from './ProductCard';

export default function FeaturedProductsSlider({ products }) {
  if (!Array.isArray(products) || products.length === 0) {
    return <p>Nenhum produto em destaque no momento.</p>;
  }
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Produtos em Destaque</h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={4}
        navigation
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 10 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 30 },
          1024: { slidesPerView: 4, spaceBetween: 30 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}