// sitetecassistiva/src/components/Header.js

import Link from 'next/link';
import { getAllCategories } from "@/lib/api";
import Image from 'next/image';

export default async function Header() {
  const categories = await getAllCategories();

  return (
    <header className="bg-[#002554] shadow-md z-[80] relative">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center overflow-visible">
        <div className="flex-shrink-0">
          <Link href="/">
            <Image src="/logo-tecassistiva.svg" alt="Tecassistiva Logo" width={120} height={40} className="w-24 h-auto" />
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/tecassistiva" className="text-white hover:text-sky-300 transition">A Tecassistiva</Link>
          <div className="relative group">
            <button className="text-white hover:text-sky-300 transition" aria-haspopup="true" aria-expanded="false">
              Produtos
            </button>
            <div className="absolute left-0 top-full w-64 bg-white shadow-lg hidden group-hover:block z-50">
              <div className="py-2">
                {Array.isArray(categories) && categories.map(category => {
                  const cat = category.attributes || category;
                  return (
                    <div key={category.id} className="border-b last:border-b-0">
                      <Link href={`/produtos/categorias/${cat.slug}`} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
                        {cat.nome}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <Link href="/atas-abertas" className="text-white hover:text-sky-300 transition">Atas Abertas</Link>
          <Link href="/suporte" className="text-white hover:text-sky-300 transition">Suporte</Link>
          <Link href="/contato" className="text-white hover:text-sky-300 transition">Contato</Link>
        </nav>
        {/* Você pode adicionar um botão de menu para mobile aqui */}
      </div>
    </header>
  );
}