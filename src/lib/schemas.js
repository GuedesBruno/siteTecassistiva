/**
 * Schema.org JSON-LD generators para SEO
 * Docs: https://schema.org/
 */

export function generateProductSchema(product) {
  const p = product.attributes || product;
  const imageUrl = p.imagem_principal?.url || p.imagem_principal?.data?.attributes?.url;
  
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: p.nome,
    description: p.descricao_curta || p.descricao_longa?.substring?.(0, 160),
    image: imageUrl ? [imageUrl] : [],
    brand: {
      '@type': 'Brand',
      name: 'Tecassistiva'
    },
    manufacturer: p.Fabricante ? {
      '@type': 'Organization',
      name: p.Fabricante
    } : undefined,
    url: `https://www.tecassistiva.com.br/produtos/${p.slug}`,
    sku: p.sku || `PROD-${p.id}`,
    // Se tiver avaliações, adicione ratings aqui
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: `https://www.tecassistiva.com.br/produtos/${p.slug}`
    }
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: 'Tecassistiva',
    url: 'https://www.tecassistiva.com.br',
    logo: 'https://www.tecassistiva.com.br/logo.png',
    description: 'Tecnologia & Acessibilidade - Soluções em tecnologia assistiva para inclusão educacional e social',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Sales',
      telephone: '+55-11-99597-8139'
    },
    sameAs: [
      'https://www.facebook.com/tecassistiva',
      'https://www.instagram.com/tecassistiva',
      'https://wa.me/5511995978139'
    ]
  };
}

export function generateBreadcrumbSchema(breadcrumbs) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.path ? `https://www.tecassistiva.com.br${crumb.path}` : undefined
    }))
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org/',
    '@type': 'LocalBusiness',
    name: 'Tecassistiva',
    image: 'https://www.tecassistiva.com.br/logo.png',
    description: 'Empresa especializada em soluções de tecnologia assistiva',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'São Paulo',
      addressRegion: 'SP',
      addressCountry: 'BR'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Sales',
      telephone: '+55-11-99597-8139'
    }
  };
}

export function generateWebPageSchema(title, description, url, image = null) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
    image: image ? [image] : [],
    publisher: {
      '@type': 'Organization',
      name: 'Tecassistiva',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.tecassistiva.com.br/logo.png'
      }
    }
  };
}

export function generateArticleSchema(title, description, datePublished, image = null) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image ? [image] : [],
    datePublished: datePublished,
    author: {
      '@type': 'Organization',
      name: 'Tecassistiva'
    }
  };
}
