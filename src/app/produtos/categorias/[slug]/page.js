import { getAllCategories, getCategoryBySlug } from '@/lib/api';
import CategoryClientView from '@/components/CategoryClientView';

// Gera todos os slugs de categoria no momento do build
export async function generateStaticParams() {
    const categories = await getAllCategories();
    if (!Array.isArray(categories)) return [];
    
    return categories.map((category) => ({
        slug: category.slug,
    }));
}

// Gera o título e descrição da página no servidor
export async function generateMetadata({ params }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    return { title: 'Categoria não Encontrada | Tecassistiva' };
  }
  return {
    title: `${category.nome} | Tecassistiva`,
    description: `Produtos da categoria ${category.nome} na Tecassistiva.`,
  };
}

// O COMPONENTE PRINCIPAL (Componente de Servidor)
// ATUALIZAÇÃO: Agora ele recebe 'searchParams' e os passa para o cliente
export default async function CategoryPage({ params, searchParams }) {
    const [category, allCategories] = await Promise.all([
        getCategoryBySlug(params.slug),
        getAllCategories()
    ]);

    if (!category) {
        return <p className="text-center py-20">Categoria não encontrada.</p>;
    }

    // Extrai o slug da subcategoria dos parâmetros de busca do servidor
    const subCategorySlug = searchParams.sub || null;

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 md:px-12 py-12">
                <CategoryClientView 
                    category={category} 
                    allCategories={allCategories}
                    currentCategorySlug={params.slug}
                    // Passa o slug da subcategoria como uma prop simples
                    subCategorySlug={subCategorySlug} 
                />
            </div>
        </div>
    );
}