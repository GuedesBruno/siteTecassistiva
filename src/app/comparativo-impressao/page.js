import React from 'react';
import Link from 'next/link';
import PasswordProtection from '@/components/PasswordProtection';

export const metadata = {
    title: 'Comparativo de Velocidade de Impressão Braille | Tecassistiva',
    description: 'Entenda como analisar a velocidade real de uma impressora Braille e a importância dos testes com caracteres da língua portuguesa.',
};

export default function ComparativoPage() {
    return (
        <PasswordProtection password="cuidadasuavida">
            <main className="min-h-screen bg-white font-sans">
                {/* Hero Section */}
                <section className="bg-gray-50 py-6 md:py-8 relative overflow-hidden border-b border-gray-200">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-gray-200 rounded-full blur-3xl opacity-40"></div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-2xl md:text-4xl font-extrabold mb-3 tracking-tight leading-tight text-gray-900">
                            Você sabe como escolher uma  <span className="text-tec-blue">Impressora Braille?</span>
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
                                Conheça as formas de medição que o mercado utiliza
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
                                A forma correta de avaliar a velocidade de uma impressora Braille é pelos caracteres por segundo (CPS). Contudo, além dos dois métodos legítimos de medição, existe uma terceira forma usada estrategicamente para inflar números e ludibriar o comprador.
                            </p>
                        </div>

                        {/* Row 1: Description Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Card 1: Texto Uniforme */}
                            <div className="flex gap-4 p-6 rounded-xl bg-white border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex-shrink-0 w-12 h-12 bg-tec-blue text-white rounded-full flex items-center justify-center font-bold text-xl">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">O Alfabeto Inglês</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Imprimir "ABC..." repetidamente. É um teste de estresse mecânico puro, ideal para medir a velocidade máxima da impressora.
                                    </p>
                                </div>
                            </div>

                            {/* Card 2: Alfabeto Puro */}
                            <div className="flex gap-4 p-6 rounded-xl bg-white border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex-shrink-0 w-12 h-12 bg-tec-blue text-white rounded-full flex items-center justify-center font-bold text-xl">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">O Alfabeto Português</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Além dos caracteres do alfabeto internacional, ele também conta com os caracteres especiais e acentos da grafia portuguesa.
                                    </p>
                                </div>
                            </div>

                            {/* Card 3: Enganoso */}
                            <div className="flex gap-4 p-6 rounded-xl bg-red-50 border-2 border-red-300 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl">
                                    ⚠️
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">O Enganoso</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Teste que não reflete a realidade brasileira. Pode inflar artificialmente os números de velocidade.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Badges */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="flex justify-center">
                                <span className="inline-block bg-gray-100 px-6 py-3 rounded-lg text-gray-700 font-bold border-2 border-gray-300 shadow-sm">
                                    Padrão
                                </span>
                            </div>
                            <div className="flex justify-center">
                                <span className="inline-block bg-gray-100 px-6 py-3 rounded-lg text-gray-700 font-bold border-2 border-gray-300 shadow-sm">
                                    Recomendado
                                </span>
                            </div>
                            <div className="flex justify-center">
                                <span className="inline-block bg-red-500 px-6 py-3 rounded-lg text-white font-bold border-2 border-red-600 shadow-md">
                                    Ilusório
                                </span>
                            </div>
                        </div>

                        {/* Row 3: Test/Simulation Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Test Card 1: Texto Uniforme */}
                            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm min-h-[320px] flex flex-col">
                                <h4 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4">SIMULAÇÃO DE TESTE</h4>
                                <div className="font-serif text-gray-600 text-lg md:text-xl leading-relaxed flex-grow" style={{ whiteSpace: 'nowrap' }}>
                                    <p>abcdefghijklmnopqrstuvwxyz</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold">Representação em Braille:</p>
                                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed" style={{ fontFamily: 'monospace', overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'break-all' }}>⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵</p>
                                </div>
                                <div className="mt-4 flex flex-col items-center gap-2">
                                    <img src="/teste1.jpg" alt="Média de pontos" className="w-32 h-auto rounded-lg shadow-md" />
                                    <p className="text-sm font-semibold text-gray-700">Média de 3.02 pontos por caractere</p>
                                </div>
                            </div>

                            {/* Test Card 2: Alfabeto */}
                            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 shadow-sm min-h-[320px] flex flex-col">
                                <h4 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4">SIMULAÇÃO DE TESTE</h4>
                                <div className="font-mono text-gray-600 text-lg md:text-xl leading-relaxed flex-grow">
                                    <p style={{ whiteSpace: 'nowrap' }}>abcdefghijklmnopqrstuvwxyz</p>
                                    <p style={{ whiteSpace: 'nowrap' }}><span className="font-bold">áàâãéêíóôõúç</span></p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed" style={{ fontFamily: 'monospace', overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'break-all' }}>⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵⠷⠡⠜⠩⠿⠣⠌⠾⠬⠹⠾⠯</p>
                                </div>
                                <div className="mt-4 flex flex-col items-center gap-2">
                                    <img src="/teste2.jpg" alt="Média de pontos" className="w-32 h-auto rounded-lg shadow-md" />
                                    <p className="text-sm font-semibold text-gray-700">Média de 3.41 pontos por caractere</p>
                                </div>
                            </div>

                            {/* Test Card 3: Enganoso */}
                            <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200 shadow-sm min-h-[320px] flex flex-col">
                                <h4 className="text-red-400 uppercase text-xs font-bold tracking-widest mb-4">⚠️ TESTE NÃO RECOMENDADO</h4>
                                <div className="font-mono text-gray-400 text-lg md:text-xl leading-relaxed flex-grow" style={{ whiteSpace: 'nowrap' }}>
                                    <p>aaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-red-200">
                                    <p className="text-xs text-red-300 mb-2 uppercase tracking-wide font-semibold">Representação em Braille:</p>
                                    <p className="text-lg md:text-xl text-gray-400 leading-relaxed" style={{ fontFamily: 'monospace', overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'break-all' }}>⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁</p>
                                </div>
                                <div className="mt-4 flex flex-col items-center gap-2">
                                    <img src="/teste3.jpg" alt="Média de pontos" className="w-32 h-auto rounded-lg shadow-md" />
                                    <p className="text-sm font-semibold text-red-600">Média de 1 ponto por caractere</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: A Solução (Brasil) */}
                <section className="py-4 md:py-8 bg-gray-50 border-t border-gray-200">
                    <div className="container mx-auto px-4 max-w-5xl text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            O que diz a Justiça Brasileira?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                            De acordo com a 7ª vara do Tribunal de Justiça do Paraná, para o mercado nacional, recomenda-se testar com <strong className="text-tec-blue">todos</strong> os caracteres que existem na língua portuguesa. Isso inclui letras acentuadas que melhor simulam um cenário real de produção.
                            Com esse teste constatamos que a média de pontos por caracteres aumenta de 3.02, no caso do alfabeto ingês, para 3.41 pontos por caractere, no caso do alfabeto português.
                        </p>

                        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-xl border border-blue-100 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-tec-blue via-blue-400 to-tec-blue"></div>
                            <p className="text-sm text-gray-400 mb-4 uppercase tracking-widest font-semibold">Tabela de Teste Real</p>
                            <div className="flex justify-center gap-0.5 md:gap-1 overflow-x-auto">
                                {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].map((char, i) => (
                                    <div key={i} className="flex flex-col items-center flex-shrink-0">
                                        <span className="font-mono text-lg md:text-2xl text-gray-800">{char}</span>
                                        <span className="font-mono text-base md:text-xl text-gray-600">{'⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵'[i]}</span>
                                    </div>
                                ))}
                                {[{ char: 'á', braille: '⠷' }, { char: 'à', braille: '⠡' }, { char: 'â', braille: '⠜' }, { char: 'ã', braille: '⠩' }, { char: 'é', braille: '⠿' }, { char: 'ê', braille: '⠣' }, { char: 'í', braille: '⠌' }, { char: 'ó', braille: '⠾' }, { char: 'ô', braille: '⠬' }, { char: 'õ', braille: '⠹' }, { char: 'ú', braille: '⠾' }, { char: 'ç', braille: '⠯' }].map((item, i) => (
                                    <div key={`accent-${i}`} className="flex flex-col items-center flex-shrink-0">
                                        <span className="font-mono text-lg md:text-2xl text-tec-blue font-black">{item.char}</span>
                                        <span className="font-mono text-base md:text-xl text-tec-blue font-black">{item.braille}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-8 text-gray-500 text-center">
                                Estes caracteres extras forçam a impressora a trabalhar mais, revelando a verdadeira velocidade de produção no Brasil.
                            </p>
                        </div>
                    </div>
                </section>

                {/* COMMENTED OUT - Veja a Diferença Section
                <section className="py-8 md:py-16 bg-tec-blue relative overflow-hidden">
                    ... (section content commented out)
                </section>
                */}

                {/* Expert Report Section */}
                <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-white">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                                Conheça o Laudo da Perícia
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Acesse o documento oficial da 7ª Vara do Tribunal de Justiça do Paraná que fundamenta os testes de velocidade para o mercado brasileiro.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 bg-gradient-to-br from-tec-blue to-blue-600 rounded-2xl flex items-center justify-center text-5xl shadow-lg">
                                        📄
                                    </div>
                                </div>
                                <div className="flex-grow text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Laudo Técnico Oficial</h3>
                                    <p className="text-gray-600 mb-6">
                                        Documento técnico detalhado com os testes de velocidade de impressão Braille no Brasil.
                                    </p>
                                    <a
                                        href="/laudo-pericia.pdf"
                                        download
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-tec-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Baixar Laudo Completo
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </PasswordProtection>
    );
}
