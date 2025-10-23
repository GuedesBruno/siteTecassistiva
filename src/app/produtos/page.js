import { getAllCategories, getAllProductsForDisplay } from '@/lib/api';
import CategoryMenu from '@/components/CategoryMenu';
import ProductDisplay from '@/components/ProductDisplay';
import Breadcrumbs from '@/components/Breadcrumbs';

export default async function AllProductsPage() {
    const [allCategories, allProducts] = await Promise.all([
        getAllCategories(),
        getAllProductsForDisplay(),
    ]);

    const pageTitle = 'Todos os Produtos';

    const breadcrumbs = [
      { name: 'Página Inicial', path: '/' },
      { name: 'Produtos', path: '/produtos' },
    ];

    return (
        <div className="container mx-auto flex flex-col md:flex-row py-8 px-4">
            <aside className="w-full md:w-1/4 lg:w-1/5 md:pr-2">
                <CategoryMenu categories={allCategories} />
            </aside>
            <div className="w-full md:w-3/4 lg:w-4/5 md:pl-2">
                <Breadcrumbs items={breadcrumbs} />
                <ProductDisplay categoryName={pageTitle} products={allProducts} />
            </div>
        </div>
    );
}