import { getStrapiMediaUrl } from '@/lib/media';
import ProductDetail from '@/components/ProductDetail';
import { notFound } from 'next/navigation';

// Lazy load API functions to avoid compilation during SSG
async function getProductBySlug(slug) {
  const { getProductBySlug: _getProductBySlug } = await import('@/lib/api');
  return _getProductBySlug(slug);
}

async function getAllProducts() {
  const { getAllProducts: _getAllProducts } = await import('@/lib/api');
  return _getAllProducts();
}

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

    const description = (productAttributes.descricao_curta || '').substring(0, 160);
    const imageUrl = getStrapiMediaUrl(
      productAttributes.imagem_principal?.data?.attributes?.url ||
      productAttributes.imagem_principal?.url
    );

    return {
        title: productAttributes.nome,
        description: description,
        keywords: [
          productAttributes.nome,
          productAttributes.Fabricante,
          'tecnologia assistiva',
          'acessibilidade'
        ].filter(Boolean).join(', '),
        canonical: `https://www.tecassistiva.com.br/produtos/${productAttributes.slug}/`,
        openGraph: {
          title: productAttributes.nome,
          description: description,
          url: `https://www.tecassistiva.com.br/produtos/${productAttributes.slug}/`,
          type: 'website',
          images: imageUrl ? [{ url: imageUrl, width: 800, height: 600 }] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title: productAttributes.nome,
          description: description,
          images: imageUrl ? [imageUrl] : [],
        }
    };
}

// A página que renderiza um único produto
export default async function ProductPage({ params }) {
  const { slug } = params;
  console.log(`📦 Renderizando página de produto: ${slug}`);
  
  const product = await getProductBySlug(slug);

  if (!product) {
    console.error(`❌ ERRO: Produto não encontrado para slug: ${slug}`);
    notFound();
  }

  const p = product.attributes || product;
  console.log(`✅ Produto renderizado com sucesso: ${slug}`);
  
  const breadcrumbs = [
    { name: 'Início', path: '/' },
    { name: 'Produtos', path: '/produtos/' },
    { name: p.nome, path: null }
  ];

  return (
    <ProductDetail product={product} breadcrumbs={breadcrumbs} />
  );
}
