import { getProducts } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

// Card de produto para esta página específica
function ProductCard({ product }) {
  const { nome, slug, descricao_curta, imagem_principal } = product;

  // CORREÇÃO APLICADA: Usar a URL diretamente
  const fullImageUrl = imagem_principal?.url;
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

// Componente da página de todos os produtos
export default async function TodosProdutosPage() {
  const allProducts = await getProducts();

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:underline">Página Inicial</Link>
          <span className="mx-2">&gt;</span>
          <span className="font-semibold text-gray-700">Todos os Produtos</span>
        </div>

        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900">Nossos Produtos</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
              Explore o catálogo completo de soluções em tecnologia assistiva da Tecassistiva.
            </p>
        </div>

        {allProducts && allProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
}