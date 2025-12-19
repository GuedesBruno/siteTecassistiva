import Link from 'next/link';

export const metadata = {
  title: 'Página em Construção | Tecassistiva',
  description: 'Esta página está em construção. Em breve teremos novidades!',
};

export default function EmConstrucaoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* Ícone de Construção Animado */}
        <div className="mb-8 animate-bounce">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
            <svg 
              className="w-12 h-12 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Em Construção
        </h1>

        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Estamos trabalhando em algo incrível! 🚀
        </p>

        {/* Descrição */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <p className="text-gray-700 text-lg mb-4">
            Esta página está sendo desenvolvida com muito carinho para oferecer a melhor experiência para você.
          </p>
          <p className="text-gray-600">
            Em breve, teremos novidades incríveis por aqui!
          </p>
        </div>

        {/* Barra de Progresso Animada */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-full animate-pulse"
              style={{ width: '65%' }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Progresso: 65%</p>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
            Voltar para Home
          </Link>

          <Link 
            href="/produtos"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-gray-200"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
              />
            </svg>
            Ver Produtos
          </Link>
        </div>

        {/* Informação de Contato */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-2">
            Tem alguma dúvida? Entre em contato conosco!
          </p>
          <Link 
            href="/contato"
            className="text-blue-600 hover:text-purple-600 font-semibold transition-colors duration-300"
          >
            Fale Conosco →
          </Link>
        </div>
      </div>
    </div>
  );
}
