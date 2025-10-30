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
    
    const mappedSlugs = manufacturers
        .filter(Boolean)
        .map(m => {
            const attrs = m.attributes || m;
            const slug = attrs?.slug || m.slug || null;
            const nome = attrs?.nome || m.nome || '';
            console.log('3. Processando fabricante:', { nome, slugEncontrado: slug });
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
    let manufacturer = await getManufacturerBySlug(slug);

    // Normaliza o formato do objeto do fabricante para sempre ter `.attributes`
    if (manufacturer && !manufacturer.attributes && manufacturer.nome) {
        manufacturer = { attributes: manufacturer };
    }

    const manufacturerName = manufacturer?.attributes?.nome || manufacturer?.nome || null;
    const pageTitle = manufacturerName ? `Produtos de ${manufacturerName}` : 'Fabricante não encontrado';
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

env:
  NEXT_PUBLIC_STRAPI_URL: ${{ secrets.NEXT_PUBLIC_STRAPI_URL }}
  STRAPI_API_TOKEN: ${{ secrets.STRAPI_API_TOKEN }}
