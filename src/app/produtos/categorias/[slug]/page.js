import { Suspense } from 'react';
import { getAllCategories, getCategoryBySlug } from '@/lib/api';
import CategoryClientView from '@/components/CategoryClientView'; // O nosso novo componente de cliente

// Essencial para o build estático, informa ao Next.js quais páginas criar
export async function generateStaticParams() {
    const categories = await getAllCategories();
    if (!categories) return [];
    // Garante que apenas categorias com slug sejam processadas
    return categories.filter(cat => cat.slug).map((category) => ({
        slug: category.slug,
    }));
}

// Esqueleto de carregamento que será mostrado enquanto o componente de cliente renderiza
function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 h-96 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="lg:col-span-3">
                <div className="h-10 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}

// --- Componente Principal da Página (Componente de Servidor) ---
export default async function CategoryPage({ params }) {
    // Busca todos os dados necessários de uma só vez no servidor
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
                {/* Suspense é a chave para o deploy funcionar */}
                <Suspense fallback={<LoadingSkeleton />}>
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