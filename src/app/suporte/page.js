import { getProductsWithDocuments, getSoftwareAndDrivers, getAllCategories } from '@/lib/api';
import SupportPageClient from '@/components/SupportPageClient';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata = {
  title: 'Suporte | Tecassistiva',
  description: 'Encontre documentos, manuais, softwares, drivers e utilitários para os produtos Tecassistiva.',
};

export default async function SuportePage() {
  // Buscando todos os dados em paralelo para eficiência
  const [products, software, categories] = await Promise.all([
    getProductsWithDocuments(),
    getSoftwareAndDrivers(),
    getAllCategories(),
  ]);

  const breadcrumbs = [
    { name: 'Página Inicial', path: '/' },
    { name: 'Suporte', path: '/suporte' },
  ];

  return (
    <div className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <Breadcrumbs path={breadcrumbs} />
        </div>
        <SupportPageClient 
            products={products}
            software={software}
            categories={categories}
        />
    </div>
  );
}