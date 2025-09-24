import { getAllCategories, fetchAPI, normalizeDataArray } from '@/lib/api';
import CategoryMenu from '@/components/CategoryMenu';
import ProductDisplay from '@/components/ProductDisplay';

async function generateStaticParamsImpl() {
    const categorias = await getAllCategories();
    if (!categorias || categorias.length === 0) return [];
    return categorias.map((c) => ({
        slug: c.attributes?.slug || c.slug,
    })).filter(Boolean);
}

export const generateStaticParams = generateStaticParamsImpl;

async function getProductsForCategory(slug) {
    try {
        const fields = 'fields[0]=nome&fields[1]=slug&fields[2]=descricao_curta';
        const populate = 'populate[0]=imagem_principal&populate[1]=subcategoria';
        // A relação produto -> categoria é muitos-para-muitos, então o campo de filtro é 'categorias'.
        const filters = `filters[categorias][slug][$eq]=${slug}`;
        
        const productsData = await fetchAPI(`/api/produtos?${fields}&${populate}&${filters}&pagination[limit]=1000`);
        return normalizeDataArray(productsData);
    } catch (error) {
        console.error(`Falha ao buscar produtos para a categoria ${slug}:`, error);
        return [];
    }
}

export default async function CategoriaSlugPage({ params }) {
    const { slug } = params;

    const [todasAsCategorias, produtosDaCategoria] = await Promise.all([
        getAllCategories(),
        getProductsForCategory(slug),
    ]);

    const categoriaAtual = todasAsCategorias.find(c => (c.attributes?.slug || c.slug) === slug);
    const nomeCategoria = categoriaAtual?.attributes?.nome || 'Produtos';

    return (
        <div className="container mx-auto flex flex-col md:flex-row gap-8 py-8 px-4">
            <aside className="w-full md:w-1/4 lg:w-1/5">
                <CategoryMenu categories={todasAsCategorias} activeCategorySlug={slug} />
            </aside>
            <div className="w-full md:w-3/4 lg:w-4/5 px-4 md:px-8 lg:px-16">
                <ProductDisplay categoryName={nomeCategoria} products={produtosDaCategoria} />
            </div>
        </div>
    );
}
