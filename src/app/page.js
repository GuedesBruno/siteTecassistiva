import { getFeaturedProducts, getBanners } from '@/lib/api'; 
import BannerSlider from '@/components/BannerSlider';
import FeaturedProductsSlider from '@/components/FeaturedProductsSlider';
import Link from 'next/link';

export default async function Home() {
  // As chamadas à API continuam iguais
  const featuredProducts = await getFeaturedProducts();
  const banners = await getBanners();
  
  // ADICIONADO: Passamos os dados para os componentes, que já foram corrigidos
  // para lidar com a estrutura 'attributes' e com arrays vazios.
  return (
    <>
      <BannerSlider banners={banners} />
      <section className="bg-tec-blue-light py-20">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Tecassistiva</h2>
          <p className="text-lg text-white mb-8 leading-relaxed">
            A Tecassistiva foi fundada em 2007, visando atender a grande demanda reprimida de produtos e serviços de qualidade
            com preços competitivos, que impediam há muitos anos que as pessoas com deficiência no Brasil, tivessem
            acesso ao grande desenvolvimento tecnológico que vinha acontecendo em outros países.
          </p>
          <Link href="/tecassistiva" className="bg-white hover:bg-gray-400 py-3 px-6 text-lg transition-colors">
            Conheça a Tecassistiva
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Nossos Produtos</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
              Veja abaixo nossos destaques, a TECA possui mais de 50 produtos, as melhores tecnologias da acessibilidade hoje
              no mercado nacional e internacional!
            </p>
          </div>
          
          <FeaturedProductsSlider products={featuredProducts} />

          <div className="text-center mt-12">
            <Link href="/produtos" className="inline-block bg-tec-blue-light text-white px-8 py-3 font-semibold hover:bg-blue-800 text-lg">
              Todos nossos produtos aqui
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}