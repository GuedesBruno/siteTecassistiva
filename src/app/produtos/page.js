import { Suspense } from 'react';
import { getAllCategoriesWithProducts } from '@/lib/api';
import CategoryClientView from '@/components/CategoryClientView';

// Este é o novo "cérebro" da sua página de produtos.
// Ele busca todos os dados necessários no servidor.
export default async function ProdutosPage() {
    const allCategories = await getAllCategoriesWithProducts();

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 md:px-12 py-12">
                {/* Usamos o Suspense para permitir que o CategoryClientView 
                  use hooks de cliente (como useSearchParams para filtrar) 
                  sem quebrar o build estático.
                */}
                <Suspense fallback={<p>Carregando...</p>}>
                    <CategoryClientView 
                        allCategories={allCategories}
                        // Não passamos 'category' ou 'currentCategorySlug'
                        // para que o componente saiba que está na visão geral.
                    />
                </Suspense>
            </div>
        </div>
    );
}