import {
    getAllCategories,
    getProductsByManufacturerSlug,
    getManufacturers,
    getManufacturerBySlug
} from '@/lib/api';
import CategoryMenu from '@/components/CategoryMenu';
import ProductDisplay from '@/components/ProductDisplay';
import Breadcrumbs from '@/components/Breadcrumbs';

export async function generateStaticParams() {
    const manufacturers = await getManufacturers();
    // Filtra para garantir que o fabricante e seus atributos necessários existam
    return manufacturers
        .map((manufacturer) => ({
            slug: manufacturer.attributes?.slug || manufacturer.slug,
        }))
        .filter(manufacturer => manufacturer.slug);
}

export default async function ManufacturerProductsPage({ params }) {
    const { slug } = params;
    
    const allCategories = await getAllCategories();
    const products = await getProductsByManufacturerSlug(slug);
    const manufacturer = await getManufacturerBySlug(slug);
    
    const pageTitle = manufacturer ? `Produtos de ${manufacturer.attributes.nome}` : 'Fabricante não encontrado';
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
