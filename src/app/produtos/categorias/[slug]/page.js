// sitetecassistiva/src/app/produtos/categorias/[slug]/page.js

import { getAllCategories, fetchAPI, normalizeDataArray } from '@/lib/api';
import CategoryMenu from '@/components/CategoryMenu';
import ProductDisplay from '@/components/ProductDisplay';

async function generateStaticParamsImpl() {
    try {
        const categories = await getAllCategories();
        if (!categories || categories.length === 0) return [];
        return categories.map((c) => ({
            slug: c.attributes?.slug || c.slug,
        })).filter(Boolean);
    } catch (err) {
        console.error("generateStaticParams (categorias) failed:", err.message);
        return [];
    }
}

export const generateStaticParams = generateStaticParamsImpl;

// Função para buscar todos os produtos de uma categoria (incluindo subcategorias)
async function getProductsForCategory(slug) {
    try {
        // Adicionado campos 'nome', 'slug', 'descricao_curta' para o card
        const fields = 'fields[0]=nome&fields[1]=slug&fields[2]=descricao_curta';
        const populate = 'populate[0]=imagem_principal&populate[1]=subcategoria';
        // Alterado o filtro para buscar em uma relação de 'muitos para muitos'.
        // O nome do campo da relação no Strapi é 'categoria'.
        const filters = `filters[categoria][slug][$eq]=${slug}`;
        
        const productsData = await fetchAPI(`/api/produtos?${fields}&${populate}&${filters}&pagination[limit]=1000`);
        return normalizeDataArray(productsData);
    } catch (error) {
        console.error(`Falha ao buscar produtos para a categoria ${slug}:`, error);
        return []; // Retorna um array vazio em caso de erro
    }
}

export default async function CategoriaSlugPage({ params }) {
    const { slug } = params;

    // Busca todos os dados necessários em paralelo para melhor performance
    const [allCategories, productsForCategory] = await Promise.all([
        getAllCategories(),
        getProductsForCategory(slug),
    ]);

    const currentCategory = allCategories.find(c => (c.attributes?.slug || c.slug) === slug);
    const categoryName = currentCategory?.attributes?.nome || 'Produtos';

    return (
        <div className="container mx-auto flex flex-col md:flex-row gap-8 py-8 px-4">
            <aside className="w-full md:w-1/4 lg:w-1/5">
                <CategoryMenu categories={allCategories} activeCategorySlug={slug} />
            </aside>
            <div className="w-full md:w-3/4 lg:w-4/5 px-4 md:px-8 lg:px-16">
                <ProductDisplay categoryName={categoryName} products={productsForCategory} />
            </div>
        </div>
    );
}