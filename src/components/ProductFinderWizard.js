'use client';

import { useState, useMemo } from 'react';
import ProductDisplay from './ProductDisplay';
import { FaSearch, FaArrowRight, FaUndo } from 'react-icons/fa';

// Helper to safely access attributes whether nested or flattened
const getAttrs = (item) => item?.attributes || item || {};

export default function ProductFinderWizard({ categories = [], products = [] }) {
    const [step, setStep] = useState(1);
    const [userInput, setUserInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Create a combined list of suggestions (Categories + Product Names)
    const suggestions = useMemo(() => {
        const catSuggestions = categories.map(c => {
            const attrs = getAttrs(c);
            return {
                type: 'category',
                label: attrs.nome,
                value: c
            };
        }).filter(s => s.label);

        const prodSuggestions = products.map(p => {
            const attrs = getAttrs(p);
            return {
                type: 'product',
                label: attrs.nome,
                value: p
            };
        }).filter(s => s.label);

        return [...catSuggestions, ...prodSuggestions];
    }, [categories, products]);

    const handleInputSubmit = (e) => {
        e.preventDefault();
        const match = suggestions.find(s => s.label.toLowerCase() === userInput.toLowerCase());

        if (match) {
            if (match.type === 'category') {
                handleCategorySelect(match.value);
            } else {
                handleProductSelect(match.value);
            }
        } else {
            // Fuzzy search or fallback: display list of products matching text
            const matches = products.filter(p =>
                getAttrs(p).nome?.toLowerCase().includes(userInput.toLowerCase())
            );
            if (matches.length > 0) {
                setFilteredProducts(matches);
                setStep(3);
            }
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        const catAttrs = getAttrs(category);
        // Check if category has subcategories
        const subcats = catAttrs.subcategorias?.data || catAttrs.subcategorias;
        if (subcats && subcats.length > 0) {
            setStep(2);
        } else {
            // Filter products by this category immediately
            const relevant = products.filter(p => {
                const pAttrs = getAttrs(p);
                const pCats = pAttrs.categorias?.data || pAttrs.categorias;
                return pCats?.some(c => getAttrs(c).slug === catAttrs.slug);
            });
            setFilteredProducts(relevant);
            setStep(3);
        }
    };

    const handleSubcategorySelect = (subcat) => {
        const subAttrs = getAttrs(subcat);
        setSelectedSubcategory(subcat);
        const relevant = products.filter(p => {
            const pAttrs = getAttrs(p);
            const pSubcats = pAttrs.subcategorias?.data || pAttrs.subcategorias;
            return pSubcats?.some(s => getAttrs(s).slug === subAttrs.slug);
        });
        setFilteredProducts(relevant);
        setStep(3);
    };

    const handleProductSelect = (product) => {
        setFilteredProducts([product]);
        setStep(3);
    };

    const handleStartOver = () => {
        setStep(1);
        setUserInput('');
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setFilteredProducts([]);
    };

    // --- Render Steps ---

    // Step 1: Initial Question
    if (step === 1) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl shadow-lg p-8 md:p-14 animate-fade-in-up border border-gray-100">
                <h2 className="text-3xl md:text-5xl font-extrabold text-tec-blue mb-8 text-center leading-tight">
                    O que você busca?
                </h2>

                <form onSubmit={handleInputSubmit} className="w-full max-w-lg relative group">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-tec-blue transition-colors duration-300" />
                        <input
                            type="text"
                            list="suggestions-list"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ex: Cegueira, Linha Braille, Lupa..."
                            className="w-full pl-12 pr-6 py-3 text-base rounded-full border-2 border-gray-200 focus:border-tec-blue focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 shadow-sm"
                        />
                    </div>
                    <datalist id="suggestions-list">
                        {suggestions.map((s, idx) => (
                            <option key={idx} value={s.label} />
                        ))}
                    </datalist>

                    {userInput && (
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-tec-blue text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-md"
                        >
                            <FaArrowRight className="text-sm" />
                        </button>
                    )}
                </form>

                <p className="mt-6 text-gray-400 text-center text-sm md:text-base">
                    Digite uma categoria ou produto acima para começar.
                </p>

                {/* Quick Category Chips for lazy users */}
                <div className="mt-10 flex flex-wrap justify-center gap-3">
                    {categories.slice(0, 5).map(cat => {
                        const cAttrs = getAttrs(cat);
                        return (
                            <button
                                type="button"
                                key={cat.id || cAttrs.slug}
                                onClick={() => {
                                    setUserInput(cAttrs.nome);
                                    handleCategorySelect(cat);
                                }}
                                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-gray-600 hover:bg-blue-50 hover:border-tec-blue hover:text-tec-blue transition-all duration-300 text-sm font-medium"
                            >
                                {cAttrs.nome}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Step 2: Subcategory Selection
    if (step === 2 && selectedCategory) {
        const catAttrs = getAttrs(selectedCategory);
        const subcats = catAttrs.subcategorias?.data || catAttrs.subcategorias || [];

        return (
            <div className="flex flex-col min-h-[50vh] animate-fade-in-up">
                <button type="button" onClick={handleStartOver} className="self-start mb-6 text-sm text-gray-500 hover:text-tec-blue flex items-center gap-2">
                    <FaUndo /> Começar de novo
                </button>

                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                    {catAttrs.nome}
                </h2>
                <p className="text-gray-500 text-center mb-10 text-lg">Selecione uma subcategoria para refinar:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 w-full">
                    {subcats.map(sub => {
                        const subAttrs = getAttrs(sub);
                        return (
                            <button
                                type="button"
                                key={sub.id || subAttrs.slug}
                                onClick={() => handleSubcategorySelect(sub)}
                                className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:border-tec-blue hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center gap-4 group h-48"
                            >
                                <span className="text-lg font-semibold text-gray-700 group-hover:text-tec-blue transition-colors">
                                    {subAttrs.nome}
                                </span>
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={() => {
                            // Show all for this category
                            const relevant = products.filter(p => {
                                const pAttrs = getAttrs(p);
                                const pCats = pAttrs.categorias?.data || pAttrs.categorias;
                                return pCats?.some(c => getAttrs(c).slug === catAttrs.slug);
                            });
                            setFilteredProducts(relevant);
                            setStep(3);
                        }}
                        className="bg-gray-50 p-8 rounded-xl border-2 border-dashed border-gray-300 hover:border-tec-blue hover:bg-blue-50 transition-all duration-300 text-center flex flex-col items-center justify-center gap-2 group h-48"
                    >
                        <span className="text-base font-medium text-gray-500 group-hover:text-tec-blue">
                            Ver todos de {catAttrs.nome}
                        </span>
                    </button>
                </div>
            </div>
        );
    }

    // Step 3: Results
    if (step === 3) {
        const catAttrs = selectedCategory ? getAttrs(selectedCategory) : null;
        const subAttrs = selectedSubcategory ? getAttrs(selectedSubcategory) : null;

        return (
            <div className="space-y-8 animate-fade-in-up">
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <button type="button" onClick={handleStartOver} className="text-tec-blue font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <FaUndo /> Nova Pesquisa
                    </button>
                    <div className="text-sm text-gray-500">
                        Encontrados: <strong>{filteredProducts.length}</strong> produtos
                    </div>
                </div>

                <ProductDisplay
                    categoryName={
                        subAttrs
                            ? `${catAttrs?.nome} > ${subAttrs.nome}`
                            : catAttrs
                                ? catAttrs.nome
                                : 'Resultados da Pesquisa'
                    }
                    products={filteredProducts}
                />
            </div>
        );
    }

    return null;
}
