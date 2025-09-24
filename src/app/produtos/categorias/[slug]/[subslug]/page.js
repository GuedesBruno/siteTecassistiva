import { getAllCategories, fetchAPI, normalizeDataArray } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

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

  const [allCategories, products] = await Promise.all([
    getAllCategories(),
    getProductsForSubcategory(subslug),
  ]);

  if (!products) {
    notFound();
  }

  const currentCategory = allCategories.find(c => (c.attributes?.slug || c.slug) === slug);
  const subcategories = currentCategory?.attributes?.subcategorias?.data || currentCategory?.subcategorias || [];
  const currentSubcategory = subcategories.find(s => (s.attributes?.slug || s.slug) === subslug);
  
  const subcategoryName = currentSubcategory?.attributes?.nome || currentSubcategory?.nome || 'Produtos';
  const categoryName = currentCategory?.attributes?.nome || currentCategory?.nome || 'Categorias';
  const categorySlug = currentCategory?.attributes?.slug || currentCategory?.slug;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:underline">
          Página Inicial
        </Link>
        <span className="mx-2">&gt;</span>
        <Link href="/produtos/categorias" className="hover:underline">
          Produtos
        </Link>
        <span className="mx-2">&gt;</span>
        <Link
          href={`/produtos/categorias/${categorySlug}`}
          className="hover:underline"
        >
          {categoryName}
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-semibold text-gray-700">
          {subcategoryName}
        </span>
      </nav>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {subcategoryName}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}