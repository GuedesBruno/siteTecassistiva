import Image from 'next/image';
import Link from 'next/link';
import { ambientesData } from '@/lib/ambientes-data';
import { getAllProductsForDisplay } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';

// Gera as páginas estáticas para todas as sub-categorias no momento do build
export async function generateStaticParams() {
  const paths = [];
  ambientesData.forEach(ambiente => {
    if (ambiente.subAmbientes) {
      ambiente.subAmbientes.forEach(sub => {
        paths.push({ slug: ambiente.slug, subslug: sub.slug });
      });
    }
  });
  return paths;
}

export async function generateMetadata({ params }) {
  const ambiente = ambientesData.find(a => a.slug === params.slug);
  const subAmbiente = ambiente?.subAmbientes?.find(s => s.slug === params.subslug);

  if (!subAmbiente) {
    return { title: 'Página não encontrada' };
  }
  return {
    title: `${subAmbiente.nome} | ${ambiente.nome}`,
    description: `Produtos recomendados para ${subAmbiente.nome} no ambiente ${ambiente.nome}.`,
  };
}

export default async function SubAmbientePage({ params }) {
  const ambiente = ambientesData.find(a => a.slug === params.slug);
  const subAmbiente = ambiente?.subAmbientes?.find(s => s.slug === params.subslug);

  if (!ambiente || !subAmbiente) {
    notFound();
  }

  const allProducts = await getAllProductsForDisplay();
  const produtosRecomendados = allProducts.filter(product =>
    subAmbiente.productSlugs?.includes(product.slug)
  );

  const breadcrumbs = [
    { name: 'Página Inicial', path: '/' },
    { name: 'Soluções por Ambientes', path: '/ambientes' },
    { name: ambiente.nome, path: `/ambientes/${ambiente.slug}` },
    { name: subAmbiente.nome, path: `/ambientes/${ambiente.slug}/${subAmbiente.slug}` },
  ];

  return (
    <div>
      {/* Reutiliza o banner do ambiente pai */}
      <div className="relative h-64 md:h-80 w-full">
        <Image
          src={ambiente.imagem_banner}
          alt={`Banner do ambiente ${ambiente.nome}`}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-4xl font-extrabold text-gray-900 my-6">{subAmbiente.nome}</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtosRecomendados.map(produto => (
            <ProductCard key={produto.id} product={produto} />
          ))}
        </div>
        
        {produtosRecomendados.length === 0 && (
          <p className="text-center text-gray-600 my-12">Nenhum produto recomendado para esta área no momento.</p>
        )}

        <div className="text-center mt-12">
            <Link href={`/ambientes/${ambiente.slug}`} className="bg-tec-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                {`← Voltar para ${ambiente.nome}`}
            </Link>
        </div>
      </div>
    </div>
  );
}
