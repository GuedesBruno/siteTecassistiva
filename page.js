import { getAllCategories, fetchAPI, normalizeDataArray } from '@/lib/api';
import CategoryMenu from '@/components/CategoryMenu';
import ProductDisplay from '@/components/ProductDisplay';

export async function generateStaticParams() {
    try {
        const categories = await getAllCategories();
        if (!categories || categories.length === 0) return [];

        const params = categories.flatMap((category) => {
            const categorySlug = category.attributes?.slug || category.slug;
            const subcategories = category.attributes?.subcategorias?.data || [];

            if (!categorySlug || subcategories.length === 0) {
                return [];
            }

            return subcategories.map((subcategory) => {
                const subcategorySlug = subcategory.attributes?.slug || subcategory.slug;
                if (!subcategorySlug) return null;
                return {
                    slug: categorySlug,
                    subslug: subcategorySlug,
                };
            }).filter(Boolean);
        });

        return params;
    } catch (err) {
        console.error("generateStaticParams (subcategorias) failed:", err.message);
        return [];
    }
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

    const [allCategories, productsForSubCategory] = await Promise.all([
        getAllCategories(),
        getProductsForSubCategory(subslug),
    ]);

    const currentCategory = allCategories.find(c => (c.attributes?.slug || c.slug) === slug);
    const currentSubCategory = currentCategory?.attributes?.subcategorias?.data?.find(
        sc => (sc.attributes?.slug || sc.slug) === subslug
    );
    const subCategoryName = currentSubCategory?.attributes?.nome || 'Produtos';

    return (
        <div className="container mx-auto flex flex-col md:flex-row gap-8 py-8 px-4">
            <aside className="w-full md:w-1/4 lg:w-1/5">
                <CategoryMenu categories={allCategories} activeCategorySlug={slug} activeSubCategorySlug={subslug} />
            </aside>
            <div className="w-full md:w-3/4 lg:w-4/5 px-4 md:px-8 lg:px-16">
                <ProductDisplay categoryName={subCategoryName} products={productsForSubCategory} />
            </div>
        </div>
    );
}