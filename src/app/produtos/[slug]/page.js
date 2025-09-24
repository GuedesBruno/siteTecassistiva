import { getProductBySlug, getAllProductSlugs } from '@/lib/api';
import ProductViewClient from '@/components/ProductViewClient';
import { notFound } from 'next/navigation';

// ✅ ADICIONE ESTA FUNÇÃO
export async function generateStaticParams() {
  const products = await getAllProductSlugs();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }) {
    const product = await getProductBySlug(params.slug);
    if (!product) {
      return {
        title: 'Produto não encontrado'
      }
    }
    return {
      title: `${product.nome} | Tecassistiva`,
      description: product.descricao_curta || `Detalhes sobre o produto ${product.nome}`,
    }
}

export default async function ProductPage({ params }) {
    const { slug } = params;
    const productData = await getProductBySlug(slug);

    if (!productData) {
        notFound();
    }

    return <ProductViewClient product={productData} />;
}