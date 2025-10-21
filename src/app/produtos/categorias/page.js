
import { getAllCategories, getAllProductsForDisplay } from '@/lib/api';
import CategoryMenu from '@/components/CategoryMenu';
import ProductDisplay from '@/components/ProductDisplay';
import Breadcrumbs from '@/components/Breadcrumbs';

/**
 * Página que exibe todas as categorias e todos os produtos.
 * Atua como a página principal de "Produtos".
 */
export default async function AllProductsPage() {
    // Busca todos os dados necessários em paralelo para melhor performance
    const [allCategories, allProducts] = await Promise.all([
        getAllCategories(),
        getAllProductsForDisplay(),
    ]);

    const pageTitle = 'Todos os Produtos';

    const breadcrumbs = [
      { name: 'Página Inicial', path: '/' },
      { name: 'Produtos', path: '/produtos' },
      { name: 'Categorias', path: '/produtos/categorias' },
    ];

    return (
        <div className="container mx-auto flex flex-col md:flex-row gap-4 py-8 px-4">
            <aside className="w-full md:w-1/4 lg:w-1/5">
                {/* Renderiza o menu sem nenhuma categoria ativa */}
                <CategoryMenu categories={allCategories} />
            </aside>
            <div className="w-full md:w-3/4 lg:w-4/5 px-2 md:px-4 lg:px-6">
                <Breadcrumbs items={breadcrumbs} />
                <ProductDisplay categoryName={pageTitle} products={allProducts} />
            </div>
        </div>
    );
}