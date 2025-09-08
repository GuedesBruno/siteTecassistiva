import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          {/* Você pode adicionar sua logo aqui */}
          {/* <Image src="/logo.png" alt="Tecassistiva Logo" width={40} height={40} /> */}
          <span className="text-2xl font-bold text-gray-800">Tecassistiva</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Produtos
              </Link>
            </li>
            {/* Adicione outros links de navegação aqui (ex: Sobre, Contato) */}
            {/* <li><Link href="/sobre" className="text-gray-600 hover:text-blue-600 transition-colors">Sobre</Link></li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
}