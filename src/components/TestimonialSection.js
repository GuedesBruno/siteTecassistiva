
"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function TestimonialSection({ depoimentos }) {
  if (!depoimentos || depoimentos.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-100 py-10">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900">Depoimentos</h2>
        </div>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={depoimentos.length > 1}
          autoplay={{
            delay: 8000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination-testimonials',
          }}
          className="relative"
        >
          {depoimentos.map((depoimento) => {
            const attrs = depoimento.attributes || depoimento;
            const { texto, autor, descricao_autor } = attrs;
            return (
              <SwiperSlide key={depoimento.id}>
                <div className="mx-auto text-center pb-12">
                  <blockquote className="text-lg md:text-2xl italic leading-relaxed mb-8 text-gray-700">
                    <span className="text-4xl leading-none font-serif">&ldquo;</span>
                    {texto}
                    <span className="text-4xl leading-none font-serif">&rdquo;</span>
                  </blockquote>
                  <footer className="text-lg">
                    <p className="font-bold text-gray-900">{autor}</p>
                    <p className="text-gray-600">{descricao_autor}</p>
                  </footer>
                </div>
              </SwiperSlide>
            );
          })}
          <div className="swiper-pagination-testimonials !absolute !bottom-0 !left-1/2 !-translate-x-1/2 flex justify-center space-x-2"></div>
        </Swiper>
      </div>
    </section>
  );
}