// sitetecassistiva/src/components/Header.js
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header({ categories = [] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Efeito para detectar o scroll da página
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0); // Ativa o estado 'rolado' imediatamente
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Limpeza do evento
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className={`bg-tec-blue shadow-md z-[80] fixed top-0 w-full`}>
      <div className={`container mx-auto px-4 flex items-center justify-between transition-all duration-300 ease-in-out ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image
              src={isScrolled ? "/icon-tecassistiva.svg" : "/logo-tecassistiva.svg"}
              alt="Tecassistiva"
              width={isScrolled ? 40 : 140}
              height={isScrolled ? 40 : 48}
              className="transition-all duration-300 ease-in-out h-auto"
            />
          </Link>
        </div>

        {/* Container para alinhar Navegação e Busca à direita */}
        <div className="hidden lg:flex items-center">
          <nav className="flex items-center space-x-8">
            <Link href="/tecassistiva" className="text-white hover:text-tec-blue-light transition font-semibold">A Tecassistiva</Link>
            <div className="relative group py-4 -my-4">
              <Link href="/produtos/categorias" className="text-white hover:text-tec-blue-light transition font-semibold">
                Produtos
              </Link>
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-0 w-72 bg-white shadow-lg hidden group-hover:block z-[120] border">
                <div className="py-2">
                  {Array.isArray(categories) && categories.map(category => {
                    const cat = category.attributes || category;
                    return (
                      <div key={cat.slug || category.id} className="border-b last:border-b-0">
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

          {/* Formulário de Busca Interativo */}
          <form onSubmit={handleSearchSubmit} className="relative group flex items-center ml-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="px-3 py-1.5 border-y border-l border-gray-300 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-tec-blue-light w-0 opacity-0 group-hover:w-40 group-focus-within:w-40 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 ease-in-out"
            />
            <button type="submit" aria-label="Buscar" className="bg-white px-3 py-1.5 border-y border-r border-gray-300 hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        <div className="lg:hidden">
          {/* mobile menu placeholder */}
        </div>
      </div>
    </header>
  );
}