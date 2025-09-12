import { getProducts, getProductBySlug } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

// ADICIONADO: Informa ao Next.js quais páginas de produto devem ser geradas
export async function generateStaticParams() {
    const products = await getProducts();
    if (!products) return [];
    return products.map((product) => ({
        slug: product.slug,
    }));
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return (
      <div className="bg-gray-50 flex-grow">
        <div className="container mx-auto text-center px-4 py-20">
          <h1 className="text-4xl font-bold text-gray-800">Produto não encontrado</h1>
          <p className="mt-4 text-lg text-gray-600">O produto que você está procurando não existe ou foi removido.</p>
          <Link href="/" className="mt-8 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  const { nome, descricao_longa, imagem_principal, galeria_de_imagens } = product;
  
  const fullImageUrl = imagem_principal?.url;
  const imageAlt = imagem_principal?.alternativeText || `Imagem ilustrativa de ${nome}`;

  const tabs = ["Visão Geral", "Fotos", "Vídeos", "Características Funcionais", "Características Técnicas", "Downloads"];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:underline">Página Inicial</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/produtos" className="hover:underline">Produtos</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="w-full">
            {fullImageUrl ? (
              <div className="aspect-square relative w-full rounded-lg shadow-lg overflow-hidden border">
                <Image
                  src={fullImageUrl}
                  alt={imageAlt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-square w-full bg-gray-200 flex items-center justify-center rounded-lg">
                <p className="text-gray-400">Sem imagem disponível</p>
              </div>
            )}
            
            {galeria_de_imagens && galeria_de_imagens.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {galeria_de_imagens.map((img) => (
                  <div key={img.id} className="aspect-square relative w-full rounded-lg overflow-hidden border hover:opacity-80 transition-opacity">
                    <Image 
                      src={img.url} 
                      alt={img.alternativeText || ''} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{nome}</h1>
            {descricao_longa && (
              <div className="prose prose-lg max-w-none text-gray-700">
                {descricao_longa.map((block, index) => (
                  <p key={index}>{block.children.map(child => child.text).join('')}</p>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-16 border-t pt-8">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <a key={tab} href="#" className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                            {tab}
                        </a>
                    ))}
                </nav>
            </div>
            <div className="py-8">
                <h3 className="text-2xl font-bold mb-4">Visão Geral</h3>
                <p className="text-gray-700 leading-relaxed">
                  Aqui entrará o conteúdo detalhado da visão geral do produto.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}