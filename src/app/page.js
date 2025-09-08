import { getProducts } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

// Transformamos a função Home em uma função 'async' para permitir a busca de dados no servidor
export default async function Home() {
  // Usamos 'await' para esperar a busca dos produtos antes de renderizar a página
  const products = await getProducts();

  return (
    // Usando classes do Tailwind CSS para estilizar o container principal
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        
        {/* Seção de Título - Inspirada no seu layout */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extbold text-gray-900">Nossos Produtos</h1>
          <p className="mt-4 text-lg text-gray-600">
            As melhores tecnologias da acessibilidade hoje no mercado nacional e internacional!
          </p>
        </div>

        {/* Lógica para exibir a grade de produtos ou a mensagem de "nenhum produto" */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Usamos .map() para criar um card para cada produto na lista */}
            {products.map((product) => (
              <Link href={`/produtos/${product.slug}`} key={product.id} className="group bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                
                {/* Imagem do Produto */}
                {/* Verifica se o produto tem imagens antes de tentar exibir */}
                {product.images && product.images[0] ? (
                   <Image
                     src={product.images[0].src}
                     alt={product.images[0].alt || `Imagem de ${product.name}`}
                     width={400}
                     height={300}
                     className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                   />
                ) : (
                  // Mostra um placeholder se não houver imagem
                  <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-400">Sem imagem</p>
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{product.name}</h2>
                  {/* A descrição vem com tags HTML, por isso usamos dangerouslySetInnerHTML */}
                  <div
                    className="text-gray-600 mt-2 text-sm"
                    dangerouslySetInnerHTML={{ __html: product.short_description }}
                  />
                </div>
              
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Nenhum produto encontrado. Verifique a conexão com a API ou se há produtos cadastrados.
          </p>
        )}

      </div>
    </div>
  );
}