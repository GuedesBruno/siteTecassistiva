import { getProducts, getProductBySlug } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

// ADICIONADO: Esta função gera a lista de todos os slugs para as páginas estáticas
export async function generateStaticParams() {
  const products = await getProducts();

  // Retorna um array no formato esperado pelo Next.js: [{ slug: 'produto-1' }, { slug: 'produto-2' }]
  return products.map((product) => ({
    slug: product.attributes.slug,
  }));
}

// ATUALIZADO: para usar os novos nomes de campo
export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return { title: 'Produto não Encontrado | Tecassistiva' };
  }

  const { nome, descricao_curta } = product.attributes;

  return {
    title: `${nome} | Tecassistiva`,
    description: descricao_curta || `Detalhes sobre o produto ${nome}`,
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

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

  const { nome, descricao_longa, imagem_principal, galeria_de_imagens } = product.attributes;
  
  const imageUrl = imagem_principal?.data?.attributes?.url;
  const fullImageUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : null;
  const imageAlt = imagem_principal?.data?.attributes?.alternativeText || `Imagem ilustrativa de ${nome}`;

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="w-full">
            {fullImageUrl ? (
              <div className="aspect-square relative w-full rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={fullImageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-square w-full bg-gray-200 flex items-center justify-center rounded-lg">
                <p className="text-gray-400">Sem imagem disponível</p>
              </div>
            )}
            {galeria_de_imagens?.data && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {galeria_de_imagens.data.map((img) => (
                  <div key={img.id} className="aspect-square relative w-full rounded-lg overflow-hidden">
                    <Image src={`${STRAPI_URL}${img.attributes.url}`} alt={img.attributes.alternativeText || ''} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{nome}</h1>
            
            {descricao_longa ? (
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: descricao_longa }}
              />
            ) : (
              <p className="text-gray-600">Nenhuma descrição detalhada disponível.</p>
            )}

            <div className="mt-8">
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300">
                &larr; Voltar para todos os produtos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}