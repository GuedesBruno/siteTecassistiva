import { getAllCategories } from '@/lib/api';
import CategoryProductList from '@/components/CategoryProductList';
import { Suspense } from 'react';

export default async function ProductsPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Nossos Produtos</h1>
      <Suspense fallback={<div>Carregando produtos...</div>}>
        <CategoryProductList categories={categories} />
      </Suspense>
    </div>
  );
}