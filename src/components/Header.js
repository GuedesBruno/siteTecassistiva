import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <Image 
              src="/logo-tecassistiva.png" // Caminho para a logo na pasta /public
              alt="Tecassistiva Logo"
              width={200} // Ajuste a largura conforme necessário
              height={50}  // Ajuste a altura conforme necessário
              priority
            />
          </Link>
          
          {/* Navegação Principal */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">A Tecassistiva</Link>
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">Produtos</Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">Atas Abertas</Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">Suporte</Link>
            <Link href="#" className="bg-blue-800 text-white px-5 py-2 rounded-md hover:bg-blue-900 transition-colors font-bold">Contato</Link>
          </nav>

          {/* Menu Mobile (Ícone) */}
          <div className="md:hidden">
            <button className="text-gray-700 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}