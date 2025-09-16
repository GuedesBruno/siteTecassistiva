import { getProducts, getProductBySlug } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

// ESSENCIAL: Esta função gera a lista de todos os slugs para as páginas estáticas
export async function generateStaticParams() {
  const products = await getProducts();
  
  if (!products || products.length === 0) {
    return [];
  }

  // CORREÇÃO: Acedemos a 'product.attributes.slug'
  return products
    .filter(product => product.attributes && product.attributes.slug) 
    .map((product) => ({
      slug: product.attributes.slug,
    }));
}

// Gera o título e a descrição da página dinamicamente
export async function generateMetadata({ params }) {
  const productData = await getProductBySlug(params.slug);
  const product = productData?.attributes;

  if (!product) {
    return { title: 'Produto não Encontrado | Tecassistiva' };
  }

  const { nome, descricao_curta } = product;

  return {
    title: `${nome} | Tecassistiva`,
    description: descricao_curta || `Detalhes sobre o produto ${nome}`,
  };
}

// Componente da página
export default async function ProductPage({ params }) {
  const productData = await getProductBySlug(params.slug);
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  if (!productData) {
    return (
      <div className="bg-gray-50 flex-grow">
        <div className="container mx-auto text-center px-4 py-20">
          <h1 className="text-4xl font-bold text-gray-800">Produto não encontrado</h1>
          <p className="mt-4 text-lg text-gray-600">O produto que você está procurando não existe ou foi removido.</p>
          <Link href="/" className="mt-8 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  const { nome, descricao_longa, imagem_principal, galeria_de_imagens, categorias } = productData.attributes;
  
  const imageUrl = imagem_principal?.data?.attributes?.url;
  const fullImageUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : null;
  const imageAlt = imagem_principal?.data?.attributes?.alternativeText || `Imagem ilustrativa de ${nome}`;

  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:underline">Página Inicial</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/produtos" className="hover:underline">Produtos</Link>
          {categorias?.data?.[0] && (
            <>
              <span className="mx-2">&gt;</span>
              <Link href={`/produtos/categorias/${categorias.data[0].attributes.slug}`} className="hover:underline">
                {categorias.data[0].attributes.nome}
              </Link>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="w-full">{/* ... Coluna da Imagem ... */}</div>
          <div>{/* ... Coluna do Conteúdo ... */}</div>
        </div>

        {/* Seção de Abas */}
        <div className="mt-16 border-t pt-8">{/* ... Abas ... */}</div>
      </div>
    </div>
  );
}