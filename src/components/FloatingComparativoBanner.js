'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function FloatingComparativoBanner() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="fixed bottom-[90px] right-8 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Área de contato invisível e fixa para estabilizar o hover enquanto o filho "pula" */}
      <div className="absolute inset-0 -top-8 -bottom-4 -left-12 -right-4 bg-transparent z-[-1]"></div>

      <div className={`relative flex items-center justify-end transition-transform duration-500 ease-in-out ${isHovered ? 'translate-y-0' : 'animate-bounce motion-reduce:animate-none'}`}>
        <Link href="/comparativo-impressao" className="relative flex items-center justify-end group">
        
        {/* Expanded Baloon text */}
        <div 
          className={`
            overflow-hidden transition-all duration-500 ease-in-out
            bg-white shadow-2xl p-4 mr-4 border-2 border-tec-blue
            flex flex-col items-center justify-center
            ${isHovered ? 'opacity-100 max-w-[280px] scale-100 translate-x-0' : 'opacity-0 max-w-0 p-0 mr-0 border-0 scale-95 translate-x-4 pointer-events-none'}
          `}
          style={{ transformOrigin: 'right center', borderRadius: '1rem' }}
        >
          <div className="w-56 text-center">
            <p className="text-gray-900 font-extrabold text-sm mb-3 leading-tight">
              Você sabe escolher uma impressora braille?
            </p>
            <span 
              className="inline-block bg-tec-blue text-white text-sm font-bold px-4 py-2 w-full text-center group-hover:bg-blue-700 transition-colors shadow-md"
              style={{ borderRadius: '0.5rem' }}
            >
              Aprenda agora
            </span>
          </div>
        </div>

        {/* Floating Icon */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          {/* Contorno pulsante atrás do círculo para dar destaque */}
          <div className="absolute inset-0 bg-tec-blue opacity-40 animate-ping motion-reduce:animate-none" style={{ borderRadius: '50%', animationDuration: '2s' }}></div>
          
          <div className="w-16 h-16 bg-tec-blue text-white flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all border-4 border-white cursor-pointer relative z-10" style={{ borderRadius: '50%' }}>
            <svg className="w-8 h-8" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {/* Ícone de Informação (i) */}
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>

        </Link>
      </div>
    </div>
  );
}
