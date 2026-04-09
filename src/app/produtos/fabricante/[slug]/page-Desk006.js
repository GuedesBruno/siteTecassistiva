import CategoryMenu from '@/components/CategoryMenu';
import ProductDisplay from '@/components/ProductDisplay';
import Breadcrumbs from '@/components/Breadcrumbs';
import fs from 'fs';
import path from 'path';

// Lazy load API functions to avoid compilation during SSG
async function getAllCategories() {
  const { getAllCategories: _getAllCategories } = await import('@/lib/api');
  return _getAllCategories();
}

async function getProductsByManufacturerSlug(slug) {
  const { getProductsByManufacturerSlug: _getProductsByManufacturerSlug } = await import('@/lib/api');
  return _getProductsByManufacturerSlug(slug);
}

async function getManufacturerBySlug(slug) {
  const { getManufacturerBySlug: _getManufacturerBySlug } = await import('@/lib/api');
  return _getManufacturerBySlug(slug);
}

// Get manufacturer slugs from search-data.json (generated at build time)
// This avoids calling the API during static generation
async function getManufacturerSlugsFromSearchData() {
  try {
    const searchDataPath = path.join(process.cwd(), 'public', 'search-data.json');
    const searchData = JSON.parse(fs.readFileSync(searchDataPath, 'utf-8'));
    
    // Extract unique manufacturer slugs from products
    const manufacturerMap = new Map();
    searchData.forEach(item => {
      if (item.type === 'Produto' && item.fabricante) {
        const manufName = item.fabricante;
        if (manufName && !manufacturerMap.has(manufName)) {
          manufacturerMap.set(manufName, { 
            slug: manufName.toLowerCase().replace(/\s+/g, '-') 
          });
        }
      }
    });
    
    return Array.from(manufacturerMap.values());
  } catch (error) {
    console.error('Error reading manufacturer slugs from search-data.json:', error);
    return [];
  }
}

export async function generateStaticParams() {
    // Get slugs from pre-generated search data instead of calling API
    const manufacturerSlugs = await getManufacturerSlugsFromSearchData();
    
    if (!manufacturerSlugs || manufacturerSlugs.length === 0) {
      console.warn('No manufacturer slugs found in search-data.json');
      return [];
    }
    
    console.log(`Generating ${manufacturerSlugs.length} manufacturer pages...`);
    return manufacturerSlugs;
}

export default async function ManufacturerProductsPage({ params }) {
    const { slug } = params;
    
    const allCategories = await getAllCategories();
    const products = await getProductsByManufacturerSlug(slug);
    let manufacturer = await getManufacturerBySlug(slug);

    // Normaliza o formato do objeto do fabricante para sempre ter `.attributes`.
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
