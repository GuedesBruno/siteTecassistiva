import { Suspense } from 'react';
import { getProductsWithDocuments, getSoftwareAndDrivers, getAllCategories } from '@/lib/api';
import SupportPageClient from '@/components/SupportPageClient';
import Breadcrumbs from '@/components/Breadcrumbs';

export default async function SuportePage() {
  // Buscando todos os dados em paralelo para eficiência
  const [products, software, categories] = await Promise.all([
    getProductsWithDocuments(),
    getSoftwareAndDrivers(),
    getAllCategories(),
  ]);

  // DEBUG: Log para verificar os dados
  console.log('=== SUPORTE PAGE DEBUG ===');
  console.log('Total de produtos com documentos:', products.length);
  if (products.length > 0) {
    console.log('Primeiro produto:', JSON.stringify(products[0], null, 2));
  }
  console.log('Total de categorias:', categories.length);
  console.log('=========================');

  const breadcrumbs = [
    { name: 'Página Inicial', path: '/' },
    { name: 'Suporte', path: '/suporte' },
  ];

  return (
    <div className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <Breadcrumbs path={breadcrumbs} />
        </div>
        <Suspense fallback={<div className="text-center py-16">Carregando conteúdo do suporte...</div>}>
            <SupportPageClient 
                products={products}
                software={software}
                categories={categories}
            />
        </Suspense>
    </div>
  );
}