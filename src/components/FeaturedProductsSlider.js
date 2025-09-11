'use client'; 

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from './ProductCard'; // Importando o novo componente de card

// Importação obrigatória dos estilos do Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function FeaturedProductsSlider({ products }) {
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500">Nenhum produto em destaque encontrado.</p>;
  }

  return (
    <div className="relative px-12"> {/* Espaço para as setas de navegação */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30} // Espaço entre os slides
        navigation // Ativa as setas
        pagination={{ clickable: true }} // Ativa a paginação (bolinhas)
        // Define quantos slides são visíveis em diferentes tamanhos de tela
        breakpoints={{
          // a partir de 640px
          640: {
            slidesPerView: 1,
          },
          // a partir de 768px
          768: {
            slidesPerView: 2,
          },
          // a partir de 1024px
          1024: {
            slidesPerView: 3,
          },
        }}
        className="!pb-12" // Adiciona padding inferior para a paginação não sobrepor o conteúdo
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="h-auto">
            <ProductCard product={product} />
          </SwiperSlide> 
          // AQUI ESTAVA O ERRO: Faltava a tag de fechamento </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}