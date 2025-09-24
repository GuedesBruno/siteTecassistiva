import ProductDetail from '@/components/ProductDetail';
import { buildBreadcrumbs } from '@/lib/utils.js';
import { getAllProducts, getProductBySlug } from '@/lib/api';

// Generate static paths for all products
export async function generateStaticParams() {
  const products = await getAllProducts(); // This gets only slugs
  return products
    .map((product) => ({
      // Acessa o slug de forma segura, esteja ele aninhado ou não.
      slug: product.attributes?.slug || product.slug,
    }))
    .filter((p) => p.slug); // Garante que apenas slugs válidos sejam retornados.
}

// ajuda a construir o breadcrumb com base na categoria e subcategoria do produto

export default async function ProdutoPage({ params }) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    // Em um app real, usaríamos notFound() do Next.js
    return <div>Produto não encontrado</div>;
  }

  const breadcrumbs = buildBreadcrumbs(product);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} breadcrumbs={breadcrumbs} />
    </div>
  );
}
