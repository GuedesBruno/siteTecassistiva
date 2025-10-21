
"use client";
import Link from 'next/link';
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
    <section className="bg-gray-100 py-16 relative">
      <div className="container mx-auto px-8 md:px-16 lg:px-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Nossos Produtos</h2>
          <p className="text-lg text-gray-600 mt-2 max-w-4xl mx-auto">
            Veja abaixo nossos destaques, a TECA possui mais de 50 produtos, as melhores tecnologias para acessibilidade 
            no mercado nacional e internacional!
          </p>
        </div>
        <Swiper
          modules={[Navigation, Autoplay]} // Adiciona Autoplay
          spaceBetween={30}
          slidesPerView={4} // Define 4 colunas como padrão para telas grandes
          navigation={{
            prevEl: '.featured-products-prev',
            nextEl: '.featured-products-next',
          }}
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
        <div className="text-center mt-12">
          <Link href="/produtos" className="bg-tec-blue-light text-white font-bold py-3 px-8 rounded-md hover:bg-tec-blue transition-colors shadow-md">
            Todos nossos produtos aqui
          </Link>
        </div>
      </div>
      {/* Botões de navegação personalizados movidos para fora do container */}
      <div className="swiper-button-prev featured-products-prev"></div>
      <div className="swiper-button-next featured-products-next"></div>
    </section>
  );
}