import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Comparativo de Velocidade de Impressão Braille | Tecassistiva',
    description: 'Entenda como analisar a velocidade real de uma impressora Braille e a importância dos testes com caracteres da língua portuguesa.',
};

export default function ComparativoPage() {
    return (
        <main className="min-h-screen bg-white font-sans">
            {/* Hero Section */}
            <section className="bg-gray-50 py-6 md:py-8 relative overflow-hidden border-b border-gray-200">
                <div className="absolute inset-0 bg-[url('/pattern-grid.png')] opacity-[0.03]"></div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-gray-200 rounded-full blur-3xl opacity-40"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-2xl md:text-4xl font-extrabold mb-3 tracking-tight leading-tight text-gray-900">
                        Velocidade de Impressão <span className="text-tec-blue">Em Braille</span>
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                        Entenda por que a velocidade nominal nem sempre reflete a realidade da sua produção e aprenda a avaliar corretamente.
                    </p>
                </div>
            </section>

            {/* Section 1: O Problema (Métodos) */}
            <section className="py-4 md:py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <div className="inline-block px-4 py-1 bg-blue-100 text-tec-blue rounded-full font-semibold text-sm mb-4">
                            Métodos de Medição
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                            O mercado sempre usou 2 formas de medir
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
                            Comparar impressoras apenas pelo número de "caracteres por segundo" pode ser enganoso se você não souber qual texto foi usado no teste.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {/* Column 1: Texto Uniforme */}
                        <div className="flex flex-col gap-6">
                            <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="flex-shrink-0 w-12 h-12 bg-white text-tec-blue rounded-full flex items-center justify-center font-bold text-xl shadow-sm border border-gray-100">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Texto Uniforme</h3>
                                    <p className="text-gray-500 mt-1 text-sm leading-relaxed">
                                        Utiliza um texto padrão mundial, como a Bíblia que é igual em todos os países. Ótimo para padronização laboratorial.
                                    </p>
                                </div>
                            </div>

                            {/* Visual 1 */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 relative group hover:shadow-md transition-all transform -rotate-1 hover:rotate-0 duration-500 flex-grow">
                                <h4 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4">Teste de Texto Uniforme</h4>
                                <div className="space-y-2 font-serif text-gray-500 text-xs md:text-sm leading-relaxed text-justify">
                                    <p>No princípio, criou Deus os céus e a terra. A terra, porém, estava sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava por sobre as águas.</p>
                                    <p>Disse Deus: Haja luz; e houve luz. E viu Deus que a luz era boa; e fez separação entre a luz e as trevas.</p>
                                    <p>Chamou Deus à luz Dia e às trevas, Noite. Houve tarde e manhã, o primeiro dia.</p>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center -translate-y-32">
                                    <span className="bg-gray-100/90 backdrop-blur px-4 py-2 rounded-lg text-gray-600 font-bold border border-gray-200 text-sm">
                                        Padrão Previsível
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Alfabeto Puro */}
                        <div className="flex flex-col gap-6">
                            <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="flex-shrink-0 w-12 h-12 bg-white text-tec-blue rounded-full flex items-center justify-center font-bold text-xl shadow-sm border border-gray-100">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">O Alfabeto Puro</h3>
                                    <p className="text-gray-500 mt-1 text-sm leading-relaxed">
                                        Imprimir "ABC..." repetidamente. É um teste de estresse mecânico puro, ideal para medir a velocidade máxima teórica do motor.
                                    </p>
                                </div>
                            </div>

                            {/* Visual 2 */}
                            <div className="bg-gray-50 rounded-3xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500 border border-gray-200 relative flex-grow">
                                <h4 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4">Simulação de Teste</h4>
                                <div className="space-y-2 font-mono text-gray-500 text-sm overflow-hidden select-none">
                                    <p>ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOP...</p>
                                    <p>ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOP...</p>
                                    <p>ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOP...</p>
                                    <p>ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOP...</p>
                                    <p>ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOP...</p>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center -translate-y-32">
                                    <span className="bg-white/90 backdrop-blur px-6 py-3 rounded-lg shadow-lg text-gray-600 font-bold border border-gray-100">
                                        Teste Sintético
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: A Solução (Brasil) */}
            <section className="py-4 md:py-8 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        O Padrão Brasileiro
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                        Para o mercado nacional, a perícia técnica recomenda testar com <strong className="text-tec-blue">todos</strong> os caracteres da nossa língua. Isso inclui acentos e cedilhas que exigem mais da cabeça de impressão.
                    </p>

                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-blue-100 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-tec-blue via-blue-400 to-tec-blue"></div>
                        <p className="text-sm text-gray-400 mb-4 uppercase tracking-widest font-semibold">Tabela de Teste Real</p>
                        <p className="font-mono text-2xl md:text-5xl text-gray-800 tracking-wider break-all leading-normal">
                            ABCDEFGHIJKLMNOPQRSTUVWXYZ<span className="text-tec-blue font-black animate-pulse">ÁÀÃÂÉÊÇÍ</span>
                        </p>
                        <p className="mt-8 text-gray-500 max-w-lg mx-auto">
                            Estes caracteres extras forçam a impressora a trabalhar mais, revelando a verdadeira velocidade de produção no Brasil.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA & Video Section */}
            <section className="py-8 md:py-16 bg-tec-blue relative overflow-hidden">
                {/* Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute w-96 h-96 bg-white opacity-5 rounded-full -top-20 -left-20"></div>
                    <div className="absolute w-[500px] h-[500px] bg-white opacity-5 rounded-full -bottom-40 -right-20"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Veja a Diferença
                        </h2>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                            Disponibilizamos materiais exclusivos para você aprofundar seu conhecimento técnico.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Card 1 */}
                        <div className="bg-white rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-2xl flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl mb-6">
                                ⚖️
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Perícia Judicial</h3>
                            <p className="text-gray-500 mb-8 flex-grow">
                                Acesse o relatório técnico detalhado que fundamenta esses testes e entenda os critérios legais.
                            </p>
                            <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl">
                                Ler Relatório
                            </button>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-2xl flex flex-col items-center text-center text-white border border-blue-500/30">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-6 backdrop-blur">
                                ▶️
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Vídeos Comparativos</h3>
                            <p className="text-blue-100 mb-8 flex-grow">
                                Assista lado a lado impressoras rodando o teste do Alfabeto vs. o teste do Padrão Brasileiro.
                            </p>
                            <button className="w-full py-4 bg-white text-tec-blue rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl">
                                Assistir Agora
                            </button>
                        </div>
                    </div>

                    <div className="mt-20 max-w-4xl mx-auto bg-gray-900 rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/10">
                        <div className="aspect-video w-full flex items-center justify-center bg-gray-800 relative group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <div className="ml-2 w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent"></div>
                            </div>
                            <p className="absolute bottom-6 font-medium text-white/80">Preview: Teste de Velocidade em Tempo Real</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
