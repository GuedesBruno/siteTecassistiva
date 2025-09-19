import { getAllProducts, getProductBySlug } from '@/lib/api';
import ProductViewClient from '@/components/ProductViewClient';
import { notFound } from 'next/navigation';

// Generate static paths for all products
export async function generateStaticParams() {
  try {
    const products = await getAllProducts(); // This gets only slugs
    return products
      .map((product) => ({
        // Acessa o slug de forma segura, esteja ele aninhado ou não.
        slug: product.attributes?.slug || product.slug,
      }))
      .filter((p) => p.slug); // Garante que apenas slugs válidos sejam retornados.
  } catch (error) {
    console.error("Failed to generate static params for products:", error);
    return [];
  }
}

// ajuda a construir o breadcrumb com base na categoria e subcategoria do produto
function buildBreadcrumbs(product) {
    const attrs = product.attributes || product;
    const { categoria, subcategoria } = attrs;
    
    const crumbs = [
        { name: 'Página Inicial', path: '/' },
        { name: 'Produtos', path: '/produtos/categorias' }
    ];

    if (categoria?.data) {
        const catAttrs = categoria.data.attributes;
        crumbs.push({ name: catAttrs.nome, path: `/produtos/categorias/${catAttrs.slug}` });
    }

    if (subcategoria?.data && categoria?.data) {
        const subAttrs = subcategoria.data.attributes;
        crumbs.push({ name: subAttrs.nome, path: `/produtos/categorias/${categoria.data.attributes.slug}/${subAttrs.slug}` });
    }

    return crumbs;
}

export default async function ProductPage({ params }) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const breadcrumbs = buildBreadcrumbs(product);

  return <ProductViewClient product={product} breadcrumbs={breadcrumbs} />;
}