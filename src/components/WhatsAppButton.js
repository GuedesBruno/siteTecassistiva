// src/components/WhatsAppButton.js
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function WhatsAppButton() {
  const phoneNumber = '5511995978139'; // 
  const message = 'Olá! Gostaria de mais informações sobre os produtos da Tecassistiva.';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000); // 2-second delay

    return () => clearTimeout(timer); // Cleanup on component unmount
  }, []); // Run only once on mount

  return (
    <Link 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group fixed bottom-5 right-8 z-50 flex items-center
        transition-all duration-700 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
        hover:scale-110
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}
      aria-label="Entre em contato pelo WhatsApp"
    >
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md shadow-lg
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300
                       whitespace-nowrap">
        Fale conosco
      </span>
      <img src="/logo_whatsapp.svg" alt="WhatsApp logo: link to chat" className="h-11 w-11 drop-shadow-lg" />
    </Link>
  );
}