import { getStrapiMediaUrl } from '@/lib/media';
import ProductDetail from '@/components/ProductDetail';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

// Lazy load API functions to avoid compilation during SSG
async function getProductBySlug(slug) {
  const { getProductBySlug: _getProductBySlug } = await import('@/lib/api');
  return _getProductBySlug(slug);
}

// Get product slugs from search-data.json (generated at build time)
// This avoids calling the API during static generation
async function getProductSlugsFromSearchData() {
  try {
    const searchDataPath = path.join(process.cwd(), 'public', 'search-data.json');
    const searchData = JSON.parse(fs.readFileSync(searchDataPath, 'utf-8'));

    // Filter for products and extract slugs
    const productSlugs = searchData
      .filter(item => item.type === 'Produto')
      .map(item => {
        // slug comes as "/produtos/slug-name", extract just the slug part
        const parts = item.slug.split('/');
        return { slug: parts[parts.length - 1] };
      })
      .filter(item => item.slug);

    return productSlugs;
  } catch (error) {
    console.error('Error reading product slugs from search-data.json:', error);
    return [];
  }
}

// Return empty array for generateStaticParams to avoid API calls during build
export async function generateStaticParams() {
  // Get slugs from pre-generated search data instead of calling API
  // This prevents whatwg-url from being loaded during static generation
  const productSlugs = await getProductSlugsFromSearchData();

  if (!productSlugs || productSlugs.length === 0) {
    console.warn('No product slugs found in search-data.json');
    return [];
  }

  console.log(`Generating ${productSlugs.length} product pages...`);
  return productSlugs;
}

// Gera os metadados para a página (título, descrição)
export async function generateMetadata({ params }) {
  try {
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
  } catch (error) {
    // During build, return minimal metadata
    // Full metadata will load on-demand with ISR
    return {
      title: 'Produto | Tecassistiva',
      description: 'Confira nosso produto.',
    };
  }
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

  // Prepara o JSON-LD para Schema.org
  const imageUrl = getStrapiMediaUrl(
    p.imagem_principal?.data?.attributes?.url ||
    p.imagem_principal?.url
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nome,
    image: imageUrl ? [imageUrl] : [],
    description: p.descricao_curta || p.descricao,
    brand: {
      '@type': 'Brand',
      name: p.Fabricante || 'Tecassistiva'
    },
    offers: {
      '@type': 'Offer',
      url: `https://www.tecassistiva.com.br/produtos/${slug}`,
      priceCurrency: 'BRL',
      price: '0', // Preço sob consulta, campo obrigatório para produto válido
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Tecassistiva'
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} breadcrumbs={breadcrumbs} />
    </>
  );
}
