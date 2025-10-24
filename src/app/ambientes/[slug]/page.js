import Image from 'next/image';
import Link from 'next/link';
import { ambientesData } from '@/lib/ambientes-data';
import { getAllProductsForDisplay } from '@/lib/api'; // Reutiliza a função que busca todos os produtos
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';

// Gera as páginas estáticas no momento do build a partir dos dados estáticos
export async function generateStaticParams() {
  return ambientesData.map((ambiente) => ({
    slug: ambiente.slug,
  }));
}

export async function generateMetadata({ params }) {
  const ambiente = ambientesData.find(a => a.slug === params.slug);
  if (!ambiente) {
    return { title: 'Ambiente não encontrado' };
  }
  return {
    title: `${ambiente.nome} | Soluções por Ambientes`,
    description: `Produtos recomendados para o ambiente: ${ambiente.nome}`,
  };
}

export default async function AmbienteDetalhePage({ params }) {
  const ambiente = ambientesData.find(a => a.slug === params.slug);

  if (!ambiente) {
    notFound();
  }

  // 1. Busca TODOS os produtos da API
  const allProducts = await getAllProductsForDisplay();

  // 2. Filtra os produtos para mostrar apenas os que estão na lista de slugs do ambiente
  const produtosRecomendados = allProducts.filter(product => 
    ambiente.productSlugs.includes(product.slug)
  );

  const breadcrumbs = [
    { name: 'Página Inicial', path: '/' },
    { name: 'Soluções por Ambientes', path: '/ambientes' },
    { name: ambiente.nome, path: `/ambientes/${ambiente.slug}` },
  ];

  return (
    <div>
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
        <h1 className="text-4xl font-extrabold text-gray-900 my-6">{ambiente.nome}</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtosRecomendados.map(produto => (
            <ProductCard key={produto.id} product={produto} />
          ))}
        </div>
        
        {produtosRecomendados.length === 0 && (
          <p className="text-center text-gray-600 my-12">Nenhum produto recomendado para este ambiente no momento.</p>
        )}

        <div className="text-center mt-12">
            <Link href="/ambientes" className="bg-tec-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                ← Voltar para Ambientes
            </Link>
        </div>
      </div>
    </div>
  );
}