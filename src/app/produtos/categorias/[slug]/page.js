'use client'; 

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getAllCategories, getCategoryBySlug } from '@/lib/api';

// --- Componente do Menu Lateral ---
function CategorySidebar({ allCategories, currentCategorySlug, currentSubCategorySlug }) {
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

// --- Componente Principal da Página ---
export default function CategoryPage({ params }) {
    const [category, setCategory] = useState(null);
    const [allCategories, setAllCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [pageTitle, setPageTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const searchParams = useSearchParams();
    const subCategorySlug = searchParams.get('sub');

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const [catData, allCatsData] = await Promise.all([
                getCategoryBySlug(params.slug),
                getAllCategories()
            ]);
            
            setCategory(catData);
            setAllCategories(allCatsData || []);
            
            if (catData) {
                if (subCategorySlug) {
                    const activeSub = catData.subcategorias?.find(s => s.slug === subCategorySlug);
                    setFilteredProducts(activeSub?.produtos || []);
                    setPageTitle(activeSub?.nome || catData.nome);
                } else {
                    const allProducts = catData.subcategorias?.flatMap(s => s.produtos || []) || [];
                    setFilteredProducts(allProducts);
                    setPageTitle(catData.nome);
                }
            }
            setIsLoading(false);
        }
        fetchData();
    }, [params.slug, subCategorySlug]);

    // O esqueleto de carregamento é mostrado enquanto os dados são buscados
    if (isLoading) {
        return (
            <div className="bg-gray-50">
                <div className="container mx-auto px-6 md:px-12 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1 h-96 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="lg:col-span-3">
                            <div className="h-10 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!category) {
        return <div className="text-center py-20">Categoria não encontrada.</div>;
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
                            <span className="mx-2">&gt;</span>
                            <span className="font-semibold text-gray-700">{pageTitle}</span>
                         </>
                    ) : (
                        <span className="font-semibold text-gray-700">{pageTitle}</span>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <CategorySidebar 
                        allCategories={allCategories} 
                        currentCategorySlug={params.slug} 
                        currentSubCategorySlug={subCategorySlug} 
                    />
                    <main className="lg:col-span-3">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">{pageTitle}</h1>
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Nenhum produto encontrado para esta seleção.</p>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}