// sitetecassistiva/src/components/Header.js

import Link from 'next/link';
import { getAllCategories } from "@/lib/api";
import Image from 'next/image';

export default async function Header() {
  const categories = await getAllCategories();

  return (
    <header className="bg-tec-blue shadow-md z-[80] relative">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between overflow-visible" style={{ minHeight: 80 }}>
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image src="/logo-tecassistiva.svg" alt="Tecassistiva" width={140} height={48} className="w-36 h-auto"  style={{ height: 'auto' }}/>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center space-x-8">
          <Link href="/tecassistiva" className="text-white hover:text-tec-blue-light transition font-semibold">A Tecassistiva</Link>
          <div className="relative group">
            <Link href="/produtos/categorias" className="text-white hover:text-tec-blue-light transition font-semibold">
              Produtos
            </Link>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-0 w-72 bg-white shadow-lg hidden group-hover:block z-[120] border">
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
          <Link href="/atas-abertas" className="text-white hover:text-tec-blue-light transition font-semibold">Atas Abertas</Link>
          <Link href="/suporte" className="text-white hover:text-tec-blue-light transition font-semibold">Suporte</Link>
          <Link href="/contato" className="text-white hover:text-tec-blue-light transition font-semibold">Contato</Link>
        </nav>

        <div className="lg:hidden">
          {/* mobile menu placeholder */}
        </div>
      </div>
    </header>
  );
}