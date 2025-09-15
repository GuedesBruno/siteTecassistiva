import { getProducts, getProductBySlug } from '@/lib/api';
import ProductViewClient from '@/components/ProductViewClient'; // Componente de cliente

// informa ao Next.js quais páginas de produto criar
export async function generateStaticParams() {
    const products = await getProducts();
    if (!products) return [];
    // Garante que apenas produtos com slug sejam processados
    return products.filter(prod => prod.slug).map((product) => ({
        slug: product.slug,
    }));
}

// Gera o metadata da página no servidor
export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: 'Produto não Encontrado | Tecassistiva' };
  }
  return {
    title: `${product.nome} | Tecassistiva`,
    description: product.descricao_curta || `Detalhes sobre o produto ${product.nome}`,
  };
}

// --- Componente Principal da Página (Componente de Servidor) ---
export default async function ProductPage({ params }) {
    // Busca os dados do produto específico no servidor
    const product = await getProductBySlug(params.slug);

    if (!product) {
        // Página de "Não Encontrado" simples
        return <p className="text-center py-20">Produto não encontrado.</p>;
    }

    return (
        // Passa os dados buscados para o componente de cliente
        <ProductViewClient product={product} />
    );
}