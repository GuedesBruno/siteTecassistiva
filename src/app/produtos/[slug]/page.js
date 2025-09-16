// Arquivo: src/app/produtos/[slug]/page.js
import ProductViewClient from "@/components/ProductViewClient";
import { staticProducts } from "@/lib/static-data";

// NOTA: Em um site estático, para ter várias páginas de produto,
// você precisaria criar uma pasta para cada produto.
// Ex: /produtos/mouse-de-cabeca/page.js, /produtos/teclado-ampliado/page.js
// Para simplificar, esta página sempre exibirá o PRIMEIRO produto da nossa lista estática.

export default function ProdutoSlugPage({ params }) {
  // Encontra o produto pelo slug ou pega o primeiro como fallback
  const product = staticProducts.find(p => p.attributes.Slug === params.slug) || staticProducts[0];

  if (!product) {
    return <div>Produto não encontrado.</div>;
  }

  return <ProductViewClient product={product} />;
}