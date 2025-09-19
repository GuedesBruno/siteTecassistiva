"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ProductCard from '@/components/ProductCard';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [results, setResults] = useState({ products: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Carrega o índice de busca local gerado no build.
        const response = await fetch('/search-data.json');
        if (!response.ok) {
          throw new Error('Não foi possível carregar o índice de busca.');
        }
        const data = await response.json();
        const allProducts = data.products || [];

        if (!query) {
          setResults({ products: [] });
        } else {
          // Filtra os produtos no lado do cliente
          const lowerCaseQuery = query.toLowerCase();
          const filteredProducts = allProducts.filter((product) => {
            const attrs = product.attributes || product; // Lida com dados aninhados ou planos
            const name = attrs.nome || '';
            const shortDesc = attrs.descricao_curta || '';
            return (
              name.toLowerCase().includes(lowerCaseQuery) ||
              shortDesc.toLowerCase().includes(lowerCaseQuery)
            );
          });
          setResults({ products: filteredProducts });
        }
      } catch (err) {
        setError('Falha ao carregar os dados de busca. Tente recarregar a página.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]); // Roda a busca sempre que o termo na URL mudar.

  if (isLoading) {
    return <p className="text-center py-10">Carregando resultados...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Resultados da Busca</h1>
      <p className="text-gray-600 mb-8">
        Você buscou por: <span className="font-semibold text-tec-blue">{query}</span>
      </p>

      <section>
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Produtos ({results.products.length})</h2>
        {results.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
            {results.products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p>Nenhum produto encontrado para este termo.</p>
        )}
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-center py-10">Carregando busca...</p>}>
      <SearchResults />
    </Suspense>
  );
}