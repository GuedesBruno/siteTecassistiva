'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

// --- Componente do Menu Lateral (Sidebar) ---
function CategorySidebar({ allCategories, currentCategorySlug, currentSubCategorySlug }) {
    // 1. Verificação de segurança principal: Garante que 'allCategories' é um array antes de continuar.
    if (!Array.isArray(allCategories)) {
        return null; // Não renderiza nada se não houver categorias, impedindo o erro.
    }

    return (
        <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <h2 className="text-xl font-bold mb-4">Categorias</h2>
                <ul>
                    {allCategories.map((cat) => {
                        // 2. Verificação de segurança secundária: Garante que cada item 'cat' e seus 'attributes' existem.
                        if (!cat || !cat.attributes) return null;
                        const catAttrs = cat.attributes;

                        return (
                            <li key={cat.id} className="mb-2">
                                <Link 
                                    href={`/produtos/categorias/${catAttrs.slug}`} 
                                    scroll={false}
                                    className={`block p-2 rounded-md font-bold transition-colors ${currentCategorySlug === catAttrs.slug && !currentSubCategorySlug ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                >
                                    {catAttrs.nome}
                                </Link>
                                {catAttrs.subcategorias?.data && catAttrs.subcategorias.data.length > 0 && (
                                    <ul className="ml-4 mt-1 border-l pl-4">
                                        {catAttrs.subcategorias.data.map((subCat) => {
                                            if (!subCat || !subCat.attributes) return null;
                                            const subCatAttrs = subCat.attributes;
                                            return (
                                                <li key={subCat.id}>
                                                    <Link 
                                                        href={`/produtos/categorias/${catAttrs.slug}?sub=${subCatAttrs.slug}`}
                                                        scroll={false}
                                                        className={`block p-1 text-sm rounded-md transition-colors ${currentSubCategorySlug === subCatAttrs.slug ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}`}
                                                    >
                                                        {subCatAttrs.nome}
                                                    </Link>
                                                </li>
                                            );
                                        })}
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


// --- Componente Principal ---
export default function CategoryClientView({ category, allCategories, currentCategorySlug }) {
    const searchParams = useSearchParams();
    const subCategorySlug = searchParams.get('sub');
    
    const { productsToShow, title, breadcrumb, categoryName } = useMemo(() => {
        // Lógica para quando estamos a ver UMA categoria específica
        if (category?.attributes) {
            const categoryAttrs = category.attributes;
            const subcategories = categoryAttrs.subcategorias?.data || [];
            const safeSubcategories = subcategories.filter(s => s && s.attributes);

            if (subCategorySlug) {
                const activeSub = safeSubcategories.find(s => s.attributes.slug === subCategorySlug);
                return {
                    productsToShow: activeSub?.attributes?.produtos?.data?.filter(p => p && p.attributes) || [],
                    title: activeSub?.attributes?.nome || categoryAttrs.nome,
                    breadcrumb: activeSub?.attributes?.nome || null,
                    categoryName: categoryAttrs.nome,
                };
            } else {
                const allProducts = safeSubcategories.flatMap(s => s.attributes.produtos?.data?.filter(p => p && p.attributes) || []);
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
                cat?.attributes?.subcategorias?.data?.flatMap(sub => sub?.attributes?.produtos?.data?.filter(p => p && p.attributes) || []) || []
            );
            return {
                productsToShow: allProductsFromAllCategories,
                title: 'Todos os Produtos',
                breadcrumb: null,
                categoryName: 'Todos os Produtos'
            };
        }

        // Estado de fallback
        return { productsToShow: [], title: 'Carregando...', breadcrumb: null, categoryName: '' };
    }, [category, allCategories, subCategorySlug]);


    return (
        <>
            <div className="text-sm text-gray-500 mb-6">
                <Link href="/" className="hover:underline">Página Inicial</Link>
                <span className="mx-2">&gt;</span>
                <Link href="/produtos" className="hover:underline">Produtos</Link>
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