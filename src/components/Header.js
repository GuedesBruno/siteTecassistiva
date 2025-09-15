'use client'; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories } from '@/lib/api';

// ... (componente Icon continua igual) ...

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProdutosMenuOpen, setIsProdutosMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const fetchedCategories = await getAllCategories();
      // CORREÇÃO: Filtra para garantir que cada item da API é válido e tem atributos
      if (Array.isArray(fetchedCategories)) {
        const validCategories = fetchedCategories.filter(cat => cat && cat.attributes);
        setCategories(validCategories);
      }
    }
    fetchCategories();
  }, []);

  // ... (resto do código do Header, que já estava correto) ...
  // A única alteração é no useEffect acima para garantir a validação dos dados.
  // O código abaixo é o mesmo da versão anterior e funcional.
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 text-white">
        <div className="bg-tec-blue shadow-lg">
          {/* Barra Superior */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isScrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'}`}>
            <div className="bg-tec-navy/50">
              <div className="container mx-auto px-6 py-1 flex justify-end items-center space-x-6 text-sm">
                  <Link href="#" className="hover:underline">Opções de Acessibilidade</Link>
                  <Link href="#" className="flex items-center hover:underline">
                      <span className="mr-1">Busca</span>
                      {/* <Icon path="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" /> */}
                  </Link>
              </div>
            </div>
          </div>

          {/* Barra Principal */}
          <div className={`container mx-auto px-6 transition-all duration-300 ease-in-out ${isScrolled ? 'py-0' : 'py-2'}`}>
            <div className="flex justify-between items-center">
              
              {/* Logo */}
              <Link href="/" className="relative flex items-center" style={{ minHeight: '40px' }}>
                <div className={`transition-opacity duration-300 ease-in-out ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
                  <Image src="/logo-tecassistiva.svg" alt="Tecassistiva Logo" width={150} height={30} priority />
                </div>
                <div className={`absolute top-1/2 left-0 -translate-y-1/2 transition-opacity duration-300 ease-in-out ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
                  <Image src="/icon-tecassistiva.svg" alt="Tecassistiva Ícone" width={150} height={70} />
                </div>
              </Link>
              
              {/* Navegação Desktop */}
              <nav className="hidden md:flex items-center space-x-8 text-lg">
                <Link href="/tecassistiva" className="font-semibold hover:text-gray-300 transition-colors">A Tecassistiva</Link>
                
                <div 
                  className="relative"
                  onMouseEnter={() => setIsProdutosMenuOpen(true)}
                  onMouseLeave={() => setIsProdutosMenuOpen(false)}
                >
                  <Link href="/produtos" className="font-semibold hover:text-gray-300 transition-colors flex items-center py-4">
                    Produtos
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </Link>
                  
                  {isProdutosMenuOpen && (
                    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                      <div className="w-56 bg-white rounded-md shadow-lg py-2">
                        {categories.length > 0 ? (
                          categories.map((category) => {
                            const { slug, nome } = category.attributes;
                            if (!slug || !nome) return null;

                            return (
                              <Link
                                key={category.id}
                                href={`/produtos/categorias/${slug}`}
                                className="block px-4 py-2 text-tec-blue hover:bg-gray-100"
                                onClick={() => setIsProdutosMenuOpen(false)}
                              >
                                {nome}
                              </Link>
                            )
                          })
                        ) : (
                          <div className="px-4 py-2 text-gray-500 text-sm">Carregando...</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Link href="#" className="font-semibold hover:text-gray-300 transition-colors">Atas Abertas</Link>
                <Link href="#" className="font-semibold hover:text-gray-300 transition-colors">Suporte</Link>
                <Link href="#" className="font-semibold hover:text-gray-300 transition-colors">Contato</Link>
              </nav>

              {/* Botão do Menu Mobile */}
              <div className="md:hidden">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none z-50 relative">
                      {isMenuOpen ? (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      ) : (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                      )}
                  </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Painel do Menu Mobile */}
      <div className={`fixed inset-0 bg-tec-blue z-40 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="flex flex-col items-center justify-center h-full space-y-8 text-2xl text-white">
          <Link href="/tecassistiva" onClick={() => setIsMenuOpen(false)} className="font-semibold hover:text-gray-300">A Tecassistiva</Link>
          <Link href="/produtos" onClick={() => setIsMenuOpen(false)} className="font-semibold hover:text-gray-300">Produtos</Link>
          <Link href="#" onClick={() => setIsMenuOpen(false)} className="font-semibold hover:text-gray-300">Atas Abertas</Link>
          <Link href="#" onClick={() => setIsMenuOpen(false)} className="font-semibold hover:text-gray-300">Suporte</Link>
          <Link href="#" onClick={() => setIsMenuOpen(false)} className="font-semibold hover:text-gray-300">Contato</Link>
        </nav>
      </div>
    </>
  );
}