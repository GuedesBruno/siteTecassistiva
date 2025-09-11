'use client'; 

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

// Importação obrigatória dos estilos do Swiper para a navegação e paginação
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BannerSlider({ banners }) {

  // Se não houver banners, exibe um placeholder
  if (!banners || banners.length === 0) {
    return (
      <div className="h-[70vh] bg-gray-200 flex items-center justify-center">
        <p>Nenhum banner para exibir.</p>
      </div>
    );
  }

  return (
    <section className="h-[80vh] max-h-[700px] w-full bg-gray-100">
      <Swiper
        // Módulos que ativam a navegação (setas), paginação (bolinhas) e autoplay
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation // Ativa as setas
        pagination={{ clickable: true }} // Ativa as bolinhas
        loop={true} // Permite que o carrossel volte ao início
        autoplay={{
          delay: 5000, // Tempo de espera de 5 segundos
          disableOnInteraction: false,
        }}
        className="w-full h-full"
      >
        {banners.map((banner, index) => {
          // Usa a URL completa da imagem, como descobrimos
          const fullImageUrl = banner.imagem?.url;
          const imageAlt = banner.imagem?.alternativeText || banner.titulo;
          
          // Lógica para intercalar: se o índice for ímpar, inverte a ordem no desktop
          const isReversed = index % 2 !== 0;

          return (
            <SwiperSlide key={banner.id}>
              {/* Container principal do slide: flex-col no mobile, flex-row no desktop */}
              <div className={`w-full h-full flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                
                {/* Coluna do Texto (1/3 no desktop) */}
                <div className="w-full lg:w-1/3 h-1/2 lg:h-full bg-grey-450 text-tec-blue flex items-center justify-center p-8 lg:p-12 order-2 lg:order-1">
                  <div className="max-w-md text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{banner.titulo}</h1>
                    <p className="text-lg md:text-xl mb-6">{banner.subtitulo}</p>
                    {banner.link_do_botao && banner.texto_do_botao && (
                        <Link href={banner.link_do_botao} className="bg-tec-blue-light hover:bg-tec-blue text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
                            {banner.texto_do_botao}
                        </Link>
                    )}
                  </div>
                </div>

                {/* Coluna da Imagem (2/3 no desktop) */}
                <div className="w-full lg:w-2/3 h-1/2 lg:h-full relative order-1 lg:order-2">
                  {fullImageUrl ? (
                    <Image
                      src={fullImageUrl}
                      alt={imageAlt}
                      fill
                      className="object-cover"
                      priority={index === 0} // Otimiza o carregamento da primeira imagem
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