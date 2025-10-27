import Link from 'next/link';
import Image from 'next/image';
import { ambientesData } from '@/lib/ambientes-data'; // Importa os dados estáticos
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata = {
  title: 'Soluções por Ambientes | Tecassistiva',
  description: 'Descubra soluções de tecnologia assistiva organizadas por ambientes de aplicação.',
};

export default function AmbientesPage() {
  const breadcrumbs = [
    { name: 'Página Inicial', path: '/' },
    { name: 'Soluções por Ambientes', path: '/ambientes' },
  ];

  return (
<div className="w-full px-8">
      <h1 className="text-3xl font-bold text-center my-8">Soluções por Ambiente</h1>
      <div className="flex flex-col items-center">
        {ambientesData.map((ambiente) => (
          <Link key={ambiente.id} href={`/ambientes/${ambiente.slug}`} className="w-full max-w-6xl mx-auto transition-transform duration-300 ease-in-out hover:scale-105">
            <div className="relative w-full h-[200px] overflow-hidden">
              <img
                src={ambiente.imagem}
                alt={ambiente.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h2 className="text-white text-4xl font-bold">{ambiente.titulo}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}