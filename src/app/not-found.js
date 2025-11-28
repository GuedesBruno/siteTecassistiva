import Link from 'next/link';

export const metadata = {
  title: 'Página não encontrada | Tecassistiva',
  description: 'A página que você está procurando não existe.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-tec-blue mb-2">404</h1>
          <p className="text-2xl font-semibold text-gray-800">Página não encontrada</p>
        </div>

        <p className="text-gray-600 mb-8">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="block bg-tec-blue hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Voltar para a página inicial
          </Link>

          <Link
            href="/produtos"
            className="block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Ver produtos
          </Link>
        </div>

        <div className="mt-12 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            Se o problema persistir, entre em contato conosco através da <Link href="/contato" className="text-tec-blue hover:underline">página de contato</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
