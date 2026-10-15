import { getStrapiMediaUrl } from '@/lib/media';
import ProductDetail from '@/components/ProductDetail';
import FloatingComparativoBanner from '@/components/FloatingComparativoBanner';
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

    // Dynamic Title Generation for SEO
    // Ex: "Impressora Braille: Folha Solta | Index Braille | Everest-D V5"
    let seoTitleParts = [];

    const manufacturer = productAttributes.Fabricante ||
      productAttributes.relacao_fabricante?.data?.attributes?.nome;

    const subcategory = productAttributes.subcategorias?.data?.[0]?.attributes?.nome ||
      productAttributes.subcategorias?.[0]?.nome;

    if (subcategory) {
      seoTitleParts.push(subcategory);
    }

    if (manufacturer) {
      seoTitleParts.push(manufacturer);
    }

    seoTitleParts.push(productAttributes.nome);

    const seoTitle = seoTitleParts.join(' | ');

    return {
      title: seoTitle,
      description: description,
      keywords: [
        // Palavras-chave do Strapi (JSON array) - Prioridade
        ...(Array.isArray(productAttributes.palavras_chave) ? productAttributes.palavras_chave : []),
        // Fallback: gera keywords automaticamente se campo estiver vazio
        productAttributes.nome,
        manufacturer,
        subcategory,
        'tecnologia assistiva',
        'acessibilidade'
      ].filter(Boolean).join(', '),
      alternates: { canonical: `/produtos/${productAttributes.slug}/` },
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
      alternates: { canonical: `/produtos/${params.slug}/` },
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
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // Data futura válida para evitar erro
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ProductDetail product={product} breadcrumbs={breadcrumbs} />
      {(slug === 'everest' || slug === 'basic') && (
        <FloatingComparativoBanner />
      )}
    </>
  );
}
