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
    console.log('1. Iniciando generateStaticParams para fabricantes...');
    const manufacturers = await getManufacturers();
    console.log('2. Dados brutos dos fabricantes:', JSON.stringify(manufacturers, null, 2));
    
    const mappedSlugs = manufacturers.map(m => {
        const slug = m.attributes?.slug || m.slug;
        console.log(`3. Processando fabricante:`, {
            nome: m.attributes?.nome || m.nome,
            slugEncontrado: slug
        });
        return { slug };
    });
    
    const filteredSlugs = mappedSlugs.filter(m => m.slug);
    console.log('4. Slugs finais:', filteredSlugs);
    
    return filteredSlugs;
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
