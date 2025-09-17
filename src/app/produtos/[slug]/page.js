// ✅ CORRIGIDO: Importa as funções que realmente existem no seu api.js
import { getAllProducts, getProductBySlug, getBanners } from "@/lib/api";
import ProductViewClient from "@/components/ProductViewClient";

// ✅ CORRIGIDO: Usa getFeaturedProducts para buscar os slugs
export async function generateStaticParams() {
  try {
    const products = await getAllProducts();

    if (!products || products.length === 0) return [];

    const slugs = new Set(products.map(p => (p.attributes?.slug || p.slug)).filter(Boolean));

    // Também varremos banners (ou outros conteúdos) que podem ter links para produtos
    try {
      const banners = await getBanners();
      if (Array.isArray(banners)) {
        banners.forEach(b => {
          const link = (b.attributes && b.attributes.link_do_botao) || b.link_do_botao;
          if (link && typeof link === 'string') {
            try {
              const u = new URL(link, 'http://example');
              // procura padrões /produtos/<slug>
              const m = u.pathname.match(/\/produtos\/(.+?)\/?$/);
              if (m && m[1]) {
                slugs.add(decodeURIComponent(m[1]));
              }
            } catch (e) {
              // se a URL for um slug relativo sem host
              const rel = link.replace(/^https?:\/\//, '').split('/').pop();
              if (rel) slugs.add(rel);
            }
          }
        });
      }
    } catch (e) {
      console.warn('generateStaticParams: getBanners failed:', e.message);
    }

    // Adiciona variações dos slugs (sem hífens, com underscores)
    const final = new Set(slugs);
    for (const s of Array.from(slugs)) {
      const condensed = s.replace(/-/g, '');
      if (condensed && condensed !== s) final.add(condensed);
      const underscored = s.replace(/-/g, '_');
      if (underscored && underscored !== s) final.add(underscored);
    }

    return Array.from(final).map(s => ({ slug: s }));
  } catch (err) {
    console.error('generateStaticParams (produtos) failed:', err.message);
    return [];
  }
}

export default async function ProdutoSlugPage({ params }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return <div>Produto não encontrado.</div>;
  }

  return <ProductViewClient product={product} />;
}