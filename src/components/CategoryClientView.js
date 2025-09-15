'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

// --- Componente do Menu Lateral ---
function CategorySidebar({ allCategories, currentCategorySlug, currentSubCategorySlug }) {
    if (!Array.isArray(allCategories)) {
        return null;
    }
    const categoriesToRender = allCategories.map(cat => cat.attributes);

    return (
        <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <h2 className="text-xl font-bold mb-4">Categorias</h2>
                <ul>
                    {categoriesToRender.map((cat, index) => {
                        if (!cat) return null;
                        return (
                            <li key={allCategories[index].id} className="mb-2">
                                <Link 
                                    href={`/produtos/categorias/${cat.slug}`} 
                                    scroll={false}
                                    className={`block p-2 rounded-md font-bold transition-colors ${currentCategorySlug === cat.slug && !currentSubCategorySlug ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                >
                                    {cat.nome}
                                </Link>
                                {cat.subcategorias?.data && cat.subcategorias.data.length > 0 && (
                                    <ul className="ml-4 mt-1 border-l pl-4">
                                        {cat.subcategorias.data.map((subCat) => (
                                            <li key={subCat.id}>
                                                <Link 
                                                    href={`/produtos/categorias/${cat.slug}?sub=${subCat.attributes.slug}`}
                                                    scroll={false}
                                                    className={`block p-1 text-sm rounded-md transition-colors ${currentSubCategorySlug === subCat.attributes.slug ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}`}
                                                >
                                                    {subCat.attributes.nome}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}


// --- Componente que Renderiza a Vista Completa no Cliente ---
export default function CategoryClientView({ category, allCategories, currentCategorySlug }) {
    const searchParams = useSearchParams();
    const subCategorySlug = searchParams.get('sub');
    
    const { productsToShow, title, breadcrumb, categoryName } = useMemo(() => {
        // Lógica para quando estamos a ver UMA categoria específica
        if (category?.attributes) {
            const categoryAttrs = category.attributes;
            const subcategories = categoryAttrs.subcategorias?.data || [];

            if (subCategorySlug) {
                const activeSub = subcategories.find(s => s.attributes.slug === subCategorySlug);
                return {
                    productsToShow: activeSub?.attributes?.produtos?.data || [],
                    title: activeSub?.attributes?.nome || categoryAttrs.nome,
                    breadcrumb: activeSub?.attributes?.nome || null,
                    categoryName: categoryAttrs.nome,
                };
            } else {
                const allProducts = subcategories.flatMap(s => s.attributes.produtos?.data || []);
                return {
                    productsToShow: allProducts,
                    title: categoryAttrs.nome,
                    breadcrumb: null,
                    categoryName: categoryAttrs.nome,
                };
            }
        }

        // Lógica para quando estamos em /produtos (visão geral)
        if (Array.isArray(allCategories)) {
             const allProductsFromAllCategories = allCategories.flatMap(cat => 
                cat.attributes.subcategorias?.data?.flatMap(sub => sub.attributes.produtos?.data || []) || []
            );
            return {
                productsToShow: allProductsFromAllCategories,
                title: 'Todos os Produtos',
                breadcrumb: null,
                categoryName: 'Todos os Produtos'
            };
        }

        // Estado de fallback/carregamento
        return { productsToShow: [], title: 'Carregando...', breadcrumb: null, categoryName: '' };
    }, [category, allCategories, subCategorySlug]);


    return (
        <>
            <div className="text-sm text-gray-500 mb-6">
                <Link href="/" className="hover:underline">Página Inicial</Link>
                <span className="mx-2">&gt;</span>
                <Link href="/produtos" className="hover:underline">Produtos</Link>
                {/* O breadcrumb só aparece se estivermos numa categoria específica */}
                {category && (
                    <>
                        <span className="mx-2">&gt;</span>
                        {breadcrumb ? (
                            <>
                                <Link href={`/produtos/categorias/${currentCategorySlug}`} className="hover:underline">{categoryName}</Link>
                                <span className="mx-2">&gt;</span>
                                <span className="font-semibold text-gray-700">{breadcrumb}</span>
                            </>
                        ) : (
                            <span className="font-semibold text-gray-700">{categoryName}</span>
                        )}
                    </>
                )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <CategorySidebar
                    allCategories={allCategories}
                    currentCategorySlug={currentCategorySlug}
                    currentSubCategorySlug={subCategorySlug}
                />
                <main className="lg:col-span-3">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8">{title}</h1>
                    {productsToShow.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {productsToShow.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">Nenhum produto encontrado para esta seleção.</p>
                    )}
                </main>
            </div>
        </>
    );
}