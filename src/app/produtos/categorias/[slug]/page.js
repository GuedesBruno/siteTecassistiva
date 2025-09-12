import { getAllCategories, getCategoryBySlug } from '@/lib/api';
import CategoryClientView from '@/components/CategoryClientView'; // O nosso novo componente de cliente

// Essencial para o build estático, informa ao Next.js quais páginas criar
// Isto resolve o erro "missing generateStaticParams()"
export async function generateStaticParams() {
    const categories = await getAllCategories();
    if (!categories) return [];
    // Garante que apenas categorias com slug sejam processadas
    return categories.filter(cat => cat.slug).map((category) => ({
        slug: category.slug,
    }));
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
                {/* O Componente de Cliente renderiza toda a vista interativa */}
                <CategoryClientView 
                    initialCategory={category}
                    allCategories={allCategories}
                    currentCategorySlug={params.slug}
                />
            </div>
        </div>
    );
}