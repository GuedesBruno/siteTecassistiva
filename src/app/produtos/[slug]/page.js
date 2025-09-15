import { getProducts, getProductBySlug } from '@/lib/api';
import ProductViewClient from '@/components/ProductViewClient';

// Essencial para o build estático
export async function generateStaticParams() {
    const products = await getProducts();
    // VERIFICAÇÃO ADICIONADA: Ignora produtos que não tenham um slug definido
    if (!products) return [];
    return products
        .filter(product => product && product.slug) 
        .map((product) => ({
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
    const product = await getProductBySlug(params.slug);

    if (!product) {
        return <p className="text-center py-20">Produto não encontrado.</p>;
    }

    return (
        <ProductViewClient product={product} />
    );
}