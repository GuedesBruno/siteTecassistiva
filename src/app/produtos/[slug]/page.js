import { getProductBySlug, getAllProducts } from '@/lib/api';
import ProductDetail from '@/components/ProductDetail';
import { notFound } from 'next/navigation';

// Gera os caminhos estáticos para todos os produtos
export async function generateStaticParams() {
  const products = await getAllProducts();
  if (!products) return [];

  return products.map((product) => ({
    slug: product.attributes?.slug || product.slug,
  })).filter(p => p.slug);
}

// Gera os metadados para a página (título, descrição)
export async function generateMetadata({ params }) {
    const product = await getProductBySlug(params.slug);
    const productAttributes = product?.attributes || product;

    if (!productAttributes) {
        return {
            title: 'Produto não encontrado'
        };
    }

    return {
        title: `${productAttributes.nome} | Tecassistiva`,
        description: productAttributes.descricao_curta,
    };
}

// A página que renderiza um único produto
export default async function ProductPage({ params }) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // O componente ProductDetail recebe os dados do produto para renderizar
  return <ProductDetail product={product} />;
}
