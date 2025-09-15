'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

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

// --- Componente que Renderiza a Vista Completa no Cliente ---
export default function CategoryClientView({ category, allCategories, currentCategorySlug }) {
    const searchParams = useSearchParams();
    const subCategorySlug = searchParams.get('sub');

    // Filtra os produtos com base na subcategoria selecionada na URL
    const { productsToShow, title, breadcrumb } = useMemo(() => {
        if (!category) {
            return { productsToShow: [], title: 'Carregando...', breadcrumb: null };
        }

        if (subCategorySlug) {
            const activeSub = category.subcategorias?.find(s => s.slug === subCategorySlug);
            return {
                productsToShow: activeSub?.produtos || [],
                title: activeSub?.nome || category.nome,
                breadcrumb: activeSub?.nome || null
            };
        } else {
            const allProducts = category.subcategorias?.flatMap(s => s.produtos || []) || [];
            return {
                productsToShow: allProducts,
                title: category.nome,
                breadcrumb: null
            };
        }
    }, [category, subCategorySlug]);

    return (
        <>
            <div className="text-sm text-gray-500 mb-6">
                <Link href="/" className="hover:underline">Página Inicial</Link>
                <span className="mx-2">&gt;</span>
                <Link href="/produtos" className="hover:underline">Produtos</Link>
                <span className="mx-2">&gt;</span>
                {breadcrumb ? (
                    <>
                        <Link href={`/produtos/categorias/${currentCategorySlug}`} className="hover:underline">{category.nome}</Link>
                        <span className="mx-2">&gt;</span>
                        <span className="font-semibold text-gray-700">{breadcrumb}</span>
                    </>
                ) : (
                    <span className="font-semibold text-gray-700">{category.nome}</span>
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