import { getFeaturedProducts } from '@/lib/api'; // Mudamos para buscar apenas os destaques
import Image from 'next/image';
import Link from 'next/link';

// Componente para o Card de Produto, para organizar o código
function ProductCard({ product }) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  
  const { nome, slug, descricao_curta, imagem_principal } = product;

  const imageUrl = imagem_principal?.url;
  const fullImageUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : null;
  const imageAlt = imagem_principal?.alternativeText || `Imagem de ${nome}`;

  if (!slug) return null;

  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-900 p-4 text-white text-center">
        <h3 className="text-xl font-bold">{nome}</h3>
      </div>
      <div className="flex-shrink-0">
        <div className="relative h-56 w-full">
          {fullImageUrl ? (
            <Image
              src={fullImageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-400">Sem imagem</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between bg-white p-6">
        <div className="flex-1">
          <p className="text-sm text-gray-600">{descricao_curta}</p>
        </div>
        <div className="mt-6">
          <Link href={`/produtos/${slug}`} className="text-blue-600 hover:text-blue-800 font-semibold">
            Ver detalhes &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}


export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    // Seção de Destaques da Página Inicial
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Título da seção, conforme o PDF */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Nossos Produtos</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Veja abaixo nossos destaques, a TECA possui mais de 50 produtos, as melhores tecnologias da acessibilidade hoje no mercado nacional e internacional!
          </p>
        </div>

        {/* Grid de Produtos em Destaque */}
        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Nenhum produto em destaque encontrado.
          </p>
        )}

        {/* Botão para ver todos os produtos */}
        <div className="text-center mt-12">
          <Link 
            href="/produtos" // Futura página com todos os produtos
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Todos nossos produtos aqui
          </Link>
        </div>
      </div>
    </div>
  );
}