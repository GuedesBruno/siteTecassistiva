"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header({ categories = [] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const headerRef = useRef(null);

  const supportMenuItems = [
    { name: 'Softwares', slug: '/suporte?tab=softwares' },
    { name: 'Manuais e Documentos', slug: '/suporte?tab=documentos' },
    { name: 'Drivers e Utilitários', slug: '/suporte?tab=drivers' },
    { name: 'Contato do Suporte', slug: '/suporte?tab=contato' },
  ];

  // Função para medir a altura do header e definir uma variável CSS
  const updateHeaderHeight = () => {
    if (headerRef.current) {
      document.documentElement.style.setProperty(
        '--header-height',
        `${headerRef.current.offsetHeight}px`
      );
    }
  };

  // Efeito para detectar o scroll da página e atualizar a altura
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
      updateHeaderHeight(); // Atualiza a altura do header em cada scroll
    };

    // Atualiza a altura inicialmente
    updateHeaderHeight();

    window.addEventListener('scroll', handleScroll);

    // Observa mudanças no tamanho do header (ex: devido a transições ou conteúdo responsivo)
    const resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight();
    });

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    // Limpeza dos eventos e observer
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (headerRef.current) {
        resizeObserver.unobserve(headerRef.current);
      }
    };
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsMenuOpen(false); // Fecha o menu mobile
      router.push(`/busca?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header ref={headerRef} className={`bg-tec-blue shadow-md z-[80] fixed top-0 left-0 right-0`}> {/* Anexa a ref para medir a altura do cabeçalho */}
      <div className={`container mx-auto px-4 flex items-center justify-between transition-all duration-300 ease-in-out ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center" aria-label="Tecassistiva - Página inicial">
            <Image
              src={isScrolled ? "/icon-tecassistiva.svg" : "/logo-tecassistiva.svg"}
              alt="Tecassistiva"
              width={isScrolled ? 140 : 140}
              height={isScrolled ? 40 : 40}
              className="transition-all duration-300 ease-in-out h-auto"
              priority
            />          </Link>
        </div>

        {/* Container para alinhar Navegação e Busca à direita */}
        <div className="hidden lg:flex items-center">
          <nav className="flex items-center space-x-8 flex-wrap" aria-label="Navegação principal">
            <Link href="/tecassistiva" className="text-white hover:text-tec-blue-light transition font-semibold">A Tecassistiva</Link>
            <div className="relative group py-4 -my-4">
              <Link href="/produtos" className="text-white hover:text-tec-blue-light transition font-semibold" aria-haspopup="true" aria-expanded="false">
                Produtos
              </Link>
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-0 w-72 bg-white shadow-lg hidden group-hover:block z-[120] border" role="menu">
                <div className="py-2">
                  <div className="border-b last:border-b-0">
                    <Link href="/ambientes" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100" role="menuitem">
                      Ambientes
                    </Link>
                  </div>
                  {Array.isArray(categories) && categories.map(category => {
                    const cat = category.attributes || category;
                    return (
                      <div key={cat.slug || category.id} className="border-b last:border-b-0">
                        <Link href={`/produtos/categorias/${cat.slug}`} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100" role="menuitem">
                          {cat.nome}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <Link href="/atas-abertas" className="text-white hover:text-tec-blue-light transition font-semibold">Atas Abertas</Link>
            <div className="relative group py-4 -my-4">
              <Link href="/suporte" className="text-white hover:text-tec-blue-light transition font-semibold" aria-haspopup="true" aria-expanded="false">
                Suporte
              </Link>
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-0 w-72 bg-white shadow-lg hidden group-hover:block z-[120] border" role="menu">
                <div className="py-2">
                  {supportMenuItems.map(item => (
                    <div key={item.name} className="border-b last:border-b-0">
                      <Link href={item.slug} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100" role="menuitem">
                        {item.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/contato" className="text-white hover:text-tec-blue-light transition font-semibold">Contato</Link>
          </nav>

          {/* Formulário de Busca Interativo */}
          <form onSubmit={handleSearchSubmit} className="relative group flex items-center ml-6" role="search" aria-label="Buscar no site">
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

        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menu"
            className="text-white focus:outline-none font-bold text-sm uppercase tracking-wider"
          >
            Menu
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-full bg-tec-blue z-[100] transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col items-center text-center">
          <div className="flex justify-between items-center mb-4 w-full">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Image
                src="/logo-tecassistiva.svg"
                alt="Tecassistiva"
                width={120}
                height={35}
                priority
              />
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              aria-label="Fechar menu"
              className="text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Formulário de Busca movido para o topo */}
          <form onSubmit={handleSearchSubmit} className="relative mb-6 w-full max-w-sm" role="search" aria-label="Buscar no site">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="w-full px-4 py-2 rounded-full text-gray-800 text-sm focus:outline-none shadow-md"
            />
            <button type="submit" aria-label="Buscar" className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-tec-blue">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <nav className="flex flex-col space-y-2 w-full overflow-y-auto max-h-[60vh] pb-4" aria-label="Menu de navegação mobile">
            <Link href="/tecassistiva" onClick={() => setIsMenuOpen(false)} className="text-white text-base font-semibold py-1">A Tecassistiva</Link>
            <div className="flex flex-col space-y-1 items-center">
              <Link href="/produtos" onClick={() => setIsMenuOpen(false)} className="text-white text-base font-semibold py-1">Produtos</Link>
              <div className="flex flex-col space-y-1 pl-4 items-center">
                {Array.isArray(categories) && categories.map(category => {
                  const cat = category.attributes || category;
                  return (
                    <Link key={cat.slug || category.id} href={`/produtos/categorias/${cat.slug}`} onClick={() => setIsMenuOpen(false)} className="text-gray-200 text-sm py-0.5">
                      {cat.nome}
                    </Link>
                  );
                })}
              </div>
            </div>
            <Link href="/atas-abertas" onClick={() => setIsMenuOpen(false)} className="text-white text-base font-semibold py-1">Atas Abertas</Link>
            <div className="flex flex-col space-y-1 items-center">
              <Link href="/suporte" onClick={() => setIsMenuOpen(false)} className="text-white text-base font-semibold py-1">Suporte</Link>
              <div className="flex flex-col space-y-1 pl-4 items-center">
                {supportMenuItems.map(item => (
                  <Link key={item.name} href={item.slug} onClick={() => setIsMenuOpen(false)} className="text-gray-200 text-sm py-0.5">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/contato" onClick={() => setIsMenuOpen(false)} className="text-white text-base font-semibold py-1">Contato</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}