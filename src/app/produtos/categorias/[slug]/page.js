import { Suspense } from 'react';
import { getAllCategories, getCategoryBySlug } from '@/lib/api';
import CategoryClientView from '@/components/CategoryClientView';

// (Esta função continua igual e está correta)
export async function generateStaticParams() {
    const categories = await getAllCategories();
    if (!Array.isArray(categories)) return [];
    
    return categories.map((category) => ({
        slug: category.slug,
    }));
}

// (Esta função continua igual e está correta)
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

// O COMPONENTE PRINCIPAL (Componente de Servidor)
export default async function CategoryPage({ params }) {
    // Busca todos os dados necessários no servidor
    const [category, allCategories] = await Promise.all([
        getCategoryBySlug(params.slug),
        getAllCategories()
    ]);

    if (!category) {
        return <p className="text-center py-20">Categoria não encontrada.</p>;
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 md:px-12 py-12">
                {/* AQUI ESTÁ A MUDANÇA CRÍTICA */}
                {/* O Suspense permite que o CategoryClientView use hooks de cliente (useSearchParams) */}
                {/* sem quebrar o build estático. */}
                <Suspense fallback={<p>Carregando produtos...</p>}>
                    <CategoryClientView 
                        category={category} 
                        allCategories={allCategories}
                        currentCategorySlug={params.slug}
                    />
                </Suspense>
            </div>
        </div>
    );
}