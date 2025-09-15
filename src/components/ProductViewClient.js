'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Componente para renderizar conteúdo Rich Text com segurança
function RichTextRenderer({ content }) {
    // VERIFICAÇÃO ADICIONADA: Só renderiza se o conteúdo for uma lista (array) válida
    if (!Array.isArray(content) || content.length === 0) {
        return <p className="text-gray-500">Nenhuma informação disponível.</p>;
    }
    return (
        <div className="prose prose-lg max-w-none text-gray-700">
            {content.map((block, index) => {
                const text = block.children.map(child => child.text).join('');
                if (!text) return null; // Ignora parágrafos vazios
                return <p key={index}>{text}</p>;
            })}
        </div>
    );
}

// Componente para renderizar vídeos embedados
function VideoEmbed({ videoContent }) {
    if (!videoContent) return <p className="text-gray-500">Nenhum vídeo disponível.</p>;
    return (
        <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: videoContent.replace(/\n/g, '<br />') }}
        />
    );
}

// --- Componente que Renderiza a Vista Completa no Cliente ---
export default function ProductViewClient({ product }) {
    const [activeTab, setActiveTab] = useState('visao-geral');
    
    const { 
        nome, 
        imagem_principal, 
        galeria_de_imagens,
        visao_geral,
        videos,
        caracteristicas_funcionais,
        caracteristicas_tecnicas,
        Documentos
    } = product;
    
    const fullImageUrl = imagem_principal?.url;
    const imageAlt = imagem_principal?.alternativeText || `Imagem ilustrativa de ${nome}`;

    const tabs = [
        { id: 'visao-geral', label: 'Visão Geral', content: visao_geral },
        { id: 'fotos', label: 'Fotos', content: galeria_de_imagens },
        { id: 'videos', label: 'Vídeos', content: videos },
        { id: 'caracteristicas-funcionais', label: 'Características Funcionais', content: caracteristicas_funcionais },
        { id: 'caracteristicas-tecnicas', label: 'Características Técnicas', content: caracteristicas_tecnicas },
        { id: 'downloads', label: 'Downloads', content: Documentos },
    ];

    // Define a primeira aba com conteúdo como ativa por padrão
    useEffect(() => {
        const firstAvailableTab = tabs.find(tab => tab.content && (!Array.isArray(tab.content) || tab.content.length > 0));
        if (firstAvailableTab) {
            setActiveTab(firstAvailableTab.id);
        }
    }, [product]);


    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-12">
                <div className="text-sm text-gray-500 mb-8">
                    <Link href="/" className="hover:underline">Página Inicial</Link>
                    <span className="mx-2">&gt;</span>
                    <Link href="/produtos" className="hover:underline">Produtos</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                    <div className="w-full">
                        {fullImageUrl ? (
                            <div className="aspect-square relative w-full rounded-lg shadow-lg overflow-hidden border">
                                <Image src={fullImageUrl} alt={imageAlt} fill className="object-contain" priority />
                            </div>
                        ) : (
                            <div className="aspect-square w-full bg-gray-200 rounded-lg" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{nome}</h1>
                    </div>
                </div>

                <div className="mt-16 border-t pt-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                            {tabs.map((tab) => (
                                (tab.content && (!Array.isArray(tab.content) || tab.content.length > 0)) && (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                )
                            ))}
                        </nav>
                    </div>
                    <div className="py-8 min-h-[10rem]">
                        {activeTab === 'visao-geral' && <RichTextRenderer content={visao_geral} />}
                        {activeTab === 'fotos' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Array.isArray(galeria_de_imagens) && galeria_de_imagens.map((img) => (
                                    <div key={img.id} className="aspect-square relative rounded-lg overflow-hidden border">
                                        <Image src={img.url} alt={img.alternativeText || ''} fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'videos' && <VideoEmbed videoContent={videos} />}
                        {activeTab === 'caracteristicas-funcionais' && <RichTextRenderer content={caracteristicas_funcionais} />}
                        {activeTab === 'caracteristicas-tecnicas' && <RichTextRenderer content={caracteristicas_tecnicas} />}
                        {activeTab === 'downloads' && (
                            <ul className="space-y-2">
                                {Array.isArray(Documentos) && Documentos.map((doc) => (
                                    <li key={doc.id}>
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {doc.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}