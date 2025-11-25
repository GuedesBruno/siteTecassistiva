import BannerSlider from "@/components/BannerSlider";
import FeaturedProductsSlider from "@/components/FeaturedProductsSlider";
import VideoSection from "@/components/VideoSection";
import ManufacturersGrid from "@/components/ManufacturersGrid";
import TestimonialSection from "@/components/TestimonialSection";
import { 
  getBanners, 
  getFeaturedProducts,
  getManufacturers,
  getAllTestimonials,
  getHomeVideos
} from "@/lib/api";
import Link from 'next/link';

export default async function Home() {
  // Busca os dados da API em paralelo para otimizar o tempo de build
  const [banners, featuredProducts, manufacturers, testimonials, homeVideos] = await Promise.all([
    getBanners(),
    getFeaturedProducts(),
    getManufacturers(),
    getAllTestimonials(),
    getHomeVideos(),
  ]);

  return (
    <div>
      <BannerSlider banners={banners || []} />
      {/* Seção Sobre a Tecassistiva */}
      <section className="bg-tec-blue-light text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Tecassistiva</h2>
          <p className="mx-auto leading-relaxed text-xl">
            A Tecassistiva é uma empresa brasileira especializada em soluções de tecnologia assistiva voltadas à inclusão educacional e social de pessoas com deficiência. Atuamos há mais de duas décadas oferecendo equipamentos, softwares e serviços que ampliam a autonomia, o acesso à informação e as oportunidades de aprendizagem para estudantes, profissionais e instituições em todo o país.
            Nosso compromisso é entregar tecnologia que transforma vidas. Por isso desenvolvemos e representamos soluções de alto desempenho para pessoas com deficiência visual e outras necessidades específicas, atendendo escolas, secretarias de educação, universidades, bibliotecas, empresas e órgãos públicos em geral com excelência e responsabilidade.
          </p>
          <div className="mt-8">
            <Link href="/tecassistiva" className="bg-white text-tec-blue font-bold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors shadow-md">Conheça a nossa história</Link>
          </div>
        </div>
      </section>
      <FeaturedProductsSlider products={featuredProducts || []} />

      {/* Novas seções adicionadas */}
      <VideoSection videos={homeVideos || []} />
      <ManufacturersGrid fabricantes={manufacturers || []} />
      <TestimonialSection depoimentos={testimonials || []} />
    </div>
  );
}