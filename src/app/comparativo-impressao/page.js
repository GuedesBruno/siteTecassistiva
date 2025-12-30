import React from 'react';
import Link from 'next/link';
import PasswordProtection from '@/components/PasswordProtection';

export const metadata = {
    title: 'Comparativo de Velocidade de Impressão Braille | Tecassistiva',
    description: 'Entenda como analisar a velocidade real de uma impressora Braille e a importância dos testes com caracteres da língua portuguesa.',
};

export default function ComparativoPage() {
    return (
        <PasswordProtection password="senh@!">
            <main className="min-h-screen bg-white font-sans">
                {/* Hero Section */}
                <section className="bg-gray-50 py-6 md:py-8 relative overflow-hidden border-b border-gray-200">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-gray-200 rounded-full blur-3xl opacity-40"></div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-2xl md:text-4xl font-extrabold mb-3 tracking-tight leading-tight text-gray-900">
                            Você sabe como escolher uma  <span className="text-tec-blue">Impressora Braille?</span>
                        </h1>
                        <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium text-justify">
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
                            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto text-justify">
                                A forma correta de avaliar a velocidade de uma impressora Braille é pelos caracteres por segundo (CPS). Contudo, além dos dois métodos legítimos de medição, existe uma terceira forma usada estrategicamente para inflar números e ludibriar o comprador.
                            </p>
                        </div>

                        {/* Methods: Vertical on mobile (card→badge→sim), Horizontal on desktop (3 cols) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Method 1: English Alphabet - Card */}
                            <div className="flex gap-4 p-6 rounded-xl bg-blue-100 border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow order-1">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-200 text-gray-900 rounded-full flex items-center justify-center font-bold text-xl">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">O Alfabeto Inglês</h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Imprimir "ABC...XYZ" repetidamente. É o método utilizado nos testes tradicionais, considerando o alfabeto inglês.
                                    </p>
                                </div>
                            </div>

                            {/* Method 2: Portuguese Alphabet - Card */}
                            <div className="flex gap-4 p-6 rounded-xl bg-blue-500 border-2 border-blue-600 shadow-sm hover:shadow-md transition-shadow order-4 md:order-2">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg mb-2">O Alfabeto Português</h3>
                                    <p className="text-white text-sm leading-relaxed">
                                        Além dos caracteres do alfabeto inglês, ele também conta com os caracteres especiais e acentos da grafia portuguesa.
                                    </p>
                                </div>
                            </div>

                            {/* Method 3: Misleading - Card */}
                            <div className="flex gap-4 p-6 rounded-xl bg-red-50 border-2 border-red-300 shadow-sm hover:shadow-md transition-shadow order-7 md:order-3">
                                <div className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl">
                                    ⚠️
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">O Enganoso</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Teste que não reflete a realidade brasileira. Criado para enganar os usuários e inflar artificialmente os números de velocidade.
                                    </p>
                                </div>
                            </div>

                            {/* Method 1: English - Badge */}
                            <div className="flex justify-center order-2 md:order-4">
                                <span className="inline-block bg-gray-100 px-6 py-3 rounded-lg text-gray-700 font-bold border-2 border-gray-300 shadow-sm">
                                    Padrão
                                </span>
                            </div>

                            {/* Method 2: Portuguese - Badge */}
                            <div className="flex justify-center order-5">
                                <span className="inline-block bg-gray-100 px-6 py-3 rounded-lg text-gray-700 font-bold border-2 border-gray-300 shadow-sm">
                                    Recomendado
                                </span>
                            </div>

                            {/* Method 3: Misleading - Badge */}
                            <div className="flex justify-center order-8 md:order-6">
                                <span className="inline-block bg-red-500 px-6 py-3 rounded-lg text-white font-bold border-2 border-red-600 shadow-md">
                                    Ilusório
                                </span>
                            </div>

                            {/* Method 1: English - Simulation */}
                            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm min-h-[320px] flex flex-col order-3 md:order-7">
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

                            {/* Method 2: Portuguese - Simulation */}
                            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 shadow-sm min-h-[320px] flex flex-col order-6 md:order-8">
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

                            {/* Method 3: Misleading - Simulation */}
                            <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200 shadow-sm min-h-[320px] flex flex-col order-9">
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

                {/* Performance Comparison Table Section */}
                <section className="py-8 md:py-12 bg-white">
                    <div className="container mx-auto px-4">
                        {/* Performance Comparison Table */}
                        <div className="max-w-5xl mx-auto">
                            {/* Table Title */}
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
                                Resultados oficiais dos testes de produção da impressora ViewPlus Columbia
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                Modo de teste
                                            </th>
                                            <th className="border border-gray-300 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                Configuração*
                                            </th>
                                            <th className="border border-gray-300 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                Modo de impressão
                                            </th>
                                            <th className="border border-gray-300 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                CPS**
                                            </th>
                                            <th className="border border-gray-300 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                PPH***
                                            </th>
                                            <th className="border border-gray-300 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                Fonte
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* 1. Alfabeto Inglês - Light Blue */}
                                        <tr className="bg-blue-100 hover:bg-blue-200 transition-colors">
                                            <td className="border border-blue-200 px-4 py-3 text-center text-sm md:text-base text-gray-900">
                                                Alfabeto Inglês
                                            </td>
                                            <td className="border border-blue-200 px-4 py-3 text-center text-sm md:text-base text-gray-900">
                                                43 CPL × 28 LPP
                                            </td>
                                            <td className="border border-blue-200 px-4 py-3 text-center text-sm md:text-base text-gray-900">
                                                Draft
                                            </td>
                                            <td className="border border-blue-200 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                70
                                            </td>
                                            <td className="border border-blue-200 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                210
                                            </td>
                                            <td className="border border-blue-200 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                SGS
                                            </td>
                                        </tr>
                                        {/* 2. Alfabeto Português - Vibrant Blue */}
                                        <tr className="bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                                            <td className="border border-blue-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                Alfabeto Português
                                            </td>
                                            <td className="border border-blue-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                43 CPL × 28 LPP
                                            </td>
                                            <td className="border border-blue-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                Draft
                                            </td>
                                            <td className="border border-blue-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                51
                                            </td>
                                            <td className="border border-blue-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                183
                                            </td>
                                            <td className="border border-blue-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                TJPR
                                            </td>
                                        </tr>
                                        {/* 3. Enganoso (Somente "a") - Red */}
                                        <tr className="bg-red-500 text-white hover:bg-red-600 transition-colors">
                                            <td className="border border-red-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                Enganoso (Somente "a")
                                            </td>
                                            <td className="border border-red-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                43 CPL × 28 LPP
                                            </td>
                                            <td className="border border-red-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                Draft
                                            </td>
                                            <td className="border border-red-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                175
                                            </td>
                                            <td className="border border-red-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                625
                                            </td>
                                            <td className="border border-red-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                TJPR
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footnotes */}
                            <div className="mt-4 text-xs md:text-sm text-gray-600 space-y-1">
                                <p>* 43 Caracteres por linha (CPL) X 28 Linhas por página (LPP)</p>
                                <p>** (CPS) Caracteres por segundo</p>
                                <p>*** (PPH) Páginas por hora</p>
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
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 text-justify">
                            O Laudo pericial da 7ª vara do TJPR recomenda que os testes de desempenho utilizem o alfabeto completo da língua portuguesa, com caracteres acentuados, para maior fidelidade à grafia oficial .
                            Os resultados mostraram que a média de pontos braille por caractere aumenta de 3,02 (alfabeto inglês) para 3,41 (alfabeto português).
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
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-justify">
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

                {/* Index Braille Basic Performance Table Section */}
                <section className="py-8 md:py-12 bg-gray-50">
                    <div className="container mx-auto px-4">
                        {/* Performance Comparison Table */}
                        <div className="max-w-5xl mx-auto">
                            {/* Table Title */}
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
                                Resultados oficiais dos testes de produção da impressora Index Braille Basic
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                Modo de teste
                                            </th>
                                            <th className="border border-gray-300 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                Configuração*
                                            </th>
                                            <th className="border border-gray-300 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                Modo de impressão
                                            </th>
                                            <th className="border border-gray-300 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                CPS**
                                            </th>
                                            <th className="border border-gray-300 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                PPH***
                                            </th>
                                            <th className="border border-gray-300 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                Fonte
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* 1. Alfabeto Inglês - Light Blue */}
                                        <tr className="bg-blue-100 hover:bg-blue-200 transition-colors">
                                            <td className="border border-blue-200 px-4 py-3 text-center text-sm md:text-base text-gray-900">
                                                Alfabeto Inglês
                                            </td>
                                            <td className="border border-blue-200 px-4 py-3 text-center text-sm md:text-base text-gray-900">
                                                46 CPL × 29 LPP
                                            </td>
                                            <td className="border border-blue-200 px-4 py-3 text-center text-sm md:text-base text-gray-900">
                                                Draft
                                            </td>
                                            <td className="border border-blue-200 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                140
                                            </td>
                                            <td className="border border-blue-200 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                378
                                            </td>
                                            <td className="border border-blue-200 px-4 py-3 text-center text-sm md:text-base font-bold text-gray-900">
                                                SGS
                                            </td>
                                        </tr>
                                        {/* 2. Alfabeto Português - Vibrant Blue */}
                                        <tr className="bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                                            <td className="border border-blue-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                Alfabeto Português
                                            </td>
                                            <td className="border border-blue-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                46 CPL × 29 LPP
                                            </td>
                                            <td className="border border-blue-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                Draft
                                            </td>
                                            <td className="border border-blue-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                139
                                            </td>
                                            <td className="border border-blue-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                375
                                            </td>
                                            <td className="border border-blue-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                Padrão TJPR
                                            </td>
                                        </tr>
                                        {/* 3. Enganoso (Somente "a") - Red */}
                                        <tr className="bg-red-500 text-white hover:bg-red-600 transition-colors">
                                            <td className="border border-red-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                Enganoso (Somente "a")
                                            </td>
                                            <td className="border border-red-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                46 CPL × 29 LPP
                                            </td>
                                            <td className="border border-red-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                Draft
                                            </td>
                                            <td className="border border-red-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                333
                                            </td>
                                            <td className="border border-red-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                898
                                            </td>
                                            <td className="border border-red-600 px-4 py-3 text-center text-sm md:text-base font-bold">
                                                Padrão TJPR
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footnotes */}
                            <div className="mt-4 text-xs md:text-sm text-gray-600 space-y-1">
                                <p>* 46 Caracteres por linha (CPL) X 29 Linhas por página (LPP)</p>
                                <p>** (CPS) Caracteres por segundo</p>
                                <p>*** (PPH) Páginas por hora</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Comparative Summary Section */}
                <section className="py-12 md:py-16 bg-white border-t border-gray-200">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-12">
                            <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-sm mb-4">
                                Análise Comparativa
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Por que a Index Braille Basic é Superior?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-justify">
                                Além da velocidade de impressão significativamente maior, a Index Braille Basic oferece economia substancial de papel através de sua configuração otimizada de impressão em papel 11" × 12".
                            </p>
                        </div>

                        {/* Comparison Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {/* Speed Comparison Card */}
                            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-200 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl">
                                        ⚡
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Vantagem em Velocidade</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                                        <p className="text-sm text-gray-600 mb-2">Teste com Alfabeto Português (Real)</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-blue-600">139 CPS</span>
                                            <span className="text-gray-500">vs</span>
                                            <span className="text-xl text-gray-400 line-through">51 CPS</span>
                                        </div>
                                        <p className="text-sm font-semibold text-green-600 mt-2">
                                            ✓ 173% mais rápida (quase 3x a velocidade)
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-blue-100">
                                        <p className="text-sm text-gray-600 mb-2">Páginas por Hora (PPH)</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-blue-600">375 PPH</span>
                                            <span className="text-gray-500">vs</span>
                                            <span className="text-xl text-gray-400 line-through">183 PPH</span>
                                        </div>
                                        <p className="text-sm font-semibold text-green-600 mt-2">
                                            ✓ 105% mais produtiva (mais que o dobro)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Time Economy Card */}
                            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border-2 border-purple-200 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-2xl">
                                        ⏱️
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Economia de Tempo</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                                        <p className="text-sm text-gray-600 mb-2">Produção de 10.000 páginas</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-purple-600">27h</span>
                                            <span className="text-gray-500">vs</span>
                                            <span className="text-xl text-gray-400 line-through">55h</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Index Basic vs ViewPlus Columbia
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                                        <p className="text-sm text-gray-600 mb-2">Tempo economizado</p>
                                        <div className="text-3xl font-bold text-purple-600 mb-2">
                                            28 horas
                                        </div>
                                        <p className="text-sm font-semibold text-green-600">
                                            ✓ 51% menos tempo de produção
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Paper Economy Card */}
                            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-200 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                                        🌱
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Economia de Papel</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg border border-green-100">
                                        <p className="text-sm text-gray-600 mb-2">Caracteres por Página (11" × 12")</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-green-600">1334</span>
                                            <span className="text-gray-500">vs</span>
                                            <span className="text-xl text-gray-400 line-through">1204</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            46 CPL × 29 LPP vs 43 CPL × 28 LPP
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-green-100">
                                        <p className="text-sm text-gray-600 mb-2">Economia em 10.000 páginas</p>
                                        <div className="text-3xl font-bold text-green-600 mb-2">
                                            <span className="text-lg">Cerca de</span> 970 folhas
                                        </div>
                                        <p className="text-sm font-semibold text-green-600">
                                            ✓ 10,8% menos papel necessário
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Explanation */}
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                Entenda os Comparativos Completos
                            </h3>

                            {/* Speed and Productivity Comparison */}
                            <div className="mb-8">
                                <h4 className="font-bold text-xl text-blue-600 mb-4">⚡ Velocidade e Produtividade</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h5 className="font-bold text-lg text-gray-900 mb-3">ViewPlus Columbia</h5>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-500 font-bold">•</span>
                                                <span>Velocidade (Português): 51 CPS</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-500 font-bold">•</span>
                                                <span>Produtividade: 183 PPH</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-500 font-bold">•</span>
                                                <span>Tempo para 10.000 páginas: 55 horas</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-lg text-green-700 mb-3">Index Braille Basic</h5>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span>Velocidade (Português): 139 CPS</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span>Produtividade: 375 PPH</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span>Tempo para 10.000 páginas: 27 horas</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Paper Economy Comparison */}
                            <div className="mb-8">
                                <h4 className="font-bold text-xl text-green-600 mb-4">🌱 Economia de Papel</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h5 className="font-bold text-lg text-gray-900 mb-3">ViewPlus Columbia</h5>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-500 font-bold">•</span>
                                                <span>Configuração: 43 CPL × 28 LPP</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-500 font-bold">•</span>
                                                <span>Total: 1.204 caracteres por página</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-blue-500 font-bold">•</span>
                                                <span>Para 100.000 caracteres: ~83 páginas</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-lg text-green-700 mb-3">Index Braille Basic</h5>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span>Configuração: 46 CPL × 29 LPP</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span>Total: 1.334 caracteres por página</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-green-500 font-bold">•</span>
                                                <span>Para 100.000 caracteres: ~75 páginas</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Box */}
                            <div className="p-6 bg-white rounded-xl border-2 border-green-300">
                                <p className="text-center text-lg font-semibold text-gray-900 mb-4">
                                    <span className="text-green-600 text-2xl">💰</span> Resumo das Vantagens da Index Braille Basic
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Velocidade</p>
                                        <p className="text-xl font-bold text-blue-600">173% mais rápida</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Economia de Tempo</p>
                                        <p className="text-xl font-bold text-purple-600">28h economizadas</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Economia de Papel</p>
                                        <p className="text-xl font-bold text-green-600">970 folhas a menos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </PasswordProtection >
    );
}
