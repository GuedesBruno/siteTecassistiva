import { getProducts } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Nossos Produtos</h1>
          <p className="mt-4 text-lg text-gray-600">
            As melhores tecnologias da acessibilidade hoje no mercado nacional e internacional!
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              // Acessando os atributos do produto do Strapi
              const { name, slug, short_description, images } = product.attributes;
              // Pegando a URL da primeira imagem
              const imageUrl = images?.data?.[0]?.attributes?.url;
              // Criando a URL completa da imagem, caso ela seja relativa
              const fullImageUrl = imageUrl ? `http://URL_DO_SEU_STRAPI${imageUrl}` : null;
              
              return (
                <Link href={`/produtos/${slug}`} key={product.id} className="group bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  
                  {fullImageUrl ? (
                     <Image
                       src={fullImageUrl}
                       alt={images.data[0].attributes.alternativeText || `Imagem de ${name}`}
                       width={400}
                       height={300}
                       className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                     />
                  ) : (
                    <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-400">Sem imagem</p>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{name}</h2>
                    {short_description && (
                      <div
                        className="text-gray-600 mt-2 text-sm"
                        dangerouslySetInnerHTML={{ __html: short_description }}
                      />
                    )}
                  </div>
                
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Nenhum produto encontrado. Verifique a conexão com a API do Strapi ou se há produtos cadastrados.
          </p>
        )}

      </div>
    </div>
  );
}