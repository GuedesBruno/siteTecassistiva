import { getAllCategories, getAllSubcategoriesWithCategory, fetchAPI, normalizeDataArray } from '@/lib/api';
import CategoryMenu from '@/components/CategoryMenu';
import ProductDisplay from '@/components/ProductDisplay';

export async function generateStaticParams() {
    // A lógica foi invertida para lidar com a relação muitos-para-muitos
    // partindo das subcategorias, que é mais garantido.
    const subcategorias = await getAllSubcategoriesWithCategory();
    if (!subcategorias || subcategorias.length === 0) return [];

    const params = subcategorias.flatMap((subcategoria) => {
        const subcategoriaSlug = subcategoria.attributes?.slug || subcategoria.slug;
        const categorias = subcategoria.attributes?.categorias?.data || [];

        if (!subcategoriaSlug || categorias.length === 0) {
            return [];
        }

        return categorias.map((categoria) => {
            const categoriaSlug = categoria.attributes?.slug || categoria.slug;
            if (!categoriaSlug) return null;
            return {
                slug: categoriaSlug,
                subslug: subcategoriaSlug,
            };
        }).filter(Boolean);
    });
    return params;
}

async function getProductsForSubCategory(subslug) {
    try {
        const fields = 'fields[0]=nome&fields[1]=slug&fields[2]=descricao_curta';
        const populate = 'populate[0]=imagem_principal';
        const filters = `filters[subcategoria][slug][$eq]=${subslug}`;
        
        const productsData = await fetchAPI(`/api/produtos?${fields}&${populate}&${filters}&pagination[limit]=1000`);
        return normalizeDataArray(productsData);
    } catch (error) {
        console.error(`Falha ao buscar produtos para a subcategoria ${subslug}:`, error);
        return [];
    }
}

export default async function SubCategoriaSlugPage({ params }) {
    const { slug, subslug } = params;

    const [todasAsCategorias, produtosDaSubcategoria] = await Promise.all([
        getAllCategories(),
        getProductsForSubCategory(subslug),
    ]);

    const categoriaAtual = todasAsCategorias.find(c => (c.attributes?.slug || c.slug) === slug);
    const subcategoriaAtual = categoriaAtual?.attributes?.subcategorias?.data?.find(
        sc => (sc.attributes?.slug || sc.slug) === subslug
    );
    const nomeSubcategoria = subcategoriaAtual?.attributes?.nome || 'Produtos';

    return (
        <div className="container mx-auto flex flex-col md:flex-row gap-8 py-8 px-4">
            <aside className="w-full md:w-1/4 lg:w-1/5">
                <CategoryMenu categories={todasAsCategorias} activeCategorySlug={slug} activeSubCategorySlug={subslug} />
            </aside>
            <div className="w-full md:w-3/4 lg:w-4/5 px-4 md:px-8 lg:px-16">
                <ProductDisplay categoryName={nomeSubcategoria} products={produtosDaSubcategoria} />
            </div>
        </div>
    );
}