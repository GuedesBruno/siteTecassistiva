import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// TEMPORARY: Hardcoded for debugging build
export async function generateStaticParams() {
    console.log('[imersao] Generating static params (MOCK)...');
    return [{ slug: 'teste-build' }];
}

export async function generateMetadata({ params }) {
    return {
        title: `Imersão: Teste Build`,
    };
}

export default async function ImersaoPage({ params }) {
    const { slug } = params;
    console.log(`📄 Renderizando página de imersão: ${slug}`);

    // Mock data
    const productData = { nome: "Produto Teste", descricao_curta: "Descrição Teste" };
    const genero_descricao = "masculino";
    const fabricante = "Fabricante Teste";
    const imageUrl = null;
    const botoes_padrao = true;
    const curso = null;
    const guia = null;
    const manual = null;
    const personalizado = null;

    const buttonClassName = "bg-[#002554] text-white py-3 px-6 font-bold text-lg hover:bg-tec-blue-light transition-colors duration-300";

    return (
        <div className="bg-gray-50 text-black min-h-screen flex flex-col items-center justify-center p-4 font-sans py-12">
            <main className="w-full max-w-2xl bg-white p-8 shadow-lg flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-8">{productData.nome}</h1>
                <p className="text-xl md:text-2xl mb-10">
                    Sua IMERSÃO com {genero_descricao === 'feminino' ? 'a' : 'o'}{' '}
                    <strong>{fabricante} {productData.nome}</strong> começa aqui!
                </p>
            </main>
        </div>
    );
}
