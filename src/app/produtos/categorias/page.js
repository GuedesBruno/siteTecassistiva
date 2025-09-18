// sitetecassistiva/src/app/produtos/categorias/page.js

import { getAllCategories, getAllProductsForDisplay } from '@/lib/api';
import CategoryMenu from '@/components/CategoryMenu';
import ProductDisplay from '@/components/ProductDisplay';

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

    return (
        <div className="container mx-auto flex flex-col md:flex-row gap-8 py-8 px-4">
            <aside className="w-full md:w-1/4 lg:w-1/5">
                {/* Renderiza o menu sem nenhuma categoria ativa */}
                <CategoryMenu categories={allCategories} />
            </aside>
            <main className="w-full md:w-3/4 lg:w-4/5 px-4 md:px-8 lg:px-16">
                <ProductDisplay categoryName={pageTitle} products={allProducts} />
            </main>
        </div>
    );
}