import { getProducts, getProductBySlug } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export async function generateStaticParams() {
  const products = await getProducts();
  if (!products || products.length === 0) return [];
  return products
    .filter(product => product.attributes && product.attributes.slug) 
    .map((product) => ({
      slug: product.attributes.slug,
    }));
}

export default async function ProductsPage() {
  const categories = await getAllCategoriesWithProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Nossos Produtos</h1>
      <CategoryProductList categories={categories} />
    </div>
  );
}