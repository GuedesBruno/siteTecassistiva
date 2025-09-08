import { getProducts } from '@/lib/api';
import Image from 'next/image'; // Importamos o componente de Imagem do Next.js

// Transformamos a função Home em uma função 'async'
export default async function Home() {
  // Agora podemos usar 'await' para esperar a busca dos produtos
  const products = await getProducts();

  return (
    // Usando classes do Tailwind para estilizar
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">

        {/* Seção Hero - Inspirada no seu layout */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Nossos Produtos</h1>
          <p className="mt-4 text-lg text-gray-600">As melhores tecnologias da acessibilidade hoje no mercado nacional e internacional!</p>
        </div>

        {/* Grid de Produtos */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Imagem do Produto */}
                {product.images && product.images[0] && (
                   <Image
                     src={product.images[0].src}
                     alt={product.images[0].alt || `Imagem de ${product.name}`}
                     width={400}
                     height={300}
                     className="w-full h-56 object-cover"
                   />
                )}

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                  {/* A descrição vem com tags HTML, por isso usamos dangerouslySetInnerHTML */}
                  <div
                    className="text-gray-600 mt-2 text-sm"
                    dangerouslySetInnerHTML={{ __html: product.short_description }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Nenhum produto encontrado. Verifique a conexão com a API ou se há produtos cadastrados.</p>
        )}

      </div>
    </div>
  );
}