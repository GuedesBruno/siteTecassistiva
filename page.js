import Image from 'next/image';
import { getProductBySlug, getAllProducts, getStrapiMediaUrl } from '@/lib/api';
import RichTextRenderer from '@/components/RichTextRenderer';
import { notFound } from 'next/navigation';

// Opcional: Gera as páginas de produto estaticamente no momento do build para melhor performance
export async function generateStaticParams() {
  try {
    const products = await getAllProducts(); // Busca todos os produtos
    // Retorna um array de slugs para o Next.js saber quais páginas gerar
    return products.map((product) => ({
      slug: product.attributes.slug,
    }));
  } catch (error) {
    console.error("Falha ao gerar parâmetros estáticos para produtos:", error);
    return [];
  }
}

export default async function ProductPage({ params }) {
  const { slug } = params;
  const productData = await getProductBySlug(slug);

  // Se o produto não for encontrado, exibe a página 404
  if (!productData) {
    notFound();
  }

  const {
    nome,
    descricao_curta,
    descricao_longa,
    imagem_principal,
  } = productData.attributes;

  const mainImageUrl = getStrapiMediaUrl(imagem_principal?.data?.attributes?.url);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Coluna da Imagem */}
          <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
            {mainImageUrl ? (
              <Image
                src={mainImageUrl}
                alt={`Imagem do produto ${nome}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Imagem indisponível</p>
              </div>
            )}
          </div>

          {/* Coluna de Informações */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-tec-blue mb-4">{nome}</h1>
            {descricao_curta && (
              <p className="text-lg text-gray-600 mb-6">{descricao_curta}</p>
            )}
            <a 
              href="/contato" 
              className="bg-tec-blue hover:bg-tec-blue-dark text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors duration-300 self-start"
            >
              Solicitar Orçamento
            </a>
          </div>
        </div>

        {/* Seção de Descrição Longa com RichTextRenderer */}
        {descricao_longa && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-tec-blue mb-4 border-b-2 border-gray-200 pb-2">
              Descrição Detalhada
            </h2>
            <div className="mt-4">
              {/* Aqui utilizamos o componente! */}
              <RichTextRenderer content={descricao_longa} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}