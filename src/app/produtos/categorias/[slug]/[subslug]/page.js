import CategoryClientView from '@/components/CategoryClientView';
import { getAllCategories, getCategoryBySlug } from '@/lib/api';

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

export default async function SubcategoryPage({ params }) {
  const { slug, subslug } = params;

  const categoryData = await getCategoryBySlug(slug);

  if (!categoryData || !categoryData.data || categoryData.data.length === 0) {
    return <div>Categoria não encontrada.</div>;
  }

  const category = categoryData.data[0];

  return <CategoryClientView category={category} />;
}
