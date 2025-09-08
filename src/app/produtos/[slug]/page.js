import { getProducts } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const products = await getProducts();
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  // Para debugar: Veja no terminal do Next.js o que a API está retornando
  // console.log('Produtos recebidos da API:', JSON.stringify(products, null, 2));

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
            {/* NOVA LÓGICA:
              Adicionamos .filter(product => product.attributes) 
              Isso garante que o código só vai tentar renderizar produtos que tenham a propriedade 'attributes',
              prevenindo o erro que você encontrou.
            */}
            {products
              .filter(product => product && product.attributes) // Filtra produtos malformados
              .map((product) => {
                const { nome, slug, descricao_curta, imagem_principal } = product.attributes;
                
                const imageUrl = imagem_principal?.data?.attributes?.url;
                const fullImageUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : null;
                const imageAlt = imagem_principal?.data?.attributes?.alternativeText || `Imagem de ${nome}`;

                return (
                  <Link href={`/produtos/${slug}`} key={product.id} className="group bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    
                    {fullImageUrl ? (
                       <Image
                         src={fullImageUrl}
                         alt={imageAlt}
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
                      <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{nome}</h2>
                      {descricao_curta && (
                        <div className="text-gray-600 mt-2 text-sm">
                          {descricao_curta}
                        </div>
                      )}
                    </div>
                  
                  </Link>
                );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Nenhum produto encontrado. Verifique a conexão com a API do Strapi ou se há produtos cadastrados e publicados.
          </p>
        )}

      </div>
    </div>
  );
}