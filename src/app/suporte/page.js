import { Suspense } from 'react';
import SupportPageClient from '@/components/SupportPageClient';
import Breadcrumbs from '@/components/Breadcrumbs';

// Prevent static generation - use on-demand ISR
export const revalidate = 3600; // Revalidate every hour

// Lazy load API functions to avoid compilation during SSG
async function getProductsWithDocuments() {
  const { getProductsWithDocuments: _getProductsWithDocuments } = await import('@/lib/api');
  return _getProductsWithDocuments();
}

async function getSoftwareAndDrivers() {
  const { getSoftwareAndDrivers: _getSoftwareAndDrivers } = await import('@/lib/api');
  return _getSoftwareAndDrivers();
}

async function getAllCategories() {
  const { getAllCategories: _getAllCategories } = await import('@/lib/api');
  return _getAllCategories();
}

export default async function SuportePage() {
  let products = [];
  let software = [];
  let categories = [];
  
  try {
    // Buscando todos os dados em paralelo para eficiência
    [products, software, categories] = await Promise.all([
      getProductsWithDocuments(),
      getSoftwareAndDrivers(),
      getAllCategories(),
    ]);
  } catch (error) {
    console.error('Erro ao carregar dados da página de suporte:', error);
  }

  // DEBUG: Log para verificar os dados
  console.log('=== SUPORTE PAGE DEBUG ===');
  console.log('Total de produtos com documentos:', products?.length || 0);
  if (products?.length > 0) {
    console.log('Primeiro produto:', JSON.stringify(products[0], null, 2));
  }
  console.log('Total de categorias:', categories?.length || 0);
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