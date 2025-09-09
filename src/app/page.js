import { getFeaturedProducts, getBanners } from '@/lib/api'; 
import BannerSlider from '@/components/BannerSlider'; // Importamos o novo componente
import Image from 'next/image';
import Link from 'next/link';

function ProductCard({ product }) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const { nome, slug, descricao_curta, imagem_principal } = product;
  const imageUrl = imagem_principal?.url;
  const fullImageUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : null;
  const imageAlt = imagem_principal?.alternativeText || `Imagem de ${nome}`;

  if (!slug) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col text-center">
      <div className="bg-tec-navy p-4 text-white rounded-t-lg">
        <h3 className="text-xl font-bold">{nome}</h3>
      </div>
      <div className="p-5 flex-grow flex flex-col items-center">
        <div className="relative h-48 w-full mb-4">
          {fullImageUrl && (
            <Image src={fullImageUrl} alt={imageAlt} fill className="object-contain" />
          )}
        </div>
        <p className="text-gray-600 text-sm flex-grow mb-4">{descricao_curta}</p>
        <Link href={`/produtos/${slug}`} className="text-tec-blue-light hover:underline mt-auto self-center font-semibold">
          Saiba mais...
        </Link>
      </div>
    </div>
  );
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const banners = await getBanners(); // Buscamos os dados dos banners

  return (
    <>
      {/* Seção 1: ATUALIZADO para usar o componente BannerSlider */}
      <BannerSlider banners={banners} />

      {/* Seção 2: Sobre a Tecassistiva */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Tecassistiva</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            A Tecassistiva foi fundada em 2007...
          </p>
          <Link href="#" className="text-tec-blue-light hover:underline font-semibold text-lg">
            Conheça a nossa história
          </Link>
        </div>
      </section>

      {/* Seção 3: Nossos Produtos em Destaque */}
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
                <ProductCard key={product.id} product={product} />
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
      
      {/* O restante das seções (Vídeos, Fornecedores, etc.) continua aqui... */}
    </>
  );
}