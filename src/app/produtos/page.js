import ProductFinderWizard from '@/components/ProductFinderWizard';
import CategoryMenu from '@/components/CategoryMenu';
import Breadcrumbs from '@/components/Breadcrumbs';

// Lazy load API functions to avoid compilation during SSG
async function getAllCategories() {
  const { getAllCategories: _getAllCategories } = await import('@/lib/api');
  return _getAllCategories();
}

async function getAllProductsForDisplay() {
  // Use getProductsWithDocuments to ensure we have categories/subcategories populated correctly if needed, 
  // or use getAllProductsForDisplay if it already populates sufficient data.
  // api.js getAllProductsForDisplay populates imagem_principal, subcategorias, categories. That is sufficient.
  const { getAllProductsForDisplay: _getAllProductsForDisplay } = await import('@/lib/api');
  return _getAllProductsForDisplay();
}

export default async function AllProductsPage() {
  const [allCategories, allProducts] = await Promise.all([
    getAllCategories(),
    getAllProductsForDisplay(),
  ]);

  const breadcrumbs = [
    { name: 'Página Inicial', path: '/' },
    { name: 'Produtos', path: '/produtos' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar com Menu de Categorias */}
        <aside className="w-full md:w-1/3 lg:w-1/4">
          <CategoryMenu categories={allCategories} />
        </aside>

        {/* Conteúdo Principal com o Wizard */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-8">
            <ProductFinderWizard categories={allCategories} products={allProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}