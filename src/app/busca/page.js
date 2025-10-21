"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import SearchResultCard from '@/components/SearchResultCard';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/search-data.json?v=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error('Não foi possível carregar o índice de busca.');
        }
        const data = await response.json();
        
        if (!query) {
          setResults({});
        } else {
          const lowerCaseQuery = query.toLowerCase();
          const filteredData = data.filter((item) => {
            const title = item.title || '';
            const description = item.description || '';
            const content = item.content || '';
            return (
              title.toLowerCase().includes(lowerCaseQuery) ||
              description.toLowerCase().includes(lowerCaseQuery) ||
              content.toLowerCase().includes(lowerCaseQuery)
            );
          });

          // Agrupa os resultados por tipo
          const groupedResults = filteredData.reduce((acc, item) => {
            const type = item.type || 'Outros';
            if (!acc[type]) {
              acc[type] = [];
            }
            acc[type].push(item);
            return acc;
          }, {});

          setResults(groupedResults);
        }
      } catch (err) {
        setError('Falha ao carregar os dados de busca. Tente recarregar a página.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]);

  if (isLoading) {
    return <p className="text-center py-10">Carregando resultados...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  const resultKeys = Object.keys(results);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Resultados da Busca</h1>
      <p className="text-gray-600 mb-8">
        Você buscou por: <span className="font-semibold text-tec-blue">{query}</span>
      </p>

      {resultKeys.length > 0 ? (
        resultKeys.map(type => (
          <section key={type} className="mb-12">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">{type} ({results[type].length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
              {results[type].map(item => {
                if (type === 'Produto') {
                  // O ProductCard espera uma estrutura de dados diferente
                  const product = {
                    id: item.id.replace('product-', ''),
                    attributes: {
                      nome: item.title,
                      slug: item.slug.replace('/produtos/', ''),
                      descricao_curta: item.description,
                      // a `imagem_principal` estaria faltando aqui, então o card pode não mostrar uma imagem.
                      // Esta é uma limitação da estrutura de dados de busca atual.
                    }
                  };
                  return <ProductCard key={item.id} product={product} />;
                }
                return <SearchResultCard key={item.id} result={item} />;
              })}
            </div>
          </section>
        ))
      ) : (
        <p>Nenhum resultado encontrado para este termo.</p>
      )}
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