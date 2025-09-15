import { getAllCategories, getCategoryBySlug } from '@/lib/api';
import CategoryClientView from '@/components/CategoryClientView';

// 1. A FUNÇÃO EM FALTA: Gera todos os slugs de categoria no momento do build
export async function generateStaticParams() {
    const categories = await getAllCategories();
    // Garante que temos um array antes de mapear
    if (!Array.isArray(categories)) return [];
    
    return categories.map((category) => ({
        slug: category.slug,
    }));
}

// 2. (Opcional, mas recomendado para SEO) Gera o título e descrição da página no servidor
export async function generateMetadata({ params }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    return { title: 'Categoria não Encontrada | Tecassistiva' };
  }
  return {
    title: `${category.nome} | Tecassistiva`,
    description: `Produtos da categoria ${category.nome} na Tecassistiva.`,
  };
}

// 3. O COMPONENTE PRINCIPAL (agora um Componente de Servidor)
// Ele busca os dados no servidor e passa para o componente de cliente que você já tem.
export default async function CategoryPage({ params }) {
    const [category, allCategories] = await Promise.all([
        getCategoryBySlug(params.slug),
        getAllCategories() // Também buscamos todas as categorias para o menu lateral
    ]);

    if (!category) {
        return <p className="text-center py-20">Categoria não encontrada.</p>;
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 md:px-12 py-12">
                {/* O seu componente de cliente agora recebe os dados via props */}
                <CategoryClientView 
                    category={category} 
                    allCategories={allCategories}
                    currentCategorySlug={params.slug}
                />
            </div>
        </div>
    );
}