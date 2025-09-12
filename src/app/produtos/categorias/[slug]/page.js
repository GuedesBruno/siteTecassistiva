import { getAllCategories, getCategoryBySlug } from '@/lib/api';
import Link from 'next/link';
import ProductListClient from '@/components/ProductListClient';

// ADICIONADO: Informa ao Next.js quais páginas de categoria devem ser geradas
export async function generateStaticParams() {
    const categories = await getAllCategories();
    if (!categories) return [];
    return categories.map((category) => ({
        slug: category.slug,
    }));
}

// Componente do Menu Lateral (Sidebar)
async function CategorySidebar({ currentCategorySlug, currentSubCategorySlug }) {
    const allCategories = await getAllCategories();
    return (
        <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <h2 className="text-xl font-bold mb-4">Categorias</h2>
                <ul>
                    {(allCategories || []).map((cat) => (
                        <li key={cat.id} className="mb-2">
                            <Link 
                                href={`/produtos/categorias/${cat.slug}`} 
                                scroll={false}
                                className={`block p-2 rounded-md font-bold transition-colors ${currentCategorySlug === cat.slug && !currentSubCategorySlug ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                            >
                                {cat.nome}
                            </Link>
                            {cat.subcategorias && cat.subcategorias.length > 0 && (
                                <ul className="ml-4 mt-1 border-l pl-4">
                                    {cat.subcategorias.map((subCat) => (
                                        <li key={subCat.id}>
                                            <Link 
                                                href={`/produtos/categorias/${cat.slug}?sub=${subCat.slug}`}
                                                scroll={false}
                                                className={`block p-1 text-sm rounded-md transition-colors ${currentSubCategorySlug === subCat.slug ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}`}
                                            >
                                                {subCat.nome}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}

// Componente Principal da Página (Componente de Servidor)
export default async function CategoryPage({ params, searchParams }) {
    const category = await getCategoryBySlug(params.slug);
    const subCategorySlug = searchParams.sub;

    if (!category) {
        return <p className="text-center py-20">Categoria não encontrada.</p>;
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 md:px-12 py-12">
                <div className="text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:underline">Página Inicial</Link>
                    <span className="mx-2">&gt;</span>
                    <Link href="/produtos" className="hover:underline">Produtos</Link>
                    <span className="mx-2">&gt;</span>
                    {subCategorySlug ? (
                         <>
                            <Link href={`/produtos/categorias/${params.slug}`} className="hover:underline">{category.nome}</Link>
                         </>
                    ) : (
                        <span className="font-semibold text-gray-700">{category.nome}</span>
                    )}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <CategorySidebar 
                        currentCategorySlug={params.slug} 
                        currentSubCategorySlug={subCategorySlug} 
                    />
                    <main className="lg:col-span-3">
                        <ProductListClient 
                            category={category}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
}