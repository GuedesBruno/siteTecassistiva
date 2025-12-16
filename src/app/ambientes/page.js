import Link from 'next/link';
import Image from 'next/image';
import { ambientesData } from '@/lib/ambientes-data'; // Importa os dados estáticos
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata = {
  title: 'Soluções por Ambientes',
  description: 'Descubra soluções de tecnologia assistiva para diferentes ambientes: escolas, empresas, residências e mais.',
  openGraph: {
    title: 'Soluções por Ambientes | Tecassistiva',
    description: 'Tecnologia assistiva para escolas, empresas e residências',
    url: 'https://www.tecassistiva.com.br/ambientes'
  }
}

export default function AmbientesPage() {
  const breadcrumbs = [
    { name: 'Página Inicial', path: '/' },
    { name: 'Soluções por Ambientes', path: '/ambientes' },
  ];

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-3">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center mt-4">Soluções por Ambientes</h1>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="space-y-0">
          {ambientesData.map((ambiente, index) => {
            const isReversed = index % 2 !== 0;

            const textBgColor = index % 2 === 0 ? 'bg-tec-blue text-white' : 'bg-gray-200 text-gray-800';
            const buttonColor = index % 2 === 0 ? 'bg-white text-tec-blue hover:bg-gray-100' : 'bg-tec-blue text-white hover:bg-blue-800';

            return (
              <div
                key={ambiente.id}
                className={`group flex flex-col md:flex-row items-stretch md:h-[300px] rounded-lg overflow-hidden shadow-lg`}>

                {/* Coluna da Imagem com Efeito de Zoom */}
                <div className={`w-full md:w-1/2 ${isReversed ? 'md:order-last' : ''} overflow-hidden`}>
                  <Link href={`/ambientes/${ambiente.slug}`} className="block h-full">
                    <Image
                      src={ambiente.imagem_grid}
                      alt={`Ambiente ${ambiente.nome}`}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                  </Link>
                </div>

                {/* Coluna do Texto e Botão */}
                <div className={`w-full md:w-1/2 flex flex-col items-center justify-center p-8 ${textBgColor}`}>
                  <div className="max-w-md text-center">
                    <h2 className="text-3xl font-bold mb-4">{ambiente.nome}</h2>
                    <p className="text-lg mb-6">
                      Descubra as soluções de tecnologia assistiva ideais para o ambiente de {ambiente.nome.toLowerCase()}.
                    </p>
                    <Link
                      href={`/ambientes/${ambiente.slug}`}
                      className={`inline-block font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md ${buttonColor}`}>
                      Ver Soluções
                    </Link>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}