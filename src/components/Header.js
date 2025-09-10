'use client'; // Converte este para um Componente de Cliente para permitir interatividade

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Componente para um ícone simples
const Icon = ({ path }) => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

export default function Header() {
  // Estado para controlar se a página foi rolada ou não
  const [isScrolled, setIsScrolled] = useState(false);

  // Efeito para adicionar e remover o monitoramento do scroll
  useEffect(() => {
    const handleScroll = () => {
      // Se a posição do scroll for maior que 10px, marca como 'scrolled'
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Adiciona o 'escutador' de evento de scroll quando o componente é montado
    window.addEventListener('scroll', handleScroll);

    // Remove o 'escutador' quando o componente é desmontado (importante para performance)
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez

  return (
    // A classe 'bg-tec-blue' foi movida para a div interna para melhor controle
    <header className="sticky top-0 z-50 text-white transition-all duration-300">
      <div className="bg-tec-blue shadow-lg">
        {/* Barra Superior - Acessibilidade e Busca */}
        {/* Adicionamos classes de transição e a classe condicional 'h-0' e 'opacity-0' */}
        <div className={`bg-tec-navy/50 transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 py-0' : 'py-1'}`}>
            <div className={`container mx-auto px-6 flex justify-end items-center space-x-6 text-sm transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
                <Link href="#" className="hover:underline">Opções de Acessibilidade</Link>
                <Link href="#" className="flex items-center hover:underline">
                    <span className="mr-1">Busca</span>
                    <Icon path="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                </Link>
            </div>
        </div>

        {/* Barra Principal - Logo e Navegação */}
        {/* A altura do padding (py) muda com base no estado 'isScrolled' */}
        <div className={`container mx-auto px-6 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-4'}`}>
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link href="/">
              {/* Logo Completa (visível quando não está 'scrolled') */}
              <Image 
                src="/logo-tecassistiva.svg"
                alt="Tecassistiva Logo"
                width={150}
                height={30}
                priority
                className={`transition-opacity duration-300 ${isScrolled ? 'opacity-0 h-0' : 'opacity-100'}`}
              />
              {/* Ícone (visível apenas quando está 'scrolled') */}
              <Image 
                src="/icon-tecassistiva.svg"
                alt="Tecassistiva Ícone"
                width={150} // Tamanho menor para o ícone
                height={70}
                className={`absolute top-1/2 -translate-y-1/2 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
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
      </div>
    </header>
  );
}