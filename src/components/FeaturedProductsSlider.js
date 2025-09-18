// sitetecassistiva/src/components/FeaturedProductsSlider.js

"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation'; // Importa o CSS da navegação
import { Navigation, Autoplay } from 'swiper/modules'; // Importa os módulos necessários
import ProductCard from './ProductCard';

export default function FeaturedProductsSlider({ products }) {
  if (!Array.isArray(products) || products.length === 0) {
    return <p>Nenhum produto em destaque no momento.</p>;
  }
  return (
    <div className="py-8 px-8 md:px-16 lg:px-32 relative">
      <h2 className="text-2xl font-bold text-center mb-6">Produtos em Destaque</h2>
      <Swiper
        modules={[Navigation, Autoplay]} // Adiciona Autoplay
        spaceBetween={30}
        slidesPerView={4} // Define 4 colunas como padrão para telas grandes
        navigation
        className="!static" // Força o contêiner do Swiper a não ser um contexto de posicionamento
        loop={true} // Habilita o loop infinito
        autoplay={{
          delay: 2500, // Rola a cada 2.5 segundos
          disableOnInteraction: false, // Não para o autoplay ao interagir
        }}
        breakpoints={{
          // Configurações responsivas
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