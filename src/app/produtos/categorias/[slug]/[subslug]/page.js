import { getAllCategories, fetchAPI, normalizeDataArray } from '@/lib/api';
import CategoryMenu from '@/components/CategoryMenu';
import ProductDisplay from '@/components/ProductDisplay';

export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();
    if (!categories || categories.length === 0) return [];

    const params = [];
    categories.forEach((cat) => {
      const c = cat.attributes || cat;
      const slug = c.slug;
      const subcats = c.subcategorias?.data || c.subcategorias || [];
      if (Array.isArray(subcats) && subcats.length > 0) {
        subcats.forEach((sub) => {
          const s = sub.attributes || sub;
          if (slug && s.slug) params.push({ slug, subslug: s.slug });
        });
      }
    });

    return params;
  } catch (err) {
    console.error('generateStaticParams (subcategoria) failed:', err.message);
    return [];
  }
}

async function getProductsForSubcategory(subslug) {
    try {
        const populate = 'populate[0]=imagem_principal';
        const filters = `filters[subcategoria][slug][$eq]=${subslug}`;
        
        const productsData = await fetchAPI(`/api/produtos?${populate}&${filters}`);
        return normalizeDataArray(productsData);
    } catch (error) {
        console.error(`Falha ao buscar produtos para a subcategoria ${subslug}:`, error);
        return [];
    }
}

export default async function SubcategoryPage({ params }) {
  const { slug, subslug } = params;

  // Busca todos os dados necessários em paralelo
  const [allCategories, productsForSubcategory] = await Promise.all([
    getAllCategories(),
    getProductsForSubcategory(subslug),
  ]);

  // Encontra o nome da subcategoria para usar como título
  const currentCategory = allCategories.find(c => (c.attributes?.slug || c.slug) === slug);
  const subcategories = currentCategory?.attributes?.subcategorias || [];
  const currentSubcategory = subcategories.find(s => (s.attributes?.slug || s.slug) === subslug);
  const subcategoryName = currentSubcategory?.nome || 'Produtos';

  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-8 py-8 px-4">
        <aside className="w-full md:w-1/4 lg:w-1/5">
            {/* Passa o slug da categoria principal para o menu */}
            <CategoryMenu categories={allCategories} activeCategorySlug={slug} activeSubcategorySlug={subslug} />
        </aside>
        <main className="w-full md:w-3/4 lg:w-4/5 px-4 md:px-8 lg:px-16">
            {/* O ProductDisplay agora recebe o nome da subcategoria e seus produtos */}
            <ProductDisplay categoryName={subcategoryName} products={productsForSubcategory} />
        </main>
    </div>
  );
}
