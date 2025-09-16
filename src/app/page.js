import { getFeaturedProducts, getBanners } from '@/lib/api'; 
import BannerSlider from '@/components/BannerSlider';
import ProductCard from '@/components/ProductCard'; // Assumindo que o ProductCard foi movido para os componentes
import Link from 'next/link';

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const banners = await getBanners();

  return (
    <>
      <BannerSlider banners={banners} />

      <section className="bg-white py-20">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Tecassistiva</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            A Tecassistiva foi fundada em 2007...
          </p>
          <Link href="/tecassistiva" className="text-tec-blue-light hover:underline font-semibold text-lg">
            Conheça a nossa história
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Nossos Produtos</h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
              Veja abaixo nossos destaques...
            </p>
          </div>
          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                // CORREÇÃO: Acedemos a product.attributes
                <ProductCard key={product.id} product={product.attributes} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Nenhum produto em destaque encontrado.</p>
          )}
          <div className="text-center mt-12">
            <Link href="/produtos" className="inline-block bg-tec-blue-light text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-800 text-lg">
              Todos nossos produtos aqui
            </Link>
          </div>
        </div>
      </section>
      
      {/* Restante das seções... */}
    </>
  );
}