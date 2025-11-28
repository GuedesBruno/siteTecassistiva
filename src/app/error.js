'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-tec-blue mb-2">Oops!</h1>
          <p className="text-2xl font-semibold text-gray-800">Algo deu errado</p>
        </div>

        <p className="text-gray-600 mb-8">
          Desculpe, encontramos um erro inesperado. Por favor, tente novamente.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="w-full bg-tec-blue hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Tentar novamente
          </button>

          <Link
            href="/"
            className="block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Voltar para a página inicial
          </Link>
        </div>

        <div className="mt-12 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Código do erro:</span> {error?.message || 'Erro desconhecido'}
          </p>
        </div>
      </div>
    </div>
  );
}
