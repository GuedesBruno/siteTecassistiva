import BannerSlider from "@/components/BannerSlider";
import FeaturedProductsSlider from "@/components/FeaturedProductsSlider";
import { getBanners, getFeaturedProducts } from "@/lib/api";
import Link from 'next/link';

export default async function Home() {
  // Busca os dados da API em paralelo para otimizar o tempo de build
  const [banners, featuredProducts] = await Promise.all([
    getBanners(),
    getFeaturedProducts(),
  ]);

  return (
    <main>
      <BannerSlider banners={banners || []} />
      {/* Informational block matching the attached screenshot */}
      <section className="bg-[#007bff] text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Tecassistiva</h2>
          <p className="max-w-3xl mx-auto leading-relaxed">
            A Tecassistiva foi fundada em 2007, visando atender a grande demanda reprimida de produtos e serviços de qualidade
            com preços competitivos, que impediam há muitos anos que as pessoas com deficiência no Brasil, tivessem
            acesso ao grande desenvolvimento tecnológico que vinha acontecendo em outros países.
            O desenvolvimento de projetos inovadores para pessoas com deficiência, com sustentabilidade, tem sido o principal
            objetivo da Tecassistiva.
          </p>
          <div className="mt-8">
            <Link href="/tecassistiva" className="bg-white text-[#007bff] font-semibold py-3 px-6 rounded-md">Conheça a nossa história</Link>
          </div>
        </div>
      </section>
      <FeaturedProductsSlider products={featuredProducts || []} />
    </main>
  );
}