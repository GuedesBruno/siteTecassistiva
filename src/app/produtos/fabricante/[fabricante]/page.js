import {
    getAllCategories,
    getProductsByManufacturerName,
    getManufacturers
} from '@/lib/api';
import CategoryMenu from '@/components/CategoryMenu';
import ProductDisplay from '@/components/ProductDisplay';
import Breadcrumbs from '@/components/Breadcrumbs';

export async function generateStaticParams() {
    const manufacturers = await getManufacturers();
    return manufacturers.map((manufacturer) => ({
        fabricante: encodeURIComponent(manufacturer.attributes.nome),
    }));
}

export default async function ManufacturerProductsPage({ params }) {
    const manufacturerName = decodeURIComponent(params.fabricante);
    
    const allCategories = await getAllCategories();
    const products = await getProductsByManufacturerName(manufacturerName);
    
    const pageTitle = `Produtos de ${manufacturerName}`;
    const breadcrumbs = [
        { name: 'Página Inicial', path: '/' },
        { name: 'Produtos', path: '/produtos' },
        { name: pageTitle }
    ];

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
