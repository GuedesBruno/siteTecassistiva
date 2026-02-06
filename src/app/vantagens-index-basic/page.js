import React from 'react';

export const metadata = {
    title: 'Vantagens Exclusivas Index Basic | Tecassistiva',
    description: 'Descubra por que a Index Basic é superior em velocidade, economia e tecnologia comparada a outras impressoras Braille.',
};

export default function VantagensPage() {
    return (
        <main className="min-h-screen bg-white font-sans">
            {/* Comparative Summary Section */}
            <section className="py-12 md:py-16 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-sm mb-4">
                            Análise Comparativa
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Por que a INDEX BASIC é Superior?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto text-justify">
                            Além da velocidade de impressão significativamente maior, a INDEX BASIC é uma impressora verdadeiramente moderna e tecnológica, oferecendo recursos de conectividade (Wi-Fi, Bluetooth) e acessibilidade que a colocam gerações à frente.
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
                                        <span className="text-xl text-gray-400 line-through">63 CPS</span>
                                    </div>
                                    <p className="text-sm font-semibold text-green-600 mt-2">
                                        ✓ 121% mais rápida (mais que o dobro)
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-blue-100">
                                    <p className="text-sm text-gray-600 mb-2">Páginas por Hora (PPH)</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-blue-600">375 PPH</span>
                                        <span className="text-gray-500">vs</span>
                                        <span className="text-xl text-gray-400 line-through">226 PPH</span>
                                    </div>
                                    <p className="text-sm font-semibold text-green-600 mt-2">
                                        ✓ 66% mais produtiva
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
                                        <span className="text-xl text-gray-400 line-through">44h</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Index Basic vs ViewPlus Columbia
                                    </p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-purple-100">
                                    <p className="text-sm text-gray-600 mb-2">Tempo economizado</p>
                                    <div className="text-3xl font-bold text-purple-600 mb-2">
                                        18 horas
                                    </div>
                                    <p className="text-sm font-semibold text-green-600">
                                        ✓ 40% menos tempo de produção
                                    </p>
                                    <p className="text-xs text-gray-500 italic mt-1">
                                        (Resultados consideram uma produção de 10.000 páginas)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modern Technology Card */}
                        <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-200 shadow-lg">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                                    📱
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Impressora Moderna</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-lg border border-green-100">
                                    <div className="flex flex-col gap-1 mb-3">
                                        <span className="text-lg font-bold text-green-600">Transcritor Automático (idB)</span>
                                        <span className="text-sm text-gray-600">Imprime Word/PDF direto (sem software extra)</span>
                                    </div>
                                    <div className="flex flex-col gap-1 mb-3">
                                        <span className="text-lg font-bold text-green-600">Acesso via IP (Web)</span>
                                        <span className="text-sm text-gray-600">Controle total pelo navegador</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-lg font-bold text-green-600">Wi-Fi & Bluetooth</span>
                                        <span className="text-sm text-gray-600">Impressão Sem Fio</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modern Technologies Card - Full Width */}
                    <div className="mb-12 bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border-2 border-orange-200 shadow-lg">
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <div className="flex items-center justify-center">
                                <img src="/indexlogo.png" alt="Index Braille" className="h-12 w-auto" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">Tecnologias Modernas Exclusivas</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>,
                                    title: 'Autonomia Total',
                                    desc: 'Impressora independente: não precisa de nenhum outro dispositivo para produzir.'
                                },
                                { icon: '📶', title: 'Wireless Wi-Fi', desc: 'Conexão sem fios estável e de longo alcance para impressão remota.' },
                                { icon: '📲', title: 'Bluetooth 4.0', desc: 'Imprima diretamente do seu SmartPhone (Android ou iOS) com facilidade.' },
                                {
                                    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m7.5 0A2.25 2.25 0 0118 11.25v9a2.25 2.25 0 01-2.25 2.25h-7.5A2.25 2.25 0 016 20.25v-9A2.25 2.25 0 018.25 9m7.5 0H8.25" /></svg>,
                                    title: 'Porta USB (Pendrive)',
                                    desc: 'Autonomia total: imprima arquivos direto do Pendrive, sem computador.',
                                    titleClassName: 'whitespace-nowrap text-base'
                                },
                                {
                                    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 scale-x-[-1]"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
                                    title: 'Serviço Web (IP)',
                                    desc: 'Acesso através do IP para impressão, configuração e suporte remoto.'
                                },
                                { icon: '📄', title: 'Impressão Direta (idB)', desc: 'Imprime arquivos .docx e .pdf convertendo automaticamente para Braille.' },
                                { icon: '🔊', title: 'Feedback de Voz', desc: 'Alto-falante integrado com feedback falado em português de todas as ações.' },
                                { icon: '⌨️', title: 'Painel Acessível', desc: 'Painel de controle com teclas em Braille e feedback sonoro e luminoso.' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-1 p-4 bg-white rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-3xl shrink-0 flex items-center justify-center w-12 h-12 text-orange-500">{item.icon}</div>
                                    <div>
                                        <h4 className={`font-bold text-gray-900 mb-2 ${item.titleClassName || 'text-lg'}`}>{item.title}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600 text-center max-w-3xl mx-auto">
                                Tecnologia Index, única no mercado com acessibilidade total de fábrica.
                            </p>
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
                                            <span>Velocidade (Português): 63 CPS</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span>Produtividade: 226 PPH</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span>Tempo para 10.000 páginas: 44 horas</span>
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

                        {/* Technology Comparison */}
                        <div className="mb-8">
                            <h4 className="font-bold text-xl text-green-600 mb-4">📱 Tecnologia e Modernidade</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h5 className="font-bold text-lg text-gray-900 mb-3">Outras Impressoras</h5>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span>Transcrição: Não possui (Requer software pago)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span>Acesso Web (IP): Não possui</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span>Conexão: Apenas USB</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span>Acessibilidade: Painel não acessível</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-bold text-lg text-green-700 mb-3">Index Braille Basic</h5>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 font-bold">•</span>
                                            <span>Transcrição: Nativo (idB gratuito integrado)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 font-bold">•</span>
                                            <span>Acesso Web (IP): Nativo (via navegador)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 font-bold">•</span>
                                            <span>Conexão: Wi-Fi, Bluetooth, Rede e USB</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 font-bold">•</span>
                                            <span>Acessibilidade: Painel com Braille e retorno em Voz (Pt-BR)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Summary Box */}
                        <div className="p-6 bg-white rounded-xl border-2 border-green-300">
                            <p className="text-center text-lg font-semibold text-gray-900 mb-4">
                                <span className="text-green-600 text-2xl">💰</span> Resumo das vantagens da INDEX BASIC
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Velocidade</p>
                                    <p className="text-xl font-bold text-blue-600">121% mais rápida</p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Economia de Tempo</p>
                                    <p className="text-xl font-bold text-purple-600">18h economizadas</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Tecnologia</p>
                                    <p className="text-xl font-bold text-green-600">Conectividade + Acessibilidade + Autonomia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
