import BannerSlider from "@/components/BannerSlider";
import FeaturedProductsSlider from "@/components/FeaturedProductsSlider";
import VideoSection from "@/components/VideoSection";
import ManufacturersGrid from "@/components/ManufacturersGrid";
import TestimonialSection from "@/components/TestimonialSection";
import { Schema } from "@/components/Schema";
import { generateOrganizationSchema, generateWebPageSchema } from "@/lib/schemas";
import { 
  getBanners, 
  getFeaturedProducts,
  getManufacturers,
  getAllTestimonials,
  getHomeVideos
} from "@/lib/api";
import Link from 'next/link';

export const metadata = {
  title: 'Tecnologia & Acessibilidade',
  description: 'A Tecassistiva é uma empresa brasileira especializada em soluções de tecnologia assistiva voltadas à inclusão educacional e social de pessoas com deficiência.',
  openGraph: {
    title: 'Tecassistiva - Tecnologia & Acessibilidade',
    description: 'Soluções em tecnologia assistiva para inclusão educacional e social',
    url: 'https://www.tecassistiva.com.br/',
    type: 'website',
    images: [
      {
        url: 'https://www.tecassistiva.com.br/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tecassistiva'
      }
    ]
  }
};

export default async function Home() {
  // Busca os dados da API em paralelo para otimizar o tempo de build
  const [banners, featuredProducts, manufacturers, testimonials, homeVideos] = await Promise.all([
    getBanners(),
    getFeaturedProducts(),
    getManufacturers(),
    getAllTestimonials(),
    getHomeVideos(),
  ]);

  const organizationSchema = generateOrganizationSchema();
  const webPageSchema = generateWebPageSchema(
    'Tecassistiva - Tecnologia & Acessibilidade',
    'Soluções em tecnologia assistiva para inclusão educacional e social',
    'https://www.tecassistiva.com.br/',
    'https://www.tecassistiva.com.br/og-image.png'
  );

  return (
    <>
      <Schema schema={organizationSchema} />
      <Schema schema={webPageSchema} />
      <div>
        <BannerSlider banners={banners || []} />
        {/* Seção Sobre a Tecassistiva */}
        <section className="bg-tec-blue-light text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-extrabold mb-4">Tecassistiva</h2>
            <p className="mx-auto text-justify leading-relaxed text-xl">
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
    </>
  );
}