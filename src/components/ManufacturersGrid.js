import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/lib/media';

export default function ManufacturersGrid({ fabricantes }) {
  if (!fabricantes || fabricantes.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Nossos Fornecedores</h2>
          <p className="text-lg text-gray-600 mt-2">Trabalhamos com as melhores marcas do mercado.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 items-center">
          {fabricantes.map((fabricante) => {
            const attrs = fabricante.attributes || fabricante;
            const logo = attrs.logo;
            const logoUrlPath = logo?.data?.attributes?.url || logo?.url;
            const logoUrl = getStrapiMediaUrl(logoUrlPath);

            return (
              <div key={fabricante.id} className="flex items-center justify-center">
                {logoUrl && attrs.slug ? (
                  <Link href={`/produtos/fabricante/${attrs.slug}`} className="block relative w-28 h-12 sm:w-40 sm:h-16 hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full relative flex items-center justify-center">
                      <Image
                        src={logoUrl}
                        alt={attrs.nome}
                        fill
                        className="object-contain transition-all duration-300"
                        unoptimized={logoUrl?.toLowerCase().endsWith('.svg')}
                      />
                    </div>
                  </Link>
                ) : (
                  <span className="text-gray-500">{attrs.nome}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
