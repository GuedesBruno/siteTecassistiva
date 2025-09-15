import { getProducts } from '@/lib/api';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default async function TodosProdutosPage() {
  const allProducts = await getProducts();

  // ADICIONADO: Filtro de segurança para garantir que a API retornou dados válidos.
  // Isto impede o erro de build se a API retornar 'null' ou um item malformado.
  const validProducts = Array.isArray(allProducts) 
    ? allProducts.filter(p => p && p.attributes) 
    : [];

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-24 py-12">
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

        {validProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {validProducts.map((product) => (
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