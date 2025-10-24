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
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">Soluções por Ambientes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ambientesData.map((ambiente) => (
          <Link key={ambiente.id} href={`/ambientes/${ambiente.slug}`} className="group relative block overflow-hidden rounded-lg shadow-lg">
            <Image
              src={ambiente.imagem_grid}
              alt={`Ambiente ${ambiente.nome}`}
              width={600}
              height={400}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h2 className="text-white text-3xl font-bold text-center p-4">{ambiente.nome}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}