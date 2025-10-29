import { getAllCategories, getAllProductsForDisplay, getProductsByManufacturerSlug, getManufacturerBySlug } from '@/lib/api';
import CategoryMenu from '@/components/CategoryMenu';
import ProductDisplay from '@/components/ProductDisplay';
import Breadcrumbs from '@/components/Breadcrumbs';

export default async function AllProductsPage({ searchParams }) {
    const manufacturerSlug = searchParams.fabricante;
    let products;
    let pageTitle;
    let breadcrumbs;

    const allCategories = await getAllCategories();

    if (manufacturerSlug) {
        const manufacturer = await getManufacturerBySlug(manufacturerSlug);
        products = await getProductsByManufacturerSlug(manufacturerSlug);
        pageTitle = manufacturer ? `Produtos de ${manufacturer.attributes.nome}` : 'Fabricante não encontrado';
        breadcrumbs = [
            { name: 'Página Inicial', path: '/' },
            { name: 'Produtos', path: '/produtos' },
            { name: pageTitle }
        ];
    } else {
        products = await getAllProductsForDisplay();
        pageTitle = 'Todos os Produtos';
        breadcrumbs = [
            { name: 'Página Inicial', path: '/' },
            { name: 'Produtos', path: '/produtos' },
        ];
    }

    return (
        <div className="flex flex-col md:flex-row py-8 px-4">
            <aside className="w-full md:w-1/4 lg:w-1/5 md:pr-2">
                <CategoryMenu categories={allCategories} />
            </aside>
            <div className="w-full md:w-3/4 lg:w-4/5 md:pl-2">
                <Breadcrumbs items={breadcrumbs} />
                <ProductDisplay categoryName={pageTitle} products={products} />
            </div>
        </div>
    );
}