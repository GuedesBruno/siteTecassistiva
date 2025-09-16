// sitetecassistiva/src/components/Header.js

import Link from 'next/link';
import { getAllCategories } from "@/lib/api";
import Image from 'next/image';

export default async function Header() {
  const categories = await getAllCategories();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-shrink-0">
          <Link href="/">
              <Image src="/logo-tecassistiva.svg" alt="Tecassistiva Logo" width={150} height={50} />
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-blue-500 transition">Início</Link>
          <div className="relative group">
            <button className="text-gray-600 hover:text-blue-500 transition">
              Produtos
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible">
              {Array.isArray(categories) && categories.map(category => (
                <Link key={category.id} href={`/produtos/categorias/${category.attributes.slug}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {category.attributes.nome}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/tecassistiva" className="text-gray-600 hover:text-blue-500 transition">O que é Tecassistiva?</Link>
        </nav>
        {/* Você pode adicionar um botão de menu para mobile aqui */}
      </div>
    </header>
  );
}