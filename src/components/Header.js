import Link from 'next/link';
import Image from 'next/image';

// Componente para um ícone simples (ex: busca)
const Icon = ({ path }) => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

export default function Header() {
  return (
    // A classe 'bg-tec-blue' agora aplicará a nova cor #002554
    <header className="bg-tec-blue text-white shadow-lg sticky top-0 z-50">
      {/* Barra Superior - Acessibilidade e Busca */}
      <div className="bg-black/20"> {/* Usando preto com transparência para um tom mais escuro que a base */}
          <div className="container mx-auto px-6 py-1 flex justify-end items-center space-x-6 text-sm">
              <Link href="#" className="hover:underline">Opções de Acessibilidade</Link>
              <Link href="#" className="flex items-center hover:underline">
                  <span className="mr-1">Busca</span>
                  <Icon path="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </Link>
          </div>
      </div>

      {/* Barra Principal - Logo e Navegação */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <Image 
              src="/logo-tecassistiva.svg" // Verifique se o nome/extensão está correto
              alt="Tecassistiva Logo"
              width={150}
              height={30}
              priority
            />
          </Link>
          
          {/* Navegação Principal */}
          <nav className="hidden md:flex items-center space-x-8 text-lg">
            <Link href="#" className="font-semibold hover:text-gray-300 transition-colors">A Tecassistiva</Link>
            <Link href="/" className="font-semibold hover:text-gray-300 transition-colors">Produtos</Link>
            <Link href="#" className="font-semibold hover:text-gray-300 transition-colors">Atas Abertas</Link>
            <Link href="#" className="font-semibold hover:text-gray-300 transition-colors">Suporte</Link>
            <Link href="#" className="font-semibold hover:text-gray-300 transition-colors">Contato</Link>
          </nav>

          {/* Menu Mobile (Ícone) */}
          <div className="md:hidden">
            <button className="text-white focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}