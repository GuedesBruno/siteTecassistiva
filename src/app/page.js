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
            A Tecassistiva foi fundada em 2007, visando atender a grande demanda reprimida de produtos e serviços de qualidade
            com preços competitivos, que impediam há muitos anos que as pessoas com deficiência no Brasil, tivessem
            acesso ao grande desenvolvimento tecnológico que vinha acontecendo em outros países.
            O desenvolvimento de projetos inovadores para pessoas com deficiência, com sustentabilidade, tem sido o principal
            objetivo da Tecassistiva.
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